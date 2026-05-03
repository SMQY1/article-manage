import { RouteRecordRaw } from 'vue-router'

const blogRoutes: RouteRecordRaw[] = [
  {
    path: '/blog',
    name: 'Blog',
    redirect: '/blog/list',
    meta: {
      title: '博客管理',
      icon: 'Document',
      // 添加这一行，让菜单显示出来
      hidden: false
    },
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/blog/ArticleList.vue'),
        meta: {
          title: '文章列表',
          icon: 'List',
          hidden: false
        }
      },
      {
        path: 'detail/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/blog/ArticleDetail.vue'),
        meta: {
          title: '文章详情',
          hidden: true // 详情页不在侧边栏显示，保持 true
        }
      }
    ]
  }
]

export default blogRoutes
