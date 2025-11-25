<!--
 * 登录页面
 * 简洁现代的登录设计，居中表单布局
 * 使用 naive-ui 组件库和 UnoCSS
-->
<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 品牌标识 -->
      <div class="brand">
        <img src="../../../assets/logo/vite.svg" alt="Logo" class="logo" />
        <h1 class="title">VUE-MONOREPO</h1>
      </div>

      <!-- 登录表单 -->
      <n-form ref="formRef" :model="formData" :rules="rules" class="login-form">
        <n-form-item path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="用户名"
            size="large"
            :input-props="{ autocomplete: 'username' }"
          >
            <template #prefix>
              <n-icon :component="PersonOutline" class="input-icon" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="密码"
            size="large"
            show-password-on="click"
            :input-props="{ autocomplete: 'current-password' }"
          >
            <template #prefix>
              <n-icon :component="LockClosedOutline" class="input-icon" />
            </template>
          </n-input>
        </n-form-item>

        <div class="form-options">
          <n-checkbox v-model:checked="rememberMe" size="small">记住我</n-checkbox>
        </div>

        <n-button
          type="primary"
          block
          size="large"
          :loading="loading"
          class="login-btn"
          @click="handleLogin"
        >
          登 录
        </n-button>
      </n-form>

      <!-- 底部版权 -->
      <p class="copyright">© 2025 VUE-MONOREPO</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录页面组件
 * 包含登录表单的 UI 展示和基础交互逻辑
 */
import { ref, reactive } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';

// 表单引用
const formRef = ref<FormInst | null>(null);

// 表单数据
const formData = reactive({
  username: '',
  password: '',
});

// 记住我
const rememberMe = ref(false);

// 加载状态
const loading = ref(false);

// 表单验证规则
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

// 登录处理（仅 UI 逻辑，不包含实际业务）
function handleLogin() {
  formRef.value?.validate(errors => {
    if (!errors) {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1500);
    }
  });
}
</script>

<style lang="scss" scoped>
.login-page {
  @apply w-full h-full flex items-center justify-center relative overflow-hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

// 背景装饰
.bg-decoration {
  @apply absolute inset-0 pointer-events-none;

  .circle {
    @apply absolute rounded-full;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    opacity: 0.08;
  }

  .circle-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
  }

  .circle-2 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -100px;
  }
}

// 登录卡片
.login-card {
  @apply relative z-10 w-full max-w-sm px-10 py-12 bg-white rounded-2xl;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

// 品牌标识
.brand {
  @apply flex flex-col items-center mb-10;

  .logo {
    @apply w-12 h-12 mb-4;
  }

  .title {
    @apply text-xl font-semibold text-gray-800 tracking-wide;
  }
}

// 登录表单
.login-form {
  .input-icon {
    @apply text-gray-400;
  }

  :deep(.n-form-item) {
    margin-bottom: 20px;

    .n-form-item-feedback-wrapper {
      min-height: 18px;
    }
  }

  :deep(.n-input) {
    border-radius: 8px;
    background: #f9fafb;

    &:focus-within {
      background: #fff;
    }
  }
}

// 表单选项
.form-options {
  @apply flex items-center justify-between mb-6 text-sm text-gray-500;
}

// 登录按钮
.login-btn {
  @apply font-medium;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// 底部版权
.copyright {
  @apply mt-8 text-center text-xs text-gray-400;
}

// 暗色模式
:global(.dark) {
  .login-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .bg-decoration .circle {
    opacity: 0.15;
  }

  .login-card {
    @apply bg-gray-800;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .brand .title {
    @apply text-white;
  }

  .form-options {
    @apply text-gray-400;
  }

  .copyright {
    @apply text-gray-500;
  }
}
</style>
