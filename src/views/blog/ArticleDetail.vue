<template>
  <div class="article-detail-container">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← 返回列表</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 文章内容 -->
    <div v-else-if="article" class="article-content">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span>📅 {{ article.date }}</span>
        <span>🏷️ {{ article.category || '未分类' }}</span>
      </div>
      <div class="article-body" v-html="article.content"></div>
    </div>

    <!-- 文章不存在 -->
    <div v-else class="empty">文章不存在</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const article = ref<any>(null)

  const fetchArticleDetail = async () => {
    loading.value = true
    try {
      const id = route.params.id as string
      console.log('当前文章ID:', id)

      const stored = localStorage.getItem('blog_articles')
      console.log('localStorage 数据:', stored)

      if (stored) {
        const articles = JSON.parse(stored)
        console.log('解析后的文章数组:', articles)

        const found = articles.find((a: any) => String(a.id) === String(id))
        console.log('找到的文章:', found)

        if (found) {
          article.value = {
            id: found.id,
            title: found.title,
            content: found.content || '暂无内容',
            date: found.createTime || new Date().toLocaleDateString(),
            category: found.category || '技术'
          }
          console.log('赋值后的 article:', article.value)
        } else {
          article.value = null
          console.warn('未找到文章, ID:', id)
        }
      } else {
        article.value = null
        console.warn('localStorage 中没有数据')
      }
    } catch (error) {
      console.error('加载失败:', error)
      article.value = null
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    router.push('/blog/list')
  }

  onMounted(() => {
    fetchArticleDetail()
  })
</script>

<style scoped>
  .article-detail-container {
    max-width: 900px;
    padding: 30px 20px;
    margin: 0 auto;
  }

  .detail-header {
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
</style>
