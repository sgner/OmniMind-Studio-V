<script setup>
import {computed, ref} from "vue";
import {getAvatarUrl} from "../api/ChatSessionMessageService";

const props =defineProps({
  width: {
    type:Number,
    default: 170
  },
  avatar:{
     type: String,
     default: ''
  },
  showPlay:{
    type: Boolean,
    default: false
  },
  fileId:{
    type: [String,Number]
  },
  partType:{
    type:String,
    default: 'avatar'
  },
  fileType:{
    type:Number,
    default: 0
  },
  forceGet:{
    type: Boolean,
    default: false
  }
})
const errorHandler = ()=>{
  console.log('error')
}
</script>

<template>
   <div class="image-panel" @click="showImageHandler">
       <el-avatar :src="avatar" shape="square" fit="cover" :size="width" @error="errorHandler">
            <svg
              style="fill: currentColor;overflow: hidden;width: 4em;height: 4em;"
              aria-hidden="true"
            >
              <use :xlink:href="`#icon-jiazaishibaishibai`"></use>
            </svg>
       </el-avatar>
   </div>
</template>

<style scoped>
.image-panel{
  position: relative;
  opacity: 1;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  background: #232323;
  .play-panel{
    z-index:2;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    display:flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
    .icon-video-play{
      font-size: 35px;
      color: #fff;
    }
    &:hover{
      opacity: 0.8;
    }
  }
}
</style>
