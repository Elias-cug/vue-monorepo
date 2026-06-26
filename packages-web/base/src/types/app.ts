import type { menuMeta } from './auth';

export interface TabMeta extends menuMeta {}

export interface TabItem {
  /** Tab 的唯一 key，绑定 fullPath */
  key: string;
  /** Tab 显示的名称 */
  title: string;
  /** Tab 的路径 */
  path: string;
  /** Tab 的 query */
  query?: Record<string, any>;
  /** Tab 的参数 */
  params?: Record<string, any>;
  /** Tab 的元信息 */
  meta?: TabMeta;
}

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  version?: string;
  description?: string;
  theme?: string;
}

export interface AppState {
  collapsed: boolean;
  tabs: TabItem[];
  cachedRoutes: string[];
  appInfo: AppInfo | null;
  /** 项目自定义 header */
  CustomHeader: any | null;
}
