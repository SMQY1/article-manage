import axios from 'axios'


// 从环境变量读取 API 地址
const API_BASE = import.meta.env.VITE_API_BASE + '/articles'

export const getArticles = () => axios.get(API_BASE)
export const getArticle = (id: string | number) => axios.get(`${API_BASE}/${id}`)
export const saveArticle = (article: any) => axios.post(API_BASE, article)
export const updateArticle = (id: string | number, article: any) => axios.put(`${API_BASE}/${id}`, article)
export const deleteArticle = (id: string | number) => axios.delete(`${API_BASE}/${id}`)


console.log('API_BASE:', API_BASE)