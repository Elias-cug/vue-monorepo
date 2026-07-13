import { get, patch, post, put } from '@lee/base';

export type PermissionType = 'app' | 'menu' | 'button';

export interface Permission {
  id: number;
  tenantId: number;
  applicationId: number;
  parentId?: number | null;
  code: string;
  name: string;
  displayName?: string | null;
  type: PermissionType;
  routePath?: string | null;
  component?: string | null;
  icon?: string | null;
  description?: string | null;
  status: number;
  isSystem: boolean;
  sort: number;
  createdAt: string;
  updatedAt: string;
  children?: Permission[];
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface PermissionQuery {
  page?: number;
  pageSize?: number;
  tenantId?: number;
  applicationId?: number;
  parentId?: number;
  keyword?: string;
  type?: PermissionType;
  status?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PermissionCreatePayload {
  tenantId: number;
  applicationId: number;
  parentId?: number | null;
  code: string;
  name: string;
  displayName?: string | null;
  type: PermissionType;
  routePath?: string | null;
  component?: string | null;
  icon?: string | null;
  description?: string | null;
  status: number;
  isSystem: boolean;
  sort: number;
}

export interface PermissionUpdatePayload {
  tenantId?: number;
  applicationId?: number;
  parentId?: number | null;
  code?: string;
  name?: string;
  displayName?: string | null;
  type?: PermissionType;
  routePath?: string | null;
  component?: string | null;
  icon?: string | null;
  description?: string | null;
  status?: number;
  sort?: number;
}

export interface PermissionStatusPayload {
  status: number;
}

export interface RolePermissionResult {
  roleId: number;
  permissionIds: number[];
}

export interface RolePermissionPayload {
  permissionIds: number[];
}

export function fetchPermissions(params: PermissionQuery) {
  return get<PageData<Permission>>('/v1/permissions', {
    params,
    safe: false,
  });
}

export function fetchPermissionTree(params?: PermissionQuery) {
  return get<Permission[]>('/v1/permissions/tree', {
    params: {
      sortBy: 'sort',
      order: 'asc',
      ...params,
    },
    safe: false,
  });
}

export function createPermission(data: PermissionCreatePayload) {
  return post<Permission>('/v1/permissions', data, {
    safe: false,
    showSuccess: true,
  });
}

export function updatePermission(id: number, data: PermissionUpdatePayload) {
  return put<Permission>(`/v1/permissions/${id}`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function updatePermissionStatus(id: number, data: PermissionStatusPayload) {
  return patch<Permission>(`/v1/permissions/${id}/status`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function fetchRolePermissions(roleId: number) {
  return get<RolePermissionResult>(`/v1/roles/${roleId}/permissions`, {
    safe: false,
  });
}

export function saveRolePermissions(roleId: number, data: RolePermissionPayload) {
  return put<RolePermissionResult>(`/v1/roles/${roleId}/permissions`, data, {
    safe: false,
    showSuccess: true,
  });
}
