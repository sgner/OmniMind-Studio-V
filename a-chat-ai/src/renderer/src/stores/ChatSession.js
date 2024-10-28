import {defineStore} from "pinia";
import {ref} from 'vue'

export const useChatSessionStore = defineStore('chatSession',()=>{
    const chatSession = ref(null)
    const setChatSession = (newSession) =>{
        chatSession.value = newSession
    }
    return {
      chatSession,
      setChatSession
    }
  },
  {
    persist:true
  })
