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
import type { ApiResponse, RequestConfig, DownloadConfig } from './types';

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
  (response) => {
    const config = response.config as RequestConfig;
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
      // 返回原始响应或解包数据
      return config.returnRaw ? response.data : data;
    }

    // 403 权限验证失败，跳转登录
    if (code === 403 || code === 401 || code === 10007 || code === 10008) {
      message.error(msg || getErrorMessage(code));
      // 清除 token
      ls.remove(TOKEN_KEY, true);
      // 跳转登录页
      router.push({
        path: '/login',
        query: {
          redirect: router.currentRoute.value.fullPath,
        },
      });
      return Promise.reject(new Error(msg || getErrorMessage(code)));
    }

    // 其他业务错误
    const errorMsg = msg || getErrorMessage(code);
    if (config.showError !== false) {
      message.error(errorMsg);
    }
    return Promise.reject(new Error(errorMsg));
  },
  (error: AxiosError) => {
    const config = error.config as RequestConfig | undefined;
    const message = useMessage();

    // 处理 HTTP 错误
    if (error.response) {
      const status = error.response.status;
      const errorMsg = getHttpStatusMessage(status);

      // 401/403 跳转登录
      if (status === 401 || status === 403) {
        ls.remove(TOKEN_KEY, true);
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        });
      }

      if (config?.showError !== false) {
        message.error(errorMsg);
      }
      return Promise.reject(new Error(errorMsg));
    }

    // 处理网络错误
    if (error.message.includes('timeout')) {
      if (config?.showError !== false) {
        message.error('请求超时，请稍后重试');
      }
      return Promise.reject(new Error('请求超时'));
    }

    if (error.message.includes('Network Error')) {
      if (config?.showError !== false) {
        message.error('网络连接失败，请检查网络');
      }
      return Promise.reject(new Error('网络错误'));
    }

    // 其他错误
    const errorMsg = error.message || '请求失败';
    if (config?.showError !== false) {
      message.error(errorMsg);
    }
    return Promise.reject(error);
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

