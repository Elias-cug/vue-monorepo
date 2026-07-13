import { get, patch, post, put } from '@lee/base';

export interface Application {
  id: number;
  tenantId?: number | null;
  code: string;
  name: string;
  displayName?: string | null;
  entryUrl?: string | null;
  icon?: string | null;
  description?: string | null;
  status: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface ApplicationQuery {
  page: number;
  pageSize: number;
  tenantId?: number;
  keyword?: string;
  status?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ApplicationCreatePayload {
  tenantId: number;
  code: string;
  name: string;
  displayName?: string | null;
  entryUrl?: string | null;
  icon?: string | null;
  description?: string | null;
  status: number;
  sort: number;
}

export interface ApplicationUpdatePayload {
  tenantId?: number;
  code?: string;
  name?: string;
  displayName?: string | null;
  entryUrl?: string | null;
  icon?: string | null;
  description?: string | null;
  status?: number;
  sort?: number;
}

export interface ApplicationStatusPayload {
  status: number;
}

export function fetchApplications(params: ApplicationQuery) {
  return get<PageData<Application>>('/v1/applications', {
    params,
    safe: false,
  });
}

export function createApplication(data: ApplicationCreatePayload) {
  return post<Application>('/v1/applications', data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateApplication(id: number, data: ApplicationUpdatePayload) {
  return put<Application>(`/v1/applications/${id}`, data, {
    safe: false,
    showSuccess: true,
  });
}

export function updateApplicationStatus(id: number, data: ApplicationStatusPayload) {
  return patch<Application>(`/v1/applications/${id}/status`, data, {
    safe: false,
    showSuccess: true,
  });
}
