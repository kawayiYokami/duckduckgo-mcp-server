/**
 * DuckDuckGo MCP Server Types
 */

export enum SafeSearchMode {
  STRICT = "1",      // kp=1
  MODERATE = "-1",   // kp=-1 (default)
  OFF = "-2"         // kp=-2
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface ServerConfig {
  safeSearch: SafeSearchMode;
  defaultRegion: string;
  port?: number;
  host?: string;
}

export interface SearchOptions {
  query: string;
  maxResults?: number;
  region?: string;
}