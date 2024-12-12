import {defineStore} from "pinia";
import {ref} from 'vue'

export const useRoleCardStore = defineStore("roleCard", ()=>{
   const roleCard = ref([])
   const setRoleCard = (newRoleCard)=>{
        this.roleCard = newRoleCard;
   }
   return {roleCard, setRoleCard}
},
  {persist:true}
)
