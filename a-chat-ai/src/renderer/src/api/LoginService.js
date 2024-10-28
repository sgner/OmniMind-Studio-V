import request from "../utils/request"
import api from "../utils/Api"
export const loginService = (data)=>{
  return request.post(api.login,data)
}
