import type { RouteMeta } from './route';

export interface menuMeta extends RouteMeta {
  menuKey?: string;
  extraProps?: Record<string, any>;
}

export interface Menu {
  /** 唯一值 */
  key: string;
  /** 菜单名称 */
  title: string;
  /** 是否固定 */
  pinned?: boolean;
  /** 是否隐藏，默认 false */
  hidden?: boolean;
  /** 后端配置的query */
  query?: Record<string, any>;
  /** 其他属性，存放一些业务属性 */
  extraProps?: Record<string, any>;
  meta?: menuMeta;
  /** 前端路径不建议在后端返回 */
  path?: string;
  /** 菜单图标，不建议在后端返回 */
  icon?: string | any;
  /** 子菜单 */
  children?: Menu[];
}

export interface UserInfo {
  /** 用户 ID */
  id?: string | number;
  /** 用户名 */
  username?: string;
  /** 姓名 */
  name?: string;
  /** 邮箱 */
  email?: string;
  /** 电话 */
  phone?: string;
  /** 头像 */
  avatar?: string;
  /** 角色 */
  roles?: string[];
  /** 其他信息 */
  [key: string]: any;
}

export interface Dics {}

export interface Params {}

export interface AuthState {
  userInfo: UserInfo | null;
  /** 菜单配置  */
  menuConfig: {
    /** default: base统一接口获取菜单 custom: 项目自定义菜单 static: 项目静态菜单 */
    mode: 'default' | 'custom' | 'static';
    staticMenu?: {
      data: Menu[];
    };
    loader?: () => Promise<{ data: Menu[] }>;
  };
  menus: Menu[];
  flatMenus: Menu[];
  homeMenu: Menu | null;
  btns: any;
  dics: Dics;
  /** 系统配置的参数 */
  params: Params;
  /** 是否已加载用户信息和菜单 */
  isLoaded: boolean;
}
