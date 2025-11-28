<template>
  <div class="global-header">
    <div class="global-header-left">
      <img class="global-header-logo" src="../../../assets/logo/vite.svg" alt="" />
      <h1 class="global-header-title">VUE单体仓库</h1>
    </div>
    <div class="global-header-right">
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        @select="handleSelect"
        @update:show="handleDropdownShow"
      >
        <div class="global-header-user">
          <img class="user-avatar" src="../../../assets/avatar/lufei.png" alt="" />
          <span class="user-name">路飞</span>
          <n-icon
            size="18"
            :style="{
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }"
          >
            <ChevronDownOutline />
          </n-icon>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { NIcon } from 'naive-ui';
import type { Component } from 'vue';
import { ChevronDownOutline, PersonCircleOutline, LogOutOutline } from '@vicons/ionicons5';
import { useRouterHelper } from '../../../composables';

const { logout } = useRouterHelper();

// 下拉菜单展开状态
const showDropdown = ref(false);

// 处理下拉菜单显示/隐藏
const handleDropdownShow = (show: boolean) => {
  showDropdown.value = show;
};

// 渲染图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

// 下拉菜单选项
const dropdownOptions = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline),
  },
];

// 处理下拉菜单选择
const handleSelect = (key: string) => {
  if (key === 'profile') {
    handleProfile();
  } else if (key === 'logout') {
    logout(false); // 退出登录，不保留重定向参数
  }
};

// 查看用户资料
const handleProfile = () => {
  // TODO: 跳转到用户资料页面
  console.log('查看用户资料');
};
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
