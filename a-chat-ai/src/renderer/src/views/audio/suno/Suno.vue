<script setup>
import Base from "./Base.vue";
import {ref, watch} from "vue";
const choose = ref('1');
const songTitle = ref('');
const lyrics = ref('');
const custom = ref();
import {QuestionFilled} from "@element-plus/icons-vue"

const selectedGenres = ref([]);
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

watch(()=>selectedGenres.value,(news)=>{
   console.log(news)
})
</script>

<template>
 <Base>
    <template #left-panel>
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
                 <el-radio-group  v-model="choose" style="margin-left: 7px">
                      <el-radio-button value="1" label="专业模式" border></el-radio-button>
                      <el-radio-button value="2" label="简易模式" border></el-radio-button>
                 </el-radio-group>
            </el-col>
          </el-row>
     <div>
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

        <el-row>
          <el-text class="option">
            歌曲流派
          </el-text>
        </el-row>
       <el-row gutter="10" style="margin-top: 10px; margin-left: 5px" class="formCss">
         <el-col :span="8" v-for="(genre, index) in genres" :key="index" style="margin-top: 15px">
           <el-checkbox-button v-model="selectedGenres" :label="genre">{{ genre }}</el-checkbox-button>
         </el-col>
       </el-row>

     </div>
    </template>
     <template #right-show>
123
     </template>
 </Base>
</template>

<style lang="scss" scoped>
:deep(.el-checkbox-button){
  background: transparent;
}
:deep(.el-checkbox-button :hover){
   background: #362e52;
}
:deep(.el-checkbox-button__inner){
  border: 1px solid;
  border-image: linear-gradient(to right, #95579f 0%, #6a51a9 100%) 1;
  background: transparent;
  color: white;
  width: 85px;
  height: 35px;
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
  border-left: 1px solid #8257ec;
}
:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: transparent;
}
:deep(.is-active .el-radio-button__inner){
    background: transparent;
    color: #522388;
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
</style>
