<script setup>
import {useRoute, useRouter} from "vue-router";
import {useUserInfoStore} from "../../stores/UserInfo";
import AvatarBase from "../../components/AvatarBase.vue";
import hljs from 'highlight.js'; // 引入 highlight.js
import 'highlight.js/styles/vs2015.css';
const route = useRoute()
const router = useRouter()
import MarkdownIt from 'markdown-it';
import {ElMessage} from "element-plus";
import {ref, watch} from "vue";
import ChatMessageFilePictureCard from "./ChatMessageFilePictureCard.vue";
import {useUploadDataStore} from "../../stores/UploadData";
const props = defineProps({
   data:{
      type:Object,
      default:()=>{}
   },
  currentChatSession:{
      type: Object,
      default: {}
  }
})
hljs.configure({useBR:true});
const md = new MarkdownIt({
  highlight: (str, lang) => {
    let changeLang = ''
    if(lang === 'vue'){
       changeLang = 'html'
  }else if(!hljs.getLanguage(lang)||!lang||lang===''||lang===undefined){
       changeLang = 'plaintext';
    }else{
       changeLang = lang;
    }
    if (lang && hljs.getLanguage(changeLang)) {
      try {
        const preCode = hljs.highlight(str, { language: changeLang, ignoreIllegals: true }).value;
        const lines = preCode.split(/\n/).slice(0, -1);
        let html = lines.map((item, index) => {
          return `<li><span class="line-num" data-line="${index + 1}"></span>${item}</li>`;
        }).join('');
        html = `<ol>${html}</ol>`;
        html = `<span class="code-head"><b class="name">${lang}</b><button class="c-button" data-copy="${md.utils.escapeHtml(str)}"><span class="iconfont icon-fuzhi1" style="font-size: 15px"></span>复制</button></span>${html}`;
        return `<pre class="hljs"><code>${html}</code></pre>`;
      } catch (error) {
        console.error('Highlight error:', error);
      }
    }
    const preCode = md.utils.escapeHtml(str);
    const lines = preCode.split(/\n/).slice(0, -1);
    let html = lines.map((item, index) => {
      return `<li><span class="line-num" data-line="${index + 1}"></span>${item}</li>`;
    }).join('');
    html = `<ol>${html}</ol>`;
    return `<pre class="hljs"><code>${html}</code></pre>`;
  }
});

const userInfoStore = useUserInfoStore();
const renderMarkdown = (text) => {
  return md.render(text || '');
};
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('内容已复制到剪贴板');
  }).catch(() => {
    ElMessage.error('复制失败');
  });
};
const handleCopy = (e)=>{
      const target = e.target;
      if(target.classList.contains('c-button')){
        let textCopy = target.getAttribute('data-copy');
         copyToClipboard(textCopy);
      }
}
</script>
<template>
    <div class="message-content-my" v-if="data.question.userId === userInfoStore.userInfo.userId&&data.question.question!==''&&data.question.question!==null">
          <div :class="['content-panel',data.question.questionType===3? 'content-panel-media':'']">
            <div class="sending" v-if="data.question.status===0">
              <el-skeleton :animated="true">
                <template #template>
                   <el-skeleton-item class="skeleton-item" variant="image"/>
                </template>
              </el-skeleton>
            </div>
            <template v-else>
              <div class="content">
                <div class="grid-panel" v-if="JSON.parse(data.question.files)!==null&& JSON.parse(data.question.files).length>0">
                <div v-for="(file,index) in JSON.parse(data.question.files)">
                  <ChatMessageFilePictureCard :file="file" :index="index"></ChatMessageFilePictureCard>
                </div>
                </div>
                <div v-html="renderMarkdown(data.question.question)" v-if="data.question.questionType !== 3"></div>
                <div v-if="data.question.questionType === 3">
                  <!--      富文本消息-->
                </div>
              </div>
            </template>
          </div>
          <AvatarBase :width="35" :id="data.question.userId"></AvatarBase>
    </div>
    <div class="message-content-other" v-for="ans in data.question.answers">
        <div class="user-avatar">
             <AvatarBase :width="35" :id="ans.answerRobotId"></AvatarBase>
        </div>
        <div
          :class="['content-panel',ans.answerType === 3? 'content-panel-media':'' ,ans.answerRobotType===1?'group-content':'']">
          <div class="nick-name" v-if="ans.answerRobotType === 1">
              {{ans.answerRobotName}}
          </div>
          <div class="sending" v-if="ans.status === 0">
            <el-skeleton :animated="true">
                <template #template>
                   <el-skeleton-item class="skeleton-item" variant="image"/>
                </template>
            </el-skeleton>
          </div>
          <template v-else>
            <div class="content" @click="handleCopy" v-html="renderMarkdown(ans.answer)" v-if="ans.answerType !== 3"></div>
             <div class="content" v-else>媒体</div>
          </template>
        </div>
    </div>
</template>

<style scoped>
.grid-panel{
  border-radius: 10px;
  border: 1px solid #2c2c2c;
  background: #2c2c2c;
  display: grid;
  grid-template-columns: repeat(1,1fr);
}
@media (min-width: 300px) {
  .grid-panel{
    grid-template-columns: repeat(2,1fr);
  }
}
@media (min-width: 400px) {
  .grid-panel{
    grid-template-columns: repeat(4,1fr);
  }
}
.sending{
  width: 170px;
  height: 170px;
  overflow: hidden;
  float:right;
  margin-right: 5px;
  border-radius: 5px;
  .skeleton-item{
     width: 170px;
     height: 170px;
  }
}
.content{
   display: inline-block;
   padding: 8px;
   color: #474747;
   border-radius: 5px;
   text-align: left;
   font-size: 15px;
   :deep(.emoji){
       font-size: 20px;
   }
}
.content-panel {
   flex: 1;
   position: relative;
   &::after{
      content: "";
      position: absolute;
      display: block;
      width: 10px;
      background: #7e64de;
      transform: rotate(45deg);
      border-bottom: 2px;
      top: 13px;
   }
}
.content-panel-media{
   .content{
      border-radius: 5px;
      background: none !important;
      overflow: hidden;
      padding: 0;
   }
  &::after{
     display: none;
  }
}
.message-content-my{
   display: flex;
   .content-panel{
       margin-right: 10px;
       text-align: right;
       padding-left: 40px;
       .content{
          background: #7e64de;
          color: #fff;
       }
     &::after{
        right: -4px;
     }
   }
}
.message-content-other{
   display: flex;
   padding-right: 32%;
   padding-top: 30px;
   .avatar{
      margin-right: 10px;
      width: 35px;
      height: 35px;
   }
  .content-panel{
     flex: 1;
     position: relative;
     text-align: left;
     .nick-name{
        font-size: 12px;
        color: #9b9b9b;
     }
    .content{
       background: #fff;
    }
    .sending{
       float: left;
    }
    &::after{
       left: -4px;
       background: #fff;
    }
  }
  .content-panel-media{
     justify-content: flex-start;
  }
}
.group-content{
   margin-top: -6px;
   .content{
      margin-top: 6px;
   }
  &::after{
     left: -4px;
     top: 35px;
     background: #fff;
  }
}
:deep(.hljs) {
  background-color: #0a0a0a;
  border-radius: 10px;
  font-size: 16px;
  padding: 0; /* 去掉默认 padding */
}

:deep(.hljs code) {
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.hljs pre) {
  margin: 0;
  padding: 0;
}

:deep(.code-block){
  position: relative;
}
:deep(.code-block){
   background-color: #0c0c0c;
   border-radius: 10px;
}

:deep(pre.hljs) {
  padding: 8px 2px;
  border-radius: 5px;
  position: relative;
  ol {
    list-style: decimal;
    padding: 0;
    li {
      list-style: decimal-leading-zero;
      position: relative;
      padding-left: 10px;
      .line-num {
        position: absolute;
        left: -40px;
        top: 0;
        width: 40px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, .66);
      }
    }
  }
  b.name {
    position: absolute;
    top: 2px;
    right: 12px;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
}
:deep(.code-head){
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.c-button){
  color: white;
  cursor: pointer;
  background-color: transparent;
}
</style>
