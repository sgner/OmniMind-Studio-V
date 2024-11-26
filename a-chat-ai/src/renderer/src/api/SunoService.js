import request from "../utils/request"
import api from "../utils/Api"
import {requestLock} from "../utils/request"
export const getSunoMusicService = ()=>{
   return  requestLock(false).get(api.sunoSongList)
}
export const genSunoMusicService = (type,data)=>{
      if(type === '1'){
     return   request.post(api.genSongCustom,data)
    }else if(type === '2') {
      return request.post(api.genSonSim,data)
    }
}
