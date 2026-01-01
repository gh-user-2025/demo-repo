# Usage Examples

This document provides concrete examples of how to interact with the demo MCP server through GitHub Copilot.

## Example 1: Retrieving User Data

**Prompt to Copilot:**
> "Use the get_demo_data tool to retrieve user information"

**What Copilot does:**
1. Discovers the `get_demo_data` tool from the MCP server
2. Calls the tool with `dataType: "user"`
3. Receives and presents the user data

**Expected Response:**
```json
{
  "id": 1,
  "name": "Demo User",
  "email": "demo@example.com",
  "created": "2026-01-01T09:00:00.000Z"
}
```

## Example 2: Retrieving Product Data

**Prompt to Copilot:**
> "Get product information from the demo server"

**Tool Call:**
```json
{
  "tool": "get_demo_data",
  "arguments": {
    "dataType": "product"
  }
}
```

**Expected Response:**
```json
{
  "id": 101,
  "name": "Demo Product",
  "category": "Electronics",
  "price": 99.99,
  "inStock": true
}
```

## Example 3: Processing an Action

**Prompt to Copilot:**
> "Process a demo action to generate a sales report"

**Tool Call:**
```json
{
  "tool": "process_demo_action",
  "arguments": {
    "action": "generate_report",
    "parameters": {
      "type": "sales",
      "format": "pdf",
      "period": "monthly"
    }
  }
}
```

**Expected Response:**
```json
{
  "action": "generate_report",
  "parameters": {
    "type": "sales",
    "format": "pdf",
    "period": "monthly"
  },
  "status": "success",
  "timestamp": "2026-01-01T09:00:00.000Z",
  "message": "Successfully processed action: generate_report"
}
```

## Example 4: Accessing Configuration Resources

**Prompt to Copilot:**
> "Show me the demo configuration settings"

**Resource Access:**
Copilot reads `demo://config/settings`

**Expected Response:**
```json
{
  "version": "1.0.0",
  "environment": "demo",
  "features": {
    "mcp_enabled": true,
    "copilot_sync": true,
    "tools_available": 2
  }
}
```

## Example 5: Accessing Sample Data

**Prompt to Copilot:**
> "What sample data is available in the demo?"

**Resource Access:**
Copilot reads `demo://data/sample`

**Expected Response:**
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ],
  "products": [
    { "id": 101, "name": "Widget A", "price": 29.99 },
    { "id": 102, "name": "Widget B", "price": 49.99 }
  ]
}
```

## Example 6: Combining Multiple Operations

**Prompt to Copilot:**
> "Get order data and then process a fulfillment action for it"

**Step 1 - Get Order Data:**
```json
{
  "tool": "get_demo_data",
  "arguments": {
    "dataType": "order"
  }
}
```

**Step 2 - Process Fulfillment:**
```json
{
  "tool": "process_demo_action",
  "arguments": {
    "action": "fulfill_order",
    "parameters": {
      "orderId": 1001,
      "shippingMethod": "express"
    }
  }
}
```

## Testing the Server Manually

You can test the MCP server directly using the MCP Inspector or by sending JSON-RPC messages:

### Start the server:
```bash
npm start
```

### Send a test request (in another terminal):
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node src/index.js
```

## Debugging Tips

1. **Enable verbose logging**: Set `LOG_LEVEL=debug` in environment variables
2. **Check tool schemas**: Verify that input schemas match expected parameters
3. **Test incrementally**: Start with simple tool calls before complex operations
4. **Use MCP Inspector**: Install the MCP Inspector tool for interactive testing

## Common Patterns

### Pattern 1: Data Retrieval
```
User asks for information → Copilot calls get_demo_data → Server returns data
```

### Pattern 2: Action Execution
```
User requests action → Copilot calls process_demo_action → Server executes and confirms
```

### Pattern 3: Configuration Access
```
User needs settings → Copilot reads resource → Server provides configuration
```

## Best Practices

1. **Clear prompts**: Be specific about what data or action you want
2. **Tool names**: Reference tools by their exact names when needed
3. **Parameters**: Provide all required parameters in your prompts
4. **Error handling**: If a tool fails, check the error message and adjust parameters
5. **Resource URIs**: Use exact resource URIs when accessing specific resources

## Next Steps

- Modify the tools in `src/index.js` to add your own functionality
- Add new resources that expose your application's data
- Integrate with real data sources and APIs
- Add authentication and security measures for production use
