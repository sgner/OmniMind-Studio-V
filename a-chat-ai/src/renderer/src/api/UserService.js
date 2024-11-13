import request from "../utils/request"
import api from "../utils/Api"

export const likeService = (comment)=>{
  return request.post(api.like,{commentId:comment.id,robotId: comment.robotId})
}

export const commentService = (data)=>{
   return request.post(api.comment,data)
}

export const createSessionService = (data)=>{
   return request.get(api.createSession,{params:{robotId:data}})
}

export const applyRobotService = (data)=>{
   return request.post(api.applyRobot,data)
}
