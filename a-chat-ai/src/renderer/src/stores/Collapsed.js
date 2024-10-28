import {defineStore} from "pinia";
import {ref} from 'vue'

export const useCollapsedStore = defineStore('collapsed',()=>{
    const collapse = ref(false)
    const setCollapse = (newId) =>{
      collapse.value = newId
    }
    return {
      collapse ,setCollapse
    }
  },
  {
    persist:true
  })
