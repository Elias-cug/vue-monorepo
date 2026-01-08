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
            :src="userInfo.avatar"
            fallback-src="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          />
          <h2 class="text-xl font-semibold mt-16px mb-4px">{{ userInfo.username }}</h2>
          <n-tag type="primary" size="small">{{ userInfo.role }}</n-tag>
          <p class="text-sm text-gray-500 mt-12px mb-0">{{ userInfo.department }}</p>
        </div>

        <n-divider class="my-8px!" />

        <div class="flex flex-col gap-12px px-8px">
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="MailOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ userInfo.email }}</span>
          </div>
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="PhonePortraitOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ userInfo.phone }}</span>
          </div>
          <div class="flex items-center gap-12px text-sm">
            <n-icon :component="CalendarOutline" size="18" class="text-gray-400" />
            <span class="text-gray-600">{{ userInfo.createTime }}</span>
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
import { reactive, computed } from 'vue';
import {
  LockClosedOutline,
  PhonePortraitOutline,
  MailOutline,
  CalendarOutline,
  CreateOutline,
} from '@vicons/ionicons5';
import SecurityItem from './components/SecurityItem.vue';
import InfoItem from './components/InfoItem.vue';

defineOptions({
  name: 'ProfilePage',
});

// 模拟用户信息数据
const userInfo = reactive({
  username: '管理员',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  email: 'admin@example.com',
  phone: '138****8888',
  role: '超级管理员',
  department: '技术部',
  createTime: '2024-01-01 12:00:00',
});

// 基本信息列表
const basicInfoList = computed(() => [
  { label: '用户名', value: userInfo.username },
  { label: '角色', value: userInfo.role },
  { label: '邮箱', value: userInfo.email },
  { label: '手机号', value: userInfo.phone },
  { label: '部门', value: userInfo.department },
  { label: '注册时间', value: userInfo.createTime },
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
    description: userInfo.phone || '未绑定',
    actionText: userInfo.phone ? '更换' : '绑定',
  },
  {
    icon: MailOutline,
    iconBgClass: 'bg-warning/10',
    iconClass: 'text-warning',
    title: '绑定邮箱',
    description: userInfo.email || '未绑定',
    actionText: userInfo.email ? '更换' : '绑定',
  },
]);
</script>

<style lang="scss" scoped></style>
