<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const articles = ref<any[]>([])
  const router = useRouter()

  const goToCreate = () => router.push('/article-manage/create')
  const goToEdit = (id: string) => router.push(`/article-manage/edit/${id}`)
  // 初始化文章数据（如果没有的话）
  const initArticles = () => {
    const existing = localStorage.getItem('blog_articles')
    if (!existing) {
      const defaultArticles = [
        {
          id: '1',
          title: '我的第一篇博客',
          content: '这是用 localStorage 存储的第一篇文章。',
          createTime: new Date().toLocaleString()
        },
        {
          id: '2',
          title: 'Vue 3 组合式 API 学习笔记',
          content: 'ref、reactive、computed、watch 是组合式 API 的核心。',
          createTime: new Date().toLocaleString()
        }
      ]
      localStorage.setItem('blog_articles', JSON.stringify(defaultArticles))
    }
  }

  // 加载文章列表
  const loadArticles = () => {
    const data = localStorage.getItem('blog_articles')
    articles.value = data ? JSON.parse(data) : []
  }

  onMounted(() => {
    initArticles() // 确保有数据
    loadArticles() // 加载到页面
  })

  const deleteArticle = (id: string) => {
    const newList = articles.value.filter((a) => a.id !== id)
    localStorage.setItem('blog_articles', JSON.stringify(newList))
    loadArticles() // 重新加载
  }
</script>

<template>
  <div style="padding: 20px">
    <h1>📝 文章管理</h1>
    <button @click="goToCreate">➕ 发布文章</button>

    <table
      border="1"
      cellpadding="8"
      cellspacing="0"
      style="width: 100%; border-collapse: collapse"
    >
      <thead>
        <tr><th>标题</th><th>创建时间</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.createTime }}</td>
          <td>
            <button @click="goToEdit(article.id)">编辑</button>
            <button @click="deleteArticle(article.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
