<script setup>
import Base from "./Base.vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
const choose = ref('1');
const songTitle = ref('');
const lyrics = ref('');
const custom = ref(false);
import {QuestionFilled} from "@element-plus/icons-vue"
import MusicPlayerM from './player/MusicPlayerM.vue'
const inds = ref('1');
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

const myList = ref(
   [
    {
      artistsName: "SUNO-AI",
      cover:
        "../../../../../src/assets/img/bgisS2.jpg",
      id: 1857630559,
      name: "SUNO",
      url: "https://cdn1.suno.ai/fd83d529-b1e5-4d73-90df-deff9ba420c6.mp3",
      lyric:
        "\n[00:25.075]\n[00:25.189]是的我看见到处是阳光\n[00:29.156]快乐在城市上空飘扬\n[00:32.773]新世界来得像梦一样\n[00:36.689]让我暖洋洋\n[00:40.122]你的老怀表还在转吗\n[00:43.822]你的旧皮鞋还能穿吗\n[00:47.506]这儿有一支未来牌香烟\n[00:51.479]你不想尝尝吗\n[00:54.512]明天一早 我猜阳光会好\n[01:02.679]我要把自己打扫\n[01:05.896]把破旧的全部卖掉\n[01:09.212]哦这样多好 快来吧奔腾电脑\n[01:17.329]就让它们代替我来思考\n[01:27.229]穿新衣吧 剪新发型呀\n[01:31.347]轻松一下Windows98\n[01:35.048]打扮漂亮 18岁是天堂\n[01:39.064]我们的生活甜得像糖\n[01:42.431]穿新衣吧 剪新发型呀\n[01:46.098]轻松一下Windows98\n[01:49.914]以后的路不再会有痛苦\n[01:53.948]我们的未来该有多酷\n[02:12.481]是的我看见到处是阳光\n[02:16.164]快乐在城市上空飘扬\n[02:19.847]新世界来的像梦一样\n[02:23.748]让我暖洋洋\n[02:27.164]你的老怀表还在转吗\n[02:30.815]你的旧皮鞋还能穿吗\n[02:34.614]这儿有一支未来牌香烟\n[02:38.448]你不想尝尝吗\n[02:41.548]明天一早我猜阳光会好\n[02:49.898]我要把自己打扫\n[02:53.564]把破旧的全部卖掉\n[02:56.198]哦这样多好 快来吧奔腾电脑\n[03:04.598]就让它们代替我来思考\n[03:11.081]\n[03:11.414]穿新衣吧剪新发型呀\n[03:14.698]轻松一下Windows98\n[03:18.264]打扮漂亮18岁是天堂\n[03:22.481]我们的生活甜得像糖\n[03:25.964]穿新衣吧剪新发型呀\n[03:29.515]轻松一下Windows98\n[03:33.264]以后的路不再会有痛苦\n[03:37.681]我们的未来该有多酷",
    }, {
      artistsName: "SUNO-AI",
      cover:
        "../../../../../src/assets/img/bgisS2.jpg",
      id: 1857630551,
      name: "SUNO2",
      url: "https://cdn1.suno.ai/fd83d529-b1e5-4d73-90df-deff9ba420c6.mp3",
      lyric:
        "\n[00:25.075]\n[00:25.189]是的我看见到处是阳光\n[00:29.156]快乐在城市上空飘扬\n[00:32.773]新世界来得像梦一样\n[00:36.689]让我暖洋洋\n[00:40.122]你的老怀表还在转吗\n[00:43.822]你的旧皮鞋还能穿吗\n[00:47.506]这儿有一支未来牌香烟\n[00:51.479]你不想尝尝吗\n[00:54.512]明天一早 我猜阳光会好\n[01:02.679]我要把自己打扫\n[01:05.896]把破旧的全部卖掉\n[01:09.212]哦这样多好 快来吧奔腾电脑\n[01:17.329]就让它们代替我来思考\n[01:27.229]穿新衣吧 剪新发型呀\n[01:31.347]轻松一下Windows98\n[01:35.048]打扮漂亮 18岁是天堂\n[01:39.064]我们的生活甜得像糖\n[01:42.431]穿新衣吧 剪新发型呀\n[01:46.098]轻松一下Windows98\n[01:49.914]以后的路不再会有痛苦\n[01:53.948]我们的未来该有多酷\n[02:12.481]是的我看见到处是阳光\n[02:16.164]快乐在城市上空飘扬\n[02:19.847]新世界来的像梦一样\n[02:23.748]让我暖洋洋\n[02:27.164]你的老怀表还在转吗\n[02:30.815]你的旧皮鞋还能穿吗\n[02:34.614]这儿有一支未来牌香烟\n[02:38.448]你不想尝尝吗\n[02:41.548]明天一早我猜阳光会好\n[02:49.898]我要把自己打扫\n[02:53.564]把破旧的全部卖掉\n[02:56.198]哦这样多好 快来吧奔腾电脑\n[03:04.598]就让它们代替我来思考\n[03:11.081]\n[03:11.414]穿新衣吧剪新发型呀\n[03:14.698]轻松一下Windows98\n[03:18.264]打扮漂亮18岁是天堂\n[03:22.481]我们的生活甜得像糖\n[03:25.964]穿新衣吧剪新发型呀\n[03:29.515]轻松一下Windows98\n[03:33.264]以后的路不再会有痛苦\n[03:37.681]我们的未来该有多酷",
    },{
      artistsName: "SUNO-AI",
      cover:
        "../../../../../src/assets/img/bgisS2.jpg",
      id: 1857630552,
      name: "SUNO3",
      url: "https://cdn1.suno.ai/fd83d529-b1e5-4d73-90df-deff9ba420c6.mp3",
      lyric:
        "\n[00:25.075]\n[00:25.189]是的我看见到处是阳光\n[00:29.156]快乐在城市上空飘扬\n[00:32.773]新世界来得像梦一样\n[00:36.689]让我暖洋洋\n[00:40.122]你的老怀表还在转吗\n[00:43.822]你的旧皮鞋还能穿吗\n[00:47.506]这儿有一支未来牌香烟\n[00:51.479]你不想尝尝吗\n[00:54.512]明天一早 我猜阳光会好\n[01:02.679]我要把自己打扫\n[01:05.896]把破旧的全部卖掉\n[01:09.212]哦这样多好 快来吧奔腾电脑\n[01:17.329]就让它们代替我来思考\n[01:27.229]穿新衣吧 剪新发型呀\n[01:31.347]轻松一下Windows98\n[01:35.048]打扮漂亮 18岁是天堂\n[01:39.064]我们的生活甜得像糖\n[01:42.431]穿新衣吧 剪新发型呀\n[01:46.098]轻松一下Windows98\n[01:49.914]以后的路不再会有痛苦\n[01:53.948]我们的未来该有多酷\n[02:12.481]是的我看见到处是阳光\n[02:16.164]快乐在城市上空飘扬\n[02:19.847]新世界来的像梦一样\n[02:23.748]让我暖洋洋\n[02:27.164]你的老怀表还在转吗\n[02:30.815]你的旧皮鞋还能穿吗\n[02:34.614]这儿有一支未来牌香烟\n[02:38.448]你不想尝尝吗\n[02:41.548]明天一早我猜阳光会好\n[02:49.898]我要把自己打扫\n[02:53.564]把破旧的全部卖掉\n[02:56.198]哦这样多好 快来吧奔腾电脑\n[03:04.598]就让它们代替我来思考\n[03:11.081]\n[03:11.414]穿新衣吧剪新发型呀\n[03:14.698]轻松一下Windows98\n[03:18.264]打扮漂亮18岁是天堂\n[03:22.481]我们的生活甜得像糖\n[03:25.964]穿新衣吧剪新发型呀\n[03:29.515]轻松一下Windows98\n[03:33.264]以后的路不再会有痛苦\n[03:37.681]我们的未来该有多酷",
    },
  ]
)

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
                       v-model="lyrics"
                       show-word-limit
                       maxlength="200"
                       placeholder="请输入风格"></el-input>
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
                      v-model="lyrics"
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
           <el-button style="width: 150px" type="goon">
             开始创作
             <svg
               style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;margin-left: 7px"
               aria-hidden="true"
             >
               <use :xlink:href="`#icon-yuanshengchuangzuo`"></use>
             </svg>
           </el-button>
         </el-col>
      </el-row>
    </template>
     <template #right-show>
          <el-row  justify="center" style="padding-top: 15px">
              <el-col :span="18" class="input-right">
                  <el-input placeholder="搜索创作的歌曲">
                  </el-input>
              </el-col>
          </el-row>
         <MusicPlayerM :song-list-props="myList"></MusicPlayerM>
     </template>
 </Base>
</template>

<style lang="scss" scoped>
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
