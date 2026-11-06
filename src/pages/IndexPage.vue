<template>
  <q-page class="flex flex-center column q-pa-md">
    <div class="text-h4 q-mb-md">Método de Vogel</div>

    <div class="q-mb-lg q-gutter-sm">
      <q-btn
        color="primary"
        label="1. Guardar Cambios"
        :loading="problemaStore.loading"
        @click="guardarProblema"
      />
      <q-btn
        color="positive"
        label="2. Resolver Vogel"
        :disable="!problemaStore.problemaActual"
        :loading="problemaStore.loading"
        @click="ejecutarVogel"
      />
    </div>

    <div
      v-if="costosMatriz.length > 0 && destinoStore.destinos.length > 0"
      class="tabla-vogel"
    >
      <table>
        <thead>
          <tr>
            <th colspan="2" rowspan="2" />
            <th class="titulo-destinos" :colspan="destinoStore.destinos.length">
              DESTINOS
            </th>
            <th rowspan="2" class="cabecera fw-bold">OFERTA</th>
            <th
              v-for="(paso, index) in pasos"
              :key="`dif-col-${index}`"
              rowspan="2"
              class="cabecera fw-bold"
            >
              DIF {{ index + 1 }}
            </th>
          </tr>
          <tr>
            <th
              v-for="destino in destinoStore.destinos"
              :key="destino._id"
              class="cabecera fw-bold"
            >
              {{ destino.nombre.toUpperCase() }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(origen, i) in origenStore.origenes" :key="origen._id">
            <th
              v-if="i === 0"
              class="titulo-origenes fw-bold"
              :rowspan="origenStore.origenes.length"
            >
              ORÍGENES
            </th>
            <th class="cabecera fw-bold">{{ origen.nombre.toUpperCase() }}</th>

            <td
              v-for="(destino, j) in destinoStore.destinos"
              :key="destino._id"
              class="celda-input"
            >
              <input
                v-model.number="costosMatriz[i][j]"
                type="number"
                min="0"
                class="input-tabla"
              />
            </td>

            <td class="celda-input bg-oferta">
              <input
                v-model.number="ofertasEditables[i]"
                type="number"
                min="0"
                class="input-tabla fw-bold"
              />
            </td>

            <td
              v-for="(paso, index) in pasos"
              :key="`dif-fila-${index}`"
              class="celda-dif"
            >
              {{ paso.penalizacionesFilas[i] !== -1 ? paso.penalizacionesFilas[i] : '' }}
            </td>
          </tr>

          <tr>
            <th class="cabecera fw-bold" colspan="2">DEMANDA</th>
            <td
              v-for="(destino, j) in destinoStore.destinos"
              :key="destino._id"
              class="celda-input bg-demanda"
            >
              <input
                v-model.number="demandasEditables[j]"
                type="number"
                min="0"
                class="input-tabla fw-bold"
              />
            </td>

            <td class="celda-diagonal">
              <div class="diagonal-line" />
              <div class="total-sup">{{ totalOferta }}</div>
              <div class="total-inf">{{ totalDemanda }}</div>
            </td>

            <td
              v-for="(paso, index) in pasos"
              :key="`dif-vacia-${index}`"
              class="celda-dif"
            />
          </tr>

          <tr v-for="(paso, index) in pasos" :key="`dif-row-${index}`">
            <th class="cabecera fw-bold" colspan="2">DIF {{ index + 1 }}</th>
            <td
              v-for="(destino, j) in destinoStore.destinos"
              :key="destino._id"
              class="celda-dif"
            >
              {{ paso.penalizacionesCols[j] !== -1 ? paso.penalizacionesCols[j] : '' }}
            </td>
            <td colspan="2" class="celda-vacia" />
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="problemaStore.solucion"
      class="q-mt-lg text-center bg-white q-pa-md shadow-1 rounded-borders"
    >
      <div class="text-h5">
        Costo Total:
        <span class="text-positive">{{ problemaStore.solucion.costoTotal }}</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useOrigenStore } from 'src/stores/origen'
import { useDestinoStore } from 'src/stores/destino'
import { useProblemaStore } from 'src/stores/problema'

const $q = useQuasar()
const origenStore = useOrigenStore()
const destinoStore = useDestinoStore()
const problemaStore = useProblemaStore()

const costosMatriz = ref([])
const ofertasEditables = ref([])
const demandasEditables = ref([])

const pasos = computed(() => problemaStore.solucion?.pasos ?? [])

const sumar = (lista) => lista.reduce((total, valor) => total + Number(valor || 0), 0)
const totalOferta = computed(() => sumar(ofertasEditables.value))
const totalDemanda = computed(() => sumar(demandasEditables.value))

onMounted(async () => {
  try {
    await Promise.all([origenStore.getOrigenes(), destinoStore.getDestinos()])

    ofertasEditables.value = origenStore.origenes.map((o) => o.oferta)
    demandasEditables.value = destinoStore.destinos.map((d) => d.demanda)
    costosMatriz.value = origenStore.origenes.map(() =>
      destinoStore.destinos.map(() => 0)
    )
  } catch (error) {
    console.error('Error al cargar datos:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al conectar con el servidor.',
      position: 'top'
    })
  }
})

const guardarProblema = async () => {
  try {
    const origenes = origenStore.origenes.map((o, i) => ({
      origenId: o._id,
      oferta: ofertasEditables.value[i]
    }))

    const destinos = destinoStore.destinos.map((d, j) => ({
      destinoId: d._id,
      demanda: demandasEditables.value[j]
    }))

    const matrizCostos = origenStore.origenes.flatMap((o, i) =>
      destinoStore.destinos.map((d, j) => ({
        origenId: o._id,
        destinoId: d._id,
        costo: costosMatriz.value[i][j]
      }))
    )

    const payload = {
      Problema: 'Problema Vogel',
      origenes,
      destinos,
      matrizCostos
    }

    if (problemaStore.problemaActual) {
      await problemaStore.putProblema(problemaStore.problemaActual._id, payload)
    } else {
      await problemaStore.postProblema(payload)
    }
  } catch (error) {
    console.error('Error guardando:', error)
  }
}

const ejecutarVogel = async () => {
  if (!problemaStore.problemaActual) return

  try {
    await guardarProblema()
    await problemaStore.resolverProblema(problemaStore.problemaActual._id)
  } catch (error) {
    console.error('Error resolviendo:', error)
  }
}
</script>

<style scoped lang="scss">
$bg-principal: #fdf1d9;
$bg-borde: #e8b983;
$bg-cabecera: #fce8c3;

.tabla-vogel {
  overflow-x: auto;
  background-color: $bg-principal;
  padding: 10px;
  border: 2px solid $bg-borde;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
  background-color: $bg-principal;

  th,
  td {
    border: 1px solid $bg-borde;
    text-align: center;
    vertical-align: middle;
    padding: 0;
  }

  .fw-bold {
    font-weight: bold;
    font-family: Arial, sans-serif;
    color: #000;
  }

  .titulo-destinos {
    background-color: $bg-cabecera;
    font-weight: bold;
    padding: 8px;
  }

  .cabecera {
    background-color: $bg-cabecera;
    padding: 8px;
    font-size: 14px;
  }

  .titulo-origenes {
    background-color: $bg-cabecera;
    padding: 8px;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 14px;
    letter-spacing: 2px;
  }

  .celda-input {
    position: relative;
  }

  .input-tabla {
    width: 100%;
    height: 100%;
    min-height: 35px;
    background: transparent;
    border: none;
    text-align: center;
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #000;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: 2px solid #1976d2;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  .bg-oferta,
  .bg-demanda {
    background-color: $bg-cabecera;
  }

  .celda-dif {
    background-color: $bg-principal;
    font-weight: bold;
    font-family: Arial, sans-serif;
    min-width: 40px;
  }

  .celda-vacia {
    background-color: $bg-principal;
  }

  .celda-diagonal {
    position: relative;
    min-width: 60px;
    height: 50px;
    background-color: $bg-cabecera;

    .diagonal-line {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top right,
        transparent 49%,
        $bg-borde 50%,
        transparent 51%
      );
      pointer-events: none;
    }

    .total-sup {
      position: absolute;
      top: 2px;
      right: 5px;
      font-weight: bold;
      font-size: 14px;
    }

    .total-inf {
      position: absolute;
      bottom: 2px;
      left: 5px;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>