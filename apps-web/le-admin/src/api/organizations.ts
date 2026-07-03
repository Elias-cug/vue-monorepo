import { del, get, post, put } from '@lee/base';

export interface Organization {
  id: number;
  tenantId: number;
  parentId?: number | null;
  name: string;
  code: string;
  orgType: string;
  sortOrder: number;
  status: number;
  remark?: string | null;
  createdAt: string;
  updatedAt: string;
  children?: Organization[];
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface OrganizationQuery {
  page?: number;
  pageSize?: number;
  tenantId?: number;
  parentId?: number;
  keyword?: string;
  orgType?: string;
  status?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface OrganizationCreatePayload {
  tenantId: number;
  parentId?: number | null;
  name: string;
  code: string;
  orgType: string;
  sortOrder: number;
  status: number;
  remark?: string | null;
}

export interface OrganizationUpdatePayload {
  tenantId?: number;
  parentId?: number | null;
  name?: string;
  code?: string;
  orgType?: string;
  sortOrder?: number;
  status?: number;
  remark?: string | null;
}

export function fetchOrganizationTree(params?: OrganizationQuery) {
  return get<Organization[]>('/v1/organizations/tree', {
    params: {
      sortBy: 'sort_order',
      order: 'asc',
      ...params,
    },
    safe: false,
  });
}

export function fetchOrganizations(params: OrganizationQuery) {
  return get<PageData<Organization>>('/v1/organizations', {
    params,
    safe: false,
  });
}

export function createOrganization(data: OrganizationCreatePayload) {
  return post<Organization>('/v1/organizations', data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateOrganization(id: number, data: OrganizationUpdatePayload) {
  return put<Organization>(`/v1/organizations/${id}`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function deleteOrganization(id: number) {
  return del<Organization>(`/v1/organizations/${id}`, {
    safe: false,
    showSuccess: true,
  });
}
