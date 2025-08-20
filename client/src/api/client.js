import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const singhClient = axios.create({ baseURL })

singhClient.interceptors.request.use(cfg => {
  const t = localStorage.getItem('rs_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export default singhClient
