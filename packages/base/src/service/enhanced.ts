/**
 * 增强的请求方法
 * 集成重试、缓存、取消等功能
 */

import request from './request';
import { withRetry, defaultRetryCondition } from './retry';
import { requestManager } from './manager';
import type { RequestConfig, Response } from './types';

/**
 * 包装请求，添加重试逻辑
 */
async function enhancedRequest<T>(config: RequestConfig): Promise<T> {
  const { retry, priority = 'normal', ...restConfig } = config;

  // 如果需要重试
  if (retry?.count && retry.count > 0) {
    return withRetry(() => request(restConfig), {
      count: retry.count,
      delay: retry.delay || 1000,
      condition: retry.condition || defaultRetryCondition,
    });
  }

  // 如果设置了优先级，使用队列
  if (priority !== 'normal' || requestManager.getStatus().concurrent >= 6) {
    return requestManager.addToQueue(() => request(restConfig), priority);
  }

  // 直接请求
  return request(restConfig);
}

/**
 * GET 请求（增强版）
 */
export function get<T = any>(url: string, config?: RequestConfig): Response<T> {
  return enhancedRequest<T>({
    ...config,
    method: 'GET',
    url,
  });
}

/**
 * POST 请求（增强版）
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedRequest<T>({
    ...config,
    method: 'POST',
    url,
    data,
  });
}

/**
 * PUT 请求（增强版）
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedRequest<T>({
    ...config,
    method: 'PUT',
    url,
    data,
  });
}

/**
 * DELETE 请求（增强版）
 */
export function del<T = any>(url: string, config?: RequestConfig): Response<T> {
  return enhancedRequest<T>({
    ...config,
    method: 'DELETE',
    url,
  });
}

/**
 * PATCH 请求（增强版）
 */
export function patch<T = any>(url: string, data?: any, config?: RequestConfig): Response<T> {
  return enhancedRequest<T>({
    ...config,
    method: 'PATCH',
    url,
    data,
  });
}

/**
 * 并发请求
 * @param requests 请求配置数组
 * @returns 所有请求结果
 */
export async function concurrent<T extends readonly any[]>(
  requests: readonly RequestConfig[]
): Promise<T> {
  const promises = requests.map(config => enhancedRequest(config));
  return Promise.all(promises) as unknown as Promise<T>;
}

/**
 * 竞速请求（返回最快的结果）
 * @param requests 请求配置数组
 * @returns 最快的请求结果
 */
export function race<T = any>(requests: RequestConfig[]): Response<T> {
  const promises = requests.map(config => enhancedRequest<T>(config));
  return Promise.race(promises);
}

/**
 * 创建取消控制器
 */
export function createCancelController(): AbortController {
  return new AbortController();
}

/**
 * 取消请求
 */
export function cancelRequest(tag: string): void {
  requestManager.cancelRequestsByTag(tag);
}

/**
 * 取消所有请求
 */
export function cancelAllRequests(): void {
  requestManager.cancelAllRequests();
}

/**
 * 清除缓存
 */
export { requestCache } from './cache';

/**
 * 获取请求状态
 */
export function getRequestStatus() {
  return requestManager.getStatus();
}
