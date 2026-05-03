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

  // 从路由获取文章 ID
  const articleId = route.params.id

  // 模拟获取文章详情（后续改成真实 API）
  const fetchArticleDetail = async () => {
    loading.value = true
    try {
      // 模拟异步请求
      await new Promise((resolve) => setTimeout(resolve, 300))

      // 模拟数据
      const mockArticles: Record<string, any> = {
        '1': {
          id: 1,
          title: '我的第一篇博客',
          date: '2025-03-20',
          category: 'Vue',
          content: `
          <h2>为什么要写博客？</h2>
          <p>写博客是很好的学习方式，可以帮助自己梳理知识体系。</p>
          <h2>这个博客项目</h2>
          <p>这是一个基于 <strong>Vue 3 + TypeScript + Element Plus</strong> 的博客系统前端。</p>
          <p>目前使用 Mock 数据，后续将接入 GitHub Issues API 实现动态内容管理。</p>
          <h2>技术栈</h2>
          <ul>
            <li>Vue 3 + Composition API</li>
            <li>TypeScript</li>
            <li>Vue Router</li>
            <li>Pinia 状态管理</li>
            <li>SCSS 样式</li>
          </ul>
          <p>接下来会逐步完善功能，欢迎关注~</p>
        `
        },
        '2': {
          id: 2,
          title: 'Vue 3 组合式 API 学习笔记',
          date: '2025-03-19',
          category: 'Vue',
          content: `
          <h2>组合式 API 简介</h2>
          <p>组合式 API (Composition API) 是 Vue 3 中新增的一套 API 风格。</p>
          <h2>核心概念</h2>
          <ul>
            <li><code>ref</code> 和 <code>reactive</code>：响应式数据</li>
            <li><code>computed</code>：计算属性</li>
            <li><code>watch</code>：侦听器</li>
            <li><code>生命周期钩子</code>：onMounted, onUpdated 等</li>
          </ul>
          <h2>优势</h2>
          <p>更好的逻辑复用、更灵活的代码组织、更好的类型推导支持。</p>
        `
        },
        '3': {
          id: 3,
          title: '前端工程化入门',
          date: '2025-03-18',
          category: '工程化',
          content: `
          <h2>什么是前端工程化？</h2>
          <p>前端工程化是指将软件工程的理念和方法应用到前端开发中。</p>
          <h2>主要内容</h2>
          <ul>
            <li>模块化：将代码拆分为独立的模块</li>
            <li>组件化：UI 的拆分与复用</li>
            <li>自动化：构建、测试、部署流程自动化</li>
            <li>规范化：代码规范、目录结构规范</li>
          </ul>
          <h2>常用工具</h2>
          <p>Webpack、Vite、ESLint、Prettier、Husky 等。</p>
        `
        }
      }

      article.value = mockArticles[articleId as string] || null
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
