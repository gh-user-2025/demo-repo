# Azure Container Apps Deployment Guide

This guide walks you through deploying the Project Management System to Azure Container Apps with integrated CI/CD and load testing.

## Architecture Overview

The deployment includes:
- **Azure Container Registry (ACR)** - Stores Docker images
- **Azure Container Apps** - Hosts the Node.js backend + React frontend
- **Azure Log Analytics & Application Insights** - Monitoring and diagnostics
- **Azure Load Testing** - Performance validation
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

1. **Azure Subscription** with Owner or Contributor access
2. **Azure CLI** installed ([Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
3. **Azure Developer CLI (azd)** installed ([Install azd](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd))
4. **Docker** installed locally (for local testing)
5. **GitHub repository** with appropriate permissions

## Initial Setup

### 1. Install Azure Developer CLI

```bash
# macOS/Linux
curl -fsSL https://aka.ms/install-azd.sh | bash

# Windows (PowerShell)
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"

# Verify installation
azd version
```

### 2. Login to Azure

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription <subscription-id>

# Login for Azure Developer CLI
azd auth login
```

### 3. Initialize Environment Variables

Create a `.azure/<environment-name>/.env` file or set environment variables:

```bash
# Create environment
export AZURE_ENV_NAME="demo-repo-dev"
export AZURE_LOCATION="eastus"
```

## Deployment Steps

### Option A: Deploy with Azure Developer CLI (Recommended)

```bash
# 1. Initialize the Azure Developer environment
azd init

# 2. Provision Azure resources (first time only)
azd provision

# 3. Deploy the application
azd deploy

# 4. Get the deployment URL
azd env get-values | grep SERVICE_API_URI
```

The `azd provision` command will:
- Create a resource group
- Set up Azure Container Registry
- Create Container Apps Environment
- Deploy the Container App
- Configure Application Insights
- Set up Azure Load Testing resource

### Option B: Manual Deployment with Azure CLI

If you prefer more control:

```bash
# 1. Set variables
RESOURCE_GROUP="rg-demo-repo-dev"
LOCATION="eastus"
ACR_NAME="crdemorepо123"
APP_NAME="ca-api-demo-repo-dev"
ENV_NAME="cae-demo-repo-dev"

# 2. Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# 3. Deploy infrastructure using Bicep
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file infra/main.bicep \
  --parameters environmentName=demo-repo-dev location=$LOCATION

# 4. Build and push Docker image
az acr login --name $ACR_NAME
docker build -t $ACR_NAME.azurecr.io/demo-repo:latest .
docker push $ACR_NAME.azurecr.io/demo-repo:latest

# 5. Update Container App
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/demo-repo:latest
```

## GitHub Actions Setup

### 1. Create Azure Service Principal

```bash
# Create service principal with Contributor role
az ad sp create-for-rbac \
  --name "github-actions-demo-repo" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/rg-demo-repo-dev \
  --sdk-auth

# Output will be JSON - save this entire output
```

### 2. Configure GitHub Secrets and Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add Secrets:**
- `JWT_SECRET` - A strong random string for JWT token signing (required for production)

**Add Variables:**
- `AZURE_CLIENT_ID` - From service principal output (clientId)
- `AZURE_TENANT_ID` - From service principal output (tenantId)
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `AZURE_ENV_NAME` - Environment name (e.g., `demo-repo-dev`)
- `AZURE_LOCATION` - Azure region (e.g., `eastus`)

### 3. Configure Federated Credentials (Workload Identity)

For more secure authentication without storing credentials:

```bash
# Get the Application ID from service principal
APP_ID=$(az ad sp list --display-name "github-actions-demo-repo" --query "[0].appId" -o tsv)

# Add federated credential for main branch
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:gh-user-2025/demo-repo:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Add federated credential for pull requests
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-pr",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:gh-user-2025/demo-repo:pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 4. Trigger Deployment

Push to the `main` branch or manually trigger the workflow:

```bash
# Push to main
git push origin main

# Or trigger manually from GitHub Actions UI
# Go to Actions → Azure Container Apps Deployment → Run workflow
```

## Environment Variables

### Backend Environment Variables

Set these in the Container App configuration or via Azure CLI:

```bash
az containerapp update \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --set-env-vars \
    NODE_ENV=production \
    PORT=8080 \
    JWT_SECRET=secretref:jwt-secret \
    JWT_EXPIRE=7d
```

**Required Variables:**
- `NODE_ENV` - Set to `production`
- `PORT` - Port the server listens on (default: `8080` for Container Apps)
- `JWT_SECRET` - Strong secret for JWT signing (stored as Container App secret)
- `JWT_EXPIRE` - Token expiration time (e.g., `7d`)
- `APPLICATIONINSIGHTS_CONNECTION_STRING` - Auto-configured by Bicep template

### Frontend Environment Variables

The React app is built during Docker image creation. Environment variables must be set at build time:

- `REACT_APP_API_URL` - Backend API URL (auto-configured to use same domain in production)

## Load Testing

### Running Load Tests Manually

```bash
# Get load test resource name
LOAD_TEST_NAME=$(az load list --resource-group rg-demo-repo-dev --query "[0].name" -o tsv)

# Run load test
az load test-run create \
  --name "manual-test-$(date +%s)" \
  --test-id load-test-demo \
  --load-test-resource $LOAD_TEST_NAME \
  --resource-group rg-demo-repo-dev \
  --test-plan loadtest/load-test.jmx \
  --env webapp_url=https://your-app-url.azurecontainerapps.io

# Check test status
az load test-run show \
  --name "manual-test-..." \
  --load-test-resource $LOAD_TEST_NAME \
  --resource-group rg-demo-repo-dev
```

### Load Test Configuration

The load test ([loadtest/load-test-config.yaml](loadtest/load-test-config.yaml)) includes:

**Test Scenarios:**
1. **Authentication Flow** (10 users, 5 iterations)
   - Health check
   - User registration
   - User login

2. **API Operations** (20 users, 10 iterations)
   - Get projects
   - Get tasks
   - Get dashboard analytics

**Failure Criteria:**
- Average response time > 2000ms
- Error percentage > 5%
- Average latency > 1500ms

**Auto-Stop:**
- If error percentage exceeds 90% within 60-second window

## Monitoring and Debugging

### View Application Logs

```bash
# Stream Container App logs
az containerapp logs show \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --follow

# View logs in Azure Portal
# Navigate to: Resource Group → Container App → Monitoring → Log stream
```

### Application Insights

```bash
# Get Application Insights details
az monitor app-insights component show \
  --app appinsights-demo-repo-dev \
  --resource-group rg-demo-repo-dev

# View in portal:
# Resource Group → Application Insights → Transaction search / Performance
```

### Common Issues and Solutions

#### Issue: Container app fails health check

**Solution:**
```bash
# Check container logs
az containerapp logs show --name ca-api-demo-repo-dev --resource-group rg-demo-repo-dev

# Verify health endpoint
curl https://your-app-url.azurecontainerapps.io/api/health
```

#### Issue: Authentication fails (401 errors)

**Solution:**
- Verify `JWT_SECRET` is set correctly
- Check if token is being passed in Authorization header
- Review server logs for JWT verification errors

#### Issue: Load test fails with high error rate

**Solution:**
- Ensure app is fully scaled up before running load tests
- Check if JWT_SECRET matches between test and deployment
- Verify database connections (if using persistent storage)

## Scaling Configuration

### Manual Scaling

```bash
# Scale up
az containerapp update \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --min-replicas 3 \
  --max-replicas 20

# Scale down (for cost savings)
az containerapp update \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --min-replicas 1 \
  --max-replicas 5
```

### Autoscaling Rules

The deployment includes HTTP-based autoscaling (configured in [infra/app/api.bicep](infra/app/api.bicep)):
- Scales when concurrent requests exceed 100
- Min replicas: 1
- Max replicas: 10

## Cost Optimization

### Development Environment

```bash
# Stop the Container App (scale to 0)
az containerapp update \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --min-replicas 0 \
  --max-replicas 1

# Resume
az containerapp update \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --min-replicas 1
```

### Delete Resources

```bash
# Delete entire resource group (careful!)
az group delete --name rg-demo-repo-dev --yes --no-wait

# Or use Azure Developer CLI
azd down
```

## Production Considerations

### 1. **Persistent Database**

The app currently uses in-memory storage. For production:

```bash
# Deploy Azure Database for PostgreSQL
az postgres flexible-server create \
  --resource-group rg-demo-repo-prod \
  --name pg-demo-repo-prod \
  --location eastus \
  --admin-user dbadmin \
  --admin-password <strong-password> \
  --sku-name Standard_B1ms

# Update app with DATABASE_URL
az containerapp update \
  --name ca-api-demo-repo-prod \
  --resource-group rg-demo-repo-prod \
  --set-env-vars \
    DATABASE_URL=secretref:database-url
```

### 2. **File Storage**

Replace local uploads directory with Azure Blob Storage:

```bash
# Create storage account
az storage account create \
  --name stdemorepoprod \
  --resource-group rg-demo-repo-prod \
  --location eastus \
  --sku Standard_LRS

# Create blob container
az storage container create \
  --name uploads \
  --account-name stdemorepoprod

# Get connection string and add to Container App
az storage account show-connection-string \
  --name stdemorepoprod \
  --resource-group rg-demo-repo-prod
```

### 3. **Custom Domain and SSL**

```bash
# Add custom domain
az containerapp hostname add \
  --hostname api.yourdomain.com \
  --name ca-api-demo-repo-prod \
  --resource-group rg-demo-repo-prod

# Bind SSL certificate
az containerapp hostname bind \
  --hostname api.yourdomain.com \
  --name ca-api-demo-repo-prod \
  --resource-group rg-demo-repo-prod \
  --certificate <certificate-id>
```

### 4. **Environment Separation**

Create separate environments:

```bash
# Development
azd provision --environment dev

# Staging
azd provision --environment staging

# Production
azd provision --environment prod
```

## Useful Commands

```bash
# Get application URL
az containerapp show \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev \
  --query properties.configuration.ingress.fqdn -o tsv

# Restart container app
az containerapp revision restart \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev

# List all revisions
az containerapp revision list \
  --name ca-api-demo-repo-dev \
  --resource-group rg-demo-repo-dev -o table

# Export environment variables
azd env get-values > .env.production

# View resource costs
az consumption usage list \
  --start-date 2026-01-01 \
  --end-date 2026-02-01
```

## Support and Resources

- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Developer CLI Documentation](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Azure Load Testing Documentation](https://learn.microsoft.com/en-us/azure/load-testing/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

## Next Steps

1. ✅ Deploy to development environment
2. ✅ Configure GitHub Actions secrets
3. ✅ Run initial deployment
4. ✅ Verify load tests pass
5. 🔄 Migrate to persistent database (optional)
6. 🔄 Configure custom domain (optional)
7. 🔄 Set up staging environment
8. 🔄 Deploy to production
