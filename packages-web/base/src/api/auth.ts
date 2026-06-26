/**
 * 认证相关 API
 */

import { menusMock, userMock } from '@base/apiMock/auth';

/**
 * 获取用户信息
 * @param token 用户 token
 * @returns 用户信息
 */
export async function fetchUserInfo(): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          ...userMock,
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
export async function fetchMenus(appId: string): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [...(menusMock[appId as keyof typeof menusMock] || [])],
      } as any);
    }, 500);
  });
}
