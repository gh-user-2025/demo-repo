# Architecture Overview

## MCP Connection Flow

```
┌─────────────────────────┐
│   GitHub Copilot Agent  │
│                         │
│  - Natural language UI  │
│  - Tool discovery       │
│  - Request formatting   │
└───────────┬─────────────┘
            │
            │ MCP Protocol
            │ (JSON-RPC over stdio)
            │
┌───────────▼─────────────┐
│   MCP Server            │
│   (demo-repo)           │
│                         │
│  ┌───────────────────┐  │
│  │  Tool Handlers    │  │
│  │                   │  │
│  │  - get_demo_data  │  │
│  │  - process_action │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  Resources        │  │
│  │                   │  │
│  │  - config/settings│  │
│  │  - data/sample    │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

## Component Details

### GitHub Copilot Agent
- Receives natural language requests from users
- Discovers available MCP servers and their capabilities
- Translates user intent into MCP tool calls
- Formats and presents responses back to users

### MCP Protocol Layer
- **Transport**: stdio (standard input/output)
- **Format**: JSON-RPC 2.0
- **Messages**: 
  - `tools/list`: Discover available tools
  - `tools/call`: Execute a tool
  - `resources/list`: Discover available resources
  - `resources/read`: Read a resource

### MCP Server (This Demo)
- **Server Framework**: @modelcontextprotocol/sdk
- **Runtime**: Node.js
- **Capabilities**:
  - Tool execution
  - Resource exposure
  - Structured data responses

## Request/Response Flow

### Example: Getting User Data

```
1. User → Copilot
   "Get demo user data"

2. Copilot → MCP Server (tools/list)
   Request: List available tools

3. MCP Server → Copilot
   Response: [
     { name: "get_demo_data", ... },
     { name: "process_demo_action", ... }
   ]

4. Copilot → MCP Server (tools/call)
   Request: {
     name: "get_demo_data",
     arguments: { dataType: "user" }
   }

5. MCP Server → Copilot
   Response: {
     content: [{
       type: "text",
       text: '{"id": 1, "name": "Demo User", ...}'
     }]
   }

6. Copilot → User
   "Here's the demo user data: ..."
```

## Tool Registration

```javascript
// Server advertises tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_demo_data",
        description: "...",
        inputSchema: { /* JSON Schema */ }
      }
    ]
  };
});

// Server handles tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  // Execute tool logic
  return { content: [...] };
});
```

## Resource Exposure

```javascript
// Server advertises resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "demo://config/settings",
        name: "Demo Configuration",
        mimeType: "application/json"
      }
    ]
  };
});

// Server provides resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  // Return resource data
  return { contents: [...] };
});
```

## Data Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Natural language
       │
┌──────▼──────┐
│   Copilot   │ ◄─── Discovers tools/resources
└──────┬──────┘
       │ MCP Protocol
       │
┌──────▼──────┐
│ MCP Server  │
│             │
│ ┌─────────┐ │
│ │ Tools   │ │ ◄─── Business logic
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │Resources│ │ ◄─── Data access
│ └─────────┘ │
└─────────────┘
```

## Security Considerations

1. **Input Validation**: All tool inputs should be validated
2. **Resource Access**: Control what resources are exposed
3. **Authentication**: Add auth for production use
4. **Rate Limiting**: Implement rate limits for tool calls
5. **Error Handling**: Don't expose sensitive info in errors

## Extending the Demo

### Adding a New Tool

1. **Define the tool** in `ListToolsRequestSchema` handler
2. **Implement handler** in `CallToolRequestSchema` switch
3. **Test** with Copilot prompts

### Adding a New Resource

1. **Define the resource** in `ListResourcesRequestSchema` handler
2. **Implement reader** in `ReadResourceRequestSchema` switch
3. **Test** with Copilot resource queries

## Performance Tips

- Keep tool execution fast (< 1 second when possible)
- Cache expensive operations
- Use async operations for I/O
- Stream large responses when supported
- Log performance metrics

## Best Practices

✅ **DO:**
- Provide clear, descriptive tool names
- Include detailed JSON schemas for inputs
- Return structured, parseable responses
- Handle errors gracefully
- Log important events

❌ **DON'T:**
- Block the main thread with heavy computation
- Expose sensitive data without authentication
- Return unstructured text when JSON is better
- Ignore input validation
- Swallow errors silently

## Learn More

- [MCP Specification](https://modelcontextprotocol.io)
- [SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
