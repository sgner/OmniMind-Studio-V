<script setup>
</script>

<template>
  <div class="layout-container">
    <div class="left-sider-inner">
      <slot name="left-panel"></slot>
    </div>
    <div class="right-container">
       <div class="bg">
      <slot name="right-show"></slot></div>
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
  width: 300px;
  height: 100vh;
  border-right: 2px solid #ffffff;
  background: #000000;
  opacity: 0.9;
  overflow: hidden;
}

.right-container {
  flex: 1;
  position: relative;
  height: 100vh;
  opacity: 0.6;
  min-width: 100px;

}
.bg{
  height: 100vh;
  width: 100%;
  background-image: url('../../../assets/img/sunob2.jpg');
  background-size: cover; /* 确保背景图完全填充 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>
