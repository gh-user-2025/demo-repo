# Demo Repo - MCP Connection with Copilot Agent

This repository demonstrates how to create and sync an MCP (Model Context Protocol) server with GitHub Copilot Agent. It provides a complete example of building custom tools and resources that Copilot can use through the MCP protocol.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. It enables seamless integration between AI assistants like GitHub Copilot and external data sources, tools, and services.

## Features

This demo repository showcases:

- ✅ **Custom MCP Server**: A Node.js-based MCP server implementation
- ✅ **Tool Registration**: Example tools that Copilot can call
- ✅ **Resource Exposure**: Demo resources that Copilot can access
- ✅ **Copilot Integration**: Configuration for syncing with GitHub Copilot Agent

## Repository Structure

```
demo-repo/
├── src/
│   └── index.js          # MCP server implementation
├── mcp-config.json       # MCP server configuration
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- GitHub Copilot with MCP support

### Installation

1. Clone this repository:
```bash
git clone https://github.com/gh-user-2025/demo-repo.git
cd demo-repo
```

2. Install dependencies:
```bash
npm install
```

3. Test the MCP server:
```bash
npm start
```

## MCP Server Features

### Available Tools

The demo server provides two example tools:

#### 1. `get_demo_data`
Retrieves demo data from the repository.

**Parameters:**
- `dataType` (string): Type of data to retrieve - `user`, `product`, or `order`

**Example usage:**
```json
{
  "tool": "get_demo_data",
  "arguments": {
    "dataType": "user"
  }
}
```

#### 2. `process_demo_action`
Processes a demo action with provided parameters.

**Parameters:**
- `action` (string): Action to perform
- `parameters` (object, optional): Action parameters

**Example usage:**
```json
{
  "tool": "process_demo_action",
  "arguments": {
    "action": "create_report",
    "parameters": {
      "format": "pdf"
    }
  }
}
```

### Available Resources

The demo server exposes two resources:

#### 1. `demo://config/settings`
Configuration settings for the demo repository in JSON format.

#### 2. `demo://data/sample`
Sample data including users and products for demonstration purposes.

## Integrating with GitHub Copilot

### Configuration

To use this MCP server with GitHub Copilot:

1. Add the MCP server configuration to your Copilot settings:

```json
{
  "mcpServers": {
    "demo-repo": {
      "command": "node",
      "args": ["src/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

2. The MCP server will be automatically started when Copilot needs to access its tools or resources.

### Using Tools in Copilot

Once configured, you can ask Copilot to use the demo tools:

- "Get demo user data using the get_demo_data tool"
- "Process a demo action to create a report"
- "Show me the demo configuration settings"

Copilot will automatically discover and use the available MCP tools and resources.

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with Node.js watch mode for automatic reloading.

### Extending the Server

To add new tools or resources:

1. **Adding a Tool**: Register it in the `ListToolsRequestSchema` handler and implement the handler function
2. **Adding a Resource**: Register it in the `ListResourcesRequestSchema` handler and implement the read handler

Example:
```javascript
// Add to ListToolsRequestSchema handler
{
  name: "my_new_tool",
  description: "Description of what this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "Parameter description"
      }
    },
    required: ["param1"]
  }
}

// Add handler in CallToolRequestSchema
case "my_new_tool":
  return handleMyNewTool(args);
```

## How It Works

1. **Server Initialization**: The MCP server starts and listens on stdio
2. **Capability Advertisement**: Server declares available tools and resources
3. **Copilot Connection**: GitHub Copilot connects to the server via MCP protocol
4. **Tool/Resource Discovery**: Copilot queries available tools and resources
5. **Request Handling**: When Copilot needs data or actions, it calls the appropriate tool
6. **Response Delivery**: Server processes requests and returns structured responses

## MCP Protocol Communication Flow

```
GitHub Copilot Agent <--> MCP Protocol <--> Demo MCP Server
                                              ├── Tools
                                              │   ├── get_demo_data
                                              │   └── process_demo_action
                                              └── Resources
                                                  ├── demo://config/settings
                                                  └── demo://data/sample
```

## Troubleshooting

### Server won't start
- Ensure Node.js 18+ is installed: `node --version`
- Check dependencies are installed: `npm install`
- Review error logs in the console

### Copilot can't connect
- Verify MCP configuration is correct
- Check that the server path in configuration is absolute or relative to Copilot's working directory
- Ensure the server starts successfully when run manually

### Tools not appearing
- Confirm tools are registered in `ListToolsRequestSchema` handler
- Verify tool schemas are valid JSON Schema format
- Check server logs for any errors during tool registration

## Learn More

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

## Contributing

This is a demo repository. Feel free to fork and adapt it for your own MCP server implementations!

## License

MIT