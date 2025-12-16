#!/usr/bin/env node

/**
 * 测试脚本 - 验证DuckDuckGo搜索功能
 */

import { spawn } from 'child_process';

const testSearch = async () => {
  console.log('🧪 启动MCP Server测试...\n');

  const server = spawn('node', ['src/dist/index.js'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  server.stdout.on('data', (data) => {
    output += data.toString();
  });

  server.stderr.on('data', (data) => {
    console.error('错误:', data.toString());
  });

  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 发送MCP初始化请求
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // 等待初始化响应
  await new Promise(resolve => setTimeout(resolve, 500));

  // 发送搜索工具调用
  const searchRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'search',
      arguments: {
        query: 'TypeScript tutorial',
        max_results: 3
      }
    }
  };

  server.stdin.write(JSON.stringify(searchRequest) + '\n');

  // 等待搜索结果
  await new Promise(resolve => setTimeout(resolve, 3000));

  server.kill();

  console.log('\n📊 测试输出:');
  console.log(output);

  // 验证结果
  if (output.includes('TypeScript') || output.includes('tutorial')) {
    console.log('\n✅ 搜索功能正常！');
    return true;
  } else {
    console.log('\n❌ 搜索可能失败，请检查输出');
    return false;
  }
};

testSearch().catch(console.error);