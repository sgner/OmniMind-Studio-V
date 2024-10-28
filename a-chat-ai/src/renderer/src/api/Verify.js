import request from "../utils/request"
import api from "../utils/Api"
export const verifyService = (id)=>{
  return request.get(api.checkCode,{params:{"temporaryId":id}})
}
