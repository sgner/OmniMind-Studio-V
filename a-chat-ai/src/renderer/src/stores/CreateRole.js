import {defineStore} from "pinia";
import {ref} from 'vue'

export const useCreateRoleStore = defineStore("createRole", ()=>{
    const createRole = ref(false)
    const setCreateRole = (newCreateRole)=>{
      this.createRole = newCreateRole
    }
    return {
      createRole,
      setCreateRole
    }
  })
