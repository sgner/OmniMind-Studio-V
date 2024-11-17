import {defineStore} from "pinia";
import {ref} from 'vue'

export const useUploadDataStore = defineStore('uploadData',()=>{
    const data = ref({})
    const setData = (session,newData) =>{
         data.value[session] = newData
    }
    const removeData = (session)=>{
         data.value[session] = []
    }
    const removeDataByIndex = (session,index)=>{
      console.log(index)
      const fileList = data.value[session];
      if (Array.isArray(fileList) && index >= 0 && index < fileList.length) {
        fileList.splice(index, 1);
        data.value[session] = fileList;
      }
      return data.value[session];
    }
    return {
        data,
        setData,
        removeData,
        removeDataByIndex
    }
  },
  {
    persist:true
  }
)
