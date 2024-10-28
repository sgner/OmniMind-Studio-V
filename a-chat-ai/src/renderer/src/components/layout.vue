<script setup>
import { ref } from 'vue';
import {useCollapsedStore} from "../stores/Collapsed";
const collapsedStore = useCollapsedStore()
const isCollapsed  = ref()
isCollapsed.value = collapsedStore.collapse
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  collapsedStore.setCollapse(isCollapsed.value)
};
</script>

<template>
  <div class="layout-container">
    <div
      class="left-sider-inner"
      :class="{ collapsed: isCollapsed }"
    >
      <slot name="left-content"></slot>
      <el-button class="toggle-btn" type="goon" @click="toggleSidebar">
        {{ isCollapsed ? '展开' : '收缩面板' }}
      </el-button>
    </div>
    <div class="right-container">
      <slot name="right-content"></slot>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
}

.left-sider-inner {
  position: relative;
  width: 250px;
  border-right: 1px solid #463183;
  transition: width 0.3s ease;
  overflow: hidden;
}

.left-sider-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #232121;
  background-size: auto;
  z-index: -1;
  opacity: 0.9;
}

.left-sider-inner.collapsed {
  width: 86px;
}

.left-sider-inner.collapsed::before {
  opacity: 0.9; /* Reduced opacity for collapsed state */
}

.right-container {
  flex: 1;
  height: calc(100vh - 2px);
  background: #313131;
  opacity: 0.9;
  min-width: 100px;
}

.toggle-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: width 0.3s ease;
}

.left-sider-inner.collapsed .toggle-btn {
  width: 90%;
}

.left-sider-inner .toggle-btn {
  width: 80%;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5));
  border-color: #56e7df;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5));
  border-color: #4de1db;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background: linear-gradient(45deg, rgba(70, 208, 193, 0.5), rgba(155, 76, 206, 0.5));
  border: 2px solid #0e807d;
  border-radius: 10px;
  width: 70%;
}
</style>
