<script setup>
import {ElConfigProvider} from "element-plus";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {ref,reactive,getCurrentInstance,nextTick} from "vue";
const {proxy}  = getCurrentInstance()
const locale = ref(zhCn)
const config = reactive({
  max:1,
})
</script>

<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>
