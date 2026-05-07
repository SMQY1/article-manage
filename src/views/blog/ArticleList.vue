<template>
  <div class="article-list-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>📝 我的博客</h1>
      <p>记录学习与成长</p>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        @click="goToDetail(article.id)"
      >
        <h2 class="article-title">{{ article.title }}</h2>
        <div class="article-meta">
          <span>📅 {{ article.date }}</span>
          <span>🏷️ {{ article.category || '未分类' }}</span>
        </div>
        <p class="article-summary">{{ article.summary }}</p>
        <div class="read-more">阅读全文 →</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 空状态 -->
    <div v-if="!loading && articles.length === 0" class="empty"> 暂无文章，敬请期待~ </div>

    <!-- 自定义回到顶部按钮 -->
    <div v-show="showBackTop" class="back-top" @click="scrollToTop"> ↑ </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const loading = ref(false)
  const showBackTop = ref(false)

  const articles = ref<any[]>([])

  const loadArticles = () => {
    const stored = localStorage.getItem('blog_articles')
    if (stored) {
      articles.value = JSON.parse(stored)
    } else {
      articles.value = [
        {
          id: '1',
          title: '欢迎使用我的博客系统',
          summary: '你可以在后台管理页面发布、编辑和删除文章。',
          date: new Date().toLocaleDateString(),
          cetegory: '公告'
        }
      ]
    }
  }

  const goToDetail = (id: number) => {
    router.push(`/blog/${id}`)
  }

  // 监听滚动事件
  const handleScroll = () => {
    showBackTop.value = window.scrollY > 300
  }

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    loadArticles()
    loading.value = false
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>
