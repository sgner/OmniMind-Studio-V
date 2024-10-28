<script setup>
const props = defineProps({
    status:{
       type: Number,
       default: 0
    },
    avatar:{
       type: String,
       default: ''
    },
    name:{
       type: String,
       default: ''
    }
})
import {useCollapsedStore} from "../../stores/Collapsed";
const collapsedStore = useCollapsedStore()
</script>

<template>
<el-row>
   <el-col :span="3">
      <el-avatar :src="avatar" :style="collapsedStore.collapse?'margin-left: 10px':''">
         <template #default>
           <el-image src="../../src/assets/img/loadF.png"></el-image>
         </template>
      </el-avatar>
   </el-col>
   <el-col :offset="4" :span="15">
     <transition name="fade">
        <span class="name" v-if="!collapsedStore.collapse">
         {{name}}
      </span>
     </transition>
   </el-col>
</el-row>
</template>

<style scoped>
.name{
  white-space: nowrap; /* 防止换行 */
  overflow: hidden;    /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <=2.1.8 */ {
  opacity: 0;
}
</style>
