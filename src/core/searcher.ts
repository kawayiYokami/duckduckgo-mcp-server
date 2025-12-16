/**
 * DuckDuckGo 搜索实现
 * 轻量高效的TypeScript版本，支持SafeSearch和Region配置
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchResult, SearchOptions, SafeSearchMode } from './types.js';

export class DuckDuckGoSearcher {
  // DuckDuckGo HTML搜索端点
  private static readonly BASE_URL = 'https://html.duckduckgo.com/html';
  // 模拟浏览器User-Agent
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  constructor(
    private safeSearch: SafeSearchMode,      // SafeSearch级别（固定）
    private defaultRegion: string            // 默认地区（可被覆盖）
  ) {}

  /**
   * 执行DuckDuckGo搜索
   * @param options 搜索选项
   * @returns 搜索结果数组
   */
  async search(options: SearchOptions): Promise<SearchResult[]> {
    const { query, maxResults = 10, region = '' } = options;
    const effectiveRegion = region || this.defaultRegion;

    try {
      console.error(`[信息] 搜索: ${query} (SafeSearch: ${this.safeSearch}, 地区: ${effectiveRegion || '默认'})`);

      // 发送POST请求到DuckDuckGo
      const response = await axios.post(
        DuckDuckGoSearcher.BASE_URL,
        new URLSearchParams({
          q: query,              // 查询词
          b: '',                 // 分页（空=第一页）
          kl: effectiveRegion,   // 地区代码（如cn-zh）
          kp: this.safeSearch    // SafeSearch参数
        }),
        {
          headers: { 'User-Agent': DuckDuckGoSearcher.USER_AGENT },
          timeout: 30000
        }
      );

      return this.parseResults(response.data, maxResults);
    } catch (error) {
      console.error(`[错误] 搜索失败:`, error);
      return [];
    }
  }

  /**
   * 解析HTML搜索结果
   * @param html DuckDuckGo返回的HTML
   * @param maxResults 最大结果数
   * @returns 解析后的结果数组
   */
  private parseResults(html: string, maxResults: number): SearchResult[] {
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    // 遍历每个搜索结果
    $('.result').each((_: number, elem: any) => {
      if (results.length >= maxResults) return false;

      const $elem = $(elem);
      const $title = $elem.find('.result__title');
      const $link = $title.find('a');

      if (!$link.length) return;

      let link = $link.attr('href') || '';
      const title = $link.text().trim();

      // 跳过广告结果
      if (link.includes('y.js')) return;

      // 清理DuckDuckGo重定向URL
      if (link.startsWith('//duckduckgo.com/l/?uddg=')) {
        const match = link.match(/uddg=([^&]+)/);
        if (match) link = decodeURIComponent(match[1]);
      }

      const snippet = $elem.find('.result__snippet').text().trim();

      results.push({
        title,
        link,
        snippet,
        position: results.length + 1
      });
    });

    console.error(`[信息] 找到 ${results.length} 条结果`);
    return results;
  }

  /**
   * 格式化搜索结果为文本
   * @param results 搜索结果数组
   * @returns 格式化的文本
   */
  formatResults(results: SearchResult[]): string {
    if (!results.length) {
      return '未找到结果。请尝试重新表述您的搜索。';
    }

    const lines = [`找到 ${results.length} 条搜索结果:\n`];

    for (const result of results) {
      lines.push(`${result.position}. ${result.title}`);
      lines.push(`   URL: ${result.link}`);
      lines.push(`   Summary: ${result.snippet}`);
      lines.push('');
    }

    return lines.join('\n');
  }
}