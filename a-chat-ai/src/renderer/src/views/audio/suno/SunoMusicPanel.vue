<script setup>
import {ref} from "vue";

const sunoResult = ref(
  {
      imageUrl: "",
      audio_url:"",
      createTime: "",
      id:"",
      title:"",
      lyric:""
  }
)
</script>

<template>
   <el-row>
       <div class="image-area">
           <el-image>

           </el-image>
       </div>
   </el-row>
</template>

<style scoped>

</style>
