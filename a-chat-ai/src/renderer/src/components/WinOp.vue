<script setup>
import {onMounted, ref} from "vue";

const props = defineProps({
    showSetTop:{
      type: Boolean,
      default:true
    },
  showMin:{
      type:Boolean,
      default: true,
  },
  showMax:{
      type:Boolean,
      default: true
  },
  showClose:{
      type:Boolean,
      default: true
  },
  closeType:{
      type: Number,
      default: 1
  }
})

const emit = defineEmits(['closeCallback'])
const isMax = ref(false)
const isTop = ref(false)
onMounted(()=>{
     isMax.value = false
     isTop.value= false
})
const close = ()=>{
  preApi.winTitleOp('close',{closeType:props.closeType})
  emit('closeCallback')
}
const minimize=()=>{
     preApi.winTitleOp('minimize')
}
const maximize=()=>{
    if(isMax.value){
        preApi.winTitleOp('unmaximize')
        isMax.value = false
    }else {
        preApi.winTitleOp('maximize')
        isMax.value=true
    }
}
const top=()=>{
    isTop.value = !isTop.value
    preApi.winTitleOp('top',{top:isTop.value})
}
</script>

<template>
  <div class="win-op no-drag">
     <div
       v-if = "showSetTop"
       :class="['iconfont icon-top',isTop? 'win-top':'']"
       @click="top"
       :title="isTop ? '取消置顶':'置顶'"
     ></div>
    <div v-if="showMin" class="iconfont icon-min" @click="minimize" title="最小化"></div>
    <div
      v-if="showMax"
      :class="['iconfont',isMax ? 'icon-maximize': 'icon-max']"
      :title="isMax? '向下还原' : '最大化'"
      @click="maximize"
    ></div>
    <div v-if="showClose" class="iconfont icon-close" @click="close" title="关闭"></div>
  </div>
</template>

<style scoped>
.win-op{
  top:0;
  right:0;
  position: absolute;
  z-index:1;
  overflow: hidden;
  border-radius: 0 3px 0 0;
  .iconfont{
    float: left;
    font-size: 16px;
    color: #a08cf1;
    text-align: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
    height: 25px;
    align-items: center;
    padding: 0 10px;
    &:hover{
      background: #5f5f60;
    }
  }
  .icon-close{
    &:hover{
      background: #fb7373;
    }
  }
  .win-top{
    background: #ddd;
    color: #7e64de;
  }
}
</style>
