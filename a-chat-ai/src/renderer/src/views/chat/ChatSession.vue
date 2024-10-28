<script setup>
 import AvatarBase from "../../components/AvatarBase.vue";
 import Utils from "../../utils/Utils";
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
 import {useCollapsedStore} from "../../stores/Collapsed";
 import {computed} from "vue";
 const collapsedStore = useCollapsedStore();
 const isCollapsed = computed(() => collapsedStore.collapse);
</script>

<template>
 <div :class="['chat-session-item',currentSession?'active':'']">
    <div class="contact-tag" v-if="data.robotType === 1">群组</div>
   <transition name="avatar-resize">
     <div class="avatar-wrapper" :class="{collapsed:isCollapsed}">
       <AvatarBase :id="data.robotId" :width="58" :key="data.robotId"></AvatarBase>
     </div>
   </transition>
   <transition name="fade">
     <div class="user-info" v-if="!isCollapsed">
        <div class="user-name-panel">
          <div class="user-name">{{data.robotName}}</div>
          <div class="message-time">{{Utils.formatDate(data.lastTime)}}</div>
        </div>
           <div class="last-message" v-html="data.lastMessage"></div>
     </div>
   </transition>
     <div class="chat-top iconfont icon-top" v-if="data.topType===1"></div>
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
 .chat-session-item{
   padding: 10px;
   position: relative;
   display: flex;
   border-bottom: 1px solid #757575;
   .contact-tag{
      position: absolute;
      left:0;
      top: 0;
      z-index: 1;
      background: #7e64de;
      color: #fff;
      font-size: 12px;
      padding: 1px 2px 1px 1px;
      border-radius: 0 3px 0 3px;
      line-height: 12px;
   }
   &:hover{
     cursor: pointer;
     background: #67579f;
     .message-time{
        color: #fff !important;
     }
     .last-message{
         color: #fff !important
     }
     .user-name{
         color: #fff !important;
     }
   }
   .user-info{
      flex: 1;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
     .user-name-panel{
        display: flex;
        .user-name{
           width: 140px;
           color: #868686;
           font-size: 14px;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
        }
       .message-time{
          width: 67px;
          color: #a2a2a2;
          font-size: 12px;
          text-align: right;
       }
     }
     .last-message{
        width: 180px;
        height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #8c8c8c;
        margin-top: 5px;
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
    cursor: pointer;
    background: #67579f;
    .message-time{
       color: #fff !important;
    }
   &hover{
      background: #7e64de;
      .message-time{
         color: #fff !important;
      }
   }
 }
 .fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s ease;
 }

 .fade-enter, .fade-leave-to /* .fade-leave-active in <=2.1.8 */ {
   opacity: 0;
 }
</style>
