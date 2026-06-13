<template>
  <div class="article-detail-container">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← 返回列表</button>
      <button class="edit-btn" @click="goToEdit">✏️ 编辑这篇文章</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="article" class="article-content">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span>📅 {{ formatDate(article.createTime || article.date) }}</span>
        <span>🏷️ {{ article.category || '未分类' }}</span>
      </div>
      <div class="article-body" v-html="article.content"></div>
    </div>

    <div v-else class="empty">文章不存在</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getArticle } from '@/api/article'

  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const article = ref<any>(null)

  const fetchArticleDetail = async () => {
    loading.value = true
    try {
      const id = route.params.id as string
      const res = await getArticle(id)
      article.value = res.data
    } catch (error) {
      console.error('加载文章失败:', error)
      article.value = null
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    router.push('/blog/list')
  }

  const goToEdit = () => {
    const articleId = route.params.id
    router.push(`/article-manage/edit/${articleId}`)
  }

  onMounted(() => {
    fetchArticleDetail()
  })

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month}-${day}`
  }
</script>

<style scoped>
  .article-detail-container {
    max-width: 900px;
    padding: 30px 20px;
    margin: 0 auto;
  }

  .detail-header {
    display: flex;
    gap: 16px;
    margin-bottom: 30px;
  }

  .back-btn {
    padding: 8px 0;
    font-size: 16px;
    color: #409eff;
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: #66b1ff;
  }

  .edit-btn {
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    background-color: #67c23a;
    border: none;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .edit-btn:hover {
    background-color: #85ce61;
  }

  .article-content {
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
  }

  .article-title {
    margin-bottom: 20px;
    font-size: 32px;
    color: #2c3e50;
  }

  .article-meta {
    display: flex;
    gap: 20px;
    padding-bottom: 20px;
    margin-bottom: 30px;
    font-size: 14px;
    color: #909399;
    border-bottom: 1px solid #eaeef5;
  }

  .article-body {
    font-size: 16px;
    line-height: 1.8;
    color: #2c3e50;
  }

  .article-body h2 {
    padding-bottom: 8px;
    margin: 30px 0 15px;
    font-size: 24px;
    border-bottom: 1px solid #eaeef5;
  }

  .article-body h3 {
    margin: 25px 0 12px;
    font-size: 20px;
  }

  .article-body p {
    margin-bottom: 16px;
  }

  .article-body ul,
  .article-body ol {
    padding-left: 24px;
    margin: 16px 0;
  }

  .article-body li {
    margin: 8px 0;
  }

  .article-body code {
    padding: 2px 6px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .loading,
  .empty {
    padding: 60px;
    color: #909399;
    text-align: center;
  }

  /* 文章详情页的图片样式 */
  .article-body img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 16px auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }
</style>
