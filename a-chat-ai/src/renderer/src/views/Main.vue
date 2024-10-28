<script setup>
import {ref} from "vue";
import dynamicImageUrl from '../assets/img/background_main.jpg'
import router from "../router";
import WinOp from "../components/WinOp.vue";


const menuList = ref(
  [
    {
      name: 'chat',
      icon: 'icon-liaotian',
      path: '/main/chat',
      countKey: 'chatCount',
      position:'top'
    },
    {
      name: 'contact',
      icon: 'icon-jiqiren1',
      path: '/main/robot',
      countKey: 'contactApplyCount',
      position: 'top'
    },
    {
      name: 'mysetting',
      icon: 'icon-more2',
      path: '/main/setting',
      position: 'bottom'
    }
  ]
)
const currentMenu = ref(menuList.value[0]);
const changeMenu=  async (item)=>{
  currentMenu.value = item
  router.push(item.path)
  await preApi.setSessionSelect();
}
const componentRef = ref()

</script>
<template>

  <div class="main">
    <div class="left-sider">
      <div></div>
      <div class="menu-list">
        <template v-for="item in menuList">
          <div
            class="popover-user-panel"
            :class="{'active': currentMenu.path === item.path}"
            v-if="item.position === 'top'"
            @click="changeMenu(item)">
            <svg
              style="fill: currentColor; overflow: hidden; width: 2.5em; height: 2.5em;"
              aria-hidden="true"
            >
              <use :xlink:href="`#${item.icon}`"></use>
            </svg>
            <template v-if="item.name === 'chat'"></template>
          </div>
        </template>

      </div>
      <div class="menu-list menu-buttom">
        <template v-for="item in menuList">
          <div :class="['tab-item iconfont',item.icon,item.path===currentMenu.path? 'active':'']" v-if="item.position==='bottom'" @click="changeMenu(item)">
          </div>
        </template>
      </div>
    </div>
    <div class="right-container">
      <router-view v-slot="{Component}">
        <keep-alive include="chat">
          <component :is="Component" ref="componentRef"></component>
        </keep-alive>
      </router-view>
    </div>
    <div class="bg">
      <div class="title drag">
        <span style="height: 20px;"></span>
      </div>
      <img alt="" class="bgImage" :src="dynamicImageUrl"></img>
    </div>
  </div>

  <WinOp></WinOp>
</template>

<style scoped>
.bg{
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
}
.bg::before{
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  background: rgba(25,29,34,0);
}
.bgImage{
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  -webkit-transition: 1s opacity;
  transition: 1s opacity;
}

.main{
  display: flex;
  overflow: hidden;
  border-radius: 0 3px 3px 0;
  .left-sider{
    width:55px;
    background: linear-gradient(45deg, rgb(31, 46, 75), rgb(73, 71, 54), rgb(61, 57, 87));
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 35px;
    border: 1px solid #2e2e2e;
    border-right: none;
    padding-bottom: 10px;
    .menu-list{
      width: 100%;
      flex:1;
      .tab-item{
        color: #d3d3d3;
        font-size:25px;
        height: 50px;
        display:flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        cursor: pointer;
        position:relative;
      }
      .active{
        color: #7e64de;
      }
    }
    .menu-buttom{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
  .right-container{
    flex:1;
    overflow:hidden;
    border:1px solid #140f28;
  }
}
.popover-user-panel {
  padding: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 15px;
  cursor: pointer;
}

/* 悬停时背景颜色变为紫色 */
.popover-user-panel:hover {
  background-color: #571c86; /* 紫色 */
}

/* 点击时背景颜色变为深紫色 */
.popover-user-panel:active {
  background-color: #460a6e; /* 深紫色 */
}

/* 当前激活的菜单项 */
.popover-user-panel.active {
  background-color: #30074d; /* 选中时的颜色 */
  transform: scale(1.2); /* 动画：点击时放大 */
}

/* 动画效果：背景颜色和缩放效果 */
.popover-user-panel.active:hover {
  background-color: #4e1a7c; /* 悬停时继续保持紫色 */
}

</style>
