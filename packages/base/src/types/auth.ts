export interface Menu {
  /** 唯一值 */
  key: string;
  /** 菜单名称 */
  title: string;
  /** 菜单路径 */
  path?: string;
  /** 菜单图标 */
  icon?: string | any;
  /** 其他属性 */
  extraProps?: Record<string, any>;
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
  params: Params;
  /** 是否已加载用户信息和菜单 */
  isLoaded: boolean;
}
