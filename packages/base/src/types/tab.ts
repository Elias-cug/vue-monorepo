export interface TabItem {
  /** Tab 的唯一 key，绑定 fullPath */
  key: string;
  /** Tab 显示的名称 */
  title: string;
  /** Tab 的路径 */
  path: string;
  /** Tab 的 query */
  query: Record<string, any>;
  /** Tab 是否可关闭 */
  closable?: boolean;
  /** Tab 的元信息 */
  meta?: Record<string, any>;
}
