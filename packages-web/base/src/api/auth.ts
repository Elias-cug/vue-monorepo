/**
 * 认证相关 API
 */

import { menusMock, userMock } from '@base/apiMock/auth';
import { get, post } from '@base/service';

export interface LoginPayload {
  tenantId: number;
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface CurrentUser {
  id: number;
  tenantId: number;
  organizationId?: number | null;
  organizationName?: string | null;
  username: string;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  status: number;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export function login(data: LoginPayload) {
  return post<LoginResult>('/v1/auth/login', data, {
    safe: false,
    skipToken: true,
  });
}

/**
 * 获取用户信息
 * @param token 用户 token
 * @returns 用户信息
 */
export async function fetchUserInfo(): Promise<any> {
  if (import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
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

  const userInfo = await get<CurrentUser>('/v1/auth/me', {
    safe: false,
  });

  return {
    code: 200,
    data: {
      ...userInfo,
      name: userInfo.displayName || userInfo.username,
      avatar: userInfo.avatarUrl,
      roles: [],
    },
  };
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
