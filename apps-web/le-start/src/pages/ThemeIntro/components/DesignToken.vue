<template>
  <div class="design-token">
    <div class="token-preview">
      <div v-if="type === 'radius'" class="radius-box" :style="{ borderRadius: value }"></div>
      <div
        v-else-if="type === 'spacing'"
        class="spacing-box"
        :style="{ width: value, height: value }"
      ></div>
      <div v-else-if="type === 'fontSize'" class="font-size-preview" :style="{ fontSize: value }">
        Aa
      </div>
      <div
        v-else-if="type === 'fontWeight'"
        class="font-weight-preview"
        :style="{ fontWeight: value }"
      >
        Aa
      </div>
      <div
        v-else-if="type === 'lineHeight'"
        class="line-height-preview"
        :style="{ lineHeight: value }"
      >
        <div>行高</div>
        <div>示例</div>
      </div>
      <div
        v-else-if="type === 'duration'"
        class="duration-preview"
        :style="{ animationDuration: value }"
      ></div>
      <div v-else-if="type === 'zIndex'" class="z-index-preview">{{ value }}</div>
    </div>
    <div class="token-info">
      <div class="token-label">{{ label }}</div>
      <div class="token-name">{{ name }}</div>
      <div class="token-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'radius' | 'spacing' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'duration' | 'zIndex';
  name: string;
  value: string;
  label: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.design-token {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: var(--le-card);
  border: 1px solid var(--le-border);
  border-radius: var(--le-radius-md);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--le-shadow-1);
    transform: translateY(-1px);
  }

  .token-preview {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    .radius-box {
      width: 100%;
      height: 100%;
      background: var(--le-primary-1);
      border: 2px solid var(--le-primary);
    }

    .spacing-box {
      background: var(--le-primary);
      border-radius: var(--le-radius-xs);
    }

    .font-size-preview {
      color: var(--le-primary);
      font-weight: 600;
    }

    .font-weight-preview {
      color: var(--le-primary);
      font-size: 24px;
    }

    .line-height-preview {
      font-size: 12px;
      color: var(--le-primary);
      text-align: center;
    }

    .duration-preview {
      width: 20px;
      height: 20px;
      background: var(--le-primary);
      border-radius: 50%;
      animation: pulse infinite ease-in-out;
    }

    .z-index-preview {
      font-size: 20px;
      font-weight: bold;
      color: var(--le-primary);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.7;
    }
  }

  .token-info {
    text-align: center;

    .token-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--le-text-1);
      margin-bottom: 2px;
    }

    .token-name {
      font-size: 11px;
      font-family: monospace;
      color: var(--le-text-2);
      margin-bottom: 2px;
    }

    .token-value {
      font-size: 10px;
      font-family: monospace;
      color: var(--le-text-3);
    }
  }
}
</style>
