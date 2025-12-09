<template>
  <LeContainer>
    <n-space vertical :size="24">
      <n-card title="LeCodeViewer 组件示例">
        <n-space vertical :size="16">
          <!-- TypeScript 示例 -->
          <div>
            <h3>TypeScript 代码</h3>
            <LeCodeViewer :code="tsCode" language="typescript" />
          </div>

          <!-- JavaScript 示例 -->
          <div>
            <h3>JavaScript 代码</h3>
            <LeCodeViewer :code="jsCode" language="javascript" />
          </div>

          <!-- JSON 示例 -->
          <div>
            <h3>JSON 数据</h3>
            <LeCodeViewer :code="jsonCode" language="json" />
          </div>

          <!-- Markdown 示例 -->
          <div>
            <h3>Markdown 文档</h3>
            <LeCodeViewer :code="mdCode" language="markdown" />
          </div>

          <!-- Shell 示例 -->
          <div>
            <h3>Shell 命令</h3>
            <LeCodeViewer :code="shellCode" language="shell" />
          </div>

          <!-- Vue 示例 -->
          <div>
            <h3>Vue 组件</h3>
            <LeCodeViewer :code="vueCode" language="vue" />
          </div>

          <!-- 不显示行号 -->
          <div>
            <h3>隐藏行号</h3>
            <LeCodeViewer :code="jsCode" language="javascript" :show-line-numbers="false" />
          </div>
        </n-space>
      </n-card>
    </n-space>
  </LeContainer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ComponentShow',
});

const tsCode = `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}

const user: User = await getUser(1);
console.log(user.name);`;

const jsCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci(10):', result);`;

const jsonCode = `{
  "name": "@lee/ui",
  "version": "1.0.0",
  "description": "UI 组件库",
  "main": "src/index.ts",
  "dependencies": {
    "vue": "^3.5.22",
    "highlight.js": "^11.11.1"
  }
}`;

const mdCode = `# LeCodeViewer 组件

## 特性

- 支持多种语言高亮
- 可选显示行号
- 暗色主题
- 基于 highlight.js

## 使用方法

\`\`\`vue
<LeCodeViewer :code="code" language="typescript" />
\`\`\``;

const shellCode = `# 安装依赖
pnpm install -w highlight.js

# 启动开发服务器
pnpm run start:vite-vue

# 构建项目
pnpm run build`;

const vueCode = `<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
<\/template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  msg: string;
}>();

const count = ref(0);
<\/script>

<style scoped>
.hello {
  color: #42b983;
}
<\/style>`;
</script>

<style lang="scss" scoped>
h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

:global(.dark) {
  h3 {
    color: #fff;
  }
}
</style>
