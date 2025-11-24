/**
 * 用户相关接口
 * 使用示例
 */

import { get, post, put, del, upload, download } from '../service';
import type { Response } from '../service';

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles?: string[];
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Response<UserInfo> {
  return get<UserInfo>('/user/info');
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>): Response<UserInfo> {
  return put<UserInfo>('/user/info', data, {
    showSuccess: true, // 显示成功提示
  });
}

/**
 * 获取用户列表
 */
export function getUserList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}): Response<{ list: UserInfo[]; total: number }> {
  return get('/user/list', { params });
}

/**
 * 删除用户
 */
export function deleteUser(id: string): Response<void> {
  return del(`/user/${id}`, {
    showSuccess: true,
  });
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File): Response<{ url: string }> {
  return upload<{ url: string }>('/user/avatar', file, {
    showSuccess: true,
  });
}

/**
 * 导出用户数据
 */
export function exportUsers(): Promise<{ blob: Blob; filename: string; url: string }> {
  return download('/user/export', {
    downloadConfig: {
      filename: '用户数据.xlsx',
    },
  });
}
