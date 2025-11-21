interface StorageData<T = any> {
  value: T;
  expire: number | null;
  time: number;
}

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7; // 默认缓存时间 7 天

class LocalStorage {
  private prefix: string;
  private defaultExpire: number;

  /**
   * 创建 LocalStorage 实例
   * @param options 配置项
   * @param options.prefix 存储键名前缀，用于区分不同项目的存储
   * @param options.defaultExpire 默认过期时间（秒）
   */
  constructor(options: { prefix?: string; defaultExpire?: number } = {}) {
    this.prefix = options.prefix || 'app';
    this.defaultExpire = options.defaultExpire || DEFAULT_CACHE_TIME;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`.toUpperCase();
  }

  /**
   * 设置存储
   * @param key 存储键名
   * @param value 存储值
   * @param expire 过期时间（秒），不传则使用默认过期时间
   */
  set<T = any>(key: string, value: T, expire?: number): void {
    if (value === undefined || value === null) {
      this.remove(key);
      return;
    }

    const storageData: StorageData<T> = {
      value,
      expire: expire !== undefined ? expire : this.defaultExpire,
      time: Date.now(),
    };

    const json = JSON.stringify(storageData);
    window.localStorage.setItem(this.getKey(key), json);
  }

  /**
   * 获取存储
   * @param key 存储键名
   * @param def 默认值（可选）
   */
  get<T = any>(key: string, def: T | null = null): T | null {
    const json = window.localStorage.getItem(this.getKey(key));
    if (!json) return def;

    try {
      const data: StorageData<T> = JSON.parse(json);
      const { value, expire, time } = data;

      // 如果设置了过期时间且已过期，则删除并返回默认值
      if (expire && Date.now() - time > expire * 1000) {
        this.remove(key);
        return def;
      }

      return value;
    } catch (error) {
      console.error('localStorage get error:', error);
      return def;
    }
  }

  /**
   * 删除指定存储
   * @param key 存储键名
   */
  remove(key: string): void {
    window.localStorage.removeItem(this.getKey(key));
  }

  /**
   * 清空当前命名空间下的所有存储
   */
  clear(): void {
    const keys = Object.keys(window.localStorage);
    const prefix = this.getKey('');

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        window.localStorage.removeItem(key);
      }
    });
  }

  /**
   * 获取所有存储键名
   */
  keys(): string[] {
    const keys = Object.keys(window.localStorage);
    const prefix = this.getKey('');

    return keys.filter(key => key.startsWith(prefix)).map(key => key.slice(prefix.length));
  }

  /**
   * 检查键是否存在
   * @param key 存储键名
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// 导出默认实例
export const storage = new LocalStorage();

// 导出类以便需要时创建自定义实例
export { LocalStorage };

export default storage;
