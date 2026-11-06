<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Gestión de Plantas (Orígenes)</div>

    <div class="row q-col-gutter-md">
      <!-- Formulario de creación -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Agregar Nueva Planta</div>
          </q-card-section>
          
          <q-card-section>
            <q-form @submit.prevent="crearPlanta" class="q-gutter-md">
              <q-input 
                v-model="nuevaPlanta.nombre" 
                label="Nombre de la planta" 
                outlined 
                required 
              />
              <q-input 
                v-model.number="nuevaPlanta.oferta" 
                type="number" 
                label="Oferta" 
                outlined 
                required 
                min="1"
              />
              <q-btn type="submit" color="secondary" label="Guardar Planta" class="full-width" :loading="origenStore.loading" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabla de plantas existentes -->
      <div class="col-12 col-md-8">
        <q-table
          title="Plantas Registradas"
          :rows="origenStore.origenes"
          :columns="columnas"
          row-key="_id"
          flat
          bordered
        >
          <!-- Slot para el botón de eliminar -->
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn 
                color="negative" 
                icon="delete" 
                round 
                dense 
                flat 
                @click="confirmarEliminar(props.row)" 
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useOrigenStore } from 'src/stores/origen'

const $q = useQuasar()
const origenStore = useOrigenStore()

const nuevaPlanta = ref({ nombre: '', oferta: null })

const columnas = [
  { name: 'nombre', label: 'Planta', field: 'nombre', align: 'left', sortable: true },
  { name: 'oferta', label: 'Oferta', field: 'oferta', align: 'center', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center' } // Columna de acciones
]

onMounted(() => {
  origenStore.getOrigenes()
})

const crearPlanta = async () => {
  try {
    await origenStore.postOrigen(nuevaPlanta.value)
    $q.notify({ type: 'positive', message: 'Planta creada exitosamente' })
    nuevaPlanta.value = { nombre: '', oferta: null }
    origenStore.getOrigenes()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al crear la planta' })
    console.error(error)
  }
}

const confirmarEliminar = (planta) => {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Estás seguro de que deseas eliminar la planta "${planta.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await origenStore.deleteOrigen(planta._id)
      $q.notify({ type: 'positive', message: 'Planta eliminada' })
      origenStore.getOrigenes()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' })
      console.error(error)
    }
  })
}
</script>