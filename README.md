# DuckDuckGo MCP Server

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

A lightweight, high-performance DuckDuckGo search server for the Model Context Protocol (MCP). Built with TypeScript, providing SafeSearch filtering and region customization.

### ✨ Features

- 🔍 **DuckDuckGo Search**: Fast, privacy-focused web search
- 🛡️ **SafeSearch**: Content filtering (STRICT/MODERATE/OFF)
- 🌍 **Region Support**: Customize results by region/language (cn-zh, us-en, jp-ja, etc.)
- ⚡ **Ultra Lightweight**: Only 7.3KB package size
- 🚀 **High Performance**: 3-5x faster than Python version
- 📦 **Zero Config**: Works out of the box with npx
- 🔒 **Type Safe**: Full TypeScript implementation

### 📊 Performance Comparison

| Metric | Python Version | TS Version | Improvement |
|--------|---------------|------------|-------------|
| Package Size | 500MB (Docker) | 7.3KB | ↓ 99.998% |
| Dependencies | ~50 packages | 3 packages | ↓ 94% |
| Startup Time | 2-3 seconds | 0.5 seconds | ↑ 5x |
| Memory Usage | ~100MB | ~40MB | ↓ 60% |

### 🚀 Quick Start

**Option 1: NPX (Recommended)**
```bash
npx -y ddg-mcp-search
```

**Option 2: Global Installation**
```bash
npm install -g ddg-mcp-search
ddg-mcp
```

**Option 3: Local Development**
```bash
git clone https://github.com/kawayiYokami/duckduckgo-mcp-server.git
cd duckduckgo-mcp-server/src
npm install
npm run build
npm start
```

### 🔧 Configuration

#### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "duckduckgo": {
      "command": "npx",
      "args": ["-y", "ddg-mcp-search"],
      "env": {
        "SAFE_SEARCH": "MODERATE",
        "REGION": "us-en"
      }
    }
  }
}
```

#### Cline / Other MCP Clients

Add to your MCP settings:

```json
{
  "duckduckgo-search": {
    "command": "npx",
    "args": ["-y", "ddg-mcp-search"],
    "env": {
      "SAFE_SEARCH": "MODERATE",
      "REGION": "cn-zh"
    }
  }
}
```

### 🌍 Region Codes

| Region | Code | Description |
|--------|------|-------------|
| China | `cn-zh` | Simplified Chinese results |
| USA | `us-en` | English (US) results |
| UK | `uk-en` | English (UK) results |
| Japan | `jp-ja` | Japanese results |
| Germany | `de-de` | German results |
| France | `fr-fr` | French results |

**Default**: No region filter (global results)

### 🛡️ SafeSearch Levels

| Level | Value | Description |
|-------|-------|-------------|
| STRICT | `STRICT` | Filter adult content strictly |
| MODERATE | `MODERATE` | Balanced filtering (default) |
| OFF | `OFF` | No filtering |

### 🔨 Available Tools

#### `search`
Search DuckDuckGo with customizable parameters.

**Parameters:**
- `query` (required): Search keywords
- `max_results` (optional): Maximum results to return (default: 5)

**Example:**
```javascript
{
  "query": "artificial intelligence",
  "max_results": 3
}
```

**Response:**
```
Found 3 search results:

1. Artificial intelligence - Wikipedia
   URL: https://en.wikipedia.org/wiki/Artificial_intelligence
   Summary: Artificial intelligence (AI), in its broadest sense, is intelligence...

2. What is Artificial Intelligence (AI)? | IBM
   URL: https://www.ibm.com/topics/artificial-intelligence
   Summary: Artificial intelligence leverages computers and machines to mimic...

3. What Is Artificial Intelligence? Definition, Uses, and Types
   URL: https://www.coursera.org/articles/what-is-artificial-intelligence
   Summary: Artificial intelligence is a field of computer science that aims...
```

### 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SAFE_SEARCH` | SafeSearch level (STRICT/MODERATE/OFF) | `MODERATE` |
| `REGION` | Region code (e.g., cn-zh, us-en) | None (global) |

### 🧪 Testing

Run the included test script:

```bash
node test-search.mjs
```

Expected output:
```
🧪 启动MCP Server测试...
✅ 搜索功能正常！
```

### 📦 Package Information

- **NPM**: https://www.npmjs.com/package/ddg-mcp-search
- **GitHub**: https://github.com/kawayiYokami/duckduckgo-mcp-server
- **License**: MIT
- **Author**: kawayiYokami

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

MIT License - see LICENSE file for details

---

<a name="chinese"></a>
## 中文

一个轻量级、高性能的DuckDuckGo搜索MCP服务器。使用TypeScript构建，提供SafeSearch内容过滤和地区定制功能。

### ✨ 特性

- 🔍 **DuckDuckGo搜索**: 快速、注重隐私的网页搜索
- 🛡️ **SafeSearch**: 内容过滤（严格/中等/关闭）
- 🌍 **地区支持**: 按地区/语言定制结果（cn-zh, us-en, jp-ja等）
- ⚡ **超轻量**: 仅7.3KB包体积
- 🚀 **高性能**: 比Python版本快3-5倍
- 📦 **零配置**: 使用npx开箱即用
- 🔒 **类型安全**: 完整的TypeScript实现

### 📊 性能对比

| 指标 | Python版本 | TS版本 | 改进 |
|------|-----------|--------|------|
| 包体积 | 500MB (Docker) | 7.3KB | ↓ 99.998% |
| 依赖数量 | ~50个包 | 3个包 | ↓ 94% |
| 启动时间 | 2-3秒 | 0.5秒 | ↑ 5倍 |
| 内存占用 | ~100MB | ~40MB | ↓ 60% |

### 🚀 快速开始

**方式1: NPX（推荐）**
```bash
npx -y ddg-mcp-search
```

**方式2: 全局安装**
```bash
npm install -g ddg-mcp-search
ddg-mcp
```

**方式3: 本地开发**
```bash
git clone https://github.com/kawayiYokami/duckduckgo-mcp-server.git
cd duckduckgo-mcp-server/src
npm install
npm run build
npm start
```

### 🔧 配置

#### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "duckduckgo": {
      "command": "npx",
      "args": ["-y", "ddg-mcp-search"],
      "env": {
        "SAFE_SEARCH": "MODERATE",
        "REGION": "cn-zh"
      }
    }
  }
}
```

#### Cline / 其他MCP客户端

在MCP设置中添加：

```json
{
  "duckduckgo-search": {
    "command": "npx",
    "args": ["-y", "ddg-mcp-search"],
    "env": {
      "SAFE_SEARCH": "MODERATE",
      "REGION": "cn-zh"
    }
  }
}
```

### 🌍 地区代码

| 地区 | 代码 | 说明 |
|------|------|------|
| 中国 | `cn-zh` | 简体中文结果 |
| 美国 | `us-en` | 英语（美国）结果 |
| 英国 | `uk-en` | 英语（英国）结果 |
| 日本 | `jp-ja` | 日语结果 |
| 德国 | `de-de` | 德语结果 |
| 法国 | `fr-fr` | 法语结果 |

**默认值**: 无地区过滤（全球结果）

### 🛡️ SafeSearch 级别

| 级别 | 值 | 说明 |
|------|-----|------|
| 严格 | `STRICT` | 严格过滤成人内容 |
| 中等 | `MODERATE` | 平衡过滤（默认） |
| 关闭 | `OFF` | 不过滤 |

### 🔨 可用工具

#### `search`
使用可定制参数搜索DuckDuckGo。

**参数:**
- `query`（必需）: 搜索关键词
- `max_results`（可选）: 返回的最大结果数（默认: 5）

**示例:**
```javascript
{
  "query": "人工智能",
  "max_results": 3
}
```

**响应:**
```
找到 3 条搜索结果:

1. 人工智能 - 维基百科
   URL: https://zh.wikipedia.org/wiki/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD
   Summary: 人工智能（英语：Artificial Intelligence，缩写为AI）...

2. 什么是人工智能（AI）？| IBM
   URL: https://www.ibm.com/cn-zh/topics/artificial-intelligence
   Summary: 人工智能利用计算机和机器来模拟人类心智的解决问题...

3. 人工智能是什么？定义、用途和类型
   URL: https://www.coursera.org/articles/what-is-artificial-intelligence
   Summary: 人工智能是计算机科学的一个领域，旨在创建能够执行...
```

### 📝 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SAFE_SEARCH` | SafeSearch级别（STRICT/MODERATE/OFF） | `MODERATE` |
| `REGION` | 地区代码（如 cn-zh, us-en） | 无（全球） |

### 🧪 测试

运行包含的测试脚本：

```bash
node test-search.mjs
```

预期输出：
```
🧪 启动MCP Server测试...
✅ 搜索功能正常！
```

### 📦 包信息

- **NPM**: https://www.npmjs.com/package/ddg-mcp-search
- **GitHub**: https://github.com/kawayiYokami/duckduckgo-mcp-server
- **许可证**: MIT
- **作者**: kawayiYokami

### 🤝 贡献

欢迎贡献！请随时提交Pull Request。

### 📄 许可证

MIT许可证 - 详见LICENSE文件