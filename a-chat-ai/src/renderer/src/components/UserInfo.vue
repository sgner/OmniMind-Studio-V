<script setup>
import AvatarBase from "./AvatarBase.vue";
const props = defineProps({
    Info:{
        type: Object,
        default: {}
    }
})
</script>

<template>
<div class="user-panel">
  <AvatarBase
    :id="Info.Id"
    :width="60"
    :borderRadius="5"
    :show-detail="true"
  >
  </AvatarBase>
  <div class="user-info">
    <div class="nick-name">
        {{Info.username}}
        <span v-if="Info.level === 0">新手上路</span>
    </div>
    <div class="info">ID：{{userInfo.userId}}</div>
    <div class="info">这是一段介绍</div>
  </div>
</div>
</template>

<style scoped>
.user-panel{
  display: flex;
  padding-bottom: 20px;
  .user-info{
    flex: 1;
    margin-left: 10px;
    .nick-name{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000000;
      font-size: 16px;
      .iconfont{
        font-size: 13px;
      }
    }
    .info{
      font-size: 12px;
      color: #9e9e9e;
      margin-top: 3px;
    }
  }
}
</style>
