<template>
  <div style="max-width: 800px; padding: 20px">
    <h1>📝 发布文章</h1>

    <div>
      <label>标题：</label>
      <input v-model="form.title" type="text" style="width: 100%; padding: 8px; margin: 8px 0" />
    </div>

    <div>
      <label>内容（Markdown）：</label>
      <textarea
        v-model="form.content"
        rows="10"
        style="width: 100%; padding: 8px; margin: 8px 0"
      ></textarea>
    </div>

    <button @click="saveArticle">保存</button>
    <button @click="goBack" style="margin-left: 8px">返回</button>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const idEditMode = ref(false) // 是否是编辑模式
  const editId = ref<string | null>(null) //编辑文章的id

  const form = reactive({
    title: '',
    content: ''
  })

  //加载文章（编辑模式用）
  const loadArticle = (id: string) => {
    const existing = localStorage.getItem('blog_articles')
    const articles = existing ? JSON.parse(existing) : []
    const article = articles.find((a: any) => a.id === id)

    if (article) {
      form.title = article.title
      form.content = article.content
    }
  }

  const saveArticle = () => {
    if (!form.title.trim()) {
      alert('请输入标题')
      return
    }

    // 获取现有文章
    const existing = localStorage.getItem('blog_articles')
    const articles = existing ? JSON.parse(existing) : []

    //编辑模式：更新已有文章
    if (idEditMode.value) {
      const index = articles.findIndex((a: any) => a.id === editId.value)
      if (index !== -1) {
        articles[index] = {
          ...articles[index],
          title: form.title,
          content: form.content,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('blog_articles', JSON.stringify(articles))
        alert('更新成功')
      }
    } else {
      // 新增模式：添加新文章
      const newArticle = {
        id: new Date().getTime().toString(),
        title: form.title,
        content: form.content,
        creaeteTime: new Date().toISOString()
      }
      articles.push(newArticle)
      localStorage.setItem('blog_articles', JSON.stringify(articles))
      alert('发布成功')
    }
    router.push('/article-manage/list')
  }

  const goBack = () => {
    router.push('/article-manage/list')
  }

  onMounted(() => {
    //判断当前路由是否是编辑模式
    const id = route.params.id as string
    if (id && route.path.includes('/edit/')) {
      idEditMode.value = true
      editId.value = id
      loadArticle(id)
    }
  })
</script>
