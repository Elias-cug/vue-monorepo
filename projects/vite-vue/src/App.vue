<script setup lang="ts">
import { onMounted } from "vue";
import { getTime } from "utils";

onMounted(() => {
  console.log("getTime", getTime());
});
let a = "";
console.log(a);
</script>

<template>
  <div>
    <div>测试包引入: {{ getTime() }}</div>
    <div class="scss-style">测试 scss: scss</div>
    <div>测试 naive-ui: <n-button>点击</n-button></div>
    <div>
      测试 unocss：
      <div class="cus-uno text-red border-solid">字体变大</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary-color: #4dabf7;
.scss-style {
  color: $primary-color;
}
.cus-uno {
  @apply pl-20px;
  font-size: 20px;
}
</style>
