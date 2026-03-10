#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 检查是否是通过MCP调用（通过环境变量或参数）
const isMcpMode = process.env.MCP_JOB_ID || 
                  process.env.MCP_LOCAL_PATH || 
                  process.env.MCP_MERGE_REQUEST_ID ||
                  process.argv.includes('--mcp');

if (isMcpMode) {
  // 启动MCP服务器
  const mcpServerPath = resolve(__dirname, '../dist/mcpServer.js');
  spawn('node', [mcpServerPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  }).on('exit', (code) => process.exit(code ?? 1));
} else {
  // 启动CLI
  const cliPath = resolve(__dirname, '../dist/main/cli.js');
  spawn('node', [cliPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  }).on('exit', (code) => process.exit(code ?? 1));
}