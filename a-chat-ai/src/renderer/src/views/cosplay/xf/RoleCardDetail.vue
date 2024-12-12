<script setup>

import {Plus} from "@element-plus/icons-vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {deleteUploadAvatarService, uploadAvatarService} from "../../../api/UserService";
import {Delete} from "@element-plus/icons-vue"
const props = defineProps({
  data:{
     type: Object,
     default: {}
  },
  showRole: {
     type: Boolean,
     default: false
  }
})
const player = ref()
player.value = props.data;
watch(()=>props.data,(newPlayer)=>{
  player.value = newPlayer;
})
const handlePlayerCard = async ()=>{
  if(player.value.playerAvatar !== ''){
    const regex = /\/([a-f0-9\-]{36})\.png$/; //暂时无效
    const match = player.value.playerAvatar.match(regex);
    await deleteUploadAvatarService(match[1])
    player.value.playerAvatar = ''
  }
}


const showUpload = ref(false); // 控制显示哪个 div
const showUserName = ref(false); // 控制哪个名字
const showUserType = ref(false)
const showUserDes = ref(false)
const showUserIdes = ref(false)


const avatarContainer = ref(null); // 绑定组件容器的 ref
const userNameContainer = ref(null); // 绑定组件容器的 ref
const userTypeContainer = ref(null); // 绑定组件容器的 ref
const userDesContainer = ref(null); // 绑定组件容器的 ref
const userIdesContainer = ref(null); // 绑定组件容器的 ref

const toggleView = () => {
  showUpload.value = !showUpload.value; // 切换 div 显示
};
const toggleName = () => {
  showUserName.value = !showUserName.value; // 切换名字显示
};
const toggleType = () => {
  showUserType.value = !showUserType.value; // 切换类型显示
}
const toggleDes = () => {
  showUserDes.value = !showUserDes.value; // 切换描述显示
}
const toggleIdes = () => {
  showUserIdes.value = !showUserIdes.value; // 切换描述显示
}

// 点击事件，用来判断是否点击了外部
const handleOutsideClick = (event) => {
  // 判断是否点击了外部
  if (avatarContainer.value && !avatarContainer.value.contains(event.target)) {
    showUpload.value = false;
  }
};
const handleOutsideClickName =(event)=>{
   if (userNameContainer.value && !userNameContainer.value.contains(event.target)) {
      showUserName.value = false;
    }
}
const handleOutsideClickType =(event)=>{
    if (userTypeContainer.value && !userTypeContainer.value.contains(event.target)) {
      showUserType.value = false;
    }
}
const handleOutsideClickDes =(event)=>{
    if (userDesContainer.value && !userDesContainer.value.contains(event.target)) {
      showUserDes.value = false;
    }
}
const handleOutsideClickIdes =(event)=>{
    if (userIdesContainer.value && !userIdesContainer.value.contains(event.target)) {
      showUserIdes.value = false;
    }
}

onMounted(() => {
  // 监听点击事件
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('click', handleOutsideClickName);
  document.addEventListener('click', handleOutsideClickType);
  document.addEventListener('click', handleOutsideClickDes);
  document.addEventListener('click', handleOutsideClickIdes);
});

onBeforeUnmount(() => {
  // 在组件销毁时移除监听
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('click', handleOutsideClickName);
  document.removeEventListener('click', handleOutsideClickType);
  document.removeEventListener('click', handleOutsideClickDes);
  document.removeEventListener('click', handleOutsideClickIdes);
});
const uploadAvatar = async ({ file })=>{
  const fromData = new FormData();
  fromData.append('avatar',file)
  const result =  await uploadAvatarService(fromData)
  if(!props.showRole){
    console.log(result.data)
    player.value.playerAvatar = result.data[0];
  }else {
    player.value.agentAvatar = result.data[0];
  }
}

const deletePlayer = (data)=>{

}
const deleteRole = (data)=>{

}
</script>

<template>
  <div class="cus-el-descriptions" v-if="!showRole">
    <el-descriptions
      column="2"
      size="large"
      border
      style="opacity: 0.94;"
    >
      <el-descriptions-item
        class-name="player-content"
        :rowspan="1"
        label="玩家头像（默认由系统生成）"
        align="center"
      >
        <div ref="avatarContainer" @dblclick="toggleView">
        <div v-if="showUpload">
          <el-tooltip v-if="player.playerAvatar !== ''" placement="top">
            <template #content>
              <div>
                <span>点击图片更换头像</span>
                <span><el-button type="text" @click="handlePlayerCard"><span style="color: #7e64de;margin-top: -3px">删除头像</span></el-button></span>
              </div>
            </template>
            <el-upload
              class="avatar-uploader"
              :http-request="uploadAvatar"
              :show-file-list="false"
              :limit="1"
            >
              <img v-if="player.playerAvatar!== ''" :src="player.playerAvatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-tooltip>
          <el-upload
            v-else
            class="avatar-uploader"
            :http-request="uploadAvatar"
            :show-file-list="false"
            :limit="1"
          >
            <img v-if="player.playerAvatar!== ''" :src="player.playerAvatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div v-else>
            <img :src="player.playerAvatar" style="width: 100px;height: 100px;border-radius: 10px" />
        </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        label="玩家名"
        class-name="player-content"
      ><template #label>
        <span>玩家名<el-text type="danger" size="large">*</el-text></span>
      </template>
        <div ref="userNameContainer" @dblclick="toggleName">
          <div v-if="showUserName" >
            <div class="input_area-xf">
              <el-input resize="none" show-word-limit rows="4" maxlength="10" type="textarea" v-model="player.playerName" placeholder="请输入玩家姓名，例如：张三"></el-input>
            </div>
          </div>
          <div v-else>
             <el-text style="cursor: pointer" size="large"><span>{{player.playerName}}</span></el-text>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="label" span="2" class-name="player-content" label="玩家类型">
       <div ref="userTypeContainer" @dblclick="toggleType">
         <div class="input_area-xf" v-if="showUserType">
           <el-input resize="none" show-word-limit rows="3" maxlength="30" type="textarea" v-model="player.playerType" placeholder="请输入玩家类型，例如：一名程序员玩家"></el-input>
         </div>
         <div v-else>
            <span>{{player.playerType}}</span>
         </div>
       </div>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="label" span="2" class-name="player-content" label="玩家描述">
        <div ref="userDesContainer" @dblclick="toggleDes">
          <div v-if="showUserDes" class="input_area-xf">
            <el-input type="textarea" resize="none" show-word-limit rows="4" maxlength="300" v-model="player.description" placeholder="请输入玩家描述 ，例如：张三，一名程序员"></el-input>
          </div>
          <div v-else>
             <span>{{player.description}}</span>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="label" class-name="player-content" label="玩家身份描述" width="112" span="2">
        <div ref="userIdesContainer" @dblclick="toggleIdes">
          <div class="input_area-xf" v-if="showUserIdes">
            <el-input type="textarea" resize="none" show-word-limit rows="6" maxlength="300" v-model="player.senderIdentity" placeholder="请对玩家的身份，与角色的关系，使命进行描述,例如：张三和李四是同事，在一家公司上班。"></el-input>
          </div>
          <div v-else>
             <span>{{player.senderIdentity}}</span>
          </div>
        </div>

      </el-descriptions-item>
      <template #title>
         <span style="color: white" class="card-title">
             玩家身份卡
             <span class="card-buttom">双击进行修改点击外部以提交
               <svg
                 style="fill: currentColor; overflow: hidden; width: 0.8em; height: 0.8em;"
                 aria-hidden="true"
               >
              <use :xlink:href="`#icon-huoyan`"></use>
            </svg></span>
         </span>
      </template>
      <template #extra>
          <el-button type="text" @click="deletePlayer">
              <span style="font-size: 15px ;color: red"><el-icon><Delete /></el-icon> 删除</span>
          </el-button>
      </template>
    </el-descriptions>
  </div>

  <div class="cus-el-descriptions-role" v-else>
    <el-descriptions
      column="2"
      size="large"
      border
      style="opacity: 0.94;"
    >
      <el-descriptions-item
        class-name="player-content"
        :rowspan="1"
        label="角色头像（默认由系统生成）"
        align="center"
      >
        <el-tooltip v-if="player.agentAvatar !== ''" content="更换头像" placement="top">
          <template #content>
            <div>
              <span>点击图片更换头像</span>
              <span><el-button type="text" @click="handlePlayerCard"><span style="color: #7e64de;margin-top: -3px">删除头像</span></el-button></span>
            </div>
          </template>

          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="uploadAvatar"
            :limit="1"
          >
            <img v-if="player.agentAvatar !== ''" :src="player.agentAvatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-tooltip>
        <el-upload
          v-else
          class="avatar-uploader"
          :show-file-list="false"
          :http-request="uploadAvatar"
          :limit="1"
        >
          <img v-if="player.agentAvatar !== ''" :src="player.agentAvatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-descriptions-item>
      <el-descriptions-item
        label="角色名"
        class-name="player-content"
      >
        <template #label>
          <span>角色名<el-text type="danger" size="large">*</el-text></span>
        </template>
        <div class="input_area-xf">
          <el-input resize="none" show-word-limit rows="4" maxlength="10" type="textarea" v-model="player.agentName" placeholder="请输入角色姓名，例如：李四"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="1" class-name="player-content" label="角色类型">
        <div class="input_area-xf">
          <el-input resize="none" show-word-limit rows="3" maxlength="30" type="textarea" v-model="player.agentType" placeholder="请输入角色类型或人格，例如：工程师"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="1" class-name="player-content" label="角色描述">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="3" maxlength="50" v-model="player.agentDescription" placeholder="请输入角色描述，例如：李四是一个高级工程师"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item class-name="player-content" label="角色爱好">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="2" maxlength="50" v-model="player.hobby" placeholder="请输入角色的爱好"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item class-name="player-content" label="角色性格关键词">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="2" maxlength="50" v-model="player.keyPersonality" placeholder="请输入角色性别关键词，例如：勇敢，乐观"></el-input>
        </div>
      </el-descriptions-item>

      <el-descriptions-item class-name="player-content" label="角色社会身份描述" width="112" span="2">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="3" maxlength="300" v-model="player.agentIdentity" placeholder="请输入角色社会身份，使用名字来指代角色避免使用”你“”我“，例如：李四是一名高级工程师，同时担任宇宙联盟的特使，负责寻找和联络未知星系中的文明。"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="角色性格描述/生平经历">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="6" maxlength="300" v-model="player.personalityDescription" placeholder="请输入角色性格描述，使用名字来指代角色避免使用”你“”我“，例如：李四出生在一个多星球组成的和平联邦中，自幼对星际旅行充满了无限的憧憬。一次偶然的星际风暴经历让他失去了家人，但也因此被一位神秘的星际旅者所救，从此他决定成为一名探险家，以寻找新的星际文明为己任，希望能够连接更多的世界，促进宇宙间的理解和和平。星巴性格乐观、勇敢且充满好奇心，面对未知从不畏惧，总是第一个冲在前面。在团队中，他以其卓越的领导力和对未知的无畏探索而受到同伴们的尊敬。"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="场景任务描述">
        <template #label>
          <span>场景任务描述<el-text type="danger" size="large">*</el-text></span>
        </template>
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="4" maxlength="1000" v-model="player.mission" placeholder="请输入任务场景，例如：在一片未曾有人踏足过的星域，李四驾驶着他的飞船穿梭于星辰之间。突然，一道异常的空间波动吸引了他的注意，李四决定前往调查。"></el-input>
        </div>
      </el-descriptions-item>
      <template #title>
         <span style="color: white" class="card-title">
             角色身份卡
             <span class="card-buttom">点击外部以提交
               <svg
                 style="fill: currentColor; overflow: hidden; width: 0.8em; height: 0.8em;"
                 aria-hidden="true"
               >
              <use :xlink:href="`#icon-huoyan`"></use>
            </svg></span>
         </span>
      </template>
      <template #extra>
        <el-button type="text" @click="deleteRole">
          <span style="color: red;font-size: 15px"><el-icon><Delete /></el-icon> 删除</span>
        </el-button>
      </template>
    </el-descriptions>
  </div>

</template>
<style>



.label{
    height: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}


.avatar-uploader .el-upload:hover {
  border-color: #7e64de;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>



<style scoped>
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

/* 定义过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active 在 2.1.8 版本之前 */ {
  opacity: 0;
}

/* 如果你想让组件从左边滑入 */
.fade-enter-active, .fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active 在 2.1.8 版本之前 */ {
  opacity: 0;
  transform: translateX(-50px);
}

.cus-el-descriptions-role{
  margin-top: 10px;
  max-width: 700px;
  max-height: 800px;
  padding: 18px;
  box-shadow: 0 0 60px rgb(183, 35, 225); /* 提升卡片质感 */
  border-radius: 15px;
  color: #fff;
  position: relative; /* 确保内部元素定位正常 */
  background-image: url('../../../../src/assets/img/Lbg3.jpg'); /* 替换为实际花纹图 */
  background-size: cover; /* 使背景图案覆盖整个区域 */
  background-repeat: no-repeat; /* 防止重复 */
  background-blend-mode: overlay;
}

.cus-el-descriptions {
  margin-top: 10px;
  max-width: 500px;
  max-height: 700px;
  padding: 18px;
  box-shadow: 0 0 60px rgb(85, 2, 110); /* 提升卡片质感 */
  border-radius: 15px;
  color: #fff;
  position: relative; /* 确保内部元素定位正常 */
  background-image: url('../../../../src/assets/img/Lbg3.jpg'); /* 替换为实际花纹图 */
  background-size: cover; /* 使背景图案覆盖整个区域 */
  background-repeat: no-repeat; /* 防止重复 */
  background-blend-mode: overlay;
}
.card-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  background: linear-gradient(to right, #e0dfdf, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 5px;
  display: inline-block;
  border-bottom: 2px solid #b11ade;
}
.card-buttom {
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  background: linear-gradient(to right, #c54dec, #9521f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: -5px;
  display: inline-block;
}

.flashing-text {
  width: 230px;
  margin-right: 60px;
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #d440f3, #765ef6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 5px;
  display: inline-block;
  animation: flash 1.5s infinite;
}

/* 定义闪动动画 */
@keyframes flash {
  0%, 100% {
    opacity: 1; /* 初始和结束完全显示 */
  }
  50% {
    opacity: 0.3; /* 中间阶段透明度降低 */
  }
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.input_area-xf {
  padding: 0 10px;
  outline: none;
  width: 100%;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-all;
  position: relative; /* Add position relative for positioning */
  :deep(.el-textarea__inner) {
    box-shadow: none;
    color: #000000;
    background: transparent !important;
  }
  :deep(.el-input__count) {
    background: transparent !important;
    padding-bottom: -10px;
    color: #808080;
  }
  :deep(.el-textarea__inner::-webkit-input-placeholder) {
    color: #afafaf;
  }
}
</style>
