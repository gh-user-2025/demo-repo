# Azure Container Apps CI/CD - Quick Reference

## 🚀 Quick Start

```bash
# 1. Login to Azure
azd auth login

# 2. Initialize and provision
azd env set AZURE_LOCATION "japaneast"

azd init

azd provision

# 3. Deploy
azd deploy
```

## 📁 Generated Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: React frontend → Node.js backend |
| `.dockerignore` | Excludes unnecessary files from Docker image |
| `azure.yaml` | Azure Developer CLI configuration |
| `infra/main.bicep` | Main infrastructure template |
| `infra/app/api.bicep` | Container App configuration |
| `infra/core/monitor/monitoring.bicep` | Log Analytics + Application Insights |
| `infra/core/host/container-registry.bicep` | Azure Container Registry |
| `infra/core/host/container-apps-environment.bicep` | Container Apps Environment |
| `infra/core/test/load-test.bicep` | Azure Load Testing resource |
| `.github/workflows/azure-container-apps.yml` | CI/CD pipeline |
| `loadtest/load-test-config.yaml` | Load test configuration |
| `loadtest/load-test.jmx` | JMeter test plan |
| `docs/DEPLOYMENT.md` | Comprehensive deployment guide |

## 🔑 GitHub Secrets Required

**Variables:**
- `AZURE_CLIENT_ID` - Service principal client ID
- `AZURE_TENANT_ID` - Azure tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID
- `AZURE_ENV_NAME` - Environment name (e.g., `demo-repo-dev`)
- `AZURE_LOCATION` - Azure region (e.g., `eastus`)

**Secrets:**
- `JWT_SECRET` - Strong random string for JWT signing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
│  Build → Test → Docker Push → Deploy → Load Test       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Azure Container Registry (ACR)              │
│                   Stores Docker Images                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Azure Container Apps                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Node.js Backend + React Frontend (Port 8080)   │  │
│  │   - JWT Authentication                            │  │
│  │   - REST API Endpoints                           │  │
│  │   - Static File Serving                          │  │
│  │   - Autoscaling (1-10 replicas)                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│          Application Insights + Log Analytics            │
│         Monitoring, Logs, Performance Metrics            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               Azure Load Testing                         │
│     POST-deployment performance validation               │
└─────────────────────────────────────────────────────────┘
```

## 🔄 CI/CD Workflow

1. **Build & Test** (every PR/push)
   - Install dependencies
   - Run Jest tests (backend + frontend)
   - Build React production bundle

2. **Docker Build & Push** (main branch only)
   - Build multi-stage Docker image
   - Push to Azure Container Registry
   - Tag with commit SHA

3. **Deploy** (main branch only, requires approval)
   - Update Container App with new image
   - Apply environment variables
   - Health check validation

4. **Load Test** (post-deployment)
   - Run JMeter tests against deployed app
   - Validate performance metrics
   - Fail if error rate > 5% or latency > 2000ms

## 📊 Load Test Scenarios

**Scenario 1: Authentication Flow** (10 concurrent users, 5 iterations)
- Health check → Register → Login

**Scenario 2: API Operations** (20 concurrent users, 10 iterations)
- Get projects → Get tasks → Get analytics

**Pass Criteria:**
- ✅ Average response time < 2000ms
- ✅ Error rate < 5%
- ✅ Average latency < 1500ms

## 🛠️ Key Technologies

- **Container Runtime**: Docker multi-stage build
- **Backend**: Node.js 18 (Express.js)
- **Frontend**: React 18 (served as static files)
- **Infrastructure as Code**: Azure Bicep
- **CI/CD**: GitHub Actions
- **Load Testing**: Azure Load Testing (JMeter)
- **Monitoring**: Application Insights
- **Deployment Tool**: Azure Developer CLI (azd)

## 🔒 Security Features

- JWT-based authentication with secret management
- Azure Managed Identity for Container Registry access
- HTTPS-only ingress (Container Apps default)
- Environment variables stored as Container App secrets
- Role-based access control (RBAC) for Azure resources

## 💰 Cost Considerations

**Development Environment** (~$30-50/month):
- Container Apps: Consumption plan (~$10-20)
- Container Registry: Basic tier ($5)
- Log Analytics: Pay-as-you-go (~$5-10)
- Load Testing: Per-test execution (~$5-10)

**Production Environment** (~$100-200/month):
- Add persistent database (PostgreSQL Flexible Server ~$50-80)
- Add blob storage for uploads (~$5-10)
- Increased Container Apps replicas and resources

**Cost Optimization:**
- Scale Container Apps to 0 replicas when not in use (dev/staging)
- Use Azure Reservations for predictable workloads
- Delete non-production environments outside business hours

## 🚨 Production Checklist

- [ ] Replace in-memory storage with Azure Database for PostgreSQL
- [ ] Replace local uploads with Azure Blob Storage
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure custom domain with SSL certificate
- [ ] Set up staging environment for pre-production testing
- [ ] Enable Azure Container Apps authentication (optional)
- [ ] Configure CORS to restrict origins
- [ ] Set up alerts for errors and performance degradation
- [ ] Enable Azure DDoS Protection (if high traffic expected)
- [ ] Implement backup strategy for database
- [ ] Configure log retention policies
- [ ] Review and restrict network access (if needed)

## 📝 Environment Variables Reference

### Backend
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Environment mode |
| `PORT` | Yes | `8080` | Server port |
| `JWT_SECRET` | **Yes** | - | JWT signing secret (CRITICAL) |
| `JWT_EXPIRE` | No | `7d` | Token expiration time |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Auto | - | Application Insights connection |

### Frontend (Build-time)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | No | `/api` | Backend API URL |

## 🔗 Useful Links

- **Full Documentation**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Azure Portal**: https://portal.azure.com
- **Azure Developer CLI**: https://aka.ms/azd
- **GitHub Actions**: `.github/workflows/azure-container-apps.yml`
- **Infrastructure Code**: `infra/`

## 💡 Tips

- Use `azd env get-values` to see all environment variables
- Use `azd monitor` to open Application Insights in browser
- Use `az containerapp logs show --follow` to stream real-time logs
- Test Dockerfile locally: `docker build -t test . && docker run -p 8080:8080 test`
- Validate Bicep templates: `az bicep build --file infra/main.bicep`

---

**Need help?** Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.
