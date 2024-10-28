<script setup>
import AvatarBase from "./AvatarBase.vue";
const props = defineProps({
  info:{
    type: Object,
    default: {}
  }
})
</script>

<template>
  <div class="user-panel">
    <AvatarBase
      :id="info.id"
      :width="60"
      :borderRadius="5"
      :show-detail="true"
    >
    </AvatarBase>
    <div class="user-info">
      <div class="nick-name">
        {{info.name}}
      </div>
      <div class="info">{{info.information}}</div>
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
    }
    .info{
      font-size: 12px;
      color: #9e9e9e;
      margin-top: 3px;
    }
  }
}
</style>
