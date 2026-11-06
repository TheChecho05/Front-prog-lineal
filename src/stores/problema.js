import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useProblemaStore = defineStore("problema", () => {
  let loading = ref(false);
  let problemaActual = ref(null);
  let solucion = ref(null);

  const postProblema = async (data) => {
    try {
      loading.value = true;
      const r = await api.post("problemas", data);
      problemaActual.value = r.data;
      return r;
    } catch (error) {
      console.error("Error al crear problema:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const putProblema = async (id, data) => {
    try {
      loading.value = true;
      const r = await api.put(`problemas/${id}`, data);
      problemaActual.value = r.data;
      return r;
    } catch (error) {
      console.error("Error al actualizar problema:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const resolverProblema = async (id) => {
    try {
      loading.value = true;
      const r = await api.post(`problemas/${id}/resolver`);
      solucion.value = r.data.solucion; // Guardamos la solución
      return r;
    } catch (error) {
      console.error("Error al resolver problema:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return { problemaActual, solucion, postProblema, putProblema, resolverProblema, loading };
});