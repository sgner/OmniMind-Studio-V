import api from "../utils/Api"
import {requestLock} from "../utils/request";
import request from "../utils/request";
import {useUploadDataStore} from "../stores/UploadData";
const uploadDataStore = useUploadDataStore()
export const sendChatMessage = (data,model,lock)=>{
  return requestLock(lock).post(api.chatWithChatGpt+model,data)
}
export const cosSendChatMessage = (data,lock)=>{
   return requestLock(lock).post(api.cosChat,{
       prompt: data.question,
       agentId: data.agentId,
       sessionId: data.sessionId
   })
}
export const uploadFile = (data,model,lock,cancelSource,percent)=>{
   return requestLock(lock).post(api.uploadFile+model,data,{
      headers:{
        "Content-Type": "multipart/form-data",
      },
     cancelToken: cancelSource.token,
     onUploadProgress:(progressEvent)=>{
          const percentCompleted = Math.round((progressEvent.loaded*100)/progressEvent.total);
          percent.value = percentCompleted
      }
   }).catch(e=>{
     if (e.type === 'TIMEOUT') {
        uploadDataStore.removeData(JSON.parse(data.get('session')).sessionId)
     }
   })
}
export const loadUploadedFile= (data)=>{
    return requestLock(false).get(api.loadUploadFile+data)
}

export const getAvatarUrl = (id)=>{
   return request.get(api.avatarUrl,{params:{robotId: id}})
}
