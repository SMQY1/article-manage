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

  const articles = ref([
    {
      id: 1,
      title: '我的第一篇博客',
      summary:
        '这是博客系统的第一篇测试文章，后续会接入真实数据。通过这个项目，我学习了 Vue 3 和前端工程化的相关知识。',
      date: '2025-03-20',
      category: 'Vue'
    },
    {
      id: 2,
      title: 'Vue 3 组合式 API 学习笔记',
      summary: '组合式 API 是 Vue 3 最重要的特性之一，它让代码组织更加灵活，逻辑复用更加方便...',
      date: '2025-03-19',
      category: 'Vue'
    },
    {
      id: 3,
      title: '前端工程化入门',
      summary: '工程化是现代前端开发的基础，包括模块化、组件化、自动化构建等方面...',
      date: '2025-03-18',
      category: '工程化'
    }
  ])

  const goToDetail = (id: number) => {
    router.push(`/blog/detail/${id}`)
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
    loading.value = false
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<style scoped>
  .article-list-container {
    max-width: 900px;
    padding: 30px 20px;
    margin: 0 auto;
  }

  .page-header {
    padding-bottom: 20px;
    margin-bottom: 40px;
    text-align: center;
    border-bottom: 2px solid #eaeef5;
  }

  .page-header h1 {
    margin-bottom: 10px;
    font-size: 32px;
    color: #2c3e50;
  }

  .page-header p {
    font-size: 16px;
    color: #7f8c8d;
  }

  .article-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .article-card {
    padding: 24px;
    cursor: pointer;
    background: white;
    border: 1px solid #eaeef5;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
    transition: all 0.3s ease;
  }

  .article-card:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
    transform: translateY(-2px);
  }

  .article-title {
    margin-bottom: 12px;
    font-size: 22px;
    color: #2c3e50;
    transition: color 0.2s;
  }

  .article-card:hover .article-title {
    color: #409eff;
  }

  .article-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #909399;
  }

  .article-summary {
    margin-bottom: 16px;
    line-height: 1.6;
    color: #606266;
  }

  .read-more {
    font-size: 14px;
    font-weight: 500;
    color: #409eff;
  }

  .loading,
  .empty {
    padding: 60px;
    color: #909399;
    text-align: center;
  }

  /* 回到顶部按钮样式 */
  .back-top {
    position: fixed;
    right: 40px;
    bottom: 40px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    background-color: #409eff;
    border-radius: 50%;
    box-shadow: 0 2px 12px rgb(0 0 0 / 20%);
    transition: all 0.3s;
  }

  .back-top:hover {
    background-color: #66b1ff;
    transform: translateY(-2px);
  }
</style>
