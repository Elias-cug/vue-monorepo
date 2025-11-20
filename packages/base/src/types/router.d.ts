import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由本身的标题（菜单用） */
    title?: string;

    /** 图标 */
    icon?: string;

    /** Tab 显示的标题（和路由 title 分离） */
    tabTitle?: string;

    /** 是否缓存页面 */
    keepAlive?: boolean;

    /** 是否需要权限 */
    auth?: boolean;

    /** 是否多 tab */
    multiTab?: boolean;

    /** 是否显示到菜单 */
    hidden?: boolean;

    /** 高亮菜单 */
    defaultIndex?: string;
  }
}
