import {contextBridge, ipcRenderer, shell} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// Custom APIs for renderer

const loadChatSession =async () =>{
   return await ipcRenderer.invoke('loadSessionData')
}

const preApi = {
  "routerToMain":(data)=>{
       ipcRenderer.send('routerToMain',data)
  },
  'successLogin':(data)=>{
      ipcRenderer.send('successLogin',data)
  },
  'winTitleOp': (action,data)=>{
        ipcRenderer.send('winTitleOp',{action,data})
  },
  'openLink': (url)=>{
       shell.openExternal(url)
  },
  'setLocalStore':(data)=>{
      ipcRenderer.send('setLocalStore',data)
  },
  'getLocalStore':(key)=>{
     return ipcRenderer.invoke("getLocalStore",key)
  },
  "receiveMessage": (callback) => {
      ipcRenderer.on("receiveMessage", async (e, data) => {
      // console.log("收到消息：" + data.messageType);

      if (data.messageType === 0) {
        try {
          const session = await loadChatSession();
          callback(null, session);  // 使用回调传递消息内容
        } catch (error) {
          callback(error, null);  // 如果发生错误，传递错误信息
        }
      } else {
        callback(null, data);  // 如果是其他类型的消息，也通过回调返回
      }
    });
  },
  'setTop':async (robotId,isTop)=>{
    return await ipcRenderer.invoke("setTop", {robotId, isTop})
  },
  'delSession': async (robotId)=>{
     return await ipcRenderer.invoke("delSession",robotId)
  },
  'loadChatMessage':async (sessionId,pageNo,maxMessageId)=>{
      return await ipcRenderer.invoke('loadChatMessage',{sessionId,pageNo,maxMessageId})
  },
  'saveChatMessage':async (data)=>{
       return await ipcRenderer.invoke("saveChatMessage",data)
    },
  'setSessionSelect':async (robotId,sessionId)=>{
       await ipcRenderer.send("setSessionSelect",{robotId,sessionId})
  },
  'loadChatSession': async ()=>{
      return  await loadChatSession()
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('preApi', preApi)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
