/**
 * 应用初始化模块
 * 负责在应用启动时进行必要的初始化工作
 */

import { ls, ss } from './storage';

/**
 * 初始化应用配置
 * @param appId 应用ID
 */
export function initApp(appId: string) {
  // 设置 storage 的 appId
  ls.setAppId(appId);
  ss.setAppId(appId);
}

