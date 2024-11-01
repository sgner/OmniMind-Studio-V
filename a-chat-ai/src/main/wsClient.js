import WebSocket from "ws";
import store from "./store";
let ws = null;
let maxReConnectTimes = null;
let lockReconnect = false;
let wsUrl = null;
let wSender = null;
let needReconnect = null;
import {addChatSession, saveOrUpdateChatSessionBatch, updateSessionInfo4Message} from './db/ChatSessionModel'
import {saveMessage, saveMessageBatch} from "./db/ChatMessageModel";
import {updateNoReadCount} from "./db/ChatSessionModel";

const initWs = (data,sender)=>{
    wsUrl =`${store.getData("devWsDomain")}? token=${data.jwt}`
    wSender = sender
    needReconnect = true
    maxReConnectTimes = 5;
    createWs();
}
const closeWs = ()=>{
  needReconnect = false;
  ws.close()
}
const createWs = ()=>{
  if(wsUrl===null){
    return;
  }
  ws = new WebSocket(wsUrl);
  ws.onopen = ()=>{
    console.log("客户端连接成功");
    ws.send("heart beat");
    maxReConnectTimes = 5;
  }
  ws.onmessage =  async (e)=>{
    // console.log("收到服务端消息",e.data);
    const message = JSON.parse(e.data);
    // console.log("收到服务端消息",message.extendData.messageList);
    // console.log("收到服务端消息",message.extendData.messageList[0].answers);
    switch(message.messageType){
      case 0:
        await saveOrUpdateChatSessionBatch(message.extendData.sessionList);
        await wSender.send("receiveMessage",{messageType: message.messageType})
        await saveMessageBatch(message.extendData.messageList)
        // await updateNoReadCount({robotId:,noReadCount:});
        break;
      case 12:
      case 2:
        console.log("消息为2")
        await saveMessage(message.extendData);
        //TODO updateSession BUG 未解决
        await updateSessionInfo4Message(store.getUserData("currentSessionId"),
          {
            sessionId:message.sessionId,
            robotName:message.sendUserNickName,
            lastMessage:message.lastMessage,
            lastTime: message.sendTime,
            robotId: message.sendUserId,
            memberCount:null
          }
        );
        await wSender.send("receiveMessage",{messageType: 0});
        break;
      case 13:
        console.log("消息为13")
        await saveMessage(message.extendData.messageDTO);
        // console.log("message",JSON.stringify(message))
        const session  =  message.extendData.sessionChatUser
        session.status = 1
        session.noReadCount = 0
        session.lastTime =new Date(session.lastTime).getTime()
        // console.log("session",session)
        await addChatSession(session)
        await wSender.send("receiveMessage",{messageType: 0})
    }
  }
  ws.onclose = ()=>{
    console.log("客户端连接关闭，正在尝试重连");
      store.setUserData("currentSessionId",null)
      store.setUserData("listOffTime",Date.now())
      reconnect()
  }
  ws.onerror = ()=>{
     console.log("客户端连接错误,正在尝试重连");
     reconnect()
  }

  const reconnect = ()=>{
       if(!needReconnect){
            console.log("客户端连接关闭,无法重连");
             return;
       }
       if(ws !== null){
         ws.close();
       }
       if(lockReconnect){
         return;
       }
       lockReconnect = true;
       if(maxReConnectTimes>0){
           console.log("客户端连接异常,正在重连,剩余次数"+maxReConnectTimes,new Date().getTime());
           maxReConnectTimes--;
           setTimeout(()=>{
               createWs();
               lockReconnect = false;
           },5000);
       }else{
         console.log("客户端连接超时,无法重连");
       }
  }
  setInterval(()=>{
    if(ws!==null&&ws.readyState === 1){
      // console.log("客户端心跳",new Date().getTime());
      ws.send("heart beat");
    }
  },5000);
}
export {
   initWs,
   closeWs,
   createWs
}

