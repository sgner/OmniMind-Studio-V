<template>
    <div class="showcase">
      <div class="window">
        <!-- 渲染卡片列表 -->
        <div v-for="(card, index) in cardList" :key="index" class="card">
          <div class="card-content" @click="handleClick(card,index,$event)">
            <RoleCard v-if="currentIndex !== index" :data="card.player" :type="'role'"></RoleCard>
          </div>
        </div>
      </div>
      <el-row>
        <el-col :span="10">
          <transition name="fade-slide">
            <keep-alive>
              <div v-if="showRole" ref="showRoleRef" class="role-card-detail-wrapper">
                <div class="role-card-detail">
                  <RoleCardDetail :data="currentCard.player" @close="handleCloseDetail" />
                </div>
              </div>
            </keep-alive>
          </transition>
        </el-col>
        <el-col  v-if="showRole" :span="6" :offset="4">
          <div class="rolesClick"
               @mouseover="changeImage('hover')"
               @mouseout="changeImage('default')"
               @click="showRoleList = true">
            <div  style="margin-top: 50px">
              <img :src="imageSrc">
            </div>
            <div style="font-size: 34px;font-weight: bold">查看该玩家角色卡</div>
          </div>
        </el-col>
      </el-row>
      <el-drawer style="overflow: auto" v-model="showRoleList">
        <el-row justify="center" style="margin-bottom: 15px;background-color: #7e64de;">
          <el-col :span="20">
            <span style="border-radius: 10px;font-size: 17px;color: white">左键角色卡查看详情，右键角色卡开始对话</span>
          </el-col>
        </el-row>
        <el-row justify="center" style="margin-bottom: 10px;">
          <el-col :span="17">
            <span style="font-size: 24px;font-weight: bold">【{{currentCard.player.playerName}}】的角色卡</span>
          </el-col>
        </el-row>

        <el-divider/>
        <div v-for="(role,index) in currentCard.roles">
          <div @click="handleLeftClick(role)" @contextmenu.prevent="handleRightClick(role)">
            <RoleCard :type="'simCard'" :data="role"></RoleCard>
          </div>
          <div @click="addRoleHandler" style="margin-top: 20px" v-if="currentCard.roles.length<5 && index === currentCard.roles.length-1">
             <RoleCard :type="'simCard-add'"></RoleCard>
          </div>
        </div>
        <div v-if="currentCard.roles.length === 0" style="margin-top: 20px">
          <div @click="addRoleHandler">
            <RoleCard :type="'simCard-add'"></RoleCard>
          </div>
        </div>
      </el-drawer>
      <div v-if="showRoleDetail" class="role-card-detail-overlay">
        <div class="role-card-detail-content">
          <RoleCardDetail :data="currentRoleDetail" :show-role="showRoleDetail"/>
        </div>
      </div>
      <div v-if="showAddRole" class="role-card-detail-overlay">
          <div class="role-card-detail-content">
              <Add :data="addRoleData" :role="true"></Add>
          </div>
      </div>
      <div v-if="showAddPlayer" class="role-card-detail-overlay">
          <div class="role-card-detail-content">
              <Add :data="addPlayerData" :role="false"></Add>
          </div>
      </div>

    </div>
</template>
<script setup>
import {onBeforeUnmount} from "vue";
import {modifyRole,modifyPlayer,session,addRole,initPlayer,getRoleList} from "../../../api/CosPlayService";
import message from "../../../utils/Message";
const showRoleRef = ref(null);
const showRoleList = ref(false);
const showRoleDetail = ref(false);
const currentRoleDetail = ref(null);
const showAddRole = ref(false)
const showAddPlayer = ref(false)
const cardList = ref(null);
const roleCardStore = useRoleCardStore()
const router = useRouter();
const route = useRouter()
const handleOutsideClick = async (event) => {
  const rolesClickEl = document.querySelector('.rolesClick');
  if (
    (showRoleRef.value && showRoleRef.value.contains(event.target)) ||
    (rolesClickEl && rolesClickEl.contains(event.target)) || (showAddPlayer.value)
  ) {
    return;
  }
  // 点击在允许区域外，关闭详情
  if(!showRoleList.value && showRole.value){
    const result =  await modifyPlayer(currentCard.value.player)
    console.log(result.data)
    if(result.data !== null){
      cardList.value = result.data.playerQueries
      roleCardStore.roleCard = cardList.value
    }
    showRole.value = false;
    currentIndex.value = null;
  }
};

const addRoleHandler = ()=>{
     showAddRole.value = true;
}

const addRoleData = ref(
  {
    agentAvatar: "",
    agentName: "",
    agentType: "",
    agentDescription: "",
    agentIdentity: "",
    personalityDescription: "",
    hobby: "",
    keyPersonality: "",
    mission: ""
  }
)
const addPlayerData = ref(
  {
    playerAvatar: '',
    playerName: '',
    playerType: '',
    description: '',
    senderIdentity: '',
  }
)
const handleRightClick = async (role)=>{
   const result = await session({
       player: currentCard.value.player,
       role: role
    })
  if(result.code === 20000 && result.data !== null){
    console.log(JSON.stringify(result))
     const session = result.data;
     session.time = new Date().getTime();
    await router.push({path: "/main", query: session})
  }
}
const handleLeftClick = (role) => {
  currentRoleDetail.value = role;
  showRoleDetail.value = true;
};


const imageSrc = ref('../../../../src/assets/img/roles1.png')
const handleCloseRoleDetail = async () => {
  currentRoleDetail.value.playerId = currentCard.value.player.playerId
  console.log(JSON.stringify(currentRoleDetail.value))
  if(currentRoleDetail.value.playerId !== null){
    const result =  await modifyRole(currentRoleDetail.value);
    if(result.data !== null){
      cardList.value = result.data.playerQueries
      roleCardStore.roleCard = cardList.value
    }
  }
  showRoleDetail.value = false;
  console.log(JSON.stringify(currentRoleDetail.value))
  currentRoleDetail.value = null;
};
const changeImage = (status)=>{
  if (status === 'hover'){
    imageSrc.value = '../../../../src/assets/img/roles.png'
  }else {
    imageSrc.value = '../../../../src/assets/img/roles1.png'
  }
}
onMounted(()=>{
   document.addEventListener('click', handleOutsideClick);
  document.addEventListener('click', async (e) => {
    const overlay = document.querySelector('.role-card-detail-content');
    if (overlay && !overlay.contains(e.target)) {
     if(showAddRole.value){
         showAddRole.value = false;
         if(addRoleData.value.agentName !== "" && addRoleData.value.mission !== ""){
           addRoleData.value.playerId = currentCard.value.player.playerId
           const resultAddRole = await addRole(addRoleData.value)
           if(resultAddRole.code === 20000){
             const result = await getRoleList();
             roleCardStore.roleCard = result.data;
             message.success("恭喜，新增角色【"+addRoleData.value.agentName+"】成功")
         }
        }else{
           message.error("新增角色失败")
        }
         return;
     } else if(showAddPlayer.value){
        showAddPlayer.value = false;
        await initPlayer(addPlayerData.value)
       const result = await getRoleList();
       roleCardStore.roleCard = result.data;
       message.success("恭喜，新增玩家【"+addPlayerData.value.playerName+"】成功")
       return;
     }
     await handleCloseRoleDetail();
    }
  });
})
onBeforeUnmount(() => {
   document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('click', handleCloseRoleDetail);
})
import {useRoleCardStore} from "../../../stores/RoleCard";
import {useCreateRoleStore} from "../../../stores/CreateRole";
import {onMounted, ref, watch} from "vue";
import RoleCard from "./RoleCard.vue";
import RoleCardDetail from "./RoleCardDetail.vue";
import {useRouter} from "vue-router";
import Add from "./Add.vue";
const showRole = ref(false);
const currentIndex = ref();
const props = defineProps({
  cards: {
    type: Array,
    default: []
  }
})
const handleClick = (card, index, event) => {
  // 阻止事件传播，避免触发外部点击事件
  event.stopPropagation();
  if(Object.keys(card).length === 0){
        showAddPlayer.value = true
  }else{
    currentIndex.value = index;
    currentCard.value = card;
    showRole.value = true;
  }
};
const currentCard  = ref()
const handleCloseDetail = () => {
  showRole.value = false;
  currentIndex.value = null;
};
watch(()=>props.cards,(cards)=>{
       if(cards.length<5 && Object.keys(cards[cards.length-1]).length!==0){
            cards.push({})
            cardList.value=cards
       }
})
</script>

<style scoped>

.role-card-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保在所有其他元素之上 */
}
.role-card-detail-content {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.rolesClick{
   color: #fff;
}
.rolesClick:hover{
   color: #4807c1;
   cursor: pointer;
}

.showcase {
  height: auto;
  width: auto;
  flex-direction: row;
  position: relative;
}

.window {
  display: grid;  /* 使用 grid 布局 */
  grid-template-columns: repeat(5, minmax(200px, 250px)); /* 每行最多显示5个卡片，卡片最小宽度为200px，最大宽度为300px */
  gap: 20px;  /* 初始间隙 */
  position: relative;
  width: auto;
  height: auto;  /* 自适应高度 */
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  padding: 10px;
  backdrop-filter: blur(10px);
  justify-items: center;  /* 居中卡片 */
}

.card {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background-image: linear-gradient(135deg, #606060 25%, #424242 35%, #656565 50%, #4d4d4d 75%);
  box-shadow: 0 0 20px rgba(220, 86, 86, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  border-radius: 8px;
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(213, 90, 255, 0.5);
}

.card-content {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  height: 100%;
  padding: 10px;
}

.card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.window::after {
  border-radius: 10px;
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;  /* 增加灯条的高度 */
  background: linear-gradient(90deg, rgba(255, 128, 0, 0.8), rgba(255, 255, 255, 0.5), rgba(255, 128, 0, 0.8));  /* 使用暖色渐变来模拟灯条 */
  box-shadow: 0 0 25px rgba(255, 160, 0, 0.8), 0 0 50px rgba(255, 200, 0, 0.6);  /* 创建亮光晕效果 */
  animation: glow 1.5s infinite alternate; /* 增加发光动画 */
}

@keyframes glow {
  0% {
    box-shadow: 0 0 30px rgba(215, 42, 255, 0.6), 0 0 50px rgba(169, 5, 180, 0.5);
    background: linear-gradient(90deg, rgba(40, 40, 40, 0.9), rgba(17, 17, 17, 0.6), rgba(51, 51, 51, 0.9));
  }
  50% {
    box-shadow: 0 0 40px rgb(255, 18, 199), 0 0 70px rgba(237, 36, 253, 0.8);
    background: linear-gradient(90deg, rgba(40, 40, 40, 0.9), rgba(17, 17, 17, 0.6), rgba(51, 51, 51, 0.9));
  }
  100% {
    box-shadow: 0 0 50px rgba(177, 17, 182, 0.8), 0 0 100px rgba(122, 12, 136, 0.9);
    background: linear-gradient(90deg, rgba(40, 40, 40, 0.9), rgba(17, 17, 17, 0.6), rgba(51, 51, 51, 0.9));
  }
}
.role-card-detail-wrapper {
  width: 500px;
}

.role-card-detail {

}

/* 控制fade-slide进入和离开的动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease;
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);  /* 离开时向下移动 */
}

/* 关闭时，详情卡片的复原 */
.role-card-detail-wrapper.fade-slide-leave-to {
  transform: translateY(100px);
}
</style>
