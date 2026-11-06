import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useVogelStore = defineStore('vogel', {
  state: () => ({
    origenes: [],
    destinos: [],
    problemaActual: null,
    solucion: null
  }),
  
  actions: {
    // Acciones para traer datos del backend
    async fetchOrigenes() {
      try {
        const { data } = await api.get('/origenes')
        this.origenes = data
      } catch (error) {
        console.error("Error al traer origenes", error)
      }
    },
    async fetchDestinos() {
      try {
        const { data } = await api.get('/destinos')
        this.destinos = data
      } catch (error) {
        console.error("Error al traer destinos", error)
      }
    }
  }
})