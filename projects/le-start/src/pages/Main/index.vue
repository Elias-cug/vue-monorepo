<template>
  <LeContainer class="dashboard">
    <!-- 项目简介 -->
    <LeCard class="intro-card">
      <div class="intro-content">
        <div class="intro-text">
          <h1>Vue Monorepo</h1>
          <p class="intro-subtitle">基于 Vue 3 + TypeScript 的企业级前端 Monorepo 项目</p>
          <p class="intro-desc">
            提供完整的主题系统、UI 组件库和基础架构，助力快速构建现代化 Web 应用
          </p>
        </div>
      </div>
    </LeCard>

    <!-- 核心功能卡片 -->
    <div class="features-grid">
      <div
        v-for="feature in features"
        :key="feature.key"
        class="feature-card"
        @click="handleFeatureClick(feature)"
      >
        <n-icon :size="40" :color="feature.color">
          <component :is="feature.icon" />
        </n-icon>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import {
  ColorPaletteOutline,
  CubeOutline,
  ExtensionPuzzleOutline,
  GridOutline,
  ServerOutline,
  GitNetworkOutline,
  CodeSlashOutline,
  GitBranchOutline,
} from '@vicons/ionicons5';

defineOptions({
  name: 'Main',
});

const router = useRouter();
const message = useMessage();

// 核心功能数据
const features = [
  {
    key: 'theme',
    title: '主题系统',
    desc: '12种预设主题切换',
    icon: ColorPaletteOutline,
    color: '#667eea',
    route: '/le-start/theme-intro',
  },
  {
    key: 'cssVars',
    title: 'CSS 变量',
    desc: '完整的设计令牌系统',
    icon: CodeSlashOutline,
    color: '#9254de',
    route: '/le-start/theme-intro',
  },
  {
    key: 'ui',
    title: 'UI 组件库',
    desc: '丰富的组件库，主题自适应',
    icon: CubeOutline,
    color: '#f093fb',
    route: '/le-start/component-show',
  },
  {
    key: 'layout',
    title: '布局系统',
    desc: '灵活的布局组件和方案',
    icon: GridOutline,
    color: '#4facfe',
    route: null,
  },
  {
    key: 'state',
    title: '状态管理',
    desc: 'Pinia 状态管理方案',
    icon: ServerOutline,
    color: '#fa8c16',
    route: null,
  },
  {
    key: 'router',
    title: '路由体系',
    desc: '动态路由和权限控制',
    icon: GitNetworkOutline,
    color: '#13c2c2',
    route: null,
  },
  {
    key: 'routerHooks',
    title: '路由 Hook',
    desc: '丰富路由 Hook，灵活控制路由行为',
    icon: GitBranchOutline,
    color: '#52c41a',
    route: null,
  },
  {
    key: 'utils',
    title: '工具函数',
    desc: '常用工具函数，提升效率',
    icon: ExtensionPuzzleOutline,
    color: '#43e97b',
    route: null,
  },
];

// 点击功能卡片
const handleFeatureClick = (feature: (typeof features)[0]) => {
  if (feature.route) {
    router.push(feature.route);
  } else {
    message.info('该功能详情页面正在开发中...');
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  // LeContainer 已经提供了 padding 和滚动，不需要重复设置

  // 项目简介卡片
  .intro-card {
    margin-bottom: 32px;
    background: linear-gradient(135deg, var(--le-primary-1) 0%, var(--le-card) 50%);
    border: none;

    :deep(.le-card__content) {
      padding: 48px 32px;
    }

    .intro-content {
      text-align: center;

      .intro-text {
        h1 {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, var(--le-primary) 0%, var(--le-primary-7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intro-subtitle {
          font-size: 20px;
          font-weight: 500;
          color: var(--le-text-1);
          margin: 0 0 12px 0;
        }

        .intro-desc {
          font-size: 16px;
          color: var(--le-text-2);
          margin: 0;
          line-height: 1.6;
        }
      }
    }
  }

  // 功能卡片网格
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    .feature-card {
      padding: 32px 24px;
      background: var(--le-card);
      border-radius: var(--le-radius-lg);
      box-shadow: var(--le-shadow-1);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        transform: translateY(-6px);
        box-shadow: var(--le-shadow-3);

        h3 {
          color: var(--le-primary);
        }
      }

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--le-text-1);
        margin: 16px 0 8px 0;
        transition: color 0.3s ease;
      }

      p {
        font-size: 14px;
        color: var(--le-text-2);
        margin: 0;
        line-height: 1.5;
      }
    }
  }
}
</style>
