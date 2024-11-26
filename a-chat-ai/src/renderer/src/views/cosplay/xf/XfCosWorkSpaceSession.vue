<script setup>
import {useCollapsedStore} from "../../../stores/Collapsed";
import {computed} from "vue";
import {defineProps} from "vue";
const collapsedStore = useCollapsedStore();
const isCollapsed = computed(() => collapsedStore.collapse);
const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  currentSession:{
    type: Boolean,
    default: false
  }
})
console.log(JSON.stringify(props));
</script>

<template>
  <div :class="['suno-session-item',currentSession?'active':'']">
    <div class="contact-tag" >COS控制台</div>
    <transition name="fade">
      <div class="suno-info" v-if="!isCollapsed">
        <div class="suno-name-panel">
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.avatar-resize-enter-active,
.avatar-resize-leave-active {
  transition: width 0.5s ease; /* 调整动画时间和效果 */
}
.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.5s ease;
  width: 65px;
}

.avatar-wrapper.collapsed {
  justify-content: center;
  width: 54px;
}
.suno-session-item{
  padding: 10px;
  height: 85px;
  position: relative;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  background-image: url('../../../assets/img/failout.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .contact-tag{
    position: absolute;
    right:0;
    top: 0;
    z-index: 1;
    background: linear-gradient(to right, #95579f 0%, #6a51a9 100%);
    color: #fff;
    font-size: 13px;
    padding: 1px 2px 1px 2px;
    border-radius: 0 6px 0 6px;
    margin-top: 3px;
    margin-right: 3px;
    line-height: 24px;
  }
  &:hover{
    cursor: pointer;
    background-image: url('../../../assets/img/failout1.jpg');
    .message-time{
      color: #fff !important;
    }
    .last-message{
      color: #fff !important
    }
    .suno-name{
      color: #fff !important;
    }
  }
  .suno-info{
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .suno-name-panel{
      display: flex;
    }
  }
  .chat-top{
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: #9687b7;
  }
}
.active{
  border-bottom: 5px solid;
  background-image: url('../../../assets/img/failout1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-image: linear-gradient(to right, #95579f 0%, #6a51a9 100%) 1;
  &:hover{
    background-image: url('../../../assets/img/failout1.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <=2.1.8 */ {
  opacity: 0;
}
</style>
