/**
 * Axios 封装
 * 提供请求拦截、响应拦截、错误处理、文件下载等功能
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useMessage } from 'naive-ui';
import router from '../router';
import { ls } from '../storage';
import { TOKEN_KEY, API_BASE_URL, REQUEST_TIMEOUT } from '../constants';
import { getErrorMessage, getHttpStatusMessage } from './errorCode';
import { requestCache } from './cache';
import { requestManager } from './manager';
import { toLogin } from '../composables/useRouterHelper';
import type { ApiResponse, RequestConfig, DownloadConfig, SafeResponse } from './types';

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & RequestConfig) => {
    // 触发开始回调
    config.onStart?.();
    // 添加 token
    if (!config.skipToken) {
      const token = ls.get<string>(TOKEN_KEY, { ignorePrefix: true });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 文件下载时设置响应类型
    if (config.isDownload) {
      config.responseType = 'blob';
    }

    // 处理缓存
    if (config.cache?.enable && config.method?.toLowerCase() === 'get') {
      const cacheKey = config.cache.key || requestCache.generateKey(config.url!, config.params);
      const cachedData = requestCache.get(cacheKey);

      if (cachedData) {
        console.log('[Cache Hit]', config.url);
        // 返回缓存数据，取消实际请求
        config.adapter = () => {
          return Promise.resolve({
            data: cachedData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          });
        };
      }
    }

    // 处理取消控制器
    if (config.abortController) {
      config.signal = config.abortController.signal;
    } else {
      // 创建默认的取消控制器
      const requestKey = requestManager.generateRequestKey(config);
      const controller = requestManager.createAbortController(requestKey, config);
      config.signal = controller.signal;
      // 保存请求键用于后续清理
      (config as any).__requestKey = requestKey;
    }

    // 处理进度监控
    if (config.onProgress) {
      config.onDownloadProgress = config.onProgress;
      config.onUploadProgress = config.onProgress;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  response => {
    const config = response.config as RequestConfig;

    // 清理请求记录
    const requestKey = (config as any).__requestKey;
    if (requestKey) {
      requestManager.removeRequest(requestKey);
    }

    // 触发结束回调
    config.onFinish?.();
    const message = useMessage();

    // 文件下载处理
    if (config.isDownload) {
      return response;
    }

    // 获取响应数据
    const { code, data, message: msg } = response.data as ApiResponse;

    // 业务成功
    if (code === 200) {
      // 显示成功提示
      if (config.showSuccess && msg) {
        message.success(msg);
      }

      // 处理缓存
      if (config.cache?.enable && config.method?.toLowerCase() === 'get') {
        const cacheKey = config.cache.key || requestCache.generateKey(config.url!, config.params);
        requestCache.set(cacheKey, response.data, config.cache.ttl);
        console.log('[Cache Set]', config.url);
      }

      // 安全模式（默认开启）：返回统一结构
      if (config.safe !== false) {
        const safeResponse: SafeResponse = {
          data: config.returnRaw ? response.data : data,
          error: null,
        };
        return Promise.resolve(safeResponse);
      }

      // 普通模式：返回原始响应或解包数据
      return config.returnRaw ? response.data : data;
    }

    // 403 权限验证失败，跳转登录
    if (code === 403 || code === 401 || code === 10007 || code === 10008) {
      message.error(msg || getErrorMessage(code));
      // 跳转到登录页
      toLogin(router.currentRoute.value.fullPath);

      // 安全模式（默认开启）：返回错误结构
      if (config.safe !== false) {
        const safeResponse: SafeResponse = {
          data: null,
          error: {
            message: msg || getErrorMessage(code),
            code: code,
          },
        };
        return Promise.resolve(safeResponse);
      }

      return Promise.reject(new Error(msg || getErrorMessage(code)));
    }

    // 其他业务错误
    const errorMsg = msg || getErrorMessage(code);
    if (config.showError !== false) {
      message.error(errorMsg);
    }

    // 安全模式（默认开启）：返回错误结构
    if (config.safe !== false) {
      const safeResponse: SafeResponse = {
        data: null,
        error: {
          message: errorMsg,
          code: code,
        },
      };
      return Promise.resolve(safeResponse);
    }

    return Promise.reject(new Error(errorMsg));
  },
  (error: AxiosError) => {
    const config = error.config as RequestConfig | undefined;
    const message = useMessage();

    // 清理请求记录
    const requestKey = (config as any)?.__requestKey;
    if (requestKey) {
      requestManager.removeRequest(requestKey);
    }

    // 触发结束回调
    config?.onFinish?.();

    // 如果是取消请求
    if (error.code === 'ERR_CANCELED' || error.message?.includes('aborted')) {
      console.log('[请求取消]', config?.url);

      // 安全模式（默认开启）：返回取消错误结构
      if (config?.safe !== false) {
        const safeResponse: SafeResponse = {
          data: null,
          error: {
            message: '请求已取消',
            code: 'ERR_CANCELED',
          },
        };
        return Promise.resolve(safeResponse);
      }

      return Promise.reject(error);
    }

    let errorMsg = '请求失败';
    let errorCode: string | number | undefined;

    // 处理 HTTP 错误
    if (error.response) {
      const status = error.response.status;
      errorMsg = getHttpStatusMessage(status);
      errorCode = status;

      // 401/403 跳转登录
      if (status === 401 || status === 403) {
        toLogin(router.currentRoute.value.fullPath);
      }

      if (config?.showError !== false) {
        message.error(errorMsg);
      }
    }
    // 处理网络错误
    else if (error.message.includes('timeout')) {
      errorMsg = '请求超时';
      errorCode = 'TIMEOUT';
      if (config?.showError !== false) {
        message.error('请求超时，请稍后重试');
      }
    } else if (error.message.includes('Network Error')) {
      errorMsg = '网络错误';
      errorCode = 'NETWORK_ERROR';
      if (config?.showError !== false) {
        message.error('网络连接失败，请检查网络');
      }
    }
    // 其他错误
    else {
      errorMsg = error.message || '请求失败';
      errorCode = error.code;
      if (config?.showError !== false) {
        message.error(errorMsg);
      }
    }

    // 安全模式（默认开启）：返回错误结构
    if (config?.safe !== false) {
      const safeResponse: SafeResponse = {
        data: null,
        error: {
          message: errorMsg,
          code: errorCode,
          details: error.response?.data,
        },
      };
      return Promise.resolve(safeResponse);
    }

    // 普通模式：抛出错误
    return Promise.reject(errorMsg === error.message ? error : new Error(errorMsg));
  }
);

/**
 * 文件下载
 * @param response axios 响应
 * @param config 下载配置
 */
export function downloadFile(response: any, config?: DownloadConfig) {
  const blob = new Blob([response.data]);
  const contentDisposition = response.headers['content-disposition'];

  // 从响应头获取文件名
  let filename = config?.filename || 'download';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
      // 处理 URL 编码的文件名
      try {
        filename = decodeURIComponent(filename);
      } catch (e) {
        console.warn('文件名解码失败', e);
      }
    }
  }

  // 自动下载
  if (config?.autoDownload !== false) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return {
    blob,
    filename,
    url: window.URL.createObjectURL(blob),
  };
}

export default instance;
