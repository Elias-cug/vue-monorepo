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
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
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
          attr-type="submit"
          block
          size="large"
          :loading="loading"
          class="login-btn"
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
import { useRoute, useRouter } from 'vue-router';
import type { FormInst, FormRules } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
import { login } from '@base/api/auth';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@base/constants';
import { ls } from '@base/storage';
import { useAppStore } from '@base/store/app';
import { useAuthStore } from '@base/store/auth';

const BLANK_REDIRECT_PATHS = new Set(['/login', '/403', '/404']);

const router = useRouter();
const route = useRoute();
const message = useMessage();
const appStore = useAppStore();
const authStore = useAuthStore();

// 表单引用
const formRef = ref<FormInst | null>(null);

// 表单数据
const formData = reactive({
  tenantId: 1,
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

function getLoginTargetPath() {
  const fallbackPath = authStore.homeMenu?.path || authStore.flatMenus[0]?.path || '/';
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '';
  const redirectPath = redirect.split('?')[0] || '';

  if (!redirect || BLANK_REDIRECT_PATHS.has(redirectPath)) {
    return fallbackPath;
  }

  return redirect;
}

async function handleLogin() {
  if (loading.value) return;

  loading.value = true;

  try {
    await formRef.value?.validate();

    const token = await login({
      tenantId: formData.tenantId,
      username: formData.username,
      password: formData.password,
    });

    ls.set(TOKEN_KEY, token.accessToken, { ignorePrefix: true });
    ls.set(REFRESH_TOKEN_KEY, token.refreshToken, { ignorePrefix: true });

    appStore.getAppInfo();
    await authStore.getAllAuthInfo();

    message.success('登录成功');
    await router.replace(getLoginTargetPath());
  } finally {
    loading.value = false;
  }
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
    color: #666 !important;
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

    // 强制输入框文字为黑色（包括暗黑模式）
    input {
      color: #000 !important;
    }

    // naive-ui placeholder 颜色
    .n-input__placeholder {
      color: #999 !important;
    }
  }
}

// 表单选项
.form-options {
  @apply flex items-center justify-between mb-6 text-sm;
  color: #666 !important;

  :deep(.n-checkbox) {
    .n-checkbox__label {
      color: #666 !important;
    }
  }
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
