import request from "../utils/request"
import api from "../utils/Api"

export const initPlayer = (data,fast)=>{
   return request.post(fast?api.initPlayerFast :api.initPlayer,data)
}

export const getRoleList = ()=>{
   return request.get(api.roleList)
}

export const modifyPlayer = (data)=>{
    return request.put(api.roleList,data)
}

export const modifyRole = (data)=>{
   return request.put(api.modifyRole,data)
}

export const session =(data)=>{
   return request.post(api.cosSession,data)
}
export const addRole = (data)=>{
   return request.post(api.addRole,data)
}
export const delRole = (data)=>{
    return request.delete(api.deleteRole+"/"+data.id,{params:{name:data.name}})
}
export const delPlayer = (data)=>{
    return request.delete(api.roleList+"/"+data.id)
}
