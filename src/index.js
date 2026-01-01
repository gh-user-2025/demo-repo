#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Demo MCP Server for Copilot Agent Integration
 * 
 * This server demonstrates:
 * - Tool registration and execution
 * - Resource exposure
 * - Sync capabilities with Copilot Agent
 */

// Create MCP server instance
const server = new Server(
  {
    name: "demo-repo-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * Tool Handlers
 * Define tools that Copilot Agent can call
 */

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_demo_data",
        description: "Retrieves demo data from the repository",
        inputSchema: {
          type: "object",
          properties: {
            dataType: {
              type: "string",
              description: "Type of demo data to retrieve (user, product, order)",
              enum: ["user", "product", "order"],
            },
          },
          required: ["dataType"],
        },
      },
      {
        name: "process_demo_action",
        description: "Processes a demo action with the provided parameters",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              description: "Action to perform",
            },
            parameters: {
              type: "object",
              description: "Action parameters",
            },
          },
          required: ["action"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_demo_data":
      return handleGetDemoData(args);
    case "process_demo_action":
      return handleProcessDemoAction(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Resource Handlers
 * Define resources that Copilot Agent can access
 */

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "demo://config/settings",
        name: "Demo Configuration",
        description: "Configuration settings for the demo repository",
        mimeType: "application/json",
      },
      {
        uri: "demo://data/sample",
        name: "Sample Data",
        description: "Sample data for demonstration purposes",
        mimeType: "application/json",
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "demo://config/settings":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                version: "1.0.0",
                environment: "demo",
                features: {
                  mcp_enabled: true,
                  copilot_sync: true,
                  tools_available: 2,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    case "demo://data/sample":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                users: [
                  { id: 1, name: "Alice", role: "admin" },
                  { id: 2, name: "Bob", role: "user" },
                ],
                products: [
                  { id: 101, name: "Widget A", price: 29.99 },
                  { id: 102, name: "Widget B", price: 49.99 },
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

/**
 * Tool Implementation Functions
 */

function handleGetDemoData(args) {
  const { dataType } = args;

  const demoData = {
    user: {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      created: new Date().toISOString(),
    },
    product: {
      id: 101,
      name: "Demo Product",
      category: "Electronics",
      price: 99.99,
      inStock: true,
    },
    order: {
      id: 1001,
      userId: 1,
      productId: 101,
      quantity: 2,
      total: 199.98,
      status: "processing",
    },
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(demoData[dataType] || {}, null, 2),
      },
    ],
  };
}

function handleProcessDemoAction(args) {
  const { action, parameters } = args;

  const result = {
    action,
    parameters: parameters || {},
    status: "success",
    timestamp: new Date().toISOString(),
    message: `Successfully processed action: ${action}`,
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

/**
 * Server Startup
 */

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Demo MCP Server running on stdio");
  console.error("Server capabilities:", JSON.stringify(server.getServerCapabilities(), null, 2));
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
