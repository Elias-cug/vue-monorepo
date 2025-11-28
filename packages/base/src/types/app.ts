import type { RouteMeta } from './route';

export interface TabItem {
  /** Tab 的唯一 key，绑定 fullPath */
  key: string;
  /** Tab 显示的名称 */
  title: string;
  /** Tab 的路径 */
  path: string;
  /** Tab 的 query */
  query?: Record<string, any>;
  /** Tab 的元信息 */
  meta?: RouteMeta;
}

export interface AppInfo {
  appId: string;
  appName: string;
  appIcon: string;
  theme?: string;
}

export interface AppState {
  collapsed: boolean;
  tabs: TabItem[];
  activeTab: TabItem | null;
  cachedRoutes: string[];
  appInfo: AppInfo | null;
}
