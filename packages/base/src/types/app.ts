export interface TabItem {
  /** Tab 的唯一 key，绑定 fullPath */
  key: string;
  /** Tab 显示的名称 */
  title: string;
  /** Tab 的路径 */
  path: string;
  /** Tab 的 query */
  query?: Record<string, any>;
  /** Tab 是否可关闭 */
  closable?: boolean;
  /** 是否支持多标签页（同一路由不同参数可以打开多个 tab） */
  multiTab?: boolean;
  /** Tab 的元信息 */
  meta?: Record<string, any>;
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
