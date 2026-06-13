import { RouteRecordRaw } from 'vue-router'

// 静态路由（不需要权限就能访问）
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/blog/list'
  },
  {
    path: '/blog/list',
    name: 'ArticleList',
    component: () => import('@/views/blog/ArticleList.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/blog/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/blog/ArticleDetail.vue'),
    meta: { title: '文章详情', hidden: true }
  }
]
