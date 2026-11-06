import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useDestinoStore = defineStore("destino", () => {
  let loading = ref(false);
  let destinos = ref([]);

  const getDestinos = async () => {
    try {
      loading.value = true;
      const response = await api.get("destinos");
      destinos.value = response.data;
      return response;
    } catch (error) {
      console.error("Error al obtener destinos:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const postDestino = async (data) => {
    try {
      loading.value = true;
      const r = await api.post("destinos", data);
      return r;
    } catch (error) {
      console.error("Error al crear destino:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const putDestino = async (id, data) => {
    try {
      loading.value = true;
      const r = await api.put(`destinos/${id}`, data);
      return r;
    } catch (error) {
      console.error("Error al actualizar destino:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
    const deleteDestino = async (id) => {
    try {
      loading.value = true;
      const r = await api.delete(`destinos/${id}`);
      return r;
    } catch (error) {
      console.error("Error al eliminar destino:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // No olvides agregarlo al return:
  return { destinos, getDestinos, postDestino, putDestino, deleteDestino, loading };
});