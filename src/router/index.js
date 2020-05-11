import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path:'/',
    name:'userMgt',
    component:Layout,
    redirect:'/userMgt/user',
    meta:{title:'用户管理',icon:'user'},
    children:[
      { name:'user',
        path:'/userMgt/user',
        component: () => import('@/views/userMgt/user'),
        meta:{title:'用户管理',icon:'user'}
      }
    ]
  },
  {
    path:'/scenesMgt',
    name:'scenesMgt',
    component:Layout,
    redirect:'/scenesMgt/scenes',
    meta:{title:'场景管理',icon:'theme'},
    children:[
      { name:'user',
        path:'/scenesMgt/scenes',
        component: () => import('@/views/scenesMgt/scenes'),
        meta:{title:'场景管理',icon:'theme'}
      }
    ]
  },
  {
    path:'/testBankMgt',
    name:'testBankMgt',
    component:Layout,
    redirect:'/testBankMgt/index',
    meta:{title:'题库管理',icon:'education'},
    children:[
      { name:'user',
        path:'/testBankMgt/index',
        component: () => import('@/views/testBankMgt/index'),
        meta:{title:'题库管理',icon:'education'}
      }
    ]
  },
  {
    path:'/ranking',
    name:'ranking',
    component:Layout,
    redirect:'/ranking/index',
    meta:{title:'答题排行',icon:'nested'},
    children:[
      { name:'rankindex',
        path:'/ranking/index',
        component: () => import('@/views/ranking/index'),
        meta:{title:'答题排行',icon:'skill'}
      }
    ]
  },
  {
    path:'/blessing',
    name:'blessing',
    component:Layout,
    redirect:'/blessing/index',
    meta:{title:'云祝福数据',icon:'documentation'},
    children:[
      { name:'blessindex',
        path:'/blessing/index',
        component: () => import('@/views/blessing/index'),
        meta:{title:'云祝福数据',icon:'table'}
      }
    ]
  },
  {
    path:'/photo',
    name:'photo',
    component:Layout,
    redirect:'/photo/index',
    meta:{title:'云合影数据',icon:'documentation'},
    children:[
      { name:'photoIndex',
        path:'/photo/index',
        component: () => import('@/views/photo/index'),
        meta:{title:'云合影数据',icon:'people'}
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
