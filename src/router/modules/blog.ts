import { RouteRecordRaw } from 'vue-router'

const blogRoutes: RouteRecordRaw[] = [
  {
    path: '/blog',
    name: 'Blog',
    redirect: '/blog/list',
    meta: {
      title: '博客',
      icon: 'Document'
    },
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/blog/ArticleList.vue'),
        meta: { title: '文章列表', icon: 'List' }
      },
      {
        path: ':id',
        name: 'ArticleDetail',
        component: () => import('@/views/blog/ArticleDetail.vue'),
        meta: { title: '文章详情', hidden: true }
      }
    ]
  }
]

export default blogRoutes
