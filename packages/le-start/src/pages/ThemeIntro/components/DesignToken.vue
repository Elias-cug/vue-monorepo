<template>
  <div class="design-token">
    <div class="token-preview">
      <div v-if="type === 'radius'" class="radius-box" :style="{ borderRadius: value }"></div>
      <div
        v-else-if="type === 'spacing'"
        class="spacing-box"
        :style="{ width: value, height: value }"
      ></div>
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
  type: 'radius' | 'spacing';
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
