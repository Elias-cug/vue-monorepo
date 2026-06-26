/**
 * 请求管理器
 * 处理请求取消、请求队列、请求优先级等
 */

import type { RequestConfig } from './types';

interface PendingRequest {
  controller: AbortController;
  tag?: string;
  priority: 'low' | 'normal' | 'high';
}

interface QueueItem {
  execute: () => Promise<any>;
  priority: 'low' | 'normal' | 'high';
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class RequestManager {
  // 进行中的请求
  private pendingRequests: Map<string, PendingRequest> = new Map();

  // 请求队列
  private queue: QueueItem[] = [];

  // 并发限制
  private maxConcurrent: number = 6;

  // 当前并发数
  private currentConcurrent: number = 0;

  // 生成请求唯一标识
  generateRequestKey(config: RequestConfig): string {
    const { method = 'get', url, params, data } = config;
    const paramStr = params ? JSON.stringify(params) : '';
    const dataStr = data ? JSON.stringify(data) : '';
    return `${method}:${url}:${paramStr}:${dataStr}`;
  }

  /**
   * 创建取消控制器
   */
  createAbortController(key: string, config: RequestConfig): AbortController {
    const controller = new AbortController();

    this.pendingRequests.set(key, {
      controller,
      tag: config.tag,
      priority: config.priority || 'normal',
    });

    return controller;
  }

  /**
   * 移除请求记录
   */
  removeRequest(key: string): void {
    this.pendingRequests.delete(key);
  }

  /**
   * 取消单个请求
   */
  cancelRequest(key: string): void {
    const request = this.pendingRequests.get(key);
    if (request) {
      request.controller.abort();
      this.pendingRequests.delete(key);
    }
  }

  /**
   * 根据标签取消请求
   */
  cancelRequestsByTag(tag: string): void {
    for (const [key, request] of this.pendingRequests.entries()) {
      if (request.tag === tag) {
        request.controller.abort();
        this.pendingRequests.delete(key);
      }
    }
  }

  /**
   * 取消所有请求
   */
  cancelAllRequests(): void {
    for (const [, request] of this.pendingRequests.entries()) {
      request.controller.abort();
    }
    this.pendingRequests.clear();
  }

  /**
   * 添加到队列
   */
  addToQueue<T>(
    execute: () => Promise<T>,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        execute,
        priority,
        resolve,
        reject,
      };

      // 根据优先级插入队列
      const insertIndex = this.findInsertIndex(priority);
      this.queue.splice(insertIndex, 0, item);

      // 尝试处理队列
      this.processQueue();
    });
  }

  /**
   * 找到插入位置（优先级队列）
   */
  private findInsertIndex(priority: 'low' | 'normal' | 'high'): number {
    const priorityValue = { low: 0, normal: 1, high: 2 }[priority];

    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (!item) continue;
      const itemPriorityValue = { low: 0, normal: 1, high: 2 }[item.priority];
      if (priorityValue > itemPriorityValue) {
        return i;
      }
    }

    return this.queue.length;
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    while (this.currentConcurrent < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      this.currentConcurrent++;

      try {
        const result = await item.execute();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
        this.currentConcurrent--;
        this.processQueue();
      }
    }
  }

  /**
   * 设置最大并发数
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
    this.processQueue();
  }

  /**
   * 获取状态信息
   */
  getStatus(): {
    pending: number;
    queued: number;
    concurrent: number;
    maxConcurrent: number;
  } {
    return {
      pending: this.pendingRequests.size,
      queued: this.queue.length,
      concurrent: this.currentConcurrent,
      maxConcurrent: this.maxConcurrent,
    };
  }
}

// 单例模式
export const requestManager = new RequestManager();
