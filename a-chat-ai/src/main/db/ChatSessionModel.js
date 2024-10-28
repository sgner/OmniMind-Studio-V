import {
  run,
  queryOne,
  queryCount,
  queryAll,
  insertOrReplace,
  insert,
  insertOrIgnore,
  update,
} from "./ADB";
import store from "../store";
import {segmentedEmits} from "element-plus";
const saveOrUpdateChatSessionBatch = (chatSessionList)=>{
     return new Promise(async (resolve, reject) => {
         try{
             for(let i =0;i<chatSessionList.length;i++){
                  const sessionInfo = chatSessionList[i];
                  sessionInfo.status = 1;
                 let sessionData = await selectUserSession(sessionInfo.robotId)
                 if(sessionData){
                   console.log("updateChatSession")
                     await updateChatSession(sessionData, sessionInfo)
                 }else{
                   console.log("addChatSession")
                  await addChatSession(sessionInfo)
                 }
             }
             resolve();
         } catch (error){
           console.log(error)
           resolve();
         }
     })
}

const updateNoReadCount = ({robotId,noReadCount})=>{
   let sql = "update session set no_read_count = no_read_count +? where user_id = ? and robot_id = ?"
   return run(sql,[noReadCount,store.getUserId(),robotId])
}

const selectUserSession = (robotId)=>{
    let sql = "select * from session where user_id=? and robot_id=?"
    return queryOne(sql, [store.getUserId(), robotId])
}
const updateChatSession = (sessionInfo)=>{
     const paramData = {
       userId: store.getUserId(),
       robotId: sessionInfo.robotId,
     }
     console.log(JSON.stringify(paramData))
     console.log(JSON.stringify(sessionInfo))
     const updateInfo = Object.assign({},sessionInfo);
     updateInfo.userId = null;
     updateInfo.robotId = null;
     return update("session",updateInfo,paramData)
}

const addChatSession = (sessionInfo)=>{
      sessionInfo.userId = store.getUserId();
      insertOrIgnore("session",sessionInfo)
}

const selectChatSessionList = async ()=>{
    let sql = "select * from session where user_id = ? and status = 1"
    console.log(store.getUserId())
    return await queryAll(sql,[store.getUserId()])
}

const saveChatMessage = ()=>{}

const readAll = async (robotId) =>{
      let sql = "update session set no_read_count = 0 where user_id = ? and robot_id = ?"
      return await run(sql,[store.getUserId(),robotId])
}

const updateSessionInfo4Message = (currentSessionId,{sessionId,robotName,lastMessage,lastTime,robotId,memberCount})=>{
   const params = [lastMessage,lastTime];
   let sql = "update session set last_message=?,last_time=?,status = 1 "
    if(robotName){
       sql += ",robot_Name=? "
       params.push(robotName)
    }
    if(memberCount){
       sql += ",member_count=? "
       params.push(memberCount)
    }
  if(currentSessionId !== sessionId){
     sql += ",no_read_count = no_read_count+1 "
  }
   sql += "where user_id = ? and robot_id = ? "
    params.push(store.getUserId(),robotId)
    return run(sql,params)
}
export {
  saveOrUpdateChatSessionBatch,
  updateNoReadCount,
  updateChatSession,
  selectChatSessionList,
  readAll,
  updateSessionInfo4Message
}
