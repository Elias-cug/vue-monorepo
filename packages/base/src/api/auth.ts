/**
 * 认证相关 API
 */

import type { UserInfo, Menu } from '@base/types/auth';

/**
 * 获取用户信息
 * @param token 用户 token
 * @returns 用户信息
 */
export async function fetchUserInfo(_token: string): Promise<UserInfo> {
  // TODO: 实现真实的 API 调用
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({} as UserInfo);
    }, 500);
  });
}

/**
 * 获取菜单列表
 * @param token 用户 token
 * @returns 菜单列表
 */
export async function fetchMenus(_token: string): Promise<Menu[]> {
  // TODO: 实现真实的 API 调用
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
}
