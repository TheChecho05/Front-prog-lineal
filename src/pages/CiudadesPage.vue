<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Gestión de Ciudades (Destinos)</div>

    <div class="row q-col-gutter-md">
      <!-- Formulario de creación -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Agregar Nueva Ciudad</div>
          </q-card-section>
          
          <q-card-section>
            <q-form @submit.prevent="crearCiudad" class="q-gutter-md">
              <q-input 
                v-model="nuevaCiudad.nombre" 
                label="Nombre de la ciudad" 
                outlined 
                required 
              />
              <q-input 
                v-model.number="nuevaCiudad.demanda" 
                type="number" 
                label="Demanda" 
                outlined 
                required 
                min="1"
              />
              <q-btn type="submit" color="primary" label="Guardar Ciudad" class="full-width" :loading="destinoStore.loading" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabla de ciudades existentes -->
      <div class="col-12 col-md-8">
        <q-table
          title="Ciudades Registradas"
          :rows="destinoStore.destinos"
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
import { useDestinoStore } from 'src/stores/destino'

const $q = useQuasar()
const destinoStore = useDestinoStore()

const nuevaCiudad = ref({ nombre: '', demanda: null })

const columnas = [
  { name: 'nombre', label: 'Ciudad', field: 'nombre', align: 'left', sortable: true },
  { name: 'demanda', label: 'Demanda', field: 'demanda', align: 'center', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center' } // Columna de acciones
]

onMounted(() => {
  destinoStore.getDestinos()
})

const crearCiudad = async () => {
  try {
    await destinoStore.postDestino(nuevaCiudad.value)
    $q.notify({ type: 'positive', message: 'Ciudad creada exitosamente' })
    nuevaCiudad.value = { nombre: '', demanda: null }
    destinoStore.getDestinos() 
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al crear la ciudad' })
    console.error(error)
  }
}

const confirmarEliminar = (ciudad) => {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Estás seguro de que deseas eliminar la ciudad "${ciudad.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await destinoStore.deleteDestino(ciudad._id)
      $q.notify({ type: 'positive', message: 'Ciudad eliminada' })
      destinoStore.getDestinos()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' })
      console.error(error)
    }
  })
}
</script>