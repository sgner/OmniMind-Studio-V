import request from "../utils/request"
import api from "../utils/Api"
export const subscribedRobotListService = (id) =>{
   return request.get(api.loadUserSubscribeRobotList+id)
}
export const robotSquareListService = (type)=>{
   return request.get(api.loadRobotSquareList+type)
}
export const robotDetailService = (data)=>{
   return request.post(api.loadRobotDetail,data)
}
export const commentListService = (data)=>{
   return request.post(api.comments,data)
}
