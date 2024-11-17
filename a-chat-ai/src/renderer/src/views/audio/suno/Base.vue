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
  position: relative;
  height: 100vh;
  opacity: 0.9;
  min-width: 100px;

}
.bg{
  margin-top: -52px;
  height: 100vh;
  width: 100%;
  background-image: url('../../../assets/img/sunob2.jpg');
  background-size: cover; /* 确保背景图完全填充 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>
