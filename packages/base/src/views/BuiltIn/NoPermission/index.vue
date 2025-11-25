<!--
 * 403 无权限页面
 * 简洁现代的权限提示页面
-->
<template>
  <div class="error-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
    </div>

    <!-- 错误内容 -->
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <p class="error-title">访问受限</p>
      <p class="error-desc">抱歉，您没有权限访问此页面</p>
      <div class="action-btns">
        <n-button type="primary" size="large" class="primary-btn" @click="handleBack">
          <template #icon>
            <n-icon :component="ArrowBackOutline" />
          </template>
          返回首页
        </n-button>
        <n-button size="large" class="secondary-btn" @click="handleGoBack">
          返回上页
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 403 无权限页面组件
 * 当用户访问无权限的页面时展示
 */
import { useRouter } from 'vue-router';
import { ArrowBackOutline } from '@vicons/ionicons5';

const router = useRouter();

function handleBack() {
  router.push('/');
}

function handleGoBack() {
  router.back();
}
</script>

<style lang="scss" scoped>
.error-page {
  @apply w-full h-full flex items-center justify-center relative overflow-hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

// 背景装饰
.bg-decoration {
  @apply absolute inset-0 pointer-events-none;

  .circle {
    @apply absolute rounded-full;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    opacity: 0.06;
  }

  .circle-1 {
    width: 500px;
    height: 500px;
    top: -150px;
    right: -100px;
  }

  .circle-2 {
    width: 350px;
    height: 350px;
    bottom: -100px;
    left: -50px;
  }
}

// 错误内容
.error-content {
  @apply relative z-10 text-center px-6;

  .error-code {
    @apply text-9xl font-bold leading-none mb-4;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .error-title {
    @apply text-2xl font-semibold text-gray-800 mb-2;
  }

  .error-desc {
    @apply text-gray-500 mb-8;
  }
}

// 操作按钮
.action-btns {
  @apply flex items-center justify-center gap-4;
}

.primary-btn {
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.secondary-btn {
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

// 暗色模式
:global(.dark) {
  .error-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .bg-decoration .circle {
    opacity: 0.1;
  }

  .error-content {
    .error-title {
      @apply text-white;
    }

    .error-desc {
      @apply text-gray-400;
    }
  }
}
</style>
