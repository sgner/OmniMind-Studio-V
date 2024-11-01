<script setup>
import {useRoute} from "vue-router";
import {ref, watch, watchEffect} from "vue";
import {sendChatMessage, uploadFile,loadUploadedFile} from "../../api/ChatSessionMessageService";
import {useUserInfoStore} from "../../stores/UserInfo";
import {useChatMessageStore} from "../../stores/ChatMessage";
import {getFileType} from "../../utils/FileType";
import {v4 as uuidv4} from 'uuid';
import emojiList from '@/utils/emoji'
import FilePictureCard from "./FilePictureCard.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {useUploadDataStore} from "../../stores/UploadData";
const route = useRoute()
   const activeEmoji = ref("表情")
const chatMessageStore = useChatMessageStore()
   const userInfoStore = useUserInfoStore()
   const props = defineProps({
          currentChatSession:{
              type:Object,
              default:{}
          }
   })
const uploadId = ref(uuidv4().replace(/-/g,''))
   const sendMessage = async (e)=>{
        if(e.shiftKey&& e.keyCode=== 13){
              return
        }
        e.preventDefault()
        const messageContent = msgContent.value? msgContent.value.replace(/\s*$/g,''):''
        if(messageContent===''){
              showSendMsgPopover.value = true;
              return;
        }
     const result = await loadUploadedFile(props.currentChatSession.sessionId);
     const uploadData = result.data;
        console.log(JSON.stringify(result))
     const storeUpload = uploadDataStore.data[props.currentChatSession.sessionId]
     if((uploadData === null || uploadData.length === 0)&& storeUpload !== null&& storeUpload.length !== 0){
       ElMessage.warning("该会话上传的文件已过期");
       console.log(JSON.stringify( uploadDataStore.data[props.currentChatSession.sessionId]))
       uploadDataStore.removeData(props.currentChatSession.sessionId)
       return
     }
      await sendMessageDo({
           question:messageContent,
           questionType: 2,
        },true)
   }
   const showSendMsgPopover = ref(false);
   const showEmojiPopover = ref(false);
   const hidePopover = ()=>{
        showSendMsgPopover.value = false;
        showEmojiPopover.value = false;
   }
    const sendMessageDo = async (messageObj={
       question:'',
       questionType:'',
       localFilePath:'',
    },cleanMsgContent)=>{
          if(messageObj.fileSize === 0){
             // 弹出文件大小为0的提示
             return;
          }
          messageObj.sessionId = props.currentChatSession.sessionId;
          messageObj.userId =  userInfoStore.userInfo.userId;
          messageObj.files = JSON.stringify(showFileList.value);
          //http请求
          msgContent.value = cleanMsgContent? "":msgContent.value;
          await uploadDataStore.removeData(props.currentChatSession.sessionId)
          showFileList.value = []
          chatMessageStore.setChatMessage(chatMessageStore.message.concat(message2QA(messageObj)))
          const result = await sendChatMessage(messageObj,"gpt-4o-mini",false)
           // 更新列表，
    }
   const message2QA =(messageObj)=>{
      messageObj.userName = userInfoStore.userInfo.userName;
      messageObj.answers = []
      return [{
        question:messageObj,
      }]
   }
   const uploadDataStore = useUploadDataStore()
   const showFileList = ref([])
   const initUploadDataStore = ()=>{
     if(!uploadDataStore.data[props.currentChatSession.sessionId]){
       uploadDataStore.setData(props.currentChatSession.sessionId,[])
       console.log(uploadDataStore.data[props.currentChatSession.sessionId])
       showFileList.value = []
     }else {
        showFileList.value = uploadDataStore.data[props.currentChatSession.sessionId]
     }
   }
  initUploadDataStore()
   watch(()=>props.currentChatSession.sessionId,(newSessionId)=>{
       if(newSessionId){
          initUploadDataStore()
       }
   })
   watch(()=>uploadDataStore.data[props.currentChatSession.sessionId],()=>{
        initUploadDataStore()
   })
   const msgContent = ref("")

const uploadFiles = ref([])
   const loadingObj = ref({})
   const uploadRef = ref()
   const cancelSource = ref(null)
   const progress = ref(0)
   const fileTotal = ref(0)
   const formData = new FormData()
   const concat = ref(true)
const upLoadFile = async ({ file })=>{

    try{
      if(concat.value){
        showFileList.value = showFileList.value.concat(uploadFiles.value)
        const concatLen = showFileList.value.length
        if(concatLen>4){
          showFileList.value = showFileList.value.slice(0,4)
          ElMessage.warning("文件列表已满")
          return;
        }
        concat.value = false;
      }
      let startIndex = showFileList.value.findIndex(item => item.status === 'ready')
      if(startIndex === -1){
         startIndex = 0
      }
      for (let i = startIndex; i<showFileList.value.length;i++){
          if(showFileList.value[i].status === 'ready'){
             loadingObj.value[i] = true;
           }
         const type =await getFileType(showFileList.value[i].raw)
         handleType(type,i)
      }
      formData.append('files',file)
      props.currentChatSession.lastTime = Math.floor(props.currentChatSession.lastTime)
      formData.set('session',JSON.stringify(props.currentChatSession))

      const source = await axios.CancelToken.source()
        try{

          if(formData.getAll('files').length === totalFile.value && totalFile.value>0){
            const result = await uploadFile(formData,'gpt-4o-mini',false,source,progress)
            cancelSource.value = source
            if(result.code===40200&&result.msg === "all"){
              ElMessage.error("文件上传失败")
              showFileList.value = [];
              formData.delete('files')
              formData.delete('session')
              uploadFiles.value = []
              fileTotal.value = 0
            }else if (result.msg === "2"){
              ElMessage.error("文件数量超出限制")
              const filesArray = formData.getAll('files');
              if (filesArray.length > 0) {
                formData.delete('files');
                filesArray.slice(0, -1).forEach(file => {
                  formData.append('files', file);
                });
              }
              uploadFiles.value.pop()
              showFileList.value.pop()
              fileTotal.value--;
            }else{
              for(file in result.data){
                if(file.status === 0){
                  ElMessage.error("文件'"+file.name+"'上传失败")
                  showFileList.value.pop()
                  const filesArray = formData.getAll('files');
                  if (filesArray.length > 0) {
                    formData.delete('files');
                    filesArray.slice(0, -1).forEach(file => {
                      formData.append('files', file);
                    });
                  }
                  uploadFiles.value.pop()
                  fileTotal.value--
                }
              }
              showFileList.value = result.data.filter(item => item.status !== 0);
              handleResultShowFileList(showFileList.value)
              console.log("josnssss+"+JSON.stringify(showFileList.value))
            }

            for(let i = 0;i<showFileList.value.length;i++){
              loadingObj.value[i] = false
            }

            formData.delete('files')
            formData.delete('session')
            concat.value = true
            uploadFiles.value = []

            uploadDataStore.setData(props.currentChatSession.sessionId,showFileList.value)

          }
        }catch (e){

          formData.delete('files')
          formData.delete('session')
          console.log(e)
        }
    }catch (e){

      formData.delete('files')
      formData.delete('session')
      console.log(e)
    }
}
const handleType = (type,index)=>{
      if(type.includes("image")){
           showFileList.value[index].src = "../../src/assets/img/pic.png"
            showFileList.value[index].type = "image"
      }else if(type.includes("video")){
           showFileList.value[index].src = "../../src/assets/img/vid.png"
           showFileList.value[index].type = "video"
      }else if(type.includes("audio")){
           showFileList.value[index].src = "../../src/assets/img/adi.png"
            showFileList.value[index].type = "audio"
      }else if(type.includes("rar")|| type.includes("zip")||type.includes("7z")||type.includes("tar")||type.includes("gzip")||type.includes("bzip")){
            showFileList.value[index].src = "../../src/assets/img/zip.png"
            showFileList.value[index].type = "zip"
      }else if(type.includes("wordprocessingml")||type.includes(".ms-word")||type.includes("msword")){
            showFileList.value[index].src = "../../src/assets/img/Microsoft-Word.png"
            showFileList.value[index].type = "word"
      }else if(type.includes("presentationml")||type.includes("ms-powerpoint")){
             showFileList.value[index].src = "../../src/assets/img/pptx.png"
             showFileList.value[index].type = "ppt"
      }else if(type.includes("pdf")){
             showFileList.value[index].src = "../../src/assets/img/zip-1.png"
      }else if(type.includes("x-cfb")||type.includes("ms-excel")||type.includes("spreadsheetml.sheet")||type.includes("spreadsheetml.template")){
        showFileList.value[index].src = "../../src/assets/img/xlsx.png"
         showFileList.value[index].type = "excel"
      }
      else{
          const suffix = getTypeFromName(showFileList.value[index].name)
          if(suffix === 'csv'){
             showFileList.value[index].src = "../../src/assets/img/-csv.png"
             showFileList.value[index].type = "csv"
          }else{
             showFileList.value[index].src = "../../src/assets/img/filei.png"
             showFileList.value[index].type = "other"
          }
      }
}
const addNum = ref(0)
const totalFile = ref(0)
const handleChange = async (file)=>{

  let upload_img = document.getElementsByClassName('upload-file')
  let uploadNum = 0
  if (upload_img && upload_img.length > 0) {
    let upload = upload_img[0].getElementsByTagName('input')
    if (upload && upload.length > 0 && upload[0].files && upload[0].files.length > 0) {
      uploadNum = upload[0].files.length
    }
  }

  addNum.value++
  if(uploadFiles.value.length<4){
    if(addNum.value === uploadNum && uploadNum!==0) {
      totalFile.value = uploadNum

      console.log('可以上传', showFileList.value)
      uploadRef.value.submit()
    }
    if(uploadNum!==0){
      uploadFiles.value.push({raw:file.raw,name:file.name,status:file.status});
    }
  }

  if(uploadNum === 0){
     addNum.value = 0
  }

}
const handleRemove = async ()=>{

}
const getTypeFromName=(name)=>{
   return name.split('.').pop().toLowerCase();
}
const handleResultShowFileList = (resultList)=>{
     for(const file of resultList){
          console.log(JSON.stringify(file))
          handleResultSrc(file);
     }
}
const handleResultSrc = (file) => {
  if (file.fileType !== 1) {
    // 根据不同的 file.type 赋值 imageSrc
    switch (file.fileType) {
      case 2:
        file.imageSrc = "../../src/assets/img/vid.png";
        break;
      case 3:
        file.imageSrc = "../../src/assets/img/filei.png";
        break;
      case 4:
        file.imageSrc = "../../src/assets/img/adi.png";
        break;
      case 5:
        file.imageSrc = "../../src/assets/img/filei.png";
        break;
      case 6:
        file.imageSrc = "../../src/assets/img/zip.png";
        break;
      case 7:
        file.imageSrc = "../../src/assets/img/zip-1.png";
        break;
      case 8:
        file.imageSrc = "../../src/assets/img/Microsoft-Word.png";
        break;
      case 9:
        file.imageSrc = "../../src/assets/img/pptx.png";
        break;
      case 10:
        file.imageSrc = "../../src/assets/img/xlsx.png";
        break;
      case 11:
        file.imageSrc = "../../src/assets/img/-csv.png";
        break;
      default:
        file.imageSrc = "default_image_path"; // 其他类型的默认图像
    }
  } else {
    file.imageSrc = file.src;
  }
}
</script>

<template>
   <div class="send-panel">
      <div class="toolbar">
          <el-popover
            :visible="showEmojiPopover"
            trigger="click"
            placement="top"
            :teleported="false"
            @show="openPopover"
            @hide="closePopover"
            :popper-style="{padding: '0 10px 10px 10px', width: '490px'}"
          >
            <template #default>
               <el-tabs v-model="activeEmoji" @click.stop>
                   <el-tab-pane :label="emoji.name" :name="emoji.name" v-for="emoji in emojiList">
                       <div class="emoji-list">
                          <div class="emoji-item" v-for="(item,index) in emoji.emojiList" @click="sendEmoji(item)">
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              :content="item"
                              placement="top"
                            >
                              {{index}}
                            </el-tooltip>
                          </div>
                       </div>
                   </el-tab-pane>
               </el-tabs>
            </template>
            <template #reference>
              <svg
                style="fill: currentColor;overflow: hidden;width: 2em;height: 2em;cursor: pointer"
                aria-hidden="true"
                @click="showEmojiPopover = !showEmojiPopover"
              >
                <use :xlink:href="`#icon-a-gaoxinghaoxinqingbiaoqingxihuanbiaoqingxiaolian`"></use>
              </svg>
            </template>
          </el-popover>
          <el-upload
            :name="uploadId"
            class="upload-file"
            :on-remove="handleRemove"
            ref="uploadRef"
            :show-file-list="false"
            :multiple="true"
            :limit=4
            :on-change="handleChange"
            :auto-upload="false"
            :http-request="upLoadFile"
            :on-exceed="uploadExceed"
            style="margin-left: 15px"
          >
            <svg
              style="fill: currentColor;overflow: hidden;width: 2.6em;height: 2.6em;cursor: pointer"
              aria-hidden="true"
            >
              <use :xlink:href="`#icon-a-071_shangchuan`"></use>
            </svg>
          </el-upload>
      </div>
     <div class="file-card-wrapper" v-if="showFileList.length !== 0">
       <FilePictureCard :file-list="showFileList" :source="cancelSource" :progress="progress" :loading="loadingObj" :cur-session="currentChatSession"></FilePictureCard>
     </div>
      <el-row>
         <el-col :span="22" style="height: 155px"><div class="input_area" @drop="dropHandler" @dragover="dragOverHandler">
           <el-input rows="7"
                     v-model="msgContent"
                     type="textarea"
                     resize="none"
                     maxlength="8000"
                     show-word-limit
                     spellcheck="true"
                     input-style="background:#f5f5f5;border:none"
                     @keydown.enter="sendMessage"
                     @paste="pasteFile"
           ></el-input>
         </div></el-col>
         <el-col :span="2"><div class="send-btn-panel">
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
               <span class="send-btn" @click="sendMessage">
                 <svg
                   style="fill: currentColor;overflow: hidden;width: 1em;height: 1em;cursor: pointer"
                   aria-hidden="true"
                 >
              <use :xlink:href="`#icon-fasong`"></use>
            </svg>
                 发送</span>
             </template>
           </el-popover>
         </div>
         </el-col>
      </el-row>
   </div>
</template>
<style scoped>
  .emoji-list{
     .emoji-item{
        float: left;
        font-size: 23px;
        padding: 2px;
        text-align: center;
        border-radius: 3px;
        margin-left: 10px;
        margin-top: 5px;
        cursor: pointer;
        &hover{
           background: #ddd;
        }
     }
  }
  .upload-file{

  }
  .send-panel{
     margin-bottom: -8px;
     background: #211f1f;
     border-top: 1px solid #ddd;
     position: relative; /* 让子元素绝对定位不影响布局 */
     height: auto; /* 确保整体高度根据内容自适应 */
    .file-card-wrapper {
      margin-bottom: 10px; /* 添加底部间距，避免与下方内容重叠 */
    }
     .toolbar{
        height: 40px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        .iconfont{
           color: #b7b7b7;
           font-size: 20px;
           margin-right: 10px;
           cursor: pointer;
        }
        :deep(.el-tabs__header){
            margin-bottom: 0;
        }
     }

    .input_area {
      padding: 0 10px;
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

    .send-btn-panel {
      position: absolute; /* Positioning it absolutely */
      bottom: 10px; /* Adjust as needed */
      right: 5px; /* Adjust as needed */
      text-align: right;
      .send-btn {
        cursor: pointer;
        color: #f3e7e7;
        background: #9361e1;
        border-radius: 5px;
        padding: 8px 25px;
        &:hover {
          background: #a390d3;
        }
      }
      .empty-msg {
        font-size: 13px;
      }
    }
  }
</style>
