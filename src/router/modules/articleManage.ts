import { RouteRecordRaw } from 'vue-router'

const articleManageRoutes: RouteRecordRaw[] = [
  {
    path: '/article-manage',
    name: 'ArticleManage',
    meta: {
      title: '文章管理',
      icon: 'Document',
      hidden: false
    },
    children: [
      {
        path: 'list',
        name: 'ArticleManageList',
        component: () => import('@/views/article-manage/ArticleList.vue'),
        meta: { title: '文章列表', icon: 'List' }
      },
      {
        path: 'create',
        name: 'ArticleManageCreate',
        component: () => import('@/views/article-manage/ArticleForm.vue'),
        meta: { title: '发布文章', icon: 'Edit' }
      },
      {
        path: 'edit/:id',
        name: 'ArticleManageEdit',
        component: () => import('@/views/article-manage/ArticleForm.vue'),
        meta: { title: '编辑文章', hidden: true }
      }
    ]
  }
]

export default articleManageRoutes
