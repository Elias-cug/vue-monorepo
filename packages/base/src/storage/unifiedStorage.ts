interface StorageData<T = any> {
  value: T;
  expire: number | null;
  time: number;
  persistent: boolean; // true for localStorage, false for sessionStorage
}

type StorageType = 'local' | 'session' | 'auto';

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7; // 默认缓存时间 7 天

class UnifiedStorage {
  private prefix: string;
  private defaultExpire: number;
  private defaultStorage: StorageType;

  /**
   * 创建 UnifiedStorage 实例
   * @param options 配置项
   * @param options.prefix 存储键名前缀，用于区分不同项目的存储
   * @param options.defaultExpire 默认过期时间（秒）
   * @param options.defaultStorage 默认存储类型，'local' | 'session' | 'auto'
   */
  constructor(
    options: {
      prefix?: string;
      defaultExpire?: number;
      defaultStorage?: StorageType;
    } = {}
  ) {
    this.prefix = options.prefix || 'app';
    this.defaultExpire = options.defaultExpire || DEFAULT_CACHE_TIME;
    this.defaultStorage = options.defaultStorage || 'local';
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`.toUpperCase();
  }

  private getStorage(persistent: boolean): Storage {
    return persistent ? window.localStorage : window.sessionStorage;
  }

  /**
   * 设置存储
   * @param key 存储键名
   * @param value 存储值
   * @param options 配置项
   * @param options.expire 过期时间（秒）
   * @param options.persistent 是否持久化存储（使用localStorage），默认为true
   */
  set<T = any>(
    key: string,
    value: T,
    options: { expire?: number; persistent?: boolean } = {}
  ): void {
    if (value === undefined || value === null) {
      this.remove(key);
      return;
    }

    const persistent = options.persistent ?? this.defaultStorage === 'local';
    const storage = this.getStorage(persistent);

    // 清理另一个存储中的相同key
    const otherStorage = this.getStorage(!persistent);
    otherStorage.removeItem(this.getKey(key));

    const storageData: StorageData<T> = {
      value,
      expire: options.expire !== undefined ? options.expire : this.defaultExpire,
      time: Date.now(),
      persistent,
    };

    const json = JSON.stringify(storageData);
    storage.setItem(this.getKey(key), json);
  }

  /**
   * 获取存储
   * @param key 存储键名
   * @param def 默认值（可选）
   * @param storageType 指定从哪个存储获取，不传则自动检测
   */
  get<T = any>(
    key: string,
    def: T | null = null,
    storageType?: 'local' | 'session' | 'auto'
  ): T | null {
    let storage: Storage | null = null;

    if (storageType === 'local') {
      storage = window.localStorage;
    } else if (storageType === 'session') {
      storage = window.sessionStorage;
    } else {
      // 自动检测，先检查localStorage，再检查sessionStorage
      const localJson = window.localStorage.getItem(this.getKey(key));
      if (localJson) {
        storage = window.localStorage;
      } else {
        const sessionJson = window.sessionStorage.getItem(this.getKey(key));
        if (sessionJson) {
          storage = window.sessionStorage;
        }
      }
    }

    if (!storage) return def;

    const json = storage.getItem(this.getKey(key));
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
      console.error('UnifiedStorage get error:', error);
      return def;
    }
  }

  /**
   * 删除指定存储
   * @param key 存储键名
   */
  remove(key: string): void {
    // 同时删除两个存储中的key
    window.localStorage.removeItem(this.getKey(key));
    window.sessionStorage.removeItem(this.getKey(key));
  }

  /**
   * 清空当前命名空间下的所有存储
   */
  clear(): void {
    this.clearByType('local');
    this.clearByType('session');
  }

  /**
   * 清空指定类型的存储
   * @param storageType 存储类型
   */
  clearByType(storageType: 'local' | 'session'): void {
    const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
    const keys = Object.keys(storage);
    const prefix = this.getKey('');

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        storage.removeItem(key);
      }
    });
  }

  /**
   * 获取所有存储键名
   * @param storageType 存储类型，不传则返回所有
   */
  keys(storageType?: 'local' | 'session'): string[] {
    const prefix = this.getKey('');
    let keys: string[] = [];

    if (!storageType || storageType === 'local') {
      keys = keys.concat(
        Object.keys(window.localStorage)
          .filter(key => key.startsWith(prefix))
          .map(key => `local:${key.slice(prefix.length)}`)
      );
    }

    if (!storageType || storageType === 'session') {
      keys = keys.concat(
        Object.keys(window.sessionStorage)
          .filter(key => key.startsWith(prefix))
          .map(key => `session:${key.slice(prefix.length)}`)
      );
    }

    return keys;
  }

  /**
   * 检查键是否存在
   * @param key 存储键名
   * @param storageType 存储类型，不传则检查所有
   */
  has(key: string, storageType?: 'local' | 'session'): boolean {
    if (storageType === 'local' || !storageType) {
      if (window.localStorage.getItem(this.getKey(key)) !== null) return true;
    }
    if (storageType === 'session' || !storageType) {
      if (window.sessionStorage.getItem(this.getKey(key)) !== null) return true;
    }
    return false;
  }
}

// 导出默认实例（保持向后兼容）
const storage = new UnifiedStorage();

// 导出预配置的存储实例
export const localStorage = new UnifiedStorage({ defaultStorage: 'local' });
export const sessionStorage = new UnifiedStorage({ defaultStorage: 'session' });

// 导出类以便需要时创建自定义实例
export { UnifiedStorage };

// 默认导出保持向后兼容
export default storage;
