<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
  import {useRobotIdStore} from "../../stores/RobotId";
  import {robotDetailService,commentListService} from "../../api/RobotService";
import {applyRobotService, likeService} from "../../api/UserService";
  import {commentService} from "../../api/UserService";
import {createSessionService} from "../../api/UserService";
const robotIdStore = useRobotIdStore();
  const robot= ref({})
  const commentList = ref([])
  const currentPage = ref(1);
  const subscribe = ref(false)
const commentSuccess = ref(false)
const goTop = ()=>{
   const commentItem =  document.querySelectorAll('.infinite-list-item')
   if(commentItem.length>0){
     setTimeout(() => {
       commentItem[0].scrollIntoView({behavior: "smooth"})
     },100)
   }
}

  const loadRobotDetail = async ()=>{
       const result = await robotDetailService({
           robotId: robotIdStore.robotId,
           type: "1",
           pageNo: 1,
       });
       robot.value = result.data.robot;
       commentList.value = result.data.comments.list;
       subscribe.value = result.data.subscribed;
  }
  const getComment = async (tabName)=>{
         const result = await commentListService(
           {
              robotId: robotIdStore.robotId,
               type: tabName,
               pageNo: 1
           }
         )
         commentList.value = result.data.list;
  }
  loadRobotDetail();
  const comment = ref("")
  watch(()=>robotIdStore.robotId,()=>{
       loadRobotDetail();
  })
const activeName = ref("1")
const showInput = ref(true)
const handleClick = async (tab, event) => {
     currentPage.value = 1;
     const tabName = tab.props.name;
     showInput.value = tabName !== "4";
     // TODO 获取评论列表
     await getComment(tabName)
     // comments.value = commentList.value.filter(comment => comment.type == tabName)
}
const inputBg = {
     "1": {background: "#000000"},
     "2": {background: "#000000"},
     "3": {background: "#000000"},
     "4": {background: "#000000"},
}
const currentInputStyle = computed(() => inputBg[activeName.value]);
const sendMessage = async (e)=>{
  if(e.shiftKey&& e.keyCode=== 13){
    return
  }
  if(comment.value === "" || comment.value === null){
     showSendMsgPopover.value = true;
     return
  }
  const result = await commentService({
        robotId: robotIdStore.robotId,
        content: comment.value,
        type: activeName.value,
        pageNo: 1
  });
  currentPage.value = 1;
  comment.value = "";
  console.log(JSON.stringify(result.data.list[0].createTime))
  console.log(JSON.stringify(Utils.formatTimeArray(result.data.list[0].createTime)))
  commentList.value = result.data.list;
  goTop();
  console.log()
}
const showSendMsgPopover = ref(false)

const clickLike = async (comment)=>{
  console.log(JSON.stringify(comment))
  const result = await likeService(comment)
  if(result.data.success){
      const find = commentList.value.find(commentResult=> commentResult.id === comment.id);
      if(result.data.like){
        find.isLike  = true;
        find.like +=1;
      }else {
         find.isLike  = false;
         find.like -=1;
      }
  }
  console.log(JSON.stringify(result))
}
const getPlaceholder=()=>{
      switch (activeName.value){
           case "1":
            return "请输入你的使用评价"
           case "2":
             return "请输入反馈"
           case "3":
             return "请输入意见"
      }
}
const showEnd = ref(false)
const loadComment = async ()=>{
  currentPage.value +=1;
  console.log("LOADCOMMENT")
  const result = await commentListService(
    {
      robotId: robotIdStore.robotId,
      type: activeName.value,
      pageNo: currentPage.value,
    }
  )
  console.log(currentPage.value)
  console.log("resultDATA: "+JSON.stringify(result.data))
  if(commentList.value.length === result.data.total){
    showEnd.value = true;
    currentPage.value -=1;
    return;
  }
  console.log(JSON.stringify(result.data.list))
  result.data.list.forEach(item =>{
       commentList.value.push(item)
  })
}
import { nextTick } from 'vue';
import Utils from "../../utils/Utils";
import {useRoute, useRouter} from "vue-router";
import {ElLoading} from "element-plus";
const topContentHeight = ref(450);
const listHeight = ref();
onMounted(async () => {
  await updateListHeight(); // 更新列表高度
});
const updateListHeight = async () => {
  await nextTick();
  const otherHeight = 115;
  const topHeaderContent = document.querySelector('.header');
  const topHContent = document.querySelector('.top-h');
  topContentHeight.value = topHeaderContent.offsetHeight+topHContent.offsetHeight;
  topContentHeight.value = topContentHeight.value<395? 395:topContentHeight.value;
  listHeight.value = window.innerHeight - (topContentHeight.value + otherHeight);
};
window.addEventListener('resize', updateListHeight);
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateListHeight);
});

const router = useRouter();
const route = useRoute()
const createSession =async (data)=>{
   const result = await createSessionService(data)
   if(result.data !== null){
     const session = result.data;
     session.time =  new Date().getTime();
     await router.push({path:"/main",query:session})
     }
}
const applyRobot = async (robotId)=>{
  const result = await applyRobotService({"robotId":robotId});
  const session = result.data;
  session.time =  new Date().getTime();
  await router.push({path:"/main",query:session})
}
</script>

<template>
 <el-header style="height: auto" class="header">
   <el-row style="background: white;border-radius: 15px;border: 3px slateblue solid">
      <el-col :span="4" :offset="6">
         <el-image class="header-h">
               <template #error>
                   <el-image fit="cover" src="../../src/assets/img/cry.png"></el-image>
               </template>
         </el-image>
      </el-col>
      <el-col :span="10" :offset="2" style="margin-top: 30px">
          <el-row>
              <span style="color: #ababab;font-size: 25px">{{robot.name}}</span>
          </el-row>
           <el-row style="margin-top: 15px">
              <span style="font-size: 15px;color: #949393">{{robot.information}}</span>
           </el-row>
           <el-row style="margin-top: 20px">
               <el-col :span="4">
                 <el-button class="bottom_style" plain type="primary" v-if="subscribe&&robot.categoryId!=6" @click="createSession(robot.id)">创建对话</el-button>
                 <el-button class="bottom_style" plain type="primary" v-else-if="subscribe&&robot.categoryId==6" @click="workspace()">进入工作台</el-button>
                 <el-button class="bottom_style" v-else type="primary" plain>试用</el-button>
               </el-col>
                <el-col :span="4" :offset="2">
                   <el-button class="bottom_style" type="danger" v-if="subscribe">取消订阅</el-button>
                   <el-button class="bottom_style" v-else type="primary" @click="applyRobot(robot.id)">订阅</el-button>
                </el-col>
           </el-row>
      </el-col>
   </el-row>
 </el-header>
  <el-main style="height: auto">
    <div class="top-h">
     <el-row>
       <span style="font-size: 18px;color: white">评论</span>
        <el-divider direction="vertical"></el-divider>
        <span style="font-size: 18px;color: white">反馈</span>
     </el-row>
        <div class="comment_area">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane name="1">
              <template #label>
                <svg
                  style="overflow: hidden; width: 2em; height: 2em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-pinglun_01xiepinglun`"></use>
                </svg>
                使用评价
              </template>
            </el-tab-pane>
            <el-tab-pane name="2">
              <template #label>
                <svg
                  style="overflow: hidden; width: 2em; height: 2em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-wentifankui1`"></use>
                </svg>
                问题反馈
              </template>
            </el-tab-pane>
            <el-tab-pane name="3">
              <template #label>
                <svg
                  style="overflow: hidden; width: 2em; height: 2em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-tousujianyi`"></use>
                </svg>
                用户建议
              </template>
            </el-tab-pane>
            <el-tab-pane label="开发者说" name="4">
               <template #label>
                 <svg
                   style="overflow: hidden; width: 2em; height: 2em;"
                   aria-hidden="true"
                 >
                   <use :xlink:href="`#icon-kaifazhe`"></use>
                 </svg>
                 开发者说
               </template>
            </el-tab-pane>
          </el-tabs>
          <el-row>
            <div class="input_area" :style="currentInputStyle" v-if="showInput">
              <el-row justify="space-between">
                <el-col :span="22">
                  <el-input :placeholder="getPlaceholder()" @keydown.enter="sendMessage" type="textarea" resize="none" rows="3" v-model="comment">
                  </el-input>
                </el-col>
                <el-col :span="1" style="padding-top: 40px">
                  <el-popover
                    trigger="click"
                    :visible="showSendMsgPopover"
                    :hide-after="1500"
                    placement="top-end"
                    :teleported="false"
                    @show="openPopover"
                    @hide="closePopover"
                    :popper-style="{
                 padding:'5px',
                 'min-width': '0',
                 width: '120px'
               }"
                  >
                    <template #default> <span class="empty-msg">不能发送空白信息</span></template>
                    <template #reference>
                    <el-button type="text" @click="sendMessage">
                      <svg
                        style="overflow: hidden; width: 1.5em; height: 1.5em;"
                        aria-hidden="true"
                      >
                        <use :xlink:href="`#icon-18-fasongxiaoxi-icon`"></use>
                      </svg>
                    </el-button>
                    </template>
                  </el-popover>
                </el-col>
              </el-row>
            </div>
          </el-row>
        </div>
    <div style="font-size: 20px; color: white">讨论区</div>
    <el-divider direction="horizontal"></el-divider>
    </div>
      <el-row>
        <el-col :style="{ height: listHeight + 'px' }" v-infinite-scroll="loadComment" class="infinite-list" v-if="commentList.length > 0" style="background: #101010;border-radius: 15px">
              <el-row v-for="(comment,index) in commentList" ref="specificRow" :key="index" class="infinite-list-item" style="padding-top: 10px">
                <el-col :span="2" :offset="1" >
                  <el-row>
                    <el-avatar :src="comment.avatar">
                      <template #default>
                        <div style="width: 5.5em">
                          <el-avatar :size="45" wi fit="cover" src="../../src/assets/img/avatar14.svg"></el-avatar>
                        </div>
                      </template>
                    </el-avatar>
                  </el-row>
                </el-col>
                <el-col :span="19" style="padding-top:10px">
                  <el-row>
                    <el-text type="primary" size="large" line-clamp="2">{{comment.username}}</el-text>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-text style="color: white;font-size: 16px">{{comment.content}}</el-text>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-text style="color: white;font-size: 12px">{{Utils.formatTimeArray(comment.createTime)}}</el-text>
                  </el-row>
                </el-col>
                <el-col :span="2" style="padding-top: 3.5em;">
                  <el-button type="text" @click="clickLike(comment)">
                    <svg
                      style="overflow: hidden; width: 2em; height: 2em;"
                      aria-hidden="true"
                      v-if="comment.like"
                    >
                      <use :xlink:href="`#icon-tubiaozhizuomoban`"></use>
                    </svg>
                    <svg
                      style="overflow: hidden; width: 2em; height: 2em;"
                      aria-hidden="true"
                      v-else
                    >
                      <use :xlink:href="`#icon-dianzan`"></use>
                    </svg>
                  </el-button>
                  <span style="color: #fb7373">{{comment.like}}</span>
                </el-col>
                <el-divider style="border-color: #343434"></el-divider>
              </el-row>
              <el-row v-if="showEnd" justify="center">
                 <el-col :span="6" style="padding-bottom: 15px">
                   <el-text style="color: #c2c2c2;font-size: 15px" >没有更多了（づ￣3￣）づ╭❤～</el-text>
                 </el-col>
              </el-row>
        </el-col>
       <el-col v-else>
           <el-empty>
              <template #image>
                <el-image src="../../src/assets/img/icon-tree.png"></el-image>
              </template>
             <template #description>
                <span>这里好像有点空旷</span>
             </template>
           </el-empty>
       </el-col>
     </el-row>
  </el-main>
</template>

<style scoped>
.header-h {
  width: 13.5em; /* 固定宽度 */
  height: 13.5em; /* 固定高度 */
  overflow: hidden; /* 防止内容溢出 */
}

.custom-message{
  position: fixed;
  z-index: 9999; /* 确保在其他元素之上 */
}
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
  overflow-y: auto;
  scrollbar-width: none;
}
.infinite-list::-webkit-scrollbar {
  display: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-msg {
  font-size: 13px;
}
.bottom_style{
    width: 100px;
    border-radius: 12px;
}
.comment_area {
  margin-top: 20px;
  background: #000000;
  color: white;
}
.input_area {
  margin-top: -10px;
  outline: none;
  width: 100%;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-all;
  position: relative; /* Add position relative for positioning */
  :deep(.el-textarea__inner) {
    box-shadow: none;
    color: white;
    background: transparent !important;
  }
  :deep(.el-input__count) {
    background: transparent !important;
    color: #a894f5;
  }
}
.demo-tabs :deep(.el-tabs__item.is-active) {
  color: #9e75e1; /* 设置选中标签的文字颜色 */
  font-weight: bold; /* 设置选中标签的文字加粗 */
  font-size: 1.1em; /* 设置选中标签的文字大小 */
}
.demo-tabs :deep(.el-tabs__item){
   color: white;
}
.demo-tabs :deep(.el-tabs__item:hover) {
  color: #9e75e1 !important; /* 设置鼠标悬停时标签的文字颜色 */
  font-weight: bold; /* 设置选中标签的文字加粗 */
  font-size: 1.1em; /* 设置选中标签的文字大小 */
  border-color: #9e75e1; /* 设置选中标签的底部激活条颜色 */
}

.demo-tabs :deep(.el-tabs__active-bar) {
  background-color: #9e75e1; /* 设置选中标签的底部激活条颜色 */
}
.demo-tabs .my-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .my-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

</style>
