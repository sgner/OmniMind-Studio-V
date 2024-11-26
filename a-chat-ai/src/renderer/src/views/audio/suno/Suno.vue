<script setup>
import Base from "./Base.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useShowPlayerStore } from '../../../stores/ShowPlayer'
import {genSunoMusicService} from '../../../api/SunoService'
import { useGenResponse } from '../../../stores/GenResponse'
import { useSunoMusicList } from '../../../stores/SunoMusicList'
const choose = ref('1');
const songTitle = ref('');
const lyrics = ref('');
const prompt = ref('');
const custom = ref(false);
import {QuestionFilled} from "@element-plus/icons-vue"
import MusicPlayerM from './player/MusicPlayerM.vue'
import { getSunoMusicService } from '../../../api/SunoService'
import SunoMusicPanel from './SunoMusicPanel.vue'
const inds = ref(false);
const customGenres = ref();
const selectedGenres = ref('流行');
const genres = [
  "流行",
  "摇滚",
  "爵士",
  "蓝调",
  "古典",
  "电子",
  "嘻哈",
  "乡村",
  "雷鬼",
  "民谣",
  "舞曲",
  "重金属"
];
const selectMoon = ref('欢乐')
const moons = [
  "欢乐",
  "伤感",
  "治愈",
  "安静",
  "励志",
  "寂寞",
  "思念",
  "宣泄",
  "甜蜜"
]
const props = defineProps({
       sessionId: {
          type: String,
          default: ''
       }
})

watch(()=>selectedGenres.value,(news)=>{
   console.log(news)
})
const scrollHeight = ref(768);

const updateScrollHeight = () => {
  const offset = 120;
  scrollHeight.value = window.innerHeight - offset;
};
const login = ref()
onMounted(() => {
  updateScrollHeight();
  window.addEventListener("resize", updateScrollHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScrollHeight);
});

const sunoMusicListStore = useSunoMusicList()
const getMusicList = async ()=>{
    const result = await getSunoMusicService();
    // sunoMusicListStore.musicList = result.data
    const resultLen = result.data.length;
    const storeLen = sunoMusicListStore.musicList.length;
    console.log(resultLen , storeLen)
    console.log(JSON.stringify(result.data))
   if(storeLen>0 && sunoMusicListStore.musicList[0].status === 'gen'){
            if(resultLen >= storeLen){
               sunoMusicListStore.musicList = result.data
            }
   }else{
       if(resultLen !== storeLen){
         sunoMusicListStore.musicList = result.data
       }
   }
}
getMusicList()
const openPlayer = ref(false)

const showPlayerStore = useShowPlayerStore()
const openIndex = ref()
watch(()=>showPlayerStore.showPlayer,(newPlay)=>{
          console.log(newPlay.show)
         openPlayer.value = newPlay.show;
         openIndex.value = newPlay.index;
},{deep:true})

const genSunoMusic = async ()=>{
  const result =  await genSunoMusicService(choose.value,{
        type: choose.value === '1'? 'sunoCustomDTO':'sunoFastDTO',
        make_instrumental:  inds.value,
        sessionId: props.sessionId,
        prompt: choose.value ==='1'? lyrics.value: prompt.value,
        tags:  choose.value === '1'? custom.value? customGenres.value : selectedGenres.value + "," + selectMoon.value : '',
        title: songTitle.value
    })
  if(result.code === 20000){
        sunoMusicListStore.musicList.unshift({
              title: '正在生成中',
              status: 'gen'
        })
  }
}

watch(()=>sunoMusicListStore.musicList,(s)=>{
           console.log(JSON.stringify(s))
})
</script>
<template>
 <Base>
    <template #left-panel>
     <div :style="{height: scrollHeight+'px'}" class="scrollbar">
       <el-row>
         <el-col>
           <el-row>
             <el-col>
               <el-text class="option">创作模型</el-text>
             </el-col>
           </el-row>
           <el-row style="margin-top: 5px">
             <div class="suno-art">
               <span class="suno-model">suno-3.5</span>
             </div>
           </el-row>
         </el-col>
       </el-row>
       <el-row style="margin-top: 15px;">
         <el-col style="align-content: center" :span="5">
           <el-text class="option">创作模式</el-text>
         </el-col>
         <el-col :span="2">
           <el-button type="text" style="font-size: 16px; margin-top: 1px;">
             <el-icon><QuestionFilled /></el-icon>
           </el-button>
         </el-col>
         <el-col :span="15" :offset="2">
           <el-radio-group class="moder" v-model="choose" style="margin-left: 7px">
             <el-radio-button value="1" label="专业模式" border></el-radio-button>
             <el-radio-button value="2" label="简易模式" border></el-radio-button>
           </el-radio-group>
         </el-col>
       </el-row>
       <div :style="{height: scrollHeight}" class="scrollbar" v-if="choose === '1'">
         <el-row style="margin-top: 15px">
           <el-col>
             <el-row>
               <el-text class="option">歌曲名</el-text>
             </el-row>
             <el-row style="margin-top: 5px" class="input_area">
               <el-input type="textarea"
                         spellcheck="true"
                         rows="1"
                         resize="none"
                         v-model="songTitle"
                         show-word-limit
                         maxlength="30"
                         placeholder="请输入歌曲名"></el-input>
             </el-row>
           </el-col>
         </el-row>
         <el-row style="margin-top: 10px">
           <el-col>
             <el-row>
               <el-col :span="5">
                 <el-text class="option">歌曲歌词</el-text>
               </el-col>
               <el-col :span="2">
                 <el-button type="text" style="font-size: 16px; margin-top: -5px">
                   <el-icon><QuestionFilled /></el-icon>
                 </el-button>
               </el-col>
             </el-row>
             <el-row style="margin-top: 5px" class="input_area">
               <el-input type="textarea"
                         spellcheck="true"
                         rows="13"
                         resize="none"
                         v-model="lyrics"
                         show-word-limit
                         maxlength="1200"
                         placeholder="请输入歌词"></el-input>
             </el-row>
           </el-col>
         </el-row>
         <el-row justify="space-between" style="margin-top: 10px">
           <el-col :span="7">
             <el-text class="option">自定义风格</el-text>
           </el-col>
           <el-col :span="4" style="margin-top: -3px;">
             <el-switch
               inline-prompt
               v-model="custom"
               active-text="开启"
               inactive-text="关闭"
             ></el-switch>
           </el-col>
         </el-row>
         <div v-if="!custom">
           <el-row>
             <el-text class="option">
               歌曲流派
             </el-text>
           </el-row>
           <el-row gutter="10" style="margin-top: 3px; margin-left: 5px" class="formCss">
             <el-col :span="8" v-for="(genre, index) in genres" :key="index" style="margin-top: 15px">
               <el-radio-group class="style-s" v-model="selectedGenres" fill="transparent">
                 <el-radio-button :value="genre" :label="genre">{{ genre }}</el-radio-button>
               </el-radio-group>
             </el-col>
           </el-row>
           <el-row style="margin-top: 5px">
             <el-text class="option">
               心情
             </el-text>
           </el-row>
           <el-row gutter="10" style="margin-top: 3px; margin-left: 5px" class="formCss">
             <el-col :span="8" v-for="(moon, index) in moons" :key="index" style="margin-top: 15px">
               <el-radio-group class="style-s" v-model="selectMoon" fill="transparent">
                 <el-radio-button :value="moon" :label="moon">{{ moon }}</el-radio-button>
               </el-radio-group>
             </el-col>
           </el-row>
         </div>
         <div v-else>
           <el-row style="margin-top: 15px">
             <el-col :span="5">
               <el-text class="option">
                 歌曲风格
               </el-text>
             </el-col>
             <el-col :span="2">
               <el-button type="text" style="font-size: 16px; margin-top: -5px">
                 <el-icon><QuestionFilled /></el-icon>
               </el-button>
             </el-col>
           </el-row>
           <el-row class="input_area" style="margin-top: 10px">
             <el-input type="textarea"
                       spellcheck="true"
                       rows="8"
                       resize="none"
                       v-model="customGenres"
                       show-word-limit
                       maxlength="200"
                       placeholder="请输入风格,风格之间使用逗号分割"></el-input>
           </el-row>
         </div>
       </div>
       <div v-else>
         <el-row style="margin-top: 15px">
           <el-col :span="5">
             <el-text class="option">
               歌曲描述
             </el-text>
           </el-col>
           <el-col :span="2">
             <el-button type="text" style="font-size: 16px; margin-top: -5px">
               <el-icon><QuestionFilled /></el-icon>
             </el-button>
           </el-col>
         </el-row>
          <el-row class="input_area" style="margin-top: 10px">
            <el-input type="textarea"
                      spellcheck="true"
                      rows="13"
                      resize="none"
                      v-model="prompt"
                      show-word-limit
                      maxlength="200"
                      placeholder="请输入描述"></el-input>
          </el-row>
         <el-row justify="space-between" style="margin-top: 10px">
           <el-col :span="7">
             <el-text class="option">纯音乐</el-text>
           </el-col>
           <el-col :span="4" style="margin-top: -3px;">
             <el-switch
               inline-prompt
               v-model="inds"
               active-text="开启"
               inactive-text="关闭"
             ></el-switch>
           </el-col>
         </el-row>
       </div>
     </div>
      <el-row class="bottom-btn-container">
         <el-col :span="6">
           <el-tooltip
              content="一次创作，会生成两首歌，请耐心等待！"
           >
             <el-button style="width: 150px" type="goon" @click="genSunoMusic">
               开始创作
               <svg
                 style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;margin-left: 7px"
                 aria-hidden="true"
               >
                 <use :xlink:href="`#icon-yuanshengchuangzuo`"></use>
               </svg>
             </el-button>
           </el-tooltip>
         </el-col>
      </el-row>
    </template>
     <template #right-show>
          <el-row v-if="!openPlayer"  justify="center" style="padding-top: 15px">
              <el-col :span="18" class="input-right">
                  <el-input placeholder="搜索创作的歌曲">
                  </el-input>
              </el-col>
          </el-row>

       <el-scrollbar v-show="!openPlayer" style="height: calc(100vh - 130px);width: 100%;margin-top: 25px">
           <el-row  class="song-grid" >
               <div v-for="(song,index) in sunoMusicListStore.musicList">
                 <SunoMusicPanel :song="song" :index="index"></SunoMusicPanel>
               </div>

           </el-row>
       </el-scrollbar>
         <transition name="drawer" mode="in-out">
       <div style="margin-top: 15px" v-if="openPlayer">
         <MusicPlayerM :key="openIndex" :song-list-props="sunoMusicListStore.musicList" :index-props="openIndex"></MusicPlayerM>
       </div>
       </transition>
     </template>
 </Base>
</template>

<style lang="scss" scoped>
@keyframes slide-up {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  25% {
    transform: translateY(75%);
    opacity: 0.5;
  }
  50% {
    transform: translateY(50%);
    opacity: 0.75;
  }
  75% {
    transform: translateY(25%);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.drawer-enter-active {
  animation: slide-up 0.6s ease-out forwards;
}

.drawer-leave-active {
  animation: slide-down 0.6s ease-out forwards;
}

@keyframes slide-down {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

.song-grid{
  margin-left: 20px;
  margin-top: 60px;
  display: grid;
  grid-gap: 10px;
  overflow-y: auto;
  grid-template-columns: repeat(1, 1fr);
}
.song-grid .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.song-grid ::-webkit-scrollbar{
    display: none;
}
@media (min-width: 1468px){
   .song-grid{
     grid-template-columns: repeat(3, 1fr);
   }
}
@media (min-width: 1782px) {
  .song-grid{
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 2166px) {
  .song-grid{
    grid-template-columns: repeat(5, 1fr);
  }
}
.bottom-show {
  visibility: visible;
  opacity: 1;
}
.bottom-visible {
  visibility: hidden;
  opacity: 0;
}
.bottom-btn-container {
  position: absolute;
  bottom: 0;
  left: 40%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0; /* 调整按钮上下间距 */
}
.scrollbar{
    overflow-y: auto;
}
.scrollbar::-webkit-scrollbar {
  display: none;
}
//:deep(.el-checkbox-button){
//  background: transparent;
//  border: none;
//}
//:deep(.el-checkbox-button :hover){
//  border: 1px solid;
//  color: #a793ff;
//  border-image: linear-gradient(to right, #ee8bff 0%, #a17eff 100%) 1;
//}
//:deep(.el-checkbox-button__inner){
//  border: 1px solid #372d59;
//  background: transparent;
//  color: white;
//  width: 85px;
//  height: 35px;
//}
//:deep(.el-checkbox-button.is-active) {
//  background: transparent;
//}
//
///* 选中后的样式 */
//:deep(.el-checkbox-button.is-checked) {
//  background: linear-gradient(to right, #b56bc2 0%, #886bd7 100%);
//  color: white;
//}

.input-right{
  :deep(.el-input__inner) {
    color: white;
  }

  :deep(.el-input__wrapper) {
    background-color: #000000;
    border: 2px solid;
    border-image: linear-gradient(to right, #95579f 0%, #6a51a9 100%) 1;
    box-shadow: 0 0 0 0;
  }

  :deep(input::-webkit-input-placeholder) {
    color: #d7d5d5;
  }
}
.input_area {
  padding: 0 10px;
  outline: none;
  width: 100%;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-all;
  position: relative; /* Add position relative for positioning */
  :deep(.el-textarea__inner) {
    border: 2px solid #a88fe8;
    box-shadow: none;
    color: white;
    background: #000000;
  }
  :deep(.el-input__count) {
    background: transparent !important;
    color: #a894f5;
  }
}

.option{
    color: #ffffff;
   align-content: center;
    font-size: 15px;
    margin-left: 2px;
    font-weight: bold;
}
.moder{
  :deep(.el-radio-button__inner){
    background: transparent;
    border: 2px solid;
    border-image: linear-gradient(to right, #95579f 0%, #6a51a9 100%) 1;
    border-radius: 0;
    font-size: 14px;
    font-weight: normal;
    color: #ffffff;
    text-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.73);
  }
  :deep(.el-radio-button:last-child .el-radio-button__inner){
    border-radius: 0;
    font-weight: bold;
    width: 85px;
  }
  :deep(.el-radio-button:first-child .el-radio-button__inner){
    border-radius: 0;
    font-weight: bold;
    width: 85px;
  }
  :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
    background: transparent;
  }
}
.style-s{
  :deep(.el-radio-button__inner){
    background: transparent;
    border: #383737 1px solid;
    border-radius: 10px;
    font-size: 14px;
    font-weight: normal;
    color: #ffffff;
    text-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.73);
  }
  :deep(.el-radio-button__inner){
    border-radius: 0;
    font-weight: bold;
    width: 85px;
  }
  :deep(.el-radio-button :hover){
     border: 1px solid;
     border-image: linear-gradient(to right, #ee8bff 0%, #a17eff 100%) 1;
  }
  :deep(.el-radio-button.is-active){
     border: 2px solid;
     border-image: linear-gradient(to right, #ee8bff 0%, #a17eff 100%) 1;

  }
  /* 右下角的三角形背景 */
  :deep(.el-radio-button.is-active)::before {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 25%; /* 控制三角形大小，与按钮右下角重合 */
    height: 65%; /* 控制三角形大小，与按钮右下角重合 */
    background: linear-gradient(to right, #ee8bff 0%, #a17eff 100%); /* 三角形的背景颜色 */
    clip-path: polygon(100% 0, 0 100%, 100% 100%); /* 生成右下角三角形 */
  }
  /* 右下角的选中图标 */
  :deep(.el-radio-button.is-active)::after {
    content: "✔"; /* 使用 Unicode 字符或自定义图标 */
    position: absolute;
    bottom: 0; /* 调整图标位置 */
    right: 2px;
    font-size: 12px; /* 图标大小 */
    color: white; /* 图标颜色 */
  }
}
.suno-art{
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;
  border-radius: 10px;border: #7e64de 3px solid;
   width: 100%;
   height: 70px;
   background-image: url("../../../assets/img/sunoart.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.suno-model{
   align-content: center;
   font-size: 35px;
   color: #ffffff;
   font-weight: bold;
   text-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.73);
   font-family: 'Papyrus', fantasy;
}


.el-button--goon.is-active,
.el-button--goon:active {
  background: linear-gradient(to right, #ee8bff 0%, #a17eff 100%);
  border-color: #c69bff;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: linear-gradient(to right, #ee8bff 0%, #a17eff 100%);
  border-color: #c69bff;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background: linear-gradient(to right, #ee8bff 0%, #a17eff 100%);
  border: 2px solid #5a4079;
  border-radius: 10px;
  width: 70%;
}
</style>
