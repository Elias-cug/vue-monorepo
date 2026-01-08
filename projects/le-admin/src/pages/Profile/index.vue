<!--
 * 个人信息页面
 * 展示用户基本信息、账户设置等
 * 使用 @lee/ui 和 naive-ui 组件库
-->
<template>
  <LeContainer overflow="auto">
    <div class="flex flex-col gap-16px">
      <!-- 用户信息卡片 -->
      <LeCard>
        <div class="flex items-center gap-24px">
          <!-- 头像 -->
          <n-avatar
            :size="80"
            round
            :src="userInfo.avatar"
            fallback-src="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          />
          <div>
            <h2 class="text-xl font-semibold m-0">{{ userInfo.username }}</h2>
            <p class="text-sm text-gray-500 mt-4px mb-0">{{ userInfo.role }}</p>
          </div>
        </div>
      </LeCard>

      <!-- 基本信息 -->
      <LeCard title="基本信息">
        <n-descriptions :column="2" label-placement="left" bordered>
          <n-descriptions-item label="用户名">
            {{ userInfo.username }}
          </n-descriptions-item>
          <n-descriptions-item label="邮箱">
            {{ userInfo.email }}
          </n-descriptions-item>
          <n-descriptions-item label="手机号">
            {{ userInfo.phone }}
          </n-descriptions-item>
          <n-descriptions-item label="角色">
            <n-tag type="primary" size="small">{{ userInfo.role }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="部门">
            {{ userInfo.department }}
          </n-descriptions-item>
          <n-descriptions-item label="注册时间">
            {{ userInfo.createTime }}
          </n-descriptions-item>
        </n-descriptions>
      </LeCard>

      <!-- 账户安全 -->
      <LeCard title="账户安全">
        <n-list>
          <n-list-item>
            <template #prefix>
              <n-icon :component="LockClosedOutline" size="24" class="text-gray-400" />
            </template>
            <n-thing title="登录密码" description="定期更换密码可以保护账户安全">
              <template #action>
                <n-button text type="primary">修改</n-button>
              </template>
            </n-thing>
          </n-list-item>
          <n-list-item>
            <template #prefix>
              <n-icon :component="PhonePortraitOutline" size="24" class="text-gray-400" />
            </template>
            <n-thing title="绑定手机" :description="userInfo.phone || '未绑定'">
              <template #action>
                <n-button text type="primary">{{ userInfo.phone ? '更换' : '绑定' }}</n-button>
              </template>
            </n-thing>
          </n-list-item>
          <n-list-item>
            <template #prefix>
              <n-icon :component="MailOutline" size="24" class="text-gray-400" />
            </template>
            <n-thing title="绑定邮箱" :description="userInfo.email || '未绑定'">
              <template #action>
                <n-button text type="primary">{{ userInfo.email ? '更换' : '绑定' }}</n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </LeCard>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
/**
 * 个人信息页面组件
 * 展示用户基本信息和账户安全设置
 */
import { reactive } from 'vue';
import { LockClosedOutline, PhonePortraitOutline, MailOutline } from '@vicons/ionicons5';

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
</script>

<style lang="scss" scoped></style>
