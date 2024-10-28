import request from "../utils/request"
import api from "../utils/Api"

export const likeService = (comment)=>{
  return request.post(api.like,{commentId:comment.id,robotId: comment.robotId})
}

export const commentService = (data)=>{
   return request.post(api.comment,data)
}
