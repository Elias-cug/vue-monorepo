/**
 * 服务层统一导出
 */

import request, { downloadFile } from './request';
import type { ApiResponse, RequestConfig, Response, DownloadConfig } from './types';
import { getErrorMessage, getHttpStatusMessage } from './errorCode';

/**
 * GET 请求
 */
export function get<T = any>(url: string, config?: RequestConfig): Response<T> {
  return request.get(url, config);
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return request.post(url, data, config);
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return request.put(url, data, config);
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, config?: RequestConfig): Response<T> {
  return request.delete(url, config);
}

/**
 * PATCH 请求
 */
export function patch<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return request.patch(url, data, config);
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
 * 批量请求
 */
export function all<T extends readonly unknown[] | []>(
  requests: T
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  return Promise.all(requests);
}

// 导出类型和工具
export type { ApiResponse, RequestConfig, Response, DownloadConfig };
export { getErrorMessage, getHttpStatusMessage, downloadFile };

// 导出 axios 实例
export { default as request } from './request';

