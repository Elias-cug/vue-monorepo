/**
 * 服务层类型定义
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 业务响应数据结构
 */
export interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
  /** 时间戳 */
  timestamp?: number;
}

/**
 * 请求配置扩展
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示，默认 true */
  showError?: boolean;
  /** 是否显示成功提示，默认 false */
  showSuccess?: boolean;
  /** 是否返回原始响应（不解包 data），默认 false */
  returnRaw?: boolean;
  /** 是否是文件下载请求，默认 false */
  isDownload?: boolean;
  /** 是否跳过 token，默认 false */
  skipToken?: boolean;
}

/**
 * 响应类型
 */
export type Response<T = any> = Promise<T>;

/**
 * 文件下载配置
 */
export interface DownloadConfig {
  /** 文件名 */
  filename?: string;
  /** 是否自动下载，默认 true */
  autoDownload?: boolean;
}

