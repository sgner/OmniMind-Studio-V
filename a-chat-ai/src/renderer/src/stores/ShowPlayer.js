import {defineStore} from "pinia";
import {ref} from 'vue'

export const useShowPlayerStore = defineStore('showPlayer',()=>{
    const showPlayer = ref({
        show: false,
        index: 0
    })
    const setShowPlayer = (showPlayer) =>{
        showPlayer.value = showPlayer
    }
    return {
      showPlayer,
      setShowPlayer
    }
  },
  {persist:true}
)
