<template>
  <div class="external-site">
    <el-progress
      v-if="loading"
      :percentage="progress"
      status="active"
      style="margin-bottom: 10px"
    ></el-progress>
    <webview
      ref="webview"
      :src="externalUrl"
      style="width: 100%; height: 100%;"
      partition="persist:myPartition"
      @did-start-loading="handleStartLoading"
      @did-stop-loading="handleStopLoading"
    ></webview>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const externalUrl = ref('https://gitee.com/sgner/ai-life');
const loading = ref(false);
const progress = ref(0);

// 处理开始加载
const handleStartLoading = () => {
  loading.value = true;
  progress.value = 0; // 重置进度
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 10; // 每次增加10%
    } else {
      clearInterval(interval);
    }
  }, 100);
};

// 处理停止加载
const handleStopLoading = () => {
  loading.value = false;
  progress.value = 100;
};
</script>

<style>
.external-site {
  height: 100vh;
  width: 100%;
  overflow-x: auto;
}
</style>
