targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@description('Id of the principal to assign database and application roles')
param principalId string = ''

// Tags that should be applied to all resources.
var tags = {
  'azd-env-name': environmentName
}

module monitoring './core/monitor/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    tags: tags
    logAnalyticsName: 'log-${environmentName}'
    applicationInsightsName: 'appinsights-${environmentName}'
  }
}

module containerRegistry './core/host/container-registry.bicep' = {
  name: 'container-registry'
  params: {
    location: location
    tags: tags
    name: 'cr${replace(environmentName, '-', '')}'
  }
}

module containerAppsEnvironment './core/host/container-apps-environment.bicep' = {
  name: 'container-apps-environment'
  params: {
    location: location
    tags: tags
    name: 'cae-${environmentName}'
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
}

module api './app/api.bicep' = {
  name: take('api-app', 64)
  params: {
    location: location
    tags: tags
    name: 'ca-api-${environmentName}'
    containerAppsEnvironmentName: containerAppsEnvironment.outputs.name
    containerRegistryName: containerRegistry.outputs.name
    applicationInsightsName: monitoring.outputs.applicationInsightsName
  }
}

module loadTest './core/test/load-test.bicep' = {
  name: 'load-test'
  params: {
    location: location
    tags: tags
    name: 'lt-${environmentName}'
  }
}

// App outputs
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup().name

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name

output SERVICE_API_NAME string = api.outputs.name
output SERVICE_API_URI string = api.outputs.uri
output SERVICE_API_IMAGE_NAME string = api.outputs.imageName

output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString

output AZURE_LOAD_TEST_NAME string = loadTest.outputs.name
output AZURE_LOAD_TEST_ID string = loadTest.outputs.id
