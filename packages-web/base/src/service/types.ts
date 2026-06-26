/**
 * 服务层类型定义
 */

import type { AxiosRequestConfig, AxiosProgressEvent } from 'axios';

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
  /** 重试配置 */
  retry?: {
    /** 重试次数，默认 0 */
    count?: number;
    /** 重试延迟(ms)，默认 1000 */
    delay?: number;
    /** 重试条件 */
    condition?: (error: any) => boolean;
  };
  /** 缓存配置 */
  cache?: {
    /** 是否启用缓存，默认 false */
    enable?: boolean;
    /** 缓存时间(ms)，默认 5分钟 */
    ttl?: number;
    /** 缓存键，默认使用 url + params */
    key?: string;
  };
  /** 取消控制器 */
  abortController?: AbortController;
  /** 请求优先级 */
  priority?: 'low' | 'normal' | 'high';
  /** 请求标签，用于批量取消 */
  tag?: string;
  /** 请求开始回调 */
  onStart?: () => void;
  /** 进度回调 */
  onProgress?: (progress: AxiosProgressEvent) => void;
  /** 请求结束回调 */
  onFinish?: () => void;

  /** 是否使用安全模式（默认 true，总是返回 resolve，通过数据结构区分成功失败；设为 false 使用传统模式） */
  safe?: boolean;
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

/**
 * 重试配置类型
 */
export interface RetryConfig {
  /** 重试次数 */
  count: number;
  /** 重试延迟(ms) */
  delay: number;
  /** 重试条件 */
  condition?: (error: any) => boolean;
}

/**
 * 安全响应类型（总是 resolve，不会 reject）
 */
export interface SafeResponse<T = any> {
  /** 响应数据 */
  data: T | null;
  /** 错误信息 */
  error: {
    message: string;
    code?: string | number;
    details?: any;
  } | null;
}
