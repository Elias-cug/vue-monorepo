<!--
 * 个人信息页面
 * 展示用户基本信息、账户设置等
 * 使用 @lee/ui 和 naive-ui 组件库
-->
<template>
  <LeContainer>
    <div class="h-full flex gap-16px">
      <!-- 左侧：用户卡片 -->
      <LeCard class="w-280px flex-shrink-0">
        <div class="flex flex-col items-center py-16px">
          <n-avatar
            :size="96"
            round
            :src="profile.avatar"
            fallback-src="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          />
          <h2 class="text-xl font-semibold mt-16px mb-4px">{{ profile.displayName }}</h2>
          <n-tag :type="profile.status === 1 ? 'success' : 'error'" size="small">
            {{ profile.statusText }}
          </n-tag>
          <p class="text-sm text-gray-500 mt-12px mb-0">{{ profile.organizationName }}</p>
        </div>

        <n-divider class="my-8px!" />

        <div class="flex flex-col gap-12px px-8px">
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="MailOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ profile.email }}</span>
          </div>
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="PhonePortraitOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ profile.phone }}</span>
          </div>
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="CalendarOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ profile.createdAt }}</span>
          </div>
        </div>
      </LeCard>

      <!-- 右侧：详细信息 -->
      <div class="flex-1 flex flex-col gap-16px">
        <!-- 基本信息 -->
        <LeCard title="基本信息">
          <template #header-extra>
            <LeButton text type="primary" size="small">
              <template #icon>
                <n-icon :component="CreateOutline" />
              </template>
              编辑
            </LeButton>
          </template>
          <div class="grid grid-cols-2 gap-x-48px gap-y-16px">
            <InfoItem
              v-for="item in basicInfoList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </div>
        </LeCard>

        <!-- 账户安全 -->
        <LeCard title="账户安全" class="flex-1">
          <div class="flex flex-col gap-16px">
            <SecurityItem
              v-for="item in securityList"
              :key="item.title"
              :icon="item.icon"
              :icon-bg-class="item.iconBgClass"
              :icon-class="item.iconClass"
              :title="item.title"
              :description="item.description"
              :action-text="item.actionText"
            />
          </div>
        </LeCard>
      </div>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
/**
 * 个人信息页面组件
 * 展示用户基本信息和账户安全设置
 */
import { computed } from 'vue';
import {
  LockClosedOutline,
  PhonePortraitOutline,
  MailOutline,
  CalendarOutline,
  CreateOutline,
} from '@vicons/ionicons5';
import { useAuthStore } from '@base/store/auth';
import SecurityItem from './components/SecurityItem.vue';
import InfoItem from './components/InfoItem.vue';

defineOptions({
  name: 'ProfilePage',
});

const authStore = useAuthStore();

const profile = computed(() => {
  const user = authStore.userInfo || {};
  const username = user.username || '-';
  const displayName = user.displayName || user.name || username;

  return {
    id: user.id ?? '-',
    username,
    displayName,
    avatar:
      user.avatar ||
      user.avatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    email: user.email || '未绑定',
    phone: user.phone || '未绑定',
    organizationName: user.organizationName || '未分配组织',
    tenantId: user.tenantId ?? '-',
    status: user.status,
    statusText: user.status === 1 ? '启用' : '停用',
    createdAt: user.createdAt || '-',
    updatedAt: user.updatedAt || '-',
    lastLoginAt: user.lastLoginAt || '-',
    lastLoginIp: user.lastLoginIp || '-',
  };
});

// 基本信息列表
const basicInfoList = computed(() => [
  { label: '用户 ID', value: String(profile.value.id) },
  { label: '账号', value: profile.value.username },
  { label: '显示名称', value: profile.value.displayName },
  { label: '所属组织', value: profile.value.organizationName },
  { label: '租户 ID', value: String(profile.value.tenantId) },
  { label: '状态', value: profile.value.statusText },
  { label: '邮箱', value: profile.value.email },
  { label: '手机号', value: profile.value.phone },
  { label: '最后登录时间', value: profile.value.lastLoginAt },
  { label: '最后登录 IP', value: profile.value.lastLoginIp },
  { label: '创建时间', value: profile.value.createdAt },
  { label: '更新时间', value: profile.value.updatedAt },
]);

// 账户安全列表
const securityList = computed(() => [
  {
    icon: LockClosedOutline,
    iconBgClass: 'bg-primary/10',
    iconClass: 'text-primary',
    title: '登录密码',
    description: '定期更换密码可以保护账户安全',
    actionText: '修改',
  },
  {
    icon: PhonePortraitOutline,
    iconBgClass: 'bg-success/10',
    iconClass: 'text-success',
    title: '绑定手机',
    description: profile.value.phone,
    actionText: profile.value.phone === '未绑定' ? '绑定' : '更换',
  },
  {
    icon: MailOutline,
    iconBgClass: 'bg-warning/10',
    iconClass: 'text-warning',
    title: '绑定邮箱',
    description: profile.value.email,
    actionText: profile.value.email === '未绑定' ? '绑定' : '更换',
  },
]);
</script>

<style lang="scss" scoped></style>
