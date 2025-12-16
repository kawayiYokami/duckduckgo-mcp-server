#!/usr/bin/env node
/**
 * DuckDuckGo MCP Server - Stdio模式
 * 轻量级TypeScript实现，支持SafeSearch和Region配置
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DuckDuckGoSearcher } from './searcher.js';
import { SafeSearchMode, ServerConfig } from './types.js';

/**
 * 从环境变量加载配置
 */
function loadConfig(): ServerConfig {
  const safeSearchStr = process.env.DDG_SAFE_SEARCH?.toUpperCase() || 'MODERATE';
  let safeSearch: SafeSearchMode;

  try {
    safeSearch = SafeSearchMode[safeSearchStr as keyof typeof SafeSearchMode];
  } catch {
    console.error(`[警告] 无效的DDG_SAFE_SEARCH值 '${safeSearchStr}', 使用MODERATE`);
    safeSearch = SafeSearchMode.MODERATE;
  }

  const defaultRegion = process.env.DDG_REGION || '';

  console.error('='.repeat(60));
  console.error('DuckDuckGo MCP Server 已初始化');
  console.error(`  SafeSearch: ${safeSearchStr} (kp=${safeSearch})`);
  console.error(`  默认地区: ${defaultRegion || '无'}`);
  console.error('='.repeat(60));

  return { safeSearch, defaultRegion };
}

/**
 * 主函数
 */
async function main() {
  const config = loadConfig();
  const searcher = new DuckDuckGoSearcher(config.safeSearch, config.defaultRegion);

  // 创建MCP服务器
  const server = new Server(
    {
      name: 'duckduckgo-search',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 注册工具列表
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'search',
        description: '在DuckDuckGo上搜索并返回格式化结果',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索查询词'
            },
            max_results: {
              type: 'number',
              description: '返回的最大结果数（默认: 10）',
              default: 10
            },
            region: {
              type: 'string',
              description: '地区/语言代码（可选，留空使用默认）。示例: us-en (美国), cn-zh (中国), jp-ja (日本)',
              default: ''
            }
          },
          required: ['query']
        }
      },
    ]
  }));

  // 注册工具调用处理
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== 'search') {
      throw new Error(`未知工具: ${request.params.name}`);
    }

    const { query, max_results = 10, region = '' } = request.params.arguments as {
      query: string;
      max_results?: number;
      region?: string;
    };

    try {
      const results = await searcher.search({ query, maxResults: max_results, region });
      const formattedText = searcher.formatResults(results);

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `搜索时发生错误: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  });

  // 连接stdio传输
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[信息] MCP Server已启动，等待请求...');
}

// 启动服务器
main().catch((error) => {
  console.error('[致命错误]', error);
  process.exit(1);
});