import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { logger } from '../utils/logger.js';

export class McpClient {
    private client: Client | null = null;
    private transport: StdioClientTransport | null = null;
    private connected: boolean = false;

    constructor() { }

    async connect() {
        if (this.connected) return;

        try {
            this.transport = new StdioClientTransport({
                command: 'npx',
                args: ['chrome-devtools-mcp', '--isolated'],
            });

            this.client = new Client(
                {
                    name: 'health-copilot-orchestrator',
                    version: '1.0.0',
                },
                {
                    capabilities: {
                        tools: {},
                    },
                }
            );

            await this.client.connect(this.transport);
            this.connected = true;
            logger.info('McpClient', 'Connected to Chrome DevTools MCP server');
        } catch (error) {
            logger.error('McpClient', 'Failed to connect to MCP server', error);
            throw error;
        }
    }

    async listTools() {
        if (!this.connected || !this.client) {
            throw new Error('MCP client not connected');
        }

        return await this.client.listTools();
    }

    async callTool(name: string, args: any) {
        if (!this.connected || !this.client) {
            throw new Error('MCP client not connected');
        }

        return await this.client.callTool({
            name,
            arguments: args,
        });
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
        }
        this.connected = false;
        logger.info('McpClient', 'Disconnected from MCP server');
    }
}

export const mcpClient = new McpClient();
