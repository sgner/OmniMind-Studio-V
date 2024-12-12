<script setup>
import ContentPanel from '@/components/ContentPanel.vue'
import { ref, watch } from 'vue'
const robotId = ref()
const robotName  = ref()
import RobotInfo from "../../components/RobotInfo.vue";
import {robotSquareListService} from "../../api/RobotService";
import {useRobotTypeStore} from "../../stores/RobotType";
import {useRobotIdStore} from "../../stores/RobotId";
import {useRightTitleStore} from "../../stores/RightTitle";
import {applyRobotService} from "../../api/UserService";
import {useRouter} from "vue-router";
const search= ()=>{
}
const searchResults = ref([])
const applyRobot = async (robotId)=>{
   const result =  await applyRobotService({"robotId":robotId});
   const session = result.data;
   session.time = new Date().getTime();
   await router.push({path:"/main",query:session})
}
const unSubscribed =()=>{

}
const robotTypeStore = useRobotTypeStore();
const loadData = async ()=>{
   const result = await robotSquareListService(robotTypeStore.robotType);
   searchResults.value = result.data;
}
loadData()
watch(()=>robotTypeStore.robotType,()=>{
        loadData()
})
const rightTitleStore = useRightTitleStore();
const router = useRouter();
const toDetail = (robotId,robotName)=>{
     const robotIdStore = useRobotIdStore();
     robotIdStore.setRobotId(robotId)
     rightTitleStore.setRightTitle(robotName)
     router.push("/robot/detail")
}
</script>

<template>
  <ContentPanel>
    <div class="search-form">
      <el-input
        clearable
        placeholder="请输入机器人名称"
        v-model="robotName"
        size="large"
        style="max-width: 600px;width: 100%; margin: 0 auto;"
        @keydown.enter="search"
      >
        <template #suffix>
          <el-button type="primary"><span class="iconfont icon-search"></span></el-button>
        </template>
      </el-input>

    </div>
    <div class="search-result-container">
      <div v-for="searchResult in searchResults" :key="searchResult.name" class="search-result-panel">

        <div class="search-result">
          <span
            class="contact-type"
            :class="{ offline: searchResult.status === 0 }"
          >
            {{ searchResult.status === 1 ? searchResult.categoryName : "已下线" }}
          </span>
          <RobotInfo :info="searchResult"></RobotInfo>
          <el-button type="primary" plain :class="searchResult.status === 1 ? 'op-btn-c': 'op-btn-f' " @click="toDetail(searchResult.id,searchResult.name)">
            查看详情
          </el-button>
          <el-button
            type="primary"
            v-if="
                searchResult.status === 1 && !searchResult.subscribed
                 "
            @click="applyRobot(searchResult.id)"
            class="op-btn"
          >订阅</el-button>
          <el-button type="danger"
                     v-else-if="(searchResult.status===1 && searchResult.subscribed)||(searchResult.status===0 && searchResult.subscribed)"
                     @click="unSubscribed"
                     class="op-btn"
          >
            取消订阅
          </el-button>
        </div>

      </div>
    </div>

    <div v-if="!searchResults" class="no-data"></div>
  </ContentPanel>
</template>

<style scoped>
.search-form {
  padding-top: 50px;
  display: flex;
  align-items: center;
  :deep(.el-input__wrapper) {
    border-radius: 4px 0 0 4px;
    border: #7e64de 5px solid;
  }

  .search-btn {
    background: #7e64de;
    color: white;
    width: 100px;
    line-height: 50px;
    text-align: center;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    &:hover {
      background: #7e64de;
    }
  }
}

.no-data {
  padding: 30px 0;
}

/* Grid layout for search results */
.search-result-container {
  margin-top: 60px;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 900px) {
  .search-result-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1350px) {
  .search-result-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1800px) {
  .search-result-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.search-result-panel {
  .search-result {
    padding: 30px 20px 20px 20px;
    background: rgb(255, 253, 253);
    border-radius: 10px;
    position: relative;
    min-height: 140px;
    min-width: 240px;
    .contact-type {
      position: absolute;
      left: 0;
      top: 0;
      background: #7e64de;
      padding: 2px 5px;
      color: #fff;
      border-radius: 5px 0 0 0;
      font-size: 12px;
    }

    .contact-type.offline {
      background: #8f2f2f;
    }
    .op-btn-f{
      position: absolute;
      bottom: 5px;
      right: 10px;
    }
    .op-btn-c{
      left: 10px;
      bottom: 5px;
      position: absolute
    }
    .op-btn {
      position: absolute;
      bottom: 5px;
      right: 10px;
    }
  }
}
</style>
