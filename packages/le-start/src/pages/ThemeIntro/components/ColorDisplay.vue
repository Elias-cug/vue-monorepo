<template>
  <div class="color-display">
    <div class="color-preview" :style="{ background: value }"></div>
    <div class="color-info">
      <div class="color-label">{{ label }}</div>
      <div class="color-name">{{ name }}</div>
      <div class="color-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  value: string;
  label: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.color-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: var(--le-card);
  border: 1px solid var(--le-border);
  border-radius: var(--le-radius-md);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--le-shadow-1);
    transform: translateY(-1px);
  }

  .color-preview {
    width: 48px;
    height: 48px;
    border-radius: var(--le-radius-sm);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  .color-info {
    flex: 1;
    min-width: 0;

    .color-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--le-text-1);
      margin-bottom: 2px;
    }

    .color-name {
      font-size: 12px;
      font-family: monospace;
      color: var(--le-text-2);
      margin-bottom: 2px;
    }

    .color-value {
      font-size: 11px;
      font-family: monospace;
      color: var(--le-text-3);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
