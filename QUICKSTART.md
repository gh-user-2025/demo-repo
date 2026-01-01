# Quick Start Guide

Get started with the demo MCP server in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install the MCP SDK and all required dependencies.

## Step 2: Test the Server

```bash
npm start
```

You should see:
```
Demo MCP Server running on stdio
Server capabilities: {...}
```

Press `Ctrl+C` to stop the server.

## Step 3: Configure for Copilot

### Option A: Using the provided configuration

Copy the `mcp-config.json` contents to your Copilot MCP configuration file.

### Option B: Manual configuration

Add this to your Copilot settings:

```json
{
  "mcpServers": {
    "demo-repo": {
      "command": "node",
      "args": ["/absolute/path/to/demo-repo/src/index.js"]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/demo-repo` with the actual path to this repository on your system.

## Step 4: Use with Copilot

Once configured, you can interact with the MCP server through Copilot:

### Example Prompts:

- "Use the get_demo_data tool to retrieve user information"
- "Get product data from the demo MCP server"
- "Process a demo action to generate a report"
- "Show me the demo configuration settings"

## What's Next?

- 📖 Read the full [README.md](README.md) for detailed documentation
- 💡 Check out [EXAMPLES.md](EXAMPLES.md) for usage examples
- ⚙️ See [MCP_CONFIGURATION.md](MCP_CONFIGURATION.md) for advanced configuration

## Troubleshooting

### "Cannot find module '@modelcontextprotocol/sdk'"
Run `npm install` to install dependencies.

### "Command not found: node"
Install Node.js from [nodejs.org](https://nodejs.org)

### Server starts but Copilot can't connect
- Verify the path in your Copilot configuration is absolute
- Ensure you've restarted Copilot after updating the configuration
- Check that the server runs without errors when started manually

## System Requirements

- Node.js 18.0 or higher
- npm 8.0 or higher
- GitHub Copilot with MCP support

## Support

For issues or questions:
1. Check the [EXAMPLES.md](EXAMPLES.md) for common usage patterns
2. Review the [README.md](README.md) troubleshooting section
3. Verify your Node.js version: `node --version`

Happy coding with MCP! 🚀
