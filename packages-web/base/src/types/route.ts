export interface RouteMeta {
  title: string;
  icon?: any;
  layout?: 'basic' | 'blank' | 'header';
  keepAlive?: boolean;
  pinned?: boolean;
  multiTab?: boolean;
  hidden?: boolean;
}

export interface Route {
  path: string;
  name: string;
  component: any;
  redirect?: string;
  children?: Route[];
  meta: RouteMeta;
}
