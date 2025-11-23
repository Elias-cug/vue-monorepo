<template>
  <div>
    Dashboard

    <p>Count: {{ count }}</p>
    <button @click="onClick">点击</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'Main',
});

const count = ref(0);
const onClick = () => {
  count.value++;
};
</script>
