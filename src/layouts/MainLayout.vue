<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="gradient-header shadow-3">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-center">
          <q-icon name="pets" size="sm" class="q-mr-sm" />
          <span class="text-weight-bold">Digimon Codex</span>
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="info"
          aria-label="Info"
        >
          <q-tooltip>Catálogo Universitario</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list padding>
        <q-item-label
          header
          class="text-weight-bold text-primary"
        >
          Navegación
        </q-item-label>

        <q-item
          clickable
          v-ripple
          to="/"
          exact
          active-class="bg-primary text-white"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
            <q-item-label caption>Catálogo de Digimons</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
