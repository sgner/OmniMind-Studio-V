import {defineStore} from "pinia";
import {ref} from 'vue'

export const useChatMessageStore = defineStore('chatMessage',()=>{
    const message = ref([])
    const setChatMessage = (newMessage) =>{
      message.value = newMessage
    }
    return {
      message,
      setChatMessage
    }
  },
  {
    persist:true
  })
