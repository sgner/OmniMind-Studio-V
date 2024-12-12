<script setup>
import layout from "../../components/layout.vue"
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import { useCollapsedStore } from "../../stores/Collapsed";
import {useRouter,useRoute} from 'vue-router'
import {subscribedRobotListService}from "../../api/RobotService"
import {useUserInfoStore} from "../../stores/UserInfo";
import SubscribeRobot from "./SubscribeRobot.vue";
import {useRobotTypeStore} from "../../stores/RobotType";
import {useRobotIdStore} from "../../stores/RobotId";
import {useRightTitleStore} from "../../stores/RightTitle";
import {createSessionService} from "../../api/UserService";
const searchKey = ref('');
const collapsedStore = useCollapsedStore();
const isCollapsed = computed(() => collapsedStore.collapse);
const partList = ref(
  [
  {
    partName: "项目地址",
    children: [
      {
        name: 'github',
        icon:'icon-github',
        path: '/robot/projectAddr/github'
      },
      {
         name: 'gitee',
         icon: 'icon-gitee',
         path: '/robot/projectAddr/gitee'
      }
    ]
  },
    {
      partName: "订阅聊天/工具",
      type:1,
      children: [
        {
          name: '订阅机器人',
          icon: 'icon-dingyue',
          path: '/robot/subscribe',
          showTitle: true,
        }
      ],
      robotData: [],
      robotPath: '/robot/info',
      emptyMsg: '暂未订阅',
      emptyIcon: 'icon-weidingyue'
    },
    {
      partName: "角色扮演",
      type:2,
      children: [
        {
           name: '查看智能体',
           icon: 'icon-a-jiaosebanyanRolePlaying',
           path: '/robot/rolePlay' ,
           showTitle: true,
        }
      ],
      robotData: [],
      robotPath: '/robot/info',
      emptyMsg: '没有参演',
      emptyIcon: 'icon-youxi-'
    },
    {
      partName:"AI群聊",
      type:5,
      children: [
        {
          name:'新建群聊',
          icon: 'icon-xinjianqunliao',
          path:'/robot/group',
          showTitle: true,
        }
      ],
      robotData: [],
      robotPath: '/robot/info',
      emptyMsg: '没有群聊',
      emptyIcon: 'icon-caifang'
    },{
    partName: "AI音视频聊天",
    type:3,
    children: [
      {
        name: '建立连接',
        icon: 'icon-shipinliaotian',
        path:'/robot/video',
        showTitle: true,
      }
    ],
    robotData: [],
    robotPath: '/robot/info',
    emptyIcon: 'icon-shipin',
    emptyMsg: '没有连接',
  }
]
)
const rightTitle = ref()
const router = useRouter();
const route = useRoute()
const robotTypeStore = useRobotTypeStore();
const rightTitleStore = useRightTitleStore();
const partJump = (data,item)=>{
     if(data.showTitle){
       rightTitleStore.setRightTitle(data.name)
       rightTitle.value = rightTitleStore.rightTitle;
     }else{
       rightTitleStore.setRightTitle(null)
       rightTitle.value = null
     }
     robotTypeStore.robotType = item.type;
     router.push(data.path)
}
watch(()=>rightTitleStore.rightTitle,(title)=>{
        rightTitle.value = title;
})
const activePath = ref('')
const activePartId = ref('')
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    // 检查当前路由是否匹配
    activePath.value = newPath
  },
  { immediate: true } // 立即执行一次
)

const scrollHeight = ref(768); // 初始高度

// 动态计算max-height
const updateScrollHeight = () => {
  const offset = 120; // 顶部搜索栏和其他内容高度为120px
  scrollHeight.value = window.innerHeight - offset;
};

// 在组件挂载时监听窗口变化
onMounted(() => {
  updateScrollHeight(); // 初始计算一次高度
  window.addEventListener("resize", updateScrollHeight); // 监听窗口大小变化
});

// 在组件卸载时移除监听器
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScrollHeight);
});

const loadRobot = async () => {
  const userInfoStore = useUserInfoStore();
  const result = await subscribedRobotListService(userInfoStore.userInfo.userId);
  const robotMap = result.data.robotMap;

  partList.value.forEach(item => {
    if (robotMap[item.type]) {
      item.robotData = robotMap[item.type].map(robot => ({ ...robot, hovered: false }));
      if (item.type === 1) {
        item.robotData.push({ ...robotMap[4][0], hovered: false });
      }
    }
  });
};
loadRobot()
const showOverlay = ref(false);
const viewDetails = (robotId,robotName)=>{
   const robotIdStore = useRobotIdStore();
   // console.log(robotName);
   rightTitleStore.setRightTitle(robotName)
   rightTitle.value = rightTitleStore.rightTitle;
   robotIdStore.setRobotId(robotId)
   activePartId.value = robotId
   router.push("/robot/detail")
}

const createSession =async (data)=>{
  const result = await createSessionService(data)
  if(result.data !== null){
    const session = result.data
    session.time = new Date().getTime()
    await router.push({path:"/main",query:session})
  }
}
</script>

<template>
  <layout>
    <template #left-content>
      <div class="drag-panel drag"></div>
      <div class="top-search-wrapper">
      <transition name="fade">
        <div class="top-search" v-if="!isCollapsed">
          <el-input clearable placeholder="搜索智能体" v-model="searchKey">
            <template #suffix>
              <span class="iconfont icon-search"></span>
            </template>
          </el-input>
        </div>
      </transition>
      </div>
      <div class="contact-list">
        <el-scrollbar :max-height="scrollHeight">
          <template v-for="item in partList">
            <div class="part-title">{{item.partName}}</div>
            <div class="part-list">
              <div
                v-for="sub in item.children"
                :class="['part-item', sub.path === activePath ?'active':'']"
                @click="partJump(sub,item)"
              >
                <div
                  class="icon-wrapper"
                  :class="{ 'collapsed': isCollapsed }"
                >
                  <svg
                    style="fill: currentColor;overflow: hidden;width: 2em;height: 2em;"
                    aria-hidden="true"
                  >
                    <use :xlink:href="`#${sub.icon}`"></use>
                  </svg>
                </div>
                <transition name="fade">
                  <div class="text" v-if="!isCollapsed">{{ sub.name }}</div>
                </transition>
              </div>
              <el-scrollbar max-height="200px">
                <template v-for="(robot, index) in item.robotData" :key="robot.id">
                  <div class="subscribe-robot-container"
                       @mouseenter="robot.hovered = true"
                       @mouseleave="robot.hovered = false">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="robot.name"
                      placement="right"
                      v-if="collapsedStore.collapse"
                    >
                    <SubscribeRobot :class="[robot.id ===activePartId?'active':'','part-item-part']"
                                    :avatar="robot.avatar"
                                    :name="robot.name"
                                    :status="robot.status" @click="viewDetails(robot.id,robot.name)"></SubscribeRobot></el-tooltip>
                    <SubscribeRobot v-else
                                    :class="[robot.id ===activePartId?'active':'','part-item-part']"
                                    :avatar="robot.avatar"
                                    :name="robot.name"
                                    :status="robot.status"
                                    @click="viewDetails(robot.id,robot.name)"></SubscribeRobot>
                    <transition name="slide">
                      <div v-if="robot.hovered && !collapsedStore.collapse" class="overlay">
                        <el-button style="margin-left: 30px" type="primary" @click="viewDetails(robot.id,robot.name)">查看详情</el-button>
                        <el-button type="primary" @click="createSession(robot.id)">创建对话</el-button>
                      </div>
                    </transition>
                  </div>
                </template>
              </el-scrollbar>
              <template v-if="item.robotData && item.robotData.length === 0">
                <div class="no-data">

                  <svg
                    style="fill: currentColor;overflow: hidden;width: 3em;height: 3em;"
                    aria-hidden="true"
                  >
                    <use :xlink:href="`#${item.emptyIcon}`"></use>
                  </svg>
                  <transition name="fade">
                    <div style="height: 20px"><div v-if="!isCollapsed">{{item.emptyMsg}}</div></div>
                  </transition>
                </div>
              </template>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </template>
    <template #right-content>
      <div class="title-panel drag">
         {{rightTitle}}
      </div>
      <router-view v-slot="{Component}">
           <component :is="Component" ref="componentRef"></component>
      </router-view>
    </template>
  </layout>
</template>

<style scoped>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.5s ease;
  font-size: 24px;
}

.icon-wrapper.collapsed {
  justify-content: center;
  font-size: 29px;
}
.drag-panel {
  height: 25px;
}

.top-search {
  padding: 0 10px 9px 10px;
  background: transparent;
  display: flex;
  align-items: center;
}

.iconfont {
  font-size: 22px;
}

/* 输入框渐变边框 */
:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__wrapper) {
  background-color: #21212c;
  border-radius: 95px;
  border: 5px solid;
  border-image: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5)) 1;
  box-shadow: 0 0 0 0;
}

:deep(input::-webkit-input-placeholder) {
  color: #d7d5d5;
}

/* 渐变效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <=2.1.8 */ {
  opacity: 0;
}

.contact-list {
  height: calc(100vh - 85px);
  overflow: hidden;
}

.contact-list:hover {
  overflow: auto;
}

.part-title {
  color: #e0e0e0;
  padding-left: 10px;
  margin-top: 10px;
}

.part-list {
  border-bottom: 0.5px solid #1c1b1b;
}

.part-item {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  position: relative;
  transition: all 0.5s ease;
}
.part-item-part{
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 10px 10px;
  position: relative;
  transition: all 0.5s ease;
}
.part-item-part:hover{
  cursor: pointer;
  width: 90%;
  background: #545454;
}
.part-item:hover {
  cursor: pointer;
  background: #595959;
}

.iconfont {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.text {
  flex: 1;
  color: #e8e8ee;
  margin-left: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  transition: opacity 0.5s ease;
}

.no-data {
  text-align: center;
  font-size: 16px;
  color: #7e64de;
  line-height: 30px;
}

.active {
  background: #4f4f4f;
}

.active:hover {
  background: #797979;
}

.title-panel {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 20px;
  color: #e8e2e2;
}
.top-search-wrapper{
 height: 50px;
}

.subscribe-robot-container {
  position: relative; /* 确保蒙版相对于该容器定位 */
}
.overlay {
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.subscribe-robot-container:hover .overlay {
  transform: translateX(0);
}



</style>
