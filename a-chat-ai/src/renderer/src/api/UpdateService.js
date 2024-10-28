import request from "../utils/request"
import api from "../utils/Api"

export const updateSessionNoReadCountService = (data)=>{
   return request.get(api.clickUpdateSession,{params:{sessionId:data}})
}
