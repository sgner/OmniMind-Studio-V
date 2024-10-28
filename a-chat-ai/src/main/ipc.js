import { ipcMain } from 'electron'
import store from './store'
import {initWs} from "./wsClient"
import {addUserSetting} from "./db/UserSettingModel";
import {readAll} from "./db/ChatSessionModel";
const changeWindowSize = (callback)=>{
       ipcMain.on('routerToMain',(_,size)=>{
            callback(size)
       })
}
const loginSuccess = (callback)=>{
  ipcMain.on('successLogin',(e,data)=>{
        store.initUserId(data.userId)
        store.setUserData('token',data.jwt);
        addUserSetting(store.getUserId(),data.email)
        callback(data)
       initWs(data,e.sender)
  })
}
const winTitleOp = (callback)=>{
   ipcMain.on('winTitleOp',(e,data)=>{
            callback(e,data)
   })
}
const setLocalStore = (callback)=>{
   ipcMain.on('setLocalStore',(_,data)=>{
         callback(data)
   })
}
const setSessionSelect = ()=>{
      ipcMain.on("setSessionSelect",async (e,{robotId,sessionId})=>{
          if(sessionId){
            store.setUserData("currentSessionId",sessionId)
            await readAll(robotId)
          }else{
             store.delUserData("currentSessionId")
          }
      })
}
export {
   changeWindowSize,
   loginSuccess,
  winTitleOp,
  setLocalStore,
  setSessionSelect
}
