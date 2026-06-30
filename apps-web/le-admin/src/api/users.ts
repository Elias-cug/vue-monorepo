import { del, get, post, put } from '@lee/base';

export interface User {
  id: number;
  tenantId: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  status: number;
  displayName?: string | null;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface UserQuery {
  page: number;
  pageSize: number;
  tenantId?: number;
  username?: string;
  email?: string;
  phone?: string;
  displayName?: string;
  status?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface UserCreatePayload {
  tenantId: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  status: number;
}

export interface UserUpdatePayload {
  tenantId?: number;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  status?: number;
}

export interface ResetPasswordResult {
  id: number;
  initialPassword: string;
}

export function fetchUsers(params: UserQuery) {
  return get<PageData<User>>('/v1/users', {
    params,
    safe: false,
  });
}

export function createUser(data: UserCreatePayload) {
  return post<User>('/v1/users', data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateUser(id: number, data: UserUpdatePayload) {
  return put<User>(`/v1/users/${id}`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function deleteUser(id: number) {
  return del<User>(`/v1/users/${id}`, {
    safe: false,
    showSuccess: true,
  });
}

export function resetUserPassword(id: number) {
  return post<ResetPasswordResult>(`/v1/users/${id}/reset-password`, undefined, {
    safe: false,
    showSuccess: true,
  });
}
