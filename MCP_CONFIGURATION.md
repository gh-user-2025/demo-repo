# Example MCP Configuration for GitHub Copilot

This file shows how to configure the demo MCP server for use with GitHub Copilot.

## For Claude Desktop / Copilot Desktop

Add this to your MCP settings file (typically at `~/Library/Application Support/Claude/claude_desktop_config.json` or similar):

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

## For GitHub Copilot CLI

If using with Copilot CLI tools, configure in your workspace settings:

```json
{
  "github.copilot.advanced": {
    "mcp": {
      "servers": {
        "demo-repo": {
          "command": "node",
          "args": ["src/index.js"],
          "cwd": "/path/to/demo-repo"
        }
      }
    }
  }
}
```

## Environment Variables

You can pass environment variables to the MCP server:

```json
{
  "mcpServers": {
    "demo-repo": {
      "command": "node",
      "args": ["src/index.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info",
        "DEMO_MODE": "true"
      }
    }
  }
}
```

## Multiple Servers

You can configure multiple MCP servers:

```json
{
  "mcpServers": {
    "demo-repo": {
      "command": "node",
      "args": ["src/index.js"]
    },
    "another-server": {
      "command": "python",
      "args": ["-m", "another_mcp_server"]
    }
  }
}
```

## Notes

- Use absolute paths for the `command` if it's not in your PATH
- The `args` array should include the path to your MCP server entry point
- The server will be started automatically when Copilot needs it
- Ensure Node.js dependencies are installed before configuring
