<template>
  <div class="blog-container">
    <!-- ===== 顶部导航栏（CSDN风格） ===== -->
    <header class="blog-header">
      <div class="header-inner">
        <div class="logo">
          <router-link to="/">
            <span class="logo-icon">⌨️</span>
            <span class="logo-text">代码拾光录</span>
          </router-link>
        </div>
        <div class="header-actions">
          <router-link to="/article-manage/list" class="write-btn">📝 写文章</router-link>
        </div>
      </div>
    </header>

    <!-- ===== 主体内容：左右两栏布局 ===== -->
    <div class="main-wrapper">
      <div class="container">
        <div class="row">
          <!-- 左侧：文章列表（主要区域） -->
          <main class="col-main">
            <!-- 搜索栏（CSDN风格） -->
            <div class="search-bar">
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索文章标题..."
                class="search-input"
              />
              <button class="search-btn" @click="searchKeyword = searchKeyword">🔍</button>
            </div>

            <!-- 分类标签 -->
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

            <!-- 文章列表 -->
            <div class="article-list">
              <article
                v-for="article in filteredArticles"
                :key="article.id"
                class="article-item"
                @click="goToDetail(article.id)"
              >
                <div class="article-content">
                  <h2 class="article-title">{{ article.title }}</h2>
                  <p class="article-summary">{{ (article.content || '').slice(0, 150) }}...</p>
                  <div class="article-meta">
                    <span class="meta-item">📅 {{ formatDate(article.createTime) }}</span>
                    <span class="meta-item">🏷️ {{ article.category || '未分类' }}</span>
                    <span class="meta-item">👁️ {{ article.viewCount || 0 }} 阅读</span>
                  </div>
                </div>
              </article>
            </div>

            <!-- 加载/空状态 -->
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="filteredArticles.length === 0" class="empty">
              {{ searchKeyword ? '没有找到相关文章' : '暂无文章，敬请期待~' }}
            </div>
          </main>

          <!-- 右侧：侧边栏 -->
          <aside class="col-side">
            <!-- 个人信息卡片 -->
            <div class="side-card profile-card">
              <div class="profile-avatar">👤</div>
              <div class="profile-name">董洋</div>
              <div class="profile-desc">全栈开发学习者</div>
              <div class="profile-stats">
                <span>📝 {{ articles.length }} 篇文章</span>
              </div>
            </div>

            <!-- 热门分类 -->
            <div class="side-card">
              <h3 class="side-title">📂 热门分类</h3>
              <ul class="side-list">
                <li v-for="cat in categories.slice(1, 6)" :key="cat">
                  <span class="list-link" @click="activeCategory = cat">{{ cat }}</span>
                  <span class="list-badge">{{ articles.filter(a => a.category === cat).length }}</span>
                </li>
              </ul>
            </div>

            <!-- 最新文章（快速链接） -->
            <div class="side-card">
              <h3 class="side-title">🕐 最新文章</h3>
              <ul class="side-list">
                <li v-for="article in articles.slice(0, 5)" :key="article.id">
                  <span class="list-link" @click="goToDetail(article.id)">{{ article.title }}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <div v-show="showBackTop" class="back-top" @click="scrollToTop">↑</div>

    <!-- 页脚 -->
    <footer class="blog-footer">
      <p>
        © 2026 代码拾光录 &nbsp;|&nbsp;
        <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2026023614号</a>
      </p>
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

const searchKeyword = ref('')
const activeCategory = ref('全部')
const categories = ref(['全部'])

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const filteredArticles = computed(() => {
  let result = articles.value
  if (activeCategory.value !== '全部') {
    result = result.filter(a => a.category === activeCategory.value)
  }
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(kw))
  }
  return result
})

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles()
    articles.value = res.data
    const allCategories = articles.value.map(a => a.category).filter(c => c && c.trim())
    categories.value = ['全部', ...new Set(allCategories)]
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: number) => {
  router.push(`/blog/${id}`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
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
/* ===== 全局重置 ===== */
* {
  box-sizing: border-box;
}

.blog-container {
  background: #f5f7fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 顶部导航 ===== */
.blog-header {
  background: #ffffff;
  border-bottom: 1px solid #e8ecf1;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1e2a3a;
  font-weight: 700;
  font-size: 20px;
}

.logo-icon {
  font-size: 26px;
  margin-right: 8px;
}

.logo-text {
  background: linear-gradient(135deg, #409eff, #2d7cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.write-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
  display: inline-block;
}

.write-btn:hover {
  background: #2d7cf6;
}

/* ===== 主容器 ===== */
.main-wrapper {
  max-width: 1200px;
  margin: 24px auto 0;
  padding: 0 24px 40px;
}

.row {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.col-main {
  flex: 1;
  min-width: 0;
}

.col-side {
  width: 300px;
  flex-shrink: 0;
}

/* ===== 搜索栏 ===== */
.search-bar {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px 0 0 8px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
}

.search-btn {
  padding: 10px 18px;
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #2d7cf6;
}

/* ===== 分类标签 ===== */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.category-btn {
  padding: 6px 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 16px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.category-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

/* ===== 文章列表 ===== */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-item {
  background: #fff;
  border-radius: 10px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid #e8ecf1;
}

.article-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #c0c8d4;
  transform: translateY(-1px);
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e2a3a;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.article-item:hover .article-title {
  color: #409eff;
}

.article-summary {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #909399;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== 侧边栏 ===== */
.side-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e8ecf1;
}

.profile-card {
  text-align: center;
}

.profile-avatar {
  font-size: 52px;
  margin-bottom: 6px;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e2a3a;
}

.profile-desc {
  font-size: 13px;
  color: #909399;
  margin: 4px 0 10px;
}

.profile-stats {
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  padding: 6px 12px;
  border-radius: 12px;
  display: inline-block;
}

.side-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.side-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #f0f2f5;
  font-size: 14px;
}

.side-list li:last-child {
  border-bottom: none;
}

.list-link {
  color: #606266;
  cursor: pointer;
  transition: color 0.2s;
  flex: 1;
}

.list-link:hover {
  color: #409eff;
}

.list-badge {
  background: #f0f2f5;
  color: #909399;
  font-size: 12px;
  padding: 0 10px;
  border-radius: 10px;
  line-height: 20px;
}

/* ===== 状态 ===== */
.loading,
.empty {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

/* ===== 回到顶部 ===== */
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
  font-size: 22px;
  color: #fff;
  cursor: pointer;
  background: #409eff;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.25s;
}

.back-top:hover {
  background: #2d7cf6;
  transform: translateY(-2px);
}

/* ===== 页脚 ===== */
.blog-footer {
  text-align: center;
  padding: 24px 0 16px;
  font-size: 13px;
  color: #909399;
  border-top: 1px solid #e8ecf1;
  background: #fff;
  margin-top: 20px;
}

.blog-footer a {
  color: #909399;
  text-decoration: none;
}

.blog-footer a:hover {
  color: #409eff;
}

/* ===== 响应式 ===== */
@media (max-width: 820px) {
  .row {
    flex-direction: column;
  }
  .col-side {
    width: 100%;
  }
  .header-inner {
    padding: 0 16px;
  }
  .main-wrapper {
    padding: 0 16px 30px;
  }
  .article-item {
    padding: 16px;
  }
  .article-title {
    font-size: 17px;
  }
}
</style>