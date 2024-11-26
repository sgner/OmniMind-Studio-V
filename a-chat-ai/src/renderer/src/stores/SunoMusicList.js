import {defineStore} from "pinia";
import {ref} from 'vue'

export const useSunoMusicList = defineStore('sunoMusicList',()=>{
    const musicList = ref([])
    const setMusicList = (newMusicList) =>{
        musicList.value = newMusicList
    }
    return {
      musicList,
      setMusicList
    }
  },
  {
    persist:true
  })
