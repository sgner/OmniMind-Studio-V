<script setup>
import {deleteUploadAvatarService, uploadAvatarService} from "../../../api/UserService";

const props = defineProps({
      data: {
         type: Object,
         default: {}
      },
      role:{
         type: Boolean,
         default: false
      }
})

const uploadAvatar = async ({ file })=>{
  const fromData = new FormData();
  fromData.append('avatar',file)
  const result =  await uploadAvatarService(fromData)
  if(!props.role){
    console.log(result.data)
    props.data.playerAvatar = result.data[0];
  }else {
    props.data.agentAvatar = result.data[0];
  }
}

const handlePlayerCard = async ()=>{
  if(props.data.playerAvatar !== ''){
    const regex = /\/([a-f0-9\-]{36})\.png$/;
    const match = props.data.playerAvatar.match(regex);
    await deleteUploadAvatarService(match[1])
    props.data.playerAvatar = ''
  }
}
import {Plus} from "@element-plus/icons-vue";
</script>

<template>
  <div class="cus-el-descriptions" v-if="!role">
    <el-descriptions
      column="2"
      size="large"
      border
      style="opacity: 0.94;"
    >
      <el-descriptions-item
        class-name="player-content"
        :rowspan="1"
        :width="140"
        label="玩家头像（默认由系统生成）"
        align="center"
      >
        <el-tooltip v-if="data.playerAvatar !== ''" placement="top">
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
            <img v-if="data.playerAvatar!== ''" :src="data.playerAvatar" class="avatar" />
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
          <img v-if="data.playerAvatar!== ''" :src="data.playerAvatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-descriptions-item>
      <el-descriptions-item
        label="玩家名"
        class-name="player-content"
      >
        <template #label>
          <span>玩家名<el-text type="danger" size="large">*</el-text></span>
        </template>
        <div class="input_area-xf">
          <el-input resize="none" show-word-limit rows="4" maxlength="10" type="textarea" v-model="data.playerName" placeholder="请输入玩家姓名，例如：张三"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="玩家类型">
        <div class="input_area-xf">
          <el-input resize="none" show-word-limit rows="3" maxlength="30" type="textarea" v-model="data.playerType" placeholder="请输入玩家类型，例如：一名程序员玩家"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="玩家描述">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="4" maxlength="300" v-model="data.description" placeholder="请输入玩家描述 ，例如：张三，一名程序员"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item class-name="player-content" label="玩家身份描述" width="112" span="2">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="6" maxlength="300" v-model="data.senderIdentity" placeholder="请对玩家的身份，与角色的关系，使命进行描述,例如：张三和李四是同事，在一家公司上班。"></el-input>
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
    </el-descriptions>
  </div>


  <div class="cus-el-descriptions" v-else>
    <el-descriptions
      column="2"
      size="large"
      border
      style="opacity: 0.94;"
    >
      <el-descriptions-item
        class-name="player-content"
        :rowspan="1"
        :width="140"
        label="角色头像（默认由系统生成）"
        align="center"
      >
        <el-tooltip v-if="data.agentAvatar !== ''" content="更换头像" placement="top">
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
            <img v-if="data.agentAvatar !== ''" :src="data.agentAvatar" class="avatar" />
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
          <img v-if="data.agentAvatar !== ''" :src="data.agentAvatar" class="avatar" />
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
          <el-input resize="none" show-word-limit rows="4" maxlength="10" type="textarea" v-model="data.agentName" placeholder="请输入角色姓名，例如：李四"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="1" class-name="player-content" label="角色类型">
        <div class="input_area-xf">
          <el-input resize="none" show-word-limit rows="3" maxlength="30" type="textarea" v-model="data.agentType" placeholder="请输入角色类型或人格，例如：工程师"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="1" class-name="player-content" label="角色描述">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="3" maxlength="50" v-model="data.agentDescription" placeholder="请输入角色描述，例如：李四是一个高级工程师"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item class-name="player-content" label="角色爱好">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="2" maxlength="50" v-model="data.hobby" placeholder="请输入角色的爱好"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item class-name="player-content" label="角色性格关键词">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="2" maxlength="50" v-model="data.keyPersonality" placeholder="请输入角色性别关键词，例如：勇敢，乐观"></el-input>
        </div>
      </el-descriptions-item>

      <el-descriptions-item class-name="player-content" label="角色社会身份描述" width="112" span="2">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="3" maxlength="300" v-model="data.agentIdentity" placeholder="请输入角色社会身份，使用名字来指代角色避免使用”你“”我“，例如：李四是一名高级工程师，同时担任宇宙联盟的特使，负责寻找和联络未知星系中的文明。"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="角色性格描述/生平经历">
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="6" maxlength="300" v-model="data.personalityDescription" placeholder="请输入角色性格描述，使用名字来指代角色避免使用”你“”我“，例如：李四出生在一个多星球组成的和平联邦中，自幼对星际旅行充满了无限的憧憬。一次偶然的星际风暴经历让他失去了家人，但也因此被一位神秘的星际旅者所救，从此他决定成为一名探险家，以寻找新的星际文明为己任，希望能够连接更多的世界，促进宇宙间的理解和和平。星巴性格乐观、勇敢且充满好奇心，面对未知从不畏惧，总是第一个冲在前面。在团队中，他以其卓越的领导力和对未知的无畏探索而受到同伴们的尊敬。"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" class-name="player-content" label="场景任务描述">
        <template #label>
          <span>场景任务描述<el-text type="danger" size="large">*</el-text></span>
        </template>
        <div class="input_area-xf">
          <el-input type="textarea" resize="none" show-word-limit rows="4" maxlength="1000" v-model="data.mission" placeholder="请输入任务场景，例如：在一片未曾有人踏足过的星域，李四驾驶着他的飞船穿梭于星辰之间。突然，一道异常的空间波动吸引了他的注意，李四决定前往调查。"></el-input>
        </div>
      </el-descriptions-item>
      <template #title>
         <span style="color: white" class="card-title">
           角色身份卡
           <span class="card-buttom">双击进行修改点击外部以提交
               <svg
                 style="fill: currentColor; overflow: hidden; width: 0.8em; height: 0.8em;"
                 aria-hidden="true"
               >
              <use :xlink:href="`#icon-huoyan`"></use>
            </svg></span>
         </span>
      </template>
    </el-descriptions>
  </div>
</template>

<style scoped>
.start-button{
  position: absolute;
  right: -5%;  /* 调整为适当的右侧距离 */
  top: 50%;
  transform: translateY(-50%);
}
.player-content {
  background: #f1f1f1;
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



.cus-el-descriptions {
  width: 100%;
  max-height: 900px;
  padding: 18px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 1); /* 提升卡片质感 */
  border-radius: 15px;
  color: #fff;
  position: relative; /* 确保内部元素定位正常 */
  background-image: url('../../../../src/assets/img/bcark.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
}
.card-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  background: linear-gradient(to right, #000000, #9d8e6c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 5px;
  display: inline-block;
  border-bottom: 2px solid #794f1d;
}
.card-buttom {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  background: linear-gradient(to right, #3f144d, #40066e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: -5px;
  display: inline-block;
}
.card-buttom:hover{
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  background: linear-gradient(to right, #c23def, #a539fd);
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
  width: 178px;
  height: 178px;
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
