/**
 * 网页内容抓取器
 * 从URL获取并解析网页内容
 */
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface FetchOptions {
  url: string;
  maxLength?: number;
}

export class WebContentFetcher {
  private readonly DEFAULT_MAX_LENGTH = 8000;

  private readonly headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  /**
   * 获取并解析网页内容
   */
  async fetch(options: FetchOptions): Promise<string> {
    const { url, maxLength = this.DEFAULT_MAX_LENGTH } = options;

    try {
      console.error(`[信息] 正在获取内容: ${url}`);

      // 发送HTTP请求
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });

      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: 无法访问网页`);
      }

      // 解析HTML
      const $ = cheerio.load(response.data);

      // 移除不需要的元素
      $('script, style, nav, header, footer, iframe, noscript').remove();

      // 提取文本内容
      let text = $('body').text();

      // 清理文本
      text = this.cleanText(text);

      // 截断过长内容
      if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '... [内容已截断]';
      }

      console.error(`[信息] 成功获取内容 (${text.length} 字符)`);
      return text;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[错误] 获取网页内容失败: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return '错误: 请求超时，无法获取网页内容';
        }
        if (error.response) {
          return `错误: HTTP ${error.response.status} - 无法访问网页`;
        }
        if (error.code === 'ENOTFOUND') {
          return '错误: 域名解析失败，请检查URL是否正确';
        }
      }

      return `错误: 获取网页内容时发生异常 (${errorMessage})`;
    }
  }

  /**
   * 清理文本内容
   */
  private cleanText(text: string): string {
    // 分行处理
    const lines = text.split('\n').map(line => line.trim());

    // 分块处理（双空格分割）
    const chunks: string[] = [];
    for (const line of lines) {
      const parts = line.split('  ').map(p => p.trim());
      chunks.push(...parts);
    }

    // 过滤空内容并拼接
    text = chunks.filter(chunk => chunk.length > 0).join(' ');

    // 移除多余空白
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * 格式化获取结果
   */
  formatResult(url: string, content: string): string {
    if (content.startsWith('错误:')) {
      return content;
    }

    return `网页内容 (${url}):\n\n${content}`;
  }
}