<script setup>
import {nextTick, ref} from 'vue';
import{ZoomIn,Delete} from '@element-plus/icons-vue'
import {useUploadDataStore} from "../../stores/UploadData";
const props = defineProps({
  fileList: {
    type: Array,
    default: []
  },
  source:{
     type: Object,
     default: null
  },
  progress:{
     type: Number,
     default: 0
  },
  loading:{
     type: Object,
     default: {}
  },
  curSession:{
     type: Object,
     default: {}
  }
});
const uploadDataStore = useUploadDataStore()
const removeFile = (index) => {
 props.fileList =  uploadDataStore.removeDataByIndex(props.curSession.sessionId,index)
}
const showImgView = (fileSrc) => {
  nextTick(() => {
    const imgElement = document.querySelector(`img[name="${fileSrc}"]`); // 根据 name 查找元素
    if (imgElement) {
      imgElement.click(); // 点击目标图片
    }
  });
};
const cancelUpload = (index)=>{
     if(props.source!==null&&props.loading.value[index]){
        props.source.cancel();
       props.fileList =  uploadDataStore.removeDataByIndex(props.curSession.sessionId,index)
     }
}
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
const hoveredIndex = ref(null);
const cancelSvg = `
  <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" style="stroke: red; stroke-width: 4; fill: rgba(0, 0, 0, 0);" />
    <line x1="15" y1="15" x2="35" y2="35" style="stroke: red; stroke-width: 4;" />
    <line x1="35" y1="15" x2="15" y2="35" style="stroke: red; stroke-width: 4;" />
  </svg>
`;
</script>

<template>
   <div>
     <div :key="index" v-for="(file, index) in fileList" class="maskContainer previewBox">
       <div
         class="demo-image__preview"
         v-loading="loading[index]&&
         {text:hoveredIndex===index?'':progress===100?'解析中':'上传中',
         svg:hoveredIndex===index? cancelSvg:svg,
         svgViewBox:hoveredIndex===index?'0,0,50,50':'-10, -10, 50, 50',
         background:hoveredIndex===index?'rgba(105,0,0,0.2)':'rgba(30,30,30, 0.65'}"
         :class="{ 'cursor-pointer': loading }"
         @mouseover="hoveredIndex = index"
         @mouseout="hoveredIndex = null"
         @click="cancelUpload(index)"
       >
        <el-image
          loading="lazy"
          :src="file.src"
          :hide-on-click-modal="true"
          :preview-src-list="[file.src]"
          fit="contain"
          class="originalImg custom-loading-svg"
          :name="file.src"
        >
          <template #error>
            <svg
              style="overflow: hidden; width: 5.5em; height: 5.5em;"
              aria-hidden="true"
            >
              <use :xlink:href="`#icon-24gf-pictureSplit`"></use>
            </svg>
          </template>
        </el-image>
      </div>
       <div class="file-name" v-if="!loading[index]">{{ file.name }}</div>
       <div class="progress-bar" v-if="loading[index]">
         <div class="progress" :style="{ width: progress + '%' }"></div>
       </div>
      <div class="mask">
        <div class="zoomInImg svgBox" v-if="!loading[index]" @click="showImgView(file.src)">
          <el-icon size="20">
            <ZoomIn />
          </el-icon>
        </div>
        <div class="deleteImg svgBox" v-if="!loading[index]" @click="removeFile(index)">
          <el-icon size="20">
            <Delete />
          </el-icon>
        </div>
        </div>
     </div>
   </div>
</template>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer; /* 设置光标为手指形状 */
}
:deep(.file-name) {
  display: inline-block; /* 或 inline-block */
  color: #fff;
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 添加省略号 */
  width: 75px; /* 设置宽度 */
  height: 12px; /* 设置高度 */
  line-height: 12px;
  max-width: 75px; /* 添加最大宽度 */
}

.maskContainer {
  display: inline-block;
  position: relative;
  line-height: 0;
  width: 75px;
  height: 75px;
  margin-left: 20px;
  .demo-image__preview{
      width: 75px;
      height: 75px;
      position: relative;
  }
  .originalImg {
    width: 75px;
    height: 75px;
  }

  &:hover {
    .mask {
      opacity: 1;
    }

    img {
      transform: scale(1.1);
    }
  }

  .mask {
    transition: all 0.5s;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    .svgBox {
      height: 25px;
      width: 25px;
      background: rgb(#000,0.3);
      border-radius: 50%;
      margin: 3px;
      padding: 3px;
      cursor: pointer;
      span {
        color: #fff; /* 按钮文字颜色 */
        font-size: 10px; /* 按钮文字大小 */
      }
    }
    .zoomInImg,
    .deleteImg{
      color: #fff;
    }
  }
}
.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  margin-top: 4px;
}

.progress {
  height: 100%;
  background-color: #7559e0; /* 可以根据需要调整颜色 */
  border-radius: 2px;
}
</style>
