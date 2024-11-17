<script setup>
import {ref} from "vue";
const props  = defineProps({
    song:{
        type:Object,
        default:{}
    },
    index:{
        type:Number,
        default:0
    }
});
import { useShowPlayerStore } from '../../../stores/ShowPlayer'
const player = ()=>{
   console.log("play",props.index)
   const showPlayerStore = useShowPlayerStore();
    showPlayerStore.showPlayer ={
         index: props.index,
         show: true }
}
</script>

<template>
  <div class="bg-panel">
    <el-row>
      <div class="image-area">
        <el-image :src="song.image_url" style="cursor: pointer" @click="player"></el-image>
      </div>
    </el-row>
    <el-row>
      <span class="song-name">{{song.title}}</span>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="10">
        <el-row >
          <el-col  :span="6">
            <el-button type="complete">
              <el-text type="success"><span class="iconfont icon-wancheng"></span> 已完成</el-text>
            </el-button>
          </el-col>
          <el-col :span="6" :offset="12">
            <el-button type="play" @click="player"><el-text type="primary"><span class="iconfont icon-bofang"></span> 播放</el-text></el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" :offset="6">
        <el-row>
          <el-col :span="2">
            <el-button type="download"><span class="iconfont icon-xiazai"></span></el-button>
          </el-col>
          <el-col :span="2" :offset="10">
            <el-button type="del" > <span class="iconfont icon-shanchu"></span></el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
     <el-row justify="space-between"  style="margin-top: 12px">
         <el-col :span="5">
           <el-button type="model"><span class="iconfont icon-yinle"></span>SUNO</el-button>
         </el-col>
         <el-col :span="10">
          <el-text><span style="font-size: 18px ;font-weight: 600" class="iconfont icon-naozhong"></span> {{song.created_at}}</el-text>
         </el-col>
     </el-row>
  </div>
</template>

<style scoped>
.bg-panel {
  max-width: 300px;
  background: linear-gradient(to right, #1a1717 0%, #4a2854 100%) ; /* 设置背景颜色 */
  border: 1px solid #000000; /* 添加边框 */
  border-radius: 8px; /* 可选：圆角边框 */
  padding: 25px; /* 设置内部和边界的距离 */
  opacity: 0.95; /* 设置透明度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 可选：添加阴影 */
}
.image-area {
  max-width: 270px;
  margin-bottom: 16px; /* 让图片与下面内容有间距 */
}
.song-name {
  font-size: 16px;
  color: #afabab;
  font-weight: 600;
  margin-bottom: 16px; /* 歌曲名称和下面按钮区域的间距 */
}

.el-button--complete:hover {
  background: transparent;
  border-color: #63e04b;
  color: #fff;
}

.el-button--complete {
  color: #FFF;
  background: transparent;
  border: 2px solid #2a5233;
  border-radius: 5px;
  width: 64px;
}

.el-button--play:hover {
  background: transparent;
  border-color: #a161ff;
  color: #fff;
}

.el-button--play {
  color: #FFF;
  background: transparent;
  border: 2px solid #6e3aa1;
  border-radius: 5px;
  width: 64px;
}

.el-button--download:hover {
  background: transparent;
  border-color: #4f8ce7;
  color: #fff;
}

.el-button--download {
  color: #FFF;
  background: transparent;
  border: 2px solid #2d437c;
  border-radius: 5px;
  width: 30px;
}

.el-button--del:hover {
  background: transparent;
  border-color: #e33c3c;
  color: #fff;
}

.el-button--del {
  color: #bd2727;
  background: transparent;
  border: 2px solid #b74141;
  border-radius: 5px;
  width: 30px;
}


.el-button--model {
  color: #692eb2;
  background: transparent;
  border: 2px solid #7241b7;
  border-radius: 5px;
  width: 75px;
}
</style>
