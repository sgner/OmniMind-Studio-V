<script setup>
import { onBeforeUnmount, ref } from 'vue'
import CreatePlayer from './CreatePlayer.vue'
const roleList = ref([])
const createRole = ref(false)


</script>

<template>

  <div class="cos-bg-container">
    <!-- 背景图片层 -->
    <div class="cos-bg"></div>
    <!-- 毛玻璃层 -->
    <div class="cos-blur-overlay"
         :style="createRole ? { backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.4)',transition: 'backdrop-filter 0.7s ease, background-color 0.7s ease, transform 0.7s ease' } : {}">
      <!-- 其他组件或内容 -->
      <div :class="createRole?'R-container': 'content' ">
        <div v-if="!createRole">
          <span style="font-size: 50px;font-weight: 600">欢迎来到角色扮演</span>
          <h3>在这里，你可以自定义角色，剧情等多个玩法</h3>
          <el-button style="margin-top: 20px" type="goon" @click="createRole = true">开始创建一个角色吧！</el-button>
        </div>
        <div v-else class="create-player-wrapper">
            <CreatePlayer></CreatePlayer>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-bg" v-if="roleList.length>0">
    <div class="first-play">
      <el-image fit="contain" src="../../../../src/assets/img/fper.jpg"></el-image>
    </div>
  </div>

</template>

<style scoped>
.first-play{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.bottom-bg{
  height: 80%;
  background: linear-gradient(to right, #211928 0%, #1f1005 100%);
}
.create-player-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.cos-bg-container-up {
  flex: 1;
  position: relative; /* 确保 .bg 的 z-index 基于 .right-container */
  max-height: 200px;
  min-width: 100px;
  border: 3px solid;
  border-image: linear-gradient(to right, #73558d 0%, #cb6a24 100%)1
}
.cos-bg-container{
  flex: 1;
  position: relative; /* 确保 .bg 的 z-index 基于 .right-container */
  max-height: 100vh;
  min-width: 100px;
  border: 3px solid;
  border-image: linear-gradient(to right, #73558d 0%, #cb6a24 100%)1
}
/* 背景图片样式 */
.cos-bg {
  height: 100%;
  width: 100%;
  background-image: url("../../../../src/assets/img/kv-WtwyiZ85.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.cos-blur-overlay {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px); /* 设置毛玻璃效果 */
  background-color: rgba(0, 0, 0, 0.5); /* 添加透明度 */
  z-index: 2; /* 确保在背景图片上方 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  color: #dcdcdc;
  text-align: center;
}
.R-container{
}
.el-button--goon.is-active,
.el-button--goon:active {
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5));
  border-color: #c73fff;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: linear-gradient(45deg, rgba(255, 111, 88, 0.5), rgba(157, 87, 238, 0.5));
  border-color: #f654ff;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background: linear-gradient(45deg, rgba(119, 72, 173, 0.5), rgba(154, 90, 12, 0.5));
  border: 2px solid #510e5b;
  border-radius: 10px;
  width: 70%;
}

:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}
</style>
