import login from "@/views/Login.vue"
import main from "@/views/Main.vue"
import {createRouter, createWebHashHistory} from "vue-router";
const routes=[
  {
    path:"/",
    name:'默认路径',
    redirect:"/login"
  },
  {
    path:"/login",
    name:'登录',
    component: login,
  },
  {
    path:"/main",
    name:'主界面',
    component: main,
    redirect:"/main/chat",
    children:[
      {
        path:"/main/chat",
        name:'聊天主窗口',

        component: ()=>import("@/views/chat/Chat.vue")
      },
      {
        path:"/main/robot",
        name:"机器人",
        redirect: '/robot/blank',
        component:()=>import("../views/robot/Robot.vue"),
        children:[
          {
            path: "/robot/detail",
            name: "机器人详情",
            component:()=>import("../views/robot/RobotDetail.vue")
          },
          {
            path: "/robot/blank",
            name: "默认空白页",
            component:()=>import("../views/robot/BlankPage.vue")
          },
          {
            path: '/robot/projectAddr/gitee',
            name:'gitee链接',
            component:()=>import("../views/robot/GitEE.vue")
          },
          {
            path: '/robot/projectAddr/github',
            name:'github链接',
            component:()=>import("../views/robot/GitHub.vue")
          },
          {
            path: '/robot/subscribe',
            name:'机器人广场',
            component:()=>import("../views/robot/RobotSquare.vue")
          }
        ]
      },
      {
        path:"/main/setting",
        name:"设置",
        component:()=>import("../views/setting/Setting.vue")
      }
    ]
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes: routes
})

export default router;
