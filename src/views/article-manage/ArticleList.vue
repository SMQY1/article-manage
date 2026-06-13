<template>
  <div style="padding: 20px">
    <h1>📝 文章管理</h1>
    <button @click="goToCreate" style="margin-bottom: 16px">➕ 发布文章</button>

    <table
      border="1"
      cellpadding="8"
      cellspacing="0"
      style="width: 100%; border-collapse: collapse"
    >
      <thead>
        <tr>
          <th>标题</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.createTime || article.date }}</td>
          <td>
            <button @click="goToEdit(article.id)">编辑</button>
            <button @click="handleDelete(article.id)" style="margin-left: 8px">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getArticles, deleteArticle } from '@/api/article'

  const router = useRouter()
  const articles = ref<any[]>([])

  const loadArticles = async () => {
    try {
      const res = await getArticles()
      articles.value = res.data
    } catch (error) {
      console.error('加载文章失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除吗？')) {
      try {
        await deleteArticle(id)
        await loadArticles()
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  const goToEdit = (id: number) => {
    router.push(`/article-manage/edit/${id}`)
  }

  const goToCreate = () => {
    router.push('/article-manage/create')
  }

  onMounted(() => {
    loadArticles()
  })
</script>
