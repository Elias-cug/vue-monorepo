/**
 * Storage 工具类
 * 支持 localStorage 和 sessionStorage，带 appId 前缀
 */

type StorageType = 'localStorage' | 'sessionStorage';

interface GetOptions {
  /** 默认值，当 key 不存在时返回 */
  defaultValue?: any;
  /** 是否忽略 appId 前缀，默认 false */
  ignorePrefix?: boolean;
}

interface SetOptions {
  /** 是否忽略 appId 前缀，默认 false */
  ignorePrefix?: boolean;
}

/**
 * Storage 类
 */
class Storage {
  private storage: globalThis.Storage;
  private appId: string | null = null;

  constructor(type: StorageType = 'localStorage') {
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  /**
   * 设置 appId
   * @param appId 应用 ID
   */
  setAppId(appId: string) {
    this.appId = appId;
  }

  /**
   * 获取带前缀的 key
   * @param key 原始 key
   * @param ignorePrefix 是否忽略前缀
   * @returns 处理后的 key
   */
  private getKey(key: string, ignorePrefix = false): string {
    if (ignorePrefix || !this.appId) {
      return key;
    }
    return `${this.appId}_${key}`;
  }

  /**
   * 获取值
   * @param key 存储的 key
   * @param options 配置选项
   * @returns 存储的值或默认值
   */
  get<T = any>(key: string, options?: GetOptions): T | undefined {
    const ignorePrefix = options?.ignorePrefix ?? false;
    const realKey = this.getKey(key, ignorePrefix);
    const value = this.storage.getItem(realKey);

    if (value === null) {
      return options?.defaultValue as T;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  /**
   * 设置值
   * @param key 存储的 key
   * @param value 要存储的值
   * @param options 配置选项
   */
  set(key: string, value: any, options?: SetOptions): void {
    const realKey = this.getKey(key, options?.ignorePrefix);
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(realKey, stringValue);
  }

  /**
   * 删除值
   * @param key 存储的 key
   * @param ignorePrefix 是否忽略前缀
   */
  remove(key: string, ignorePrefix = false): void {
    const realKey = this.getKey(key, ignorePrefix);
    this.storage.removeItem(realKey);
  }

  /**
   * 清空所有带 appId 前缀的存储
   */
  clear(): void {
    if (!this.appId) {
      this.storage.clear();
      return;
    }

    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(`${this.appId}_`)) {
        keys.push(key);
      }
    }
    keys.forEach(key => this.storage.removeItem(key));
  }

  /**
   * 获取所有带 appId 前缀的 key
   * @returns key 数组
   */
  keys(): string[] {
    if (!this.appId) {
      return Object.keys(this.storage);
    }

    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(`${this.appId}_`)) {
        // 移除前缀，返回原始 key
        result.push(key.replace(`${this.appId}_`, ''));
      }
    }
    return result;
  }
}

// 创建默认实例
export const ls = new Storage('localStorage');
export const ss = new Storage('sessionStorage');

// 导出类型和类
export type { StorageType, GetOptions, SetOptions };
