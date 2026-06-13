import axios from 'axios'

// 本地开发用 localhost
const API_BASE = 'http://localhost:8080/api/articles'

// 如果以后要部署到线上，再改成服务器地址
// const API_BASE = 'http://120.24.233.47:8080/api/articles'

export const getArticles = () => axios.get(API_BASE)
export const getArticle = (id: string | number) => axios.get(`${API_BASE}/${id}`)
export const saveArticle = (article: any) => axios.post(API_BASE, article)
export const updateArticle = (id: string | number, article: any) =>
  axios.put(`${API_BASE}/${id}`, article)
export const deleteArticle = (id: string | number) => axios.delete(`${API_BASE}/${id}`)
