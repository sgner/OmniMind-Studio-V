import request from "../utils/request"
import api from "../utils/Api"

export const getSunoMusicService = ()=>{
   return  request.get(api.sunoSongList)
}
