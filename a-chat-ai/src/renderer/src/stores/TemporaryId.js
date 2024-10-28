import {defineStore} from "pinia";
import {ref} from 'vue'

export const useTemporaryIdStore = defineStore('temporaryId',()=>{
        const temporaryId = ref('')
        const setTemporaryId = (newId) =>{
            temporaryId.value = newId
        }
        const removeId = () =>{
           temporaryId.value = ''
        }
        return {
            temporaryId ,setTemporaryId ,removeId
        }
    },
    {
        persist:true
    })