import {defineStore} from "pinia";
import {ref} from 'vue'

export const useRobotTypeStore = defineStore('robotType',()=>{
    const robotType = ref()
    const setRobotType = (type) =>{
      robotType.value = type
    }
    return {
      robotType,
      setRobotType
    }
  },
  {persist:true}
  )
