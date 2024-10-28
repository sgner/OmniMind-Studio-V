<script setup>
import {Delete, ZoomIn} from "@element-plus/icons-vue";
import {nextTick, ref, watchEffect} from "vue";

const props = defineProps({
  file: {
    type: Object,
    default: () => ({}),
  },
       index:{
         type: Number
       }
})


watchEffect(() => {
  if (props.file.fileType !== 1) {
    // 根据不同的 file.type 赋值 imageSrc
    switch (props.file.fileType) {
      case 2:
        props.file.imageSrc = "../../src/assets/img/vid.png";
        break;
      case 3:
        props.file.imageSrc = "../../src/assets/img/filei.png";
        break;
      case 4:
        props.file.imageSrc = "../../src/assets/img/adi.png";
        break;
      case 5:
        props.file.imageSrc = "../../src/assets/img/filei.png";
        break;
      case 6:
        props.file.imageSrc = "../../src/assets/img/zip.png";
        break;
      case 7:
        props.file.imageSrc = "../../src/assets/img/zip-1.png";
        break;
      case 8:
        props.file.imageSrc = "../../src/assets/img/Microsoft-Word.png";
        break;
      case 9:
        props.file.imageSrc = "../../src/assets/img/pptx.png";
        break;
      case 10:
        props.file.imageSrc = "../../src/assets/img/xlsx.png";
        break;
      case 11:
        props.file.imageSrc = "../../src/assets/img/-csv.png";
        break;
      default:
        props.file.imageSrc = "default_image_path"; // 其他类型的默认图像
    }
  } else {
    props.file.imageSrc = props.file.src;
  }
});
const showImgView = (fileSrc) => {
  nextTick(() => {
    const imgElement = document.querySelector(`img[name="${fileSrc}"]`); // 根据 name 查找元素
    if (imgElement) {
      imgElement.click(); // 点击目标图片
    }
  });
};
</script>

<template>
    <div class="maskContainer previewBox">
      <div
        class="demo-image__preview"
      >
        <el-image
          loading="lazy"
          :name="file.src"
          :src="file.imageSrc"
          :hide-on-click-modal="true"
          :preview-src-list="[file.src]"
          fit="contain"
          class="originalImg"
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
      <div class="file-name">{{ file.name }}</div>
      <div class="mask" v-if="file.fileType===1">
        <div class="zoomInImg svgBox" @click="showImgView(file.src)">
          <el-icon size="30">
            <ZoomIn />
          </el-icon>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.maskContainer {
  display: inline-block;
  position: relative;
  line-height: 0;
  width: 115px;
  height: 115px;
  margin-left: 20px;
  .demo-image__preview{
    width: 115px;
    height: 115px;
    position: relative;
  }
  .originalImg {
    width: 115px;
    height: 115px;
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
      height: 35px;
      width: 35px;
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
  width: 115px; /* 设置宽度 */
  height: 12px; /* 设置高度 */
  line-height: 12px;
  max-width: 115px; /* 添加最大宽度 */
}
</style>
