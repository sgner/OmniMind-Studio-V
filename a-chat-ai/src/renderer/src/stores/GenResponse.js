import {defineStore} from "pinia";
import {ref} from 'vue'

export const useGenResponse = defineStore('genResponse',()=>{
    const genR = ref(false)
    const setGenR = (newGenR) =>{
        genR.value = newGenR
    }
    return {
      genR,
      setGenR
    }
  },
  {
    persist:true
  })
