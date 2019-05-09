import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'inform',
    component: Main,
    meta: {
      //  hideInBread: true,  hideInMenu: false,
      icon: 'logo-buffer',
      title: '通知'
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      },
      {
        path: 'order_page',
        name: 'order_page',
        meta: {
          icon: 'ios-basket',
          title: '订单中心'
        },
        component: () => import('@/view/single-page/order/index.vue')
      }
    ]
  },
  {
    path: '/meterials',
    name: 'meterials',
    meta: {
      icon: 'md-notifications',
      title: '物品管理'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: 'add_material',
        meta: {
          icon: 'ios-add',
          title: '添加物品'
        },
        component: () => import('@/view/materials/add.vue')
      },
      {
        path: 'inquire',
        name: 'inquire_material',
        meta: {
          icon: 'ios-hammer',
          title: '查询&修改物品信息'
        },
        component: () => import('@/view/materials/inquiry.vue')
      }
    ]
  },
  {
    path: '/food',
    name: 'food',
    meta: {
      icon: 'logo-snapchat',
      title: '菜单管理'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: 'add_food',
        meta: {
          icon: 'ios-add',
          title: '添加菜单'
        },
        component: () => import('@/view/food/add.vue')
      },
      {
        path: 'update',
        name: 'update_food',
        meta: {
          icon: 'ios-hammer',
          title: '查询&修改菜单信息'
        },
        component: () => import('@/view/food/update.vue')
      },
      {
        path: 'image',
        name: '图片管理',
        meta: {
          icon: 'ios-hammer',
          title: '菜单图片管理'
        },
        component: () => import('@/view/food/image.vue')
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '导入EXCEL'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '导出EXCEL'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'logo-yen',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: 'inquiry',
        name: 'order_inquiry',
        meta: {
          icon: 'md-stats',
          title: '订单查询'
        },
        component: () => import('@/view/order/inquiry.vue')
      }
    ]
  },
  {
    path: '/output',
    name: 'output',
    meta: {
      icon: 'logo-yen',
      title: '物品支出管理'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: 'output_add',
        meta: {
          icon: 'ios-add',
          title: '物品支出添加'
        },
        component: () => import('@/view/output/add.vue')
      },
      {
        path: 'in',
        name: 'output_in',
        meta: {
          icon: 'md-stats',
          title: '物品支出查询'
        },
        component: () => import('@/view/output/inquiry.vue')
      }
    ]
  },
  {
    path: '/multilevel',
    name: 'multilevel',
    meta: {
      icon: 'md-menu',
      title: '多级菜单'
    },
    component: Main,
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-2-1.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin'],
          icon: 'md-funnel',
          showAlways: true,
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'md-funnel',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
          },
          {
            path: 'level_2_2_2',
            name: 'level_2_2_2',
            meta: {
              icon: 'md-funnel',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'md-funnel',
          title: '二级-3'
        },
        component: () => import('@/view/multilevel/level-2-3.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
