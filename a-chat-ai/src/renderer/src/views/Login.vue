<script setup>
import {onMounted, ref} from "vue";
import {Loading,Avatar} from "@element-plus/icons-vue"
import Utils from "../utils/Utils";
import {ElMessage} from "element-plus";
import {useTemporaryIdStore} from "../stores/TemporaryId";
import {verifyService} from "../api/Verify";
import {registerService} from "../api/RegisterService";
import {loginService} from "../api/LoginService";
const errorMessage = (msg)=>{
   ElMessage.error(msg)
}
const successMessage = (msg)=>{
  ElMessage.success(msg)
}
const loginForm=ref({
  account:'',
  password:'',
  checkCode:'',
  temporaryId:''
})
const registerForm=ref({
  email:'',
  username:'',
  password:'',
  rePassword:'',
})
const loginFormClear = () => {
  loginForm.value = {
    account:'',
    password:'',
    checkCode:''
  }
  validateFailed.value = false
}
const registerFormClear = () => {
  registerForm.value = {
    email:'',
    username:'',
    password:'',
    rePassword:'',
  }

  validateRegisterFailed.value = false
}
import {useTokenStore} from "../stores/token";
import WinOp from "../components/WinOp.vue"; useTokenStore()
import {useUserInfoStore} from "../stores/UserInfo";
const router = useRouter()
const login = async () => {
  const q1 = validateLogin('验证码',loginForm.value.checkCode)
  const q2 =  validateLogin('密码',loginForm.value.password)
  const q3 = validateLogin('账户',loginForm.value.account)
  if(!q1&&!q2&&!q3){
    try{
      const temporaryIdStore = useTemporaryIdStore()
      const userInfoStore = useUserInfoStore()
      loginForm.value.temporaryId = temporaryIdStore.temporaryId;
      const loginResult = await loginService(loginForm.value)
      // successMessage("成功")
      const tokenStore = useTokenStore()
      tokenStore.setToken(loginResult.data.jwt)
      userInfoStore.userInfo = {userId:loginResult.data.userId,userName:loginResult.data.userName};
      validateFailed.value =  false
      await router.push({path:"/main",query:{}})
      preApi.routerToMain(null)
      preApi.successLogin(loginResult.data)
    }catch (e){
         loginForm.value.checkCode="";
         clickChangeImageVerify()
    }
  }else {
        clickChangeImageVerify()
        loginForm.value.checkCode = '';
       validateFailed.value = true
  }
}

const register = async () => {
  const q1 =  validateRegister('确认密码',registerForm.value.rePassword)
  const q2 = validateRegister('密码',registerForm.value.password)
  const q3 = validateRegister('邮箱',registerForm.value.email)
  const q4 = validateRegister('用户名',registerForm.value.username)
  if(!q1&&!q2&&!q3&&!q4){
    await registerService(registerForm.value)
    successMessage("成功")
    validateFailed.value = false
    clickToLogin();

  }else{
    validateRegisterFailed.value = true
  }
}

const checkCodeImage = ref()

const isLogin = ref(true)
const clickToRegister = () => {
  isLogin.value = false;
  registerFormClear()
}
const clickToLogin = () => {
  isLogin.value = true;
  loginFormClear()
}

const imageVerify = async ()=>{
  const temporaryIdStore = useTemporaryIdStore()
  let result
  try{
    result = await verifyService(temporaryIdStore.temporaryId)
  }catch(err){
    await verifyService(temporaryIdStore.temporaryId)
  }
  const codeResult = result.data
  checkCodeImage.value = codeResult.image;
  if(temporaryIdStore.temporaryId === ''){
    temporaryIdStore.setTemporaryId(codeResult.temporaryId)
  }
}
imageVerify()

const clickChangeImageVerify = ()=>{
     imageVerify()
}
const msg= ref()
const validateFailed = ref(false)
const validateLogin = (type,value) => {
    if(Utils.isEmpty(value)){
         msg.value = "请输入"+type
         validateFailed.value = true
      return true;
    }
    validateFailed.value = false
    return false;
};

const registerMsg = ref()
const validateRegisterFailed = ref(false)
const validateRegister = (type,value) => {
    if(Utils.isEmpty(value)){
         registerMsg.value = "请输入"+type
         validateRegisterFailed.value = true
      return true;
    }
    if(type === "用户名"){
      const usernameRegex = /^(?!\d+$)[\s\S]{5,12}$/u;
      if(!usernameRegex.test(value)){
          registerMsg.value = "用户名长度为5-12字符，不能为纯数字"
        validateRegisterFailed.value = true
        return true;
      }
    }
    if(type === "邮箱"){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(value)){
          registerMsg.value = "不支持的邮箱格式"
        validateRegisterFailed.value = true
        return true;
      }
    }
    if (type==="密码"){
      const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if(!passwordRegex.test(value)){
          registerMsg.value = "密码长度为8-16字符，必须包含大写字母、数字和特殊符号"
        validateRegisterFailed.value = true
        return true;
      }
    }

    if(type === "确认密码"){
      if(value !== registerForm.value.password){
          registerMsg.value = "两次密码不一致"
        validateRegisterFailed.value = true
        return true;
      }
    }

    validateRegisterFailed.value = false
    return false;
}
import Api from '../utils/Api'
import {useRouter} from "vue-router";
const init = ()=>{
   preApi.setLocalStore({key:'devWsDomain',value:Api.devWsDomain})
   preApi.setLocalStore({key:'prodDomain',value:Api.prodDomain})
   preApi.setLocalStore({key:'prodWsDomain',value:Api.prodWsDomain})
   preApi.setLocalStore({key:'devDomain',value:Api.devDomain})
}
onMounted(()=>{
     init()
})
</script>
<template>
  <div class="videoContainer">
    <div class="login-panel">
      <div class="title drag">A-AI</div>
    </div>
    <transition name="slide-fade" mode="out-in">
     <div v-if="isLogin">
      <el-row style="display: flex; align-items: center;">
        <el-col :span="5" :offset="3">
          <el-avatar size="large" src="../src/assets/img/rbot.svg"></el-avatar>
        </el-col>
        <el-divider direction="vertical" class="blinking-divider"/>
        <el-col :span="10" :offset="1">
          <transition name="bounce-up">
          <el-text
            :key="msg"
            :type="validateFailed ? 'danger' : 'primary'"
            size="large"
            tag="p"
            class="animated-text"
          >
            {{ validateFailed ? msg : 'Hi ~ 你好 ~' }}
          </el-text>
    </transition>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="10">
          <el-avatar size="large" src="../src/assets/img/avatar14.svg"></el-avatar>
        </el-col>
      </el-row>
      <div class="login-form">
        <el-form :model="loginForm">
          <el-form-item style="margin-top: 2em" prop="account">
            <el-row>
              <el-col :offset="5">
                <el-input maxlength="25" clearable placeholder="请输入邮箱/账号/用户名" v-model="loginForm.account" class="input_el">
                  <template #prefix>
                    <span class="iconfont icon-email"></span>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="password">
            <el-row>
              <el-col :offset="5">
                <el-input type="password" show-password clearable placeholder="请输入密码" v-model="loginForm.password" class="input_el">
                  <template #prefix>
                    <span class="iconfont icon-password"></span>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="checkCode">
            <el-row>
              <el-col :offset="5">
                <el-input placeholder="输入验证码" v-model="loginForm.checkCode" class="input_el">
                  <template #prefix>
                    <span class="iconfont icon-checkcode"></span>
                  </template>
                  <template #suffix>
                <span style="display: flex; align-items: center;width: 70px;height: 30px;margin-right: -11px;margin-top: 1px">
                  <el-image :src="checkCodeImage" @click="clickChangeImageVerify()" style="cursor: pointer;opacity: 0.6;border-radius: 12px; border: #7e64de 1px solid">
                    <template #error>
                      <div class="image-slot">
                       <el-icon><Loading /></el-icon>加载失败
                      </div>
                    </template>
                  </el-image>
                </span>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-row justify="center">
          <el-col :offset="7">
            <el-button class="login-btn" type="goon" @click="login()">登录</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 1em;">
          <el-col :span="4" :offset="2" style="margin-top: -15px;">
            <div style="cursor: pointer">
              <el-tooltip placement="right" effect="">
                <template #content>
                    <span style="color: white"> 使用二维码登录</span>
                </template>
                <el-image src="../src/assets/img/qr.svg" ></el-image>
              </el-tooltip>
            </div>

          </el-col>
          <el-col :span="6" :offset="10">
              <el-link type="warning" @click="clickToRegister()">没有账号?</el-link>
          </el-col>
      </el-row>
    </div>



    <div v-else>
      <el-row style="display: flex; align-items: center;">
         <el-col :span="5" :offset="3">
           <el-avatar size="large" src="../src/assets/img/rbot.svg"></el-avatar>
         </el-col>
        <el-divider direction="vertical" class="blinking-divider"/>
         <el-col :span="13" :offset="1">
           <transition name="bounce-up">
           <el-text
             :key="registerMsg"
             :type="validateRegisterFailed ? 'danger' : 'primary'"
             size="large"
             tag="p"
             class="animated-text"
           >
             {{ validateRegisterFailed ? registerMsg : 'Hi ~ 新用户' }}
           </el-text>
             </transition>
         </el-col>
      </el-row>

      <el-form :model="loginForm">
        <el-form-item style="margin-top: 2em">
          <el-row>
            <el-col :offset="5">
              <el-input clearable placeholder="请输入用户名" v-model="registerForm.username" class="input_el">
                <template #prefix>
                  <el-icon><Avatar /></el-icon>
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 2em">
          <el-row>
            <el-col :offset="5">
              <el-input clearable placeholder="请输入邮箱" v-model="registerForm.email" class="input_el">
                <template #prefix>
                  <span class="iconfont icon-email"></span>
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 2em">
          <el-row>
            <el-col :offset="5">
              <el-input type="password" show-password clearable placeholder="请输入密码" v-model="registerForm.password" class="input_el">
                  <template #prefix>
                    <span class="iconfont icon-password"></span>
                  </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 2em">
          <el-row>
            <el-col :offset="5">
              <el-input type="password" show-password clearable placeholder="请确认密码" v-model="registerForm.rePassword" class="input_el">
                <template #prefix>
                  <span class="iconfont icon-password"></span>
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row>

        <el-col :span="10" :offset="3">
        <el-button class="login-btn" type="goon" @click="register()">注册</el-button>
      </el-col>

          <el-col :span="6" :offset="3">
            <el-link type="warning" @click="clickToLogin();clickChangeImageVerify()">已有账号?</el-link>
          </el-col>
      </el-row>
     </div>
    </transition>
    <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
      <source src="../assets/img/185366-875417525_tiny.mp4" type="video/mp4">
    </video>
  </div>
  <WinOp :showSetTop="false" :show-min="false" :show-max="false" :close-type="0"></WinOp>
</template>


<style scoped>
.videoContainer{
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
}

.videoContainer:before{
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  background: rgba(25,29,34,.65);
}
.fullscreenVideo {
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
.email-select{
  width: 250px;
}
.loading-panel{
  height: calc(100vh - 32px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img{
    width: 300px;
  }
}

.input_el{
    width: 15em;
    color: #d7d5d5;
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__wrapper) {
  background-color: transparent;/*覆盖原背景颜色，设置成透明 */
  border-radius: 95px;
  border: 5px solid #826b9f;
  box-shadow: 0 0 0 0px;
}
:deep(input::-webkit-input-placeholder){
  color: #d7d5d5;
}
.drag{
  cursor: move;
}
  .login-panel{
    //background-image: url('../assets/img/panel.png');
    //border-radius: 5px;
    //border: 1px solid #ccc;
    .title{
      height: 29px;
      padding:5px 0 0 10px;
      color: white;
      font-size: 14px;
    }
    .login-form{
      padding: 0 15px 29px 15px;
      :deep(.el-input_wrapper){
        box-shadow: none;
        border-radius: 5px;
      }
      .el-from-item{
        border-bottom: 1px solid #ccc;
      }
      .email-panel{
        align-items: center;
        width: 100%;
        display: flex;
        .input{
          flex: 1;
        }
        .icon-down{
          margin-left:3px;
          width: 16px;
          cursor: pointer;
          border: none;
        }
      }
      .error-msg{
        line-height: 30px;
        height: 30px;
        color: #fb7373;
      }
      .check-code-panel{
        display: flex;
        .check-code{
          cursor: pointer;
          width: 120px;
          margin-left: 5px;
        }
      }
      .login-btn{
        background: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5));
        //background-image: linear-gradient(to right, #fff, #fff);
        border: 1px solid transparent;
      }
      .bottom-link{
        text-align: right;
      }
    }
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
  border-radius: 20px;
  width: 70%;
}

/* 定义进入和离开动画的基本样式 */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* 定义进入时的初始状态 */
.slide-fade-enter {
  transform: translateX(100%);
  opacity: 0;
}

/* 定义离开时的最终状态 */
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.box {
  padding: 20px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  margin: 10px 0;
}

.animated-text {
  display: inline-block;
}

.bounce-up-enter-active, .bounce-up-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* 关键是缓动效果，用于弹跳 */
}

.bounce-up-enter, .bounce-up-leave-to {
  transform: translateY(30px); /* 从30px下方开始或向上移出 */
  opacity: 0;
}

.bounce-up-enter-to, .bounce-up-leave {
  transform: translateY(0); /* 元素回到原位 */
  opacity: 1;
}

.blinking-divider {
  animation: blink 0.7s infinite; /* 1秒钟的闪烁动画，循环播放 */
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
