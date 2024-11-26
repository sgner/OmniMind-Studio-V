<script setup>
</script>

<template>
  <div class="layout-container">
    <div class="left-sider-inner">
      <slot name="left-panel"></slot>
    </div>
    <div class="right-container">
      <slot name="right-show"></slot>
      <div class="bg"></div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  position: relative;
}

.left-sider-inner {
  position: relative;
  width: 310px;
  height: calc(100vh - 60px);
  border-right: 2px solid #ffffff;
  background: #000000;
  overflow: hidden;
}

.right-container {
  flex: 1;
  position: relative; /* 确保 .bg 的 z-index 基于 .right-container */
  height: 100vh;
  opacity: 0.9;
  min-width: 100px;
}
.bg {
  position: absolute; /* 保证背景位置固定在 .right-container 内部 */
  top: 0;
  left: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  background-image: url('../../../assets/img/sunob2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.right-container > slot {
  z-index: 1;
  position: relative; /* 使插槽内容位于背景之上 */
}
</style>
