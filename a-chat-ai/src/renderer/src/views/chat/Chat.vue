<script setup>
import layout from '@/components/layout.vue'
import {useCollapsedStore} from "../../stores/Collapsed";
import {computed, onMounted, ref, watch} from "vue";
import chatSession from "@/views/chat/ChatSession.vue"
import {useChatSessionStore} from "../../stores/ChatSession";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css"
import {useChatMessageStore} from "../../stores/ChatMessage";
import Message from "@/views/chat/Message.vue";
import ChatMessage from "./ChatMessage.vue";
import {loadUploadedFile} from "../../api/ChatSessionMessageService";
import {updateSessionNoReadCountService} from "../../api/UpdateService";
import {useUploadDataStore} from "../../stores/UploadData";
import {ElLoading, ElMessage} from "element-plus";
const chatSessionStore  = useChatSessionStore();
const collapsedStore = useCollapsedStore();
const uploadDataStore = useUploadDataStore()
const isCollapsed = computed(() => collapsedStore.collapse);
const chatMessageStore = useChatMessageStore();
const cuSession = ref([])
onMounted(() => {
  // 组件挂载时，开始监听消息
  preApi.receiveMessage((error, session) => {
    if (error) {
      console.error("消息接收失败：", error);
    } else {
      console.log("接收到消息：", session);
      cuSession.value = session;
      chatSessionStore.setChatSession(session);
      messageList.value = [];
      messageCountInfo.pageNo = 0;
      messageCountInfo.totalPage = 1;
      messageCountInfo.noData = false;
      messageCountInfo.maxMessageId = null;
      loadChatMessage();
      goBottom();
      const lastMessage = chatMessageStore.message[chatMessageStore.message.length - 1];
      if(currentChatSession.value.sessionId !== lastMessage.sessionId){
             //TODO 未读消息
      }
    }
  });
});
const setTop = async (id,topType)=>{
  const session = await preApi.setTop(id,topType);
  sortChatSession(session)
  chatSessionStore.chatSession = session;
}
const delSession = async (id)=>{
   chatSessionStore.chatSession = await preApi.delSession(id);
}

const onContextmenu = (data,e)=>{
   ContextMenu.showContextMenu({
     x:e.x,
     y:e.y,
     items:[{
         label: data.topType === 0 ?"置顶":"取消置顶",
         onClick:()=>{
             setTop(data.robotId,data.topType === 0 ?1:0)
         }
     }, {
        label: '删除聊天',
         onClick:()=>{
             delSession(data.robotId)
          }
       }
     ]
   })
}

const currentChatSession = ref({})
const messageList = ref([]);
const messageCountInfo = {
    totalPage: 0,
    pageNo: 0,
    maxMessageId: null,
    noData: false
}
const chatSessionClickHandler = async (item)=>{
   currentChatSession.value = item;
   messageList.value = [];
   messageCountInfo.pageNo = 0;
   messageCountInfo.totalPage = 1;
   messageCountInfo.noData = false;
   messageCountInfo.maxMessageId = null;
   await loadChatMessage();
   goBottom();
  const result = await loadUploadedFile(currentChatSession.value.sessionId)
  const uploadData = result.data;
  const storeUpload = uploadDataStore.data[currentChatSession.value.sessionId]
  if((uploadData === null || uploadData.length === 0)&& storeUpload !== null&& storeUpload.length !== 0){
       uploadDataStore.removeData(currentChatSession.value.sessionId)
       ElMessage.warning("该会话上传的文件已经失效")
  }else if(uploadData.length >= 0){
        uploadDataStore.setData(currentChatSession.value.sessionId,uploadData)
  }
   await preApi.setSessionSelect(currentChatSession.value.robotId,currentChatSession.value.sessionId)
   await updateSessionNoReadCountService(currentChatSession.value.sessionId);
}
const loadChatMessage = async () =>{
     if(messageCountInfo.noData){
        return;
     }
     messageCountInfo.pageNo++;
     const message = await preApi.loadChatMessage(currentChatSession.value.sessionId,messageCountInfo.pageNo,messageCountInfo.maxMessageId)
     if(message.pageNo === message.totalPage){
         messageCountInfo.noData = true;
     }
     message.messageList.sort((a,b)=>{
          return a.question.id - b.question.id
     })
     messageList.value = message.messageList.concat(messageList.value)
     messageCountInfo.totalPage = message.totalPage;
     messageCountInfo.pageNo = message.pageNo;
     if(messageCountInfo.pageNo === 1){
       messageCountInfo.maxMessageId = message.messageList.length > 0 ? message.messageList[message.messageList.length-1].question.id : null;
     }
     chatMessageStore.setChatMessage(messageList.value);
}
const goBottom = () => {
  const items = document.querySelectorAll('.message-item');
  if (items.length > 0) {
    setTimeout(() => {
      items[items.length-1].scrollIntoView();
    }, 100);
  }
}

const sortChatSession = (list)=>{
     list.sort((a,b)=>{
          const topTypeResult = a.topType - b.topType;
          if (topTypeResult === 0){
             return a.lastTime - b.lastTime;
          }else{
            return topTypeResult;
          }
     })
}
watch(() => chatMessageStore.message, (newMessages) => {
    goBottom();
}, { deep: true });
const showGroupDetail = ()=>{
   console.log("show group detail")
}

</script>

<template>
<layout>
     <template #left-content>
         <div class="drag-panel drag"></div>
       <div class="top-search-wrapper">
         <transition name="fade">
           <div class="top-search" v-if="!isCollapsed">
             <el-input clearable placeholder="搜索" v-model="searchKey">
               <template #suffix>
                 <span class="iconfont icon-search"></span>
               </template>
             </el-input>
           </div>
         </transition>
       </div>
       <div class="chat-session-list">
         <template v-for="item in chatSessionStore.chatSession">
            <chatSession :data="item" :currentSession="item.sessionId === currentChatSession.sessionId" @click="chatSessionClickHandler(item)" @contextmenu="onContextmenu(item,$event)"></chatSession>
         </template>
       </div>
     </template>
   <template #right-content>
     <div class="title-panel drag">
       <div class="title" v-if="Object.keys(currentChatSession).length>0">
           <span>{{currentChatSession.robotName}}</span>
           <span v-if="currentChatSession.robotType ===1">A-AI
               ({{currentChatSession.robotNumber}})
           </span>
       </div>
     </div>
      <div class="iconfont icon-more no-drag" v-if="currentChatSession.robotType === 1" @click="showGroupDetail()">
      </div>
      <div class="chat-panel" v-show="Object.keys(currentChatSession).length>0">
            <div class="message-panel" id="message-panel">
                <div class="message-item" v-for="(data,index) in chatMessageStore.message" :id="'message' + data.question.id">
                  <ChatMessage :data="data" :currentChatSession="currentChatSession"></ChatMessage>
                </div>
            </div>
        <Message :currentChatSession="currentChatSession"></Message>
      </div>
   </template>
</layout>
</template>
<style scoped>

/* 保证聊天面板的布局 */
.chat-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* 保证聊天面板占据除顶部栏之外的剩余高度 */
}
/* 消息面板设置为可滚动 */
.message-panel {
  flex: 1; /* 占据剩余的可用高度 */
  overflow-y: auto; /* 垂直滚动 */
  padding: 10px;
  background-color: #3c3c3f; /* 背景色 */
}

/* 消息项的样式 */
.message-item {
  margin-top: 20px;
  border-radius: 10px;
  padding-bottom: 10px;
  color: #ffffff;
}

/* 保证<Message>组件始终位于底部 */
.message-input {
  border-top: 1px solid #484259;
  padding: 10px;
  background-color: #2d2d3b;
  display: flex;
  align-items: center;
}

.message-input input {
  flex: 1;
  background: #3b3a4f;
  border: none;
  border-radius: 5px;
  padding: 10px;
  color: white;
}

.message-input button {
  margin-left: 10px;
  background-color: #7e64de;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #6b5b9a;
}


.title{
  height: 29px;
  padding:5px 0 0 10px;
  color: white;
  font-size: 24px;
}
.drag-panel {
  height: 25px;
}
.top-search {
  padding: 0 10px 9px 10px;
  background: transparent;
  display: flex;
  align-items: center;
}

.iconfont {
  font-size: 22px;
}

/* 输入框渐变边框 */
:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__wrapper) {
  background-color: #21212c;
  border-radius: 95px;
  border: 5px solid;
  border-image: linear-gradient(45deg, rgba(255, 0, 255, 0.5), rgba(0, 255, 255, 0.5)) 1;
  box-shadow: 0 0 0 0;
}

:deep(input::-webkit-input-placeholder) {
  color: #d7d5d5;
}

/* 渐变效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <=2.1.8 */ {
  opacity: 0;
}

.contact-list {
  height: calc(100vh - 85px);
  overflow: hidden;
}

.contact-list:hover {
  overflow: auto;
}

.part-title {
  color: #e0e0e0;
  padding-left: 10px;
  margin-top: 10px;
}

.part-list {
  border-bottom: 1px solid #484259;
}

.part-item {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  position: relative;
  transition: all 0.5s ease;
}

.part-item:hover {
  cursor: pointer;
  background: #7e64de;
}

.iconfont {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.text {
  flex: 1;
  color: #e8e8ee;
  margin-left: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  transition: opacity 0.5s ease;
}

.no-data {
  text-align: center;
  font-size: 16px;
  color: #7e64de;
  line-height: 30px;
}

.active {
  background: #484456;
}

.active:hover {
  background: #6b5b9a;
}

.title-panel {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 15px;
  color: #e8e2e2;
}
.top-search-wrapper{
  height: 50px;
}
</style>
