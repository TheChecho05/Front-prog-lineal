import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useOrigenStore = defineStore("origen", () => {
  let loading = ref(false);
  let origenes = ref([]);

  const getOrigenes = async () => {
    try {
      loading.value = true;
      const response = await api.get("origenes");
      origenes.value = response.data;
      return response;
    } catch (error) {
      console.error("Error al obtener origenes:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const postOrigen = async (data) => {
    try {
      loading.value = true;
      const r = await api.post("origenes", data);
      return r;
    } catch (error) {
      console.error("Error al crear origen:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const putOrigen = async (id, data) => {
    try {
      loading.value = true;
      const r = await api.put(`origenes/${id}`, data);
      return r;
    } catch (error) {
      console.error("Error al actualizar origen:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
    const deleteOrigen = async (id) => {
    try {
      loading.value = true;
      const r = await api.delete(`origenes/${id}`);
      return r;
    } catch (error) {
      console.error("Error al eliminar origen:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  
  // No olvides agregarlo al return:
  return { origenes, getOrigenes, postOrigen, putOrigen, deleteOrigen, loading };
});