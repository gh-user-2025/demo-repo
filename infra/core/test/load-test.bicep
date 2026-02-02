param location string = resourceGroup().location
param tags object = {}

param name string

resource loadTest 'Microsoft.LoadTestService/loadTests@2022-12-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    description: 'Load testing for Project Management System API'
  }
}

output name string = loadTest.name
output id string = loadTest.id
