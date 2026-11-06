import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Creamos una instancia de Axios apuntando a nuestro backend
const api = axios.create({ 
  baseURL: 'https://back-prog-lineal.onrender.com/api'
  // baseURL: 'http://localhost:4500/api' 
})

export default boot(({ app }) => {
  // Lo hacemos global para poder usarlo en cualquier componente
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }