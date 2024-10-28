import {defineStore} from "pinia";
import {ref} from 'vue'

export const useRightTitleStore = defineStore('rightTitle',()=>{
    const rightTitle = ref()
    const setRightTitle = (title) =>{
        rightTitle.value = title
    }
    return {
      rightTitle,
      setRightTitle
    }
  },
  {persist:true}
)
