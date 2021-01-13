import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/login.vue'
import Home from './../components/home.vue'
import Welcome from './../components/welcome.vue'
import ProjectSingle from './../components/project/single.vue'
import ProjectGroup from './../components/project/group.vue'
import ConfigUser from './../components/config/user.vue'
import ConfigPermission from './../components/config/permission.vue'
import ConfigUserInfo from './../components/config/user/userInfo.vue'
import FileOnline from './../components/file/online.vue'
import FileOnlineFile from './../components/file/onlineFile.vue'
import NoSelect from './../components/file/noSelect.vue'
import NetWorkDisk from './../components/file/networkDisk.vue'


Vue.use(VueRouter)

const routes = [

  {
    path: '/login', component: Login
  },
  {
    path: '/', redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome ,meta: {
        keepAlive: true
      }},
      {
        path: '/project/single',
        component: ProjectSingle,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/project/group',
        component: ProjectGroup,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/config/user',
        component: ConfigUser,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/config/permission',
        component: ConfigPermission,
        meta: {
          keepAlive: true
        }
      },
      { path: '/config/user/userInfo/:uid', component: ConfigUserInfo, props: true ,meta: {
        keepAlive: true
      }},
      {
        path: '/folder/online', component: FileOnline,meta: {
          keepAlive: true
        },
        redirect:'/folder/online/noSelect',
        children:[
          {
            path: 'file/:id', component: FileOnlineFile,props: true
          },
          {
            path: 'noSelect', component: NoSelect
          }
        ]
      },{
        
        path: '/folder/cloud', component: NetWorkDisk,meta: {
          keepAlive: true
        }
      }

    ]
  }
]

const router = new VueRouter({
  base:'/management-front/',
  routes
})

// 挂载路由守卫,to : 将要访问的路径，from：代表从哪个路径的来的 next：表示放行函数
router.beforeEach((to, from, next) => {
  // 登录页不拦截，直接放行
  if (to.path === '/login') return next()
  const token = window.localStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

// 解决路由连续跳转的error
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default router
