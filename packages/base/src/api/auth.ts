/**
 * 认证相关 API
 */

import type { UserInfo, Menu } from '@base/types/auth';
import { menusMock } from '@base/mock/menus.ts';

/**
 * 获取用户信息
 * @param token 用户 token
 * @returns 用户信息
 */
export async function fetchUserInfo(_token: string): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          ...menusMock,
        },
      } as any);
    }, 500);
  });
}

/**
 * 获取菜单列表
 * @param token 用户 token
 * @returns 菜单列表
 */
export async function fetchMenus(_token: string): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [...menusMock],
      } as any);
    }, 500);
  });
}
