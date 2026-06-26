/**
 * 请求重试工具
 */

import type { AxiosError } from 'axios';

export interface RetryConfig {
  /** 重试次数 */
  count: number;
  /** 重试延迟(ms) */
  delay: number;
  /** 重试条件 */
  condition?: (error: any) => boolean;
}

/**
 * 默认重试条件
 * @param error 错误对象
 * @returns 是否重试
 */
export function defaultRetryCondition(error: AxiosError): boolean {
  // 网络错误重试
  if (!error.response) {
    return true;
  }

  // 5xx 服务器错误重试
  if (error.response.status >= 500) {
    return true;
  }

  // 429 限流错误重试
  if (error.response.status === 429) {
    return true;
  }

  // 408 请求超时重试
  if (error.response.status === 408) {
    return true;
  }

  return false;
}

/**
 * 指数退避延迟
 * @param attempt 当前重试次数
 * @param baseDelay 基础延迟
 * @returns 实际延迟时间
 */
export function exponentialBackoff(attempt: number, baseDelay: number): number {
  const maxDelay = 30000; // 最大延迟 30秒
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // 添加随机抖动，避免重试风暴
  const jitter = Math.random() * 0.3 * delay;
  return Math.floor(delay + jitter);
}

/**
 * 执行重试
 * @param fn 要执行的函数
 * @param config 重试配置
 * @returns Promise
 */
export async function withRetry<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T> {
  const { count, delay, condition } = config;
  let lastError: any;

  for (let i = 0; i <= count; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 最后一次尝试，不再重试
      if (i === count) {
        break;
      }

      // 检查是否满足重试条件
      if (condition && !condition(error)) {
        break;
      }

      // 延迟重试（使用指数退避）
      const retryDelay = exponentialBackoff(i, delay);
      console.log(`请求失败，${retryDelay}ms 后进行第 ${i + 1} 次重试...`);
      await sleep(retryDelay);
    }
  }

  throw lastError;
}

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
