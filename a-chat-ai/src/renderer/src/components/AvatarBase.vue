<script setup>
import showLocalImage from '../components/LocaImage.vue'

const props =defineProps({
  id:{
    type: String,
  },
  avatar:{
    type: String,
    default: ''
  },
  width: {
    type:Number,
    default: 40
  },
  borderRadius:{
    type: Number,
    default: 40
  },
  showDetail:{
    type: Boolean,
    default: false
  }
})
const showDetailHandler = ()=>{
  if(!props.showDetail){
    return
  }
  //图片详情

}
</script>

<template>
  <div class="avatar" @click="showDetailHandler"
  :style="{width:width+'px',height:width+'px','border-radius':borderRadius+'px'}">
    <show-local-image
      :width="width"
      :file-id="id"
      :avatar="avatar"
      part-type="avatar"
      :force-get="true"
    >
    </show-local-image>
  </div>
</template>

<style scoped>
.avatar{
  background: #e3e3e3;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
</style>
