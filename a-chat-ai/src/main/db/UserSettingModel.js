import {
  run,
  queryOne,
  queryCount,
  queryAll,
  insertOrReplace,
  insert,
  insertOrIgnore,
  update,
} from "./ADB";
import store from "../store";
import os from "os";
import path from "path";
import fs from "fs";


const userDir = os.homedir();
const updateRobotNoReadCount = ({userId,noReadCount})=>{
   return new Promise(async (resolve,reject)=>{
         let sql = "null";
         if(noReadCount ===0){
            resolve();
            return;
         }
         if(noReadCount){
           sql = "update user_setting set contact_no_read = contact_no_read+? where user_id = ?"
         }else{
            noReadCount = 0;
            sql = "update user_setting set contact_no_read = ? where user_id = ?"
         }
         await run(sql,[noReadCount,userId])
         resolve()
   })
}
const addUserSetting = async (userId,email)=>{
  try {

  }catch (error) {
    console.log(error);
  }
  let sql = "select max(server_port) as serverPort from user_setting"
  let result = await queryOne(sql,[])
  console.log("执行了adduserSetting")
  let serverPort = (result && result.serverPort !== null && result.serverPort !== undefined) ? result.serverPort + 1 : 10240;
  const sysSetting = {
      localFileFolder: userDir+"\\.a-chat-ai\\fileStorage\\"
  }
  sql = "select * from user_setting where user_id = ?"
  const user_setting = await queryOne(sql,[userId]);

  let resultServicePort = null;
  let localFileFolder = sysSetting.localFileFolder+userId;
  if(user_setting){
     await update("user_setting",{"email":email},{"userId":userId});
     resultServicePort = user_setting.serverPort;
     localFileFolder = JSON.parse(user_setting.sysSetting).localFileFolder+userId;
  }else {
     await insertOrIgnore("user_setting",{
        userId: userId,
        email: email,
        sysSetting: JSON.stringify(sysSetting),
        contactNoRead: 0,
        serverPort:serverPort
     })
  }

  store.setUserData("localServerPort",resultServicePort);
  store.setUserData("localFileFolder",localFileFolder)
}
export {
  updateRobotNoReadCount,
  addUserSetting
}
