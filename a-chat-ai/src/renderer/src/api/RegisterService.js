import request from "../utils/request"
import api from "../utils/Api"
export const registerService = (data)=>{
  return request.post(api.register,data)
}
