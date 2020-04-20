import Vue from 'vue'
import Router from 'vue-router'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      meta: {
        title: '登录'
      },
      component: resolve => require(['@/views/login'], resolve)
    },
    {
      path: '/home',
      meta: {
        title: '主容器'
      },
      component: resolve => require(['@/views/home'], resolve),
      children:[
      	{
          path: '/home',
          meta: {
            title: '水司端首页'
          },
          component: resolve => require(['@/views/ApplicationManagement'], resolve)
        },
        {
          path: '/ApplicationManagement',
          meta: {
            title: '应用管理'
          },
          component: resolve => require(['@/views/ApplicationManagement'], resolve)
        },
        {
          path: '/WorkflowDesign',
          meta: {
            title: '工作流设计'
          },
          component: resolve => require(['@/views/WorkflowDesign'], resolve)
        },
        {
          path: '/WorkflowMonitoring',
          meta: {
            title: '工作流监控'
          },
          component: resolve => require(['@/views/WorkflowMonitoring'], resolve)
        },
        {
          path: '/BasicSet',
          meta: {
            title: '基础配置'
          },
          component: resolve => require(['@/views/BasicSet'], resolve),
          children: [
            {
              path: '/',
              redirect:"PositionManagement"
            },
            {
                path: '/BasicSet/PositionManagement',
                meta: {
                title: '岗位管理'
                },
                component: resolve => require(['@/views/BasicSet/PositionManagement/index'], resolve),
                children:[],
            },
            {
                path: '/BasicSet/RoleLineManagement',
                meta: {
                title: '角色线管理'
                },
                component: resolve => require(['@/views/BasicSet/RoleLineManagement/index'], resolve),
                children:[],
            },
            {
                path: '/BasicSet/Organization',
                meta: {
                title: '组织架构'
                },
                component: resolve => require(['@/views/BasicSet/Organization/index'], resolve),
                children:[],
            },
            {
                path: '/BasicSet/UsersManagement',
                meta: {
                title: '组织架构'
                },
                component: resolve => require(['@/views/BasicSet/UsersManagement/index'], resolve),
                children:[],
            },
          ],
        },
        {
          path: '/SystemSet',
          meta: {
            title: '基础配置'
          },
          component: resolve => require(['@/views/SystemSet'], resolve),
          children: [
            {
              path: '/',
              redirect:"SystemUserManagement"
            },
            {
                path: '/SystemSet/SystemUserManagement',
                meta: {
                title: '系统用户管理'
                },
                component: resolve => require(['@/views/SystemSet/SystemUserManagement/index'], resolve),
                children:[],
            },
            {
                path: '/SystemSet/InterfaceCallLog',
                meta: {
                title: '接口调用日志'
                },
                component: resolve => require(['@/views/SystemSet/InterfaceCallLog/index'], resolve),
                children:[],
            },
            {
                path: '/SystemSet/DataDctionary',
                meta: {
                title: '接口调用日志'
                },
                component: resolve => require(['@/views/SystemSet/DataDctionary/index'], resolve),
                children:[],
            },
          ],
        },
      ]
    },
    {
      path: '/error',
      meta: {
        title: '错误页面'
      },
      component: resolve => require(['@/views/errorPage'], resolve)
    },
  ]
})
