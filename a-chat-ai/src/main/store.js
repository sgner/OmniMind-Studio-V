const Store = require('electron-store');
Store.initRenderer();
const store = new Store();
let userId= null;
const initUserId = (_userId)=>{
   userId = _userId;
}
const getUserId = ()=>{
    return userId;
}
const setData = (key, value) => {
    store.set(key, value);
}
const getData = (key) => {
  if (key === undefined) {
    throw new Error("Key must be defined");
  }
    return store.get(key);
}

const removeData = (key) => {
    store.delete(key);
}
const setUserData=(key,value)=>{
     setData(userId+key,value)
}
const getUserData=(key)=>{
    return getData(userId+key)
}
const delUserData=(key)=>{
    removeData(userId+key)
}
export default {
  setData,
  getData,
  removeData,
  setUserData,
  initUserId,
  getUserId,
  getUserData,
  delUserData
}
