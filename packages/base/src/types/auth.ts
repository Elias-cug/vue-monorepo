export interface Menu {
  /** 唯一值 */
  key: string;
  /** 菜单名称 */
  title: string;
  /** 是否固定 */
  pinned?: boolean;
  /** 是否隐藏，默认 false */
  hidden?: boolean;
  /** query */
  query?: Record<string, any>;
  /** 其他属性，存放一些业务属性 */
  extraProps?: Record<string, any>;
  /** 前端路径不建议在后端返回 */
  path?: string;
  /** 菜单图标，不建议在后端返回 */
  icon?: string | any;
  /** 子菜单 */
  children?: Menu[];
}

export interface UserInfo {}

export interface Dics {}

export interface Params {}

export interface AuthState {
  userInfo: UserInfo | null;
  menus: Menu[];
  flatMenus: Menu[];
  btns: Menu[];
  dics: Dics;
  /** 系统配置的参数 */
  params: Params;
  /** 是否已加载用户信息和菜单 */
  isLoaded: boolean;
}
