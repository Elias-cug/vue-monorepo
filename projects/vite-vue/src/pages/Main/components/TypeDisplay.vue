<!--
  类型信息展示组件
  用于平铺展示嵌套的类型定义
-->
<template>
  <div class="type-display">
    <n-card
      v-for="(typeSection, index) in flattenedTypes"
      :key="index"
      class="type-section"
      :title="typeSection.name"
      size="small"
    >
      <template #header-extra>
        <n-tag v-if="typeSection.extends" type="info" size="small">
          extends {{ typeSection.extends }}
        </n-tag>
      </template>
      <n-table :bordered="false" size="small">
        <thead>
          <tr>
            <th style="width: 200px">字段名</th>
            <th style="width: 150px">类型</th>
            <th style="width: 100px">必填</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in typeSection.fields" :key="field.name">
            <td>
              <n-text code>{{ field.name }}</n-text>
            </td>
            <td>
              <n-tag type="success" size="small">{{ field.type }}</n-tag>
            </td>
            <td>
              <n-tag :type="field.required ? 'error' : 'default'" size="small">
                {{ field.required ? '必填' : '可选' }}
              </n-tag>
            </td>
            <td>
              <n-text depth="3">{{ field.description || '-' }}</n-text>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface TypeField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface TypeSection {
  name: string;
  extends?: string;
  fields: TypeField[];
}

interface TypeInfo {
  name: string;
  extends?: string;
  fields: TypeField[];
  nested?: TypeInfo[];
}

interface Props {
  typeInfo: TypeInfo;
}

const props = defineProps<Props>();

// 平铺展示所有类型（包括嵌套的类型）
const flattenedTypes = computed(() => {
  const result: TypeSection[] = [];

  function flatten(type: TypeInfo) {
    result.push({
      name: type.name,
      extends: type.extends,
      fields: type.fields,
    });

    // 递归处理嵌套类型
    if (type.nested && type.nested.length > 0) {
      type.nested.forEach(nestedType => flatten(nestedType));
    }
  }

  flatten(props.typeInfo);
  return result;
});
</script>

<style lang="scss" scoped>
.type-display {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .type-section {
    :deep(.n-card__header) {
      background-color: rgba(24, 160, 88, 0.05);
      font-weight: 600;
    }

    :deep(.n-table) {
      th {
        background-color: rgba(0, 0, 0, 0.02);
        font-weight: 600;
      }
    }
  }
}

// 暗色模式
:global(.dark) {
  .type-display {
    .type-section {
      :deep(.n-card__header) {
        background-color: rgba(24, 160, 88, 0.1);
      }

      :deep(.n-table) {
        th {
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }
  }
}
</style>
