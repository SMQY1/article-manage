<template>
  <div style="max-width: 800px; padding: 20px">
    <h1>{{ isEditMode ? '✏️ 编辑文章' : '📝 发布文章' }}</h1>

    <div>
      <label>标题：</label>
      <input v-model="form.title" type="text" style="width: 100%; padding: 8px; margin: 8px 0" />
    </div>

    <div>
      <label>分类：</label>
      <input
        v-model="form.category"
        type="text"
        placeholder="技术"
        style="width: 100%; padding: 8px; margin: 8px 0"
      />
    </div>

    <div>
      <label>内容（Markdown）：</label>
      <div class="editor-toolbar">
        <button type="button" class="toolbar-btn" @click="insertImageByUrl"
          >🔗 插入图片(URL)</button
        >
        <label class="toolbar-btn" style="cursor: pointer">
          🖼️ 上传图片
          <input type="file" @change="uploadImage" accept="image/*" style="display: none" />
        </label>
      </div>
      <textarea
        ref="textareaRef"
        v-model="form.content"
        rows="15"
        style="width: 100%; padding: 8px; margin: 8px 0; font-family: monospace"
      ></textarea>
      <!-- 预览区域（可选） -->
      <div v-if="previewUrl" class="image-preview-container">
        <p>预览：</p>
        <img :src="previewUrl" class="image-preview" />
        <button @click="clearPreview">取消</button>
      </div>
    </div>

    <button @click="save">{{ isEditMode ? '更新' : '保存' }}</button>
    <button @click="goBack" style="margin-left: 8px">返回</button>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getArticle, saveArticle, updateArticle } from '@/api/article'

  const route = useRoute()
  const router = useRouter()
  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  const isEditMode = ref(false)
  const editId = ref<string | null>(null)
  const previewUrl = ref('')

  const form = reactive({
    title: '',
    content: '',
    category: '技术'
  })

  // 插入文本到光标位置
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentContent = form.content
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end)
    form.content = newContent

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  // 方式一：通过 URL 插入图片
  const insertImageByUrl = () => {
    const url = prompt('请输入图片URL地址：')
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      insertAtCursor(`\n![图片](${url})\n`)
    } else if (url) {
      alert('请输入正确的图片URL（以 http:// 或 https:// 开头）')
    }
  }

  // 方式二：上传本地图片转 Base64
  const uploadImage = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小（限制 1MB）
    if (file.size > 1 * 1024 * 1024) {
      alert('图片大小不能超过 1MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      // 显示预览
      previewUrl.value = base64
      // 插入 Markdown 格式的图片
      insertAtCursor(`\n![图片](${base64})\n`)
    }
    reader.readAsDataURL(file)

    // 清空 input，以便下次能再次选择同一文件
    input.value = ''
  }

  const clearPreview = () => {
    previewUrl.value = ''
  }

  const loadArticle = async (id: string) => {
    try {
      const res = await getArticle(id)
      const article = res.data
      form.title = article.title
      form.content = article.content
      form.category = article.category || '技术'
    } catch (error) {
      console.error('加载文章失败:', error)
    }
  }

  const save = async () => {
    if (!form.title.trim()) {
      alert('请输入标题')
      return
    }

    try {
      if (isEditMode.value && editId.value) {
        await updateArticle(editId.value, form)
        alert('更新成功！')
      } else {
        await saveArticle(form)
        alert('发布成功！')
      }
      router.push('/article-manage/list')
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请检查后端服务是否运行')
    }
  }

  const goBack = () => {
    router.push('/article-manage/list')
  }

  onMounted(() => {
    const id = route.params.id as string
    if (id && route.path.includes('/edit/')) {
      isEditMode.value = true
      editId.value = id
      loadArticle(id)
    }
  })
</script>

<style scoped>
  .editor-toolbar {
    display: flex;
    gap: 8px;
    padding: 8px;
    margin-bottom: 8px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .toolbar-btn {
    padding: 4px 12px;
    font-size: 14px;
    cursor: pointer;
    background: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .toolbar-btn:hover {
    color: white;
    background: #409eff;
    border-color: #409eff;
  }

  .image-preview-container {
    padding: 12px;
    margin-top: 8px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .image-preview {
    max-width: 200px;
    max-height: 150px;
    margin-top: 8px;
    border-radius: 4px;
  }
</style>
