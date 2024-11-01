import { app, shell, BrowserWindow, ipcMain ,Menu,Tray} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/robot.png?asset'
const login_width = 300;
const login_height = 440;
import {changeWindowSize, loginSuccess, winTitleOp, setLocalStore,setSessionSelect} from "./ipc";
import store from './store'
const register_height =530;
const main_width = 1324;
const main_height = 868;
import {selectChatSessionList, updateChatSession, updateSessionInfo4Message} from "./db/ChatSessionModel";
import {queryAll, update} from "./db/ADB";
import dayjs from "dayjs";
import {selectMessageList,saveMessage} from "./db/ChatMessageModel";
require('dayjs/locale/de')
dayjs.locale('zh-cn')
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: login_width,
    height: login_height,
    show: false,
    icon:icon,
    autoHideMenuBar: true,
    resizable:false,
    frame:true,
    titleBarStyle:"hidden",
    transparent:true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle('爱聊AI')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const tray = new Tray(icon);
  const contextMenu = [
    {label:'退出A-AI',click:function (){
      app.exit();
      }}
  ]

  const menu = Menu.buildFromTemplate(contextMenu);
  tray.setToolTip('A-AI')
  tray.setContextMenu(menu);
  tray.on('click',()=>{
    mainWindow.setSkipTaskbar(false)
    mainWindow.show();
  })
   changeWindowSize((size)=>{
     mainWindow.setResizable(true)
     if(size===null||size===undefined || size===''){
         mainWindow.setSize(main_width,main_height)
     }else {
       mainWindow.setSize(size.width,size.height)
     }
     mainWindow.center()
     mainWindow.setMaximizable(true)
     // mainWindow.setMaximumSize(1424,1068)
     mainWindow.setMinimumSize(1354,768)
   })

  loginSuccess((data)=>{
     contextMenu.unshift({
       label: '用户：'+ data.username,click: function (){
       }
     })
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
  })

  setLocalStore((data)=>{
        store.setData(data.key,data.value)
  })


  ipcMain.handle('getLocalStore',(_,key)=>{
     // console.log(key)
    return store.getData(key)
  })

  ipcMain.handle('loadSessionData',async (e)=>{
    return await selectChatSessionList();
  })

  ipcMain.handle('setTop',async (e,{robotId,isTop})=>{
      await update('session',{topType:isTop},{robotId:robotId,userId:store.getUserId()})
      return await queryAll( "select * from session where user_id = ? and status = 1",[store.getUserId()])
  })
  ipcMain.handle('delSession',async (e,robotId)=>{
    await update('session',{status:0},{robotId:robotId,userId:store.getUserId()})
    return await queryAll( "select * from session where user_id = ? and status = 1",[store.getUserId()])
  })
  ipcMain.handle('loadChatMessage',async(e,{sessionId,pageNo,maxMessageId})=>{
      return await selectMessageList({sessionId: sessionId,pageNo:pageNo,maxMessageId:maxMessageId});
  })
  ipcMain.handle("saveChatMessage",async (e,data)=>{
      await saveMessage(data)
      await updateSessionInfo4Message(store.getUserData("currentSessionId"), data.question)
      return {status:1,messageId:data.question}

  })
  setSessionSelect();
  winTitleOp((e,{action,data})=>{
       const webContests = e.sender;
       const win = BrowserWindow.fromWebContents(webContests)
       switch(action){
         case 'close':{
           if(data.closeType === 0){
             win.close()
           }else {
             win.setSkipTaskbar(true);
             win.hide()
           }
           break;
         }
         case 'minimize' :{
             win.minimize();
             break;
         }
         case 'maximize':{
           win.maximize();
           break;
       }
         case "unmaximize":{
           win.unmaximize()
           break;
         }
         case "top":{
           win.setAlwaysOnTop(data.top)
           break
         }
    }
  })

  // ipcMain.on('routerToMain',()=>{
  //   changeWindowSize(main_width,main_height)
  // })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
