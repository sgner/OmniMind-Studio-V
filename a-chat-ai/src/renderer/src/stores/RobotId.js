import {defineStore} from "pinia";
import {ref} from 'vue'

export const useRobotIdStore = defineStore('robotId',()=>{
    const robotId = ref()
    const setRobotId = (id) =>{
        robotId.value = id
    }
    return {
        robotId,
        setRobotId
    }
  },
  {persist:true}
)
