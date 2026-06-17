<template>
  <div class="article-list-container">
    <div class="page-header">
      <h1>📝 我的博客</h1>
      <p>记录学习与成长</p>
      <div class="admin-link">
        <router-link to="/article-manage/list" class="admin-btn">
          🔧 内容管理
        </router-link>
      </div>
    </div>

    <!-- 搜索和筛选栏 -->
    <div class="filter-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="🔍 搜索文章标题..." 
          class="search-input"
        />
      </div>
      <div class="category-tabs">
        <button 
          v-for="cat in categories" 
          :key="cat"
          :class="['category-btn', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
        @click="goToDetail(article.id)"
      >
        <h2 class="article-title">{{ article.title }}</h2>
        <div class="article-meta">
          <span>📅 {{ formatDate(article.createTime) }}</span>
          <span>🏷️ {{ article.category || '未分类' }}</span>
        </div>
        <p class="article-summary">{{ (article.content || '').slice(0, 120) }}...</p>
        <div class="read-more">阅读全文 →</div>
      </div>
    </div>

    <!-- 状态提示 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="filteredArticles.length === 0" class="empty">
      {{ searchKeyword ? '没有找到相关文章' : '暂无文章，敬请期待~' }}
    </div>

    <!-- 回到顶部 -->
    <div v-show="showBackTop" class="back-top" @click="scrollToTop">↑</div>

    <!-- ===== 新增：ICP备案号 ===== -->
    <footer class="icp-footer">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
        湘ICP备2026023614号
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles } from '@/api/article'

const router = useRouter()
const loading = ref(false)
const showBackTop = ref(false)
const articles = ref<any[]>([])

// 筛选相关
const searchKeyword = ref('')
const activeCategory = ref('全部')
const categories = ref(['全部'])

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

// 过滤后的文章列表
const filteredArticles = computed(() => {
  let result = articles.value

  // 1. 按分类筛选
  if (activeCategory.value !== '全部') {
    result = result.filter(article => article.category === activeCategory.value)
  }

  // 2. 按标题关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 加载文章
const loadArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles()
    articles.value = res.data
    
    // 动态提取所有分类
    const allCategories = articles.value
      .map(a => a.category)
      .filter(c => c && c.trim())
    const uniqueCategories = [...new Set(allCategories)] as string[]
    categories.value = ['全部', ...uniqueCategories]
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: number) => {
  router.push(`/blog/${id}`)
}

const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadArticles()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-list-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eaeef5;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.page-header p {
  font-size: 16px;
  color: #7f8c8d;
}

.admin-link {
  margin-top: 15px;
}

.admin-btn {
  display: inline-block;
  padding: 6px 16px;
  background-color: #409eff;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.admin-btn:hover {
  background-color: #66b1ff;
}

/* 筛选栏样式 */
.filter-bar {
  margin-bottom: 30px;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-btn {
  padding: 6px 16px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.category-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eaeef5;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-title {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 12px;
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
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.read-more {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
}

.loading,
.empty {
  text-align: center;
  padding: 60px;
  color: #909399;
}

.back-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.back-top:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
}

/* ===== 新增：备案号页脚样式 ===== */
.icp-footer {
  text-align: center;
  padding: 20px 0 10px;
  margin-top: 40px;
  border-top: 1px solid #eaeef5;
  font-size: 12px;
  color: #909399;
}

.icp-footer a {
  color: #909399;
  text-decoration: none;
  transition: color 0.2s;
}

.icp-footer a:hover {
  color: #409eff;
}
</style>