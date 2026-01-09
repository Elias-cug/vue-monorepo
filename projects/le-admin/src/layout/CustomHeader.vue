<template>
  <CommonHeader :show-opts="['user', 'theme']">
    <template #header-center>
      <div class="w-40%">
        <NInput round placeholder="请输入搜索内容">
          <template #suffix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
    </template>
  </CommonHeader>
</template>

<script setup lang="ts">
import { CommonHeader } from '@base/layout';
import { SearchOutline } from '@vicons/ionicons5';
defineOptions({
  name: 'CustomHeader',
});
</script>

<style lang="scss" scoped></style>
