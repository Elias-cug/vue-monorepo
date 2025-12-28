<template>
  <LeContainer overflow="auto" padding="24px">
    <div class="demo-section">
      <LeCard title="基础用法">
        <p class="mb-2 text-sm text-gray-500">通过 v-model:visible 控制弹窗显示/隐藏</p>
        <LeButton type="primary" @click="basicVisible = true">打开基础弹窗</LeButton>

        <LeDialog v-model:visible="basicVisible" title="基础弹窗">
          <p>这是一个基础弹窗示例</p>
          <p>点击遮罩或关闭按钮可关闭弹窗</p>
        </LeDialog>
      </LeCard>

      <LeCard title="全屏功能">
        <p class="mb-2 text-sm text-gray-500">点击右上角全屏按钮可切换全屏/退出全屏</p>
        <LeButton type="primary" @click="fullscreenVisible = true">打开弹窗体验全屏</LeButton>

        <LeDialog
          v-model:visible="fullscreenVisible"
          title="支持全屏的弹窗"
          @fullscreen-change="handleFullscreenChange"
        >
          <p>点击右上角的全屏按钮可以切换全屏模式</p>
          <p>当前状态：{{ isFullscreen ? '全屏' : '非全屏' }}</p>
          <div class="mt-4">
            <p v-for="i in 10" :key="i">内容行 {{ i }}</p>
          </div>
        </LeDialog>
      </LeCard>

      <LeCard title="禁用全屏">
        <p class="mb-2 text-sm text-gray-500">通过 :fullscreenable="false" 禁用全屏功能</p>
        <LeButton type="primary" @click="noFullscreenVisible = true">打开不可全屏弹窗</LeButton>

        <LeDialog
          v-model:visible="noFullscreenVisible"
          title="不可全屏弹窗"
          :fullscreenable="false"
        >
          <p>这个弹窗不支持全屏功能</p>
        </LeDialog>
      </LeCard>

      <LeCard title="带底部操作">
        <p class="mb-2 text-sm text-gray-500">通过 footer 插槽自定义底部操作区域</p>
        <LeButton type="primary" @click="footerVisible = true">打开带底部弹窗</LeButton>

        <LeDialog v-model:visible="footerVisible" title="确认操作">
          <p>确定要执行此操作吗？</p>
          <p class="text-sm text-gray-500 mt-2">此操作不可撤销</p>

          <template #footer>
            <NButton @click="footerVisible = false">取消</NButton>
            <NButton type="primary" @click="handleConfirm">确定</NButton>
          </template>
        </LeDialog>
      </LeCard>

      <LeCard title="自定义 Header">
        <p class="mb-2 text-sm text-gray-500">通过 header 插槽自定义头部内容</p>
        <LeButton type="primary" @click="customHeaderVisible = true">打开自定义头部弹窗</LeButton>

        <LeDialog v-model:visible="customHeaderVisible">
          <template #header>
            <div class="flex items-center gap-2">
              <NIcon :size="20" color="var(--le-primary)">
                <SettingsOutline />
              </NIcon>
              <span class="font-semibold">自定义标题</span>
            </div>
          </template>
          <p>通过 header 插槽可以完全自定义头部内容</p>
          <p>全屏和关闭按钮会自动保留</p>
        </LeDialog>
      </LeCard>

      <LeCard title="自定义宽度">
        <p class="mb-2 text-sm text-gray-500">通过 width 属性设置弹窗宽度</p>
        <div class="flex gap-4 flex-wrap">
          <LeButton @click="openWidth(400)">宽度 400px</LeButton>
          <LeButton @click="openWidth(600)">宽度 600px</LeButton>
          <LeButton @click="openWidth('80%')">宽度 80%</LeButton>
        </div>

        <LeDialog
          v-model:visible="widthVisible"
          :title="`宽度: ${currentWidth}`"
          :width="currentWidth"
        >
          <p>弹窗宽度设置为：{{ currentWidth }}</p>
        </LeDialog>
      </LeCard>

      <LeCard title="关闭时销毁">
        <p class="mb-2 text-sm text-gray-500">通过 destroy-on-close 在关闭时销毁内容</p>
        <LeButton type="primary" @click="destroyVisible = true">打开弹窗</LeButton>

        <LeDialog v-model:visible="destroyVisible" title="关闭时销毁" destroy-on-close>
          <DestroyContent />
        </LeDialog>
      </LeCard>

      <LeCard title="禁止点击遮罩关闭">
        <p class="mb-2 text-sm text-gray-500">通过 :mask-closable="false" 禁止点击遮罩关闭</p>
        <LeButton type="primary" @click="noMaskCloseVisible = true">打开弹窗</LeButton>

        <LeDialog v-model:visible="noMaskCloseVisible" title="禁止遮罩关闭" :mask-closable="false">
          <p>点击遮罩无法关闭此弹窗</p>
          <p>只能通过关闭按钮关闭</p>
        </LeDialog>
      </LeCard>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, defineComponent, onMounted, onUnmounted, h } from 'vue';
import { NButton, NIcon, useMessage } from 'naive-ui';
import { SettingsOutline } from '@vicons/ionicons5';
import { LeDialog } from '@lee/ui';

const message = useMessage();

const basicVisible = ref(false);
const fullscreenVisible = ref(false);
const noFullscreenVisible = ref(false);
const footerVisible = ref(false);
const customHeaderVisible = ref(false);
const widthVisible = ref(false);
const destroyVisible = ref(false);
const noMaskCloseVisible = ref(false);

const isFullscreen = ref(false);
const currentWidth = ref<string | number>(520);

function handleFullscreenChange(val: boolean) {
  isFullscreen.value = val;
  message.info(val ? '进入全屏模式' : '退出全屏模式');
}

function handleConfirm() {
  message.success('操作已确认');
  footerVisible.value = false;
}

function openWidth(width: string | number) {
  currentWidth.value = width;
  widthVisible.value = true;
}

const DestroyContent = defineComponent({
  setup() {
    onMounted(() => {
      message.info('组件已挂载');
    });
    onUnmounted(() => {
      message.warning('组件已销毁');
    });
    return () => h('p', null, '关闭弹窗后，此组件会被销毁');
  },
});
</script>

<style lang="scss" scoped>
.demo-section {
  @apply flex flex-col gap-4;
}
</style>
