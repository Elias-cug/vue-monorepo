/**
 * 服务层统一导出
 * 提供增强的请求功能：重试、缓存、取消、优先级等
 */

import request, { downloadFile } from './request';
import type {
  ApiResponse,
  RequestConfig,
  Response,
  DownloadConfig,
  RetryConfig,
  SafeResponse,
} from './types';
import { getErrorMessage, getHttpStatusMessage } from './errorCode';
import {
  get as enhancedGet,
  post as enhancedPost,
  put as enhancedPut,
  del as enhancedDel,
  patch as enhancedPatch,
  concurrent,
} from './enhanced';
import type { AxiosProgressEvent } from 'axios';

/**
 * GET 请求（增强版，支持重试、缓存等）
 */
export function get<T = any>(url: string, config?: RequestConfig): Response<T> {
  return enhancedGet<T>(url, config);
}

/**
 * POST 请求（增强版）
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedPost<T>(url, data, config);
}

/**
 * PUT 请求（增强版）
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedPut<T>(url, data, config);
}

/**
 * DELETE 请求（增强版）
 */
export function del<T = any>(url: string, config?: RequestConfig): Response<T> {
  return enhancedDel<T>(url, config);
}

/**
 * PATCH 请求（增强版）
 */
export function patch<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedPatch<T>(url, data, config);
}

/**
 * 文件上传
 */
export function upload<T = any>(
  url: string,
  file: File | FormData,
  config?: RequestConfig
): Response<T> {
  const formData = file instanceof FormData ? file : new FormData();
  if (file instanceof File) {
    formData.append('file', file);
  }

  return request.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  });
}

/**
 * 文件下载
 */
export async function download(
  url: string,
  config?: RequestConfig & { downloadConfig?: DownloadConfig }
): Promise<{ blob: Blob; filename: string; url: string }> {
  const response = await request.get(url, {
    ...config,
    isDownload: true,
  });

  return downloadFile(response, config?.downloadConfig);
}

/**
 * 并发请求（等待所有请求完成）
 */
export function all<T extends readonly any[]>(requests: readonly RequestConfig[]): Promise<T> {
  return concurrent<T>(requests);
}

/**
 * 竞速请求（返回最快的结果）
 */
export { race } from './enhanced';

/**
 * 创建取消控制器
 */
export { createCancelController } from './enhanced';

/**
 * 取消指定标签的请求
 */
export { cancelRequest } from './enhanced';

/**
 * 取消所有请求
 */
export { cancelAllRequests } from './enhanced';

/**
 * 请求缓存管理
 */
export { requestCache } from './enhanced';

/**
 * 获取请求状态
 */
export { getRequestStatus } from './enhanced';

/**
 * 请求管理器
 */
export { requestManager } from './manager';

// 导出类型
export type {
  ApiResponse,
  RequestConfig,
  Response,
  DownloadConfig,
  RetryConfig,
  AxiosProgressEvent,
  SafeResponse,
};

// 导出工具函数
export { getErrorMessage, getHttpStatusMessage, downloadFile };

// 导出 axios 实例（供高级用法）
export { default as request } from './request';
