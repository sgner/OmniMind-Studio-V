
<!--  <el-row justify="center">-->
<!--     <el-col :span="20" >-->
<!--       <el-row justify="center">-->
<!--         <el-col :span="8">-->
<!--           <el-row>-->
<!--             <el-avatar src="">-->
<!--               <template #default>-->
<!--                 <el-image src=""></el-image>-->
<!--               </template>-->
<!--             </el-avatar>-->
<!--           </el-row>-->
<!--           <el-row>-->
<!--             点击上传玩家头像或默认由系统生成-->
<!--           </el-row>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <el-row style="margin-top: 30px">-->
<!--         <el-col :span="5">-->
<!--           玩家名称-->
<!--         </el-col>-->
<!--         <el-col :offset="3" :span="15" class="input_area-xf">-->
<!--           <el-input resize="none" show-word-limit rows="1" maxlength="10" type="textarea" v-model="name" placeholder="请输入玩家姓名，例如：张三"></el-input>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <el-row style="margin-top: 30px">-->
<!--         <el-col :span="5">-->
<!--          玩家类型-->
<!--         </el-col>-->
<!--         <el-col :offset="3" :span="15" class="input_area-xf">-->
<!--           <el-input resize="none" show-word-limit rows="2" maxlength="30" type="textarea" v-model="type" placeholder="请输入玩家类型，例如：一名程序员玩家"></el-input>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <el-row style="margin-top: 30px">-->
<!--         <el-col :span="5">-->
<!--            玩家描述-->
<!--         </el-col>-->
<!--         <el-col :offset="3" :span="15" class="input_area-xf">-->
<!--           <el-input v-model="description" placeholder="请输入玩家描述，主要描述玩家的特征，例如：张三，一名程序员"></el-input>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <el-row style="margin-top: 30px">-->
<!--         <el-col :span="5">-->
<!--           玩家身份描述-->
<!--         </el-col>-->
<!--         <el-col :offset="3" :span="15" class="input_area-xf">-->
<!--           <el-input v-model="senderIdentity" placeholder="请对玩家的身份，与角色的关系，使命进行描述,例如：张三和李四是同事，在一家公司上班。"></el-input>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <el-row justify="space-between">-->
<!--         <el-col :span="8">立即设定对话角色身份</el-col>-->
<!--         <el-col :span="8">-->
<!--           <el-switch v-model="agentD"></el-switch>-->
<!--         </el-col>-->
<!--       </el-row>-->
<!--       <div v-if="agentD">-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--             角色名称-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="agentName" placeholder="请输入角色姓名，例如：李四"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--             角色类型/人格-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="agentType" placeholder="请输入角色类型或人格，例如：工程师"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--             角色描述-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="agentDescription" placeholder="请输入角色描述，例如：李四是一个高级工程师"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--             角色社会身份-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="agentIdentity" placeholder="请输入角色社会身份，使用名字来指代角色避免使用”你“”我“，例如：李四是一名高级工程师，同时担任宇宙联盟的特使，负责寻找和联络未知星系中的文明。"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--            角色性格描述-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="personalityDescription" placeholder="请输入角色性格描述，使用名字来指代角色避免使用”你“”我“，例如：李四出生在一个多星球组成的和平联邦中，自幼对星际旅行充满了无限的憧憬。一次偶然的星际风暴经历让他失去了家人，但也因此被一位神秘的星际旅者所救，从此他决定成为一名探险家，以寻找新的星际文明为己任，希望能够连接更多的世界，促进宇宙间的理解和和平。星巴性格乐观、勇敢且充满好奇心，面对未知从不畏惧，总是第一个冲在前面。在团队中，他以其卓越的领导力和对未知的无畏探索而受到同伴们的尊敬。"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--             角色爱好-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="hobby" placeholder="请输入角色的爱好"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--              性格关键词-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="keyPersonality" placeholder="请输入角色性别关键词，例如：勇敢，乐观"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--         <el-row>-->
<!--           <el-col :span="5">-->
<!--              场景任务-->
<!--           </el-col>-->
<!--           <el-col :offset="3" :span="15">-->
<!--             <el-input v-model="mission" placeholder="请输入任务场景，例如：在一片未曾有人踏足过的星域，李四驾驶着他的飞船穿梭于星辰之间。突然，一道异常的空间波动吸引了他的注意，李四决定前往调查。"></el-input>-->
<!--           </el-col>-->
<!--         </el-row>-->
<!--       </div>-->
<!--       <el-row>-->
<!--         <el-button type="primary">立即创建</el-button>-->
<!--       </el-row>-->
<!--     </el-col>-->
<!--  </el-row>-->


<script setup>
import { onBeforeUnmount, ref } from 'vue'
import {Plus} from "@element-plus/icons-vue"
const name = ref('')
const type = ref('')
const description = ref('')
const senderIdentity = ref('')
const agentD = ref(false)
const agentName= ref('')
const agentType = ref('')
const agentDescription = ref('')
const agentIdentity = ref('')
const personalityDescription = ref('')
const hobby = ref('')
const keyPersonality = ref('')
const mission = ref('')
const imageSrc = ref('../../../../src/assets/img/arror.png')
const changeImage = (status)=>{
       if (status === 'hover'){
          imageSrc.value = '../../../../src/assets/img/arrorB.png'
       }else {
            imageSrc.value = '../../../../src/assets/img/arror.png'
       }
}
</script>

<template>
  <el-row>
    <div>
      <h1 class="flashing-text">注册一个玩家身份，以进行游戏  <svg
        style="fill: currentColor; overflow: hidden; width: 1em; height: 1em;"
        aria-hidden="true"
      >
        <use :xlink:href="`#icon-add`"></use>
      </svg>
        <svg
        style="fill: currentColor; overflow: hidden; width: 1em; height: 1em;"
        aria-hidden="true"
      >
        <use :xlink:href="`#icon-huoyan`"></use>
      </svg>

      </h1>
    </div>
  </el-row>
  <el-row>
     <el-col :span="21">
       <div class="el-descriptions">
       <el-descriptions
         column="2"
         size="large"
         border
         >
         <el-descriptions-item
           label-class-name="my-label"
           class-name="my-content"
           :rowspan="1"
           :width="140"
           label="玩家头像（默认由系统生成）"
           align="center"
         >
           <el-upload
             class="avatar-uploader"
             action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload"
           >
             <img v-if="imageUrl" :src="imageUrl" class="avatar" />
             <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
           </el-upload>
         </el-descriptions-item>
         <el-descriptions-item label="玩家名">
           <div class="input_area-xf">
             <el-input resize="none" show-word-limit rows="4" maxlength="10" type="textarea" v-model="name" placeholder="请输入玩家姓名，例如：张三"></el-input>
           </div>
         </el-descriptions-item>
         <el-descriptions-item span="2" label="玩家类型">
           <div class="input_area-xf">
             <el-input resize="none" show-word-limit rows="3" maxlength="30" type="textarea" v-model="type" placeholder="请输入玩家类型，例如：一名程序员玩家"></el-input>
           </div>
         </el-descriptions-item>
         <el-descriptions-item span="2" label="玩家描述">
           <div class="input_area-xf">
             <el-input type="textarea" resize="none" show-word-limit rows="3" maxlength="50" v-model="agentType" placeholder="请输入角色类型或人格，例如：工程师"></el-input>
           </div>
         </el-descriptions-item>
         <el-descriptions-item label="玩家身份描述" width="112" span="2">
           <div class="input_area-xf">
             <el-input type="textarea" resize="none" show-word-limit rows="6" maxlength="50" v-model="senderIdentity" placeholder="请对玩家的身份，与角色的关系，使命进行描述,例如：张三和李四是同事，在一家公司上班。"></el-input>
           </div>
         </el-descriptions-item>
         <template #title>
         <span style="color: white" class="card-title">
             玩家身份卡
         </span>
         </template>
       </el-descriptions>
     </div>
     </el-col>
    <el-col :span="2" style="position: absolute;top: 50%;left: 105%; transform: translate(-50%, -50%);">
      <div>
          <img  width="80" src="../../../assets/img/newPlayer.png">
      </div>
    </el-col>
    <el-col :span="2" style="position: absolute;top: 50%;left: 93%; transform: translate(-50%, -50%);">
      <div>
        <img  style="cursor: pointer"
              width="80"
              :src="imageSrc"
              @mouseover="changeImage('hover')"
              @mouseout="changeImage('default')">
      </div>
    </el-col>
  </el-row>
</template>
<style>

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
.el-descriptions {
  max-width: 900px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9); /* 提升卡片质感 */
  border-radius: 15px;
  color: #fff;
  position: relative; /* 确保内部元素定位正常 */
  background-image: url('../../../../src/assets/img/marbling-8620587_1280.png'); /* 替换为实际花纹图 */
  background-size: cover; /* 使背景图案覆盖整个区域 */
  background-repeat: no-repeat; /* 防止重复 */
  background-blend-mode: overlay;
}
.card-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(to right, #a85707, #2c2b2f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 5px;
  display: inline-block;
  border-bottom: 2px solid #794f1d;
}


.flashing-text {
  width: 180px;
  margin-right: 60px;
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #87289b, #463793);
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
:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}

</style>


