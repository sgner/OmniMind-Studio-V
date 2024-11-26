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
        break;
      case 14:
         console.log("消息为14")
         await wSender.send("receiveMessage",{messageType: message.messageType,musicList: message.extendData})
         break;
      case 15:
        console.log("消息为15")
        const session15  = message.extendData
        if (session15 !== null){
          session15.lastTime =new Date(session15.lastTime[0],session15.lastTime[1],session15.lastTime[2],session15.lastTime[3],session15.lastTime[4],session15.lastTime[5],Math.floor(session15.lastTime[6]/1000000)).getTime()
          console.log("session15",JSON.stringify(session15))
          session15.topType = 1
          await addChatSession(session15)
          await wSender.send("receiveMessage",{messageType: message.messageType,session:session15})
        }else{

        }
        break
      case 16:
        console.log("消息为16")
        const session16 = message.extendData
        if (session16 !== null){
          session16.lastTime = new Date(session16.lastTime[0],session16.lastTime[1],session16.lastTime[2],session16.lastTime[3],session16.lastTime[4],session16.lastTime[5],Math.floor(session16.lastTime[6]/1000000)).getTime()
          session16.topType = 1
          await addChatSession(session16)
          await wSender.send("receiveMessage",{messageType: message.messageType, session: session16})
        }
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

