import { get, patch, post, put } from '@lee/base';

export interface Role {
  id: number;
  tenantId?: number | null;
  code: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  status: number;
  isSystem: boolean;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface RoleQuery {
  page: number;
  pageSize: number;
  tenantId?: number;
  keyword?: string;
  status?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface RoleCreatePayload {
  tenantId: number;
  code: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  status: number;
  sort: number;
}

export interface RoleUpdatePayload {
  tenantId?: number;
  code?: string;
  name?: string;
  displayName?: string | null;
  description?: string | null;
  status?: number;
  sort?: number;
}

export interface RoleStatusPayload {
  status: number;
}

export function fetchRoles(params: RoleQuery) {
  return get<PageData<Role>>('/v1/roles', {
    params,
    safe: false,
  });
}

export function createRole(data: RoleCreatePayload) {
  return post<Role>('/v1/roles', data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateRole(id: number, data: RoleUpdatePayload) {
  return put<Role>(`/v1/roles/${id}`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateRoleStatus(id: number, data: RoleStatusPayload) {
  return patch<Role>(`/v1/roles/${id}/status`, data, {
    safe: false,
    showSuccess: true,
  });
}
