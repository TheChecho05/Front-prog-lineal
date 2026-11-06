<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Método de Vogel </q-toolbar-title>
        <div>Proyecto Universitario</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-grey-1">
      <q-list padding>
        <q-item-label header class="text-weight-bold text-primary">
          MENÚ PRINCIPAL
        </q-item-label>

        <!-- Opción 1: Tabla Vogel -->
        <q-item clickable to="/" exact active-class="bg-primary text-white">
          <q-item-section avatar>
            <q-icon name="grid_on" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tabla Vogel</q-item-label>
            <q-item-label caption>Resolver el problema</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Opción 2: Crear Ciudades -->
        <q-item clickable to="/ciudades" active-class="bg-primary text-white">
          <q-item-section avatar>
            <q-icon name="location_city" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Crear Ciudades</q-item-label>
            <q-item-label caption>Destinos y demandas</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Opción 3: Crear Orígenes -->
        <q-item clickable to="/origenes" active-class="bg-primary text-white">
          <q-item-section avatar>
            <q-icon name="factory" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Crear Plantas</q-item-label>
            <q-item-label caption>Orígenes y ofertas</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>