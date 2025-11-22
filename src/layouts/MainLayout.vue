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
          icon="logout"
          aria-label="Cerrar Sesión"
          @click="handleLogout"
        >
          <q-tooltip>Cerrar Sesión</q-tooltip>
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
          to="/digimons"
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

        <q-separator class="q-my-md" />

        <q-item
          clickable
          v-ripple
          @click="handleLogout"
        >
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cerrar Sesión</q-item-label>
            <q-item-label caption>Salir de la aplicación</q-item-label>
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

defineOptions({
  name: 'MainLayout'
})

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout () {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro que deseas cerrar sesión?',
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true
    },
    ok: {
      label: 'Cerrar Sesión',
      color: 'negative',
      flat: true
    },
    persistent: false
  }).onOk(() => {
    authStore.logout()

    $q.notify({
      type: 'info',
      message: 'Sesión cerrada',
      caption: 'Hasta pronto',
      position: 'top',
      timeout: 2000
    })

    router.push('/login')
  })
}
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
