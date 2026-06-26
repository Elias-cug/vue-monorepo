/**
 * 请求缓存管理器
 */

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class RequestCache {
  private cache: Map<string, CacheItem> = new Map();

  /**
   * 生成缓存键
   */
  generateKey(url: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${url}:${paramStr}`;
  }

  /**
   * 设置缓存
   */
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * 获取缓存
   */
  get(key: string): any {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

// 单例模式
export const requestCache = new RequestCache();

// 定期清理过期缓存（每5分钟）
setInterval(
  () => {
    requestCache.clearExpired();
  },
  5 * 60 * 1000
);
