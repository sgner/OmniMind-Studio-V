<script setup>
import {onMounted, ref, watch} from "vue";
import dynamicImageUrl from '../assets/img/background_main.jpg'
import WinOp from "../components/WinOp.vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import AvatarBase from "../components/AvatarBase.vue";


const menuList = ref(
  [
    {
    name: "avatar",
    countKey: 'avatarCount',
    src: "../../src/assets/img/adi.png",
    position: "top"
   },
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
const routed = useRoute()
const routerd = useRouter()
const currentMenu = ref(menuList.value[1]);
const changeMenu=  async (item)=>{
  currentMenu.value = item
  await routerd.push({path: item.path})
  await preApi.setSessionSelect();
}
const componentRef = ref()

const isLoading = ref(false)
const loadingGif = ref("../src/assets/img/loading.gif")
const redirect = async()=>{
  isLoading.value = true
  try{
    if ( Object.keys(routed.query).length !== 0&&routed.query !== null){
      currentMenu.value = menuList.value[1]
      await routerd.push({path:"/main/chat",query:routed.query})
    }else{
      await routerd.push({path:"/main/chat"})
    }
  }finally {
    isLoading.value = false
  }
}
onMounted(() => {
  redirect();
});
// 监听路由的 query 参数变化
watch(() => routed.query, (newSession) => {
  console.log(newSession)
  console.log(routed.query.sessionId)
  if(newSession!==undefined&&newSession!==null&& Object.keys(newSession).length!==0){
    redirect();
  }
});
</script>
<template>

  <div class="main">
    <div v-if="isLoading" class="loading-overlay">
      <el-image fit="cover" :src="loadingGif" alt="Loading..." />
    </div>
    <div class="left-sider">
      <div class="menu-list">
        <template v-for="item in menuList">
          <div v-if="item.name === 'avatar'" class="avatar-m">
              <AvatarBase :avatar="item.src" :width="48" :border-radius="10"></AvatarBase>
          </div>
          <div
            class="popover-user-panel"
            :class="{'active': currentMenu.path === item.path}"
            v-if="item.position === 'top' && item.name !== 'avatar'"
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
.avatar-m{
   border: 3px solid #67119a;
   border-radius: 10px;
}

.loading-overlay {
  border-radius: 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 确保在最上层 */
  pointer-events: auto; /* 允许 pointer-events */
}

.loading-overlay img {
  max-width: 700px; /* 适当限制加载动画的大小 */
  max-height: 800px;
}
.bg{
  position: fixed;
  width: 100%;
  height: 100%;
  border-radius: 15px;
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
  border-radius: 15px;
  .left-sider{
    width:55px;
    background: black;
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


.popover-user-panel:hover {
  background-color: #343042;
}

.popover-user-panel.active {
  margin-left: 1px;
  transform: scale(1.1);
  background: #2a2a38;
  border-left: 4px solid #ae99ff;
}

.popover-user-panel:hover.active {
  background-color: #343042;
  border-left: 4px solid #61538f;
}


</style>
