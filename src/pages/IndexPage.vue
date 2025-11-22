<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="text-center q-mb-lg">
      <h3 class="text-purple-9 q-my-md text-weight-bold">
        <q-icon name="pets" size="lg" class="q-mr-sm" />
        Explorador Digital
      </h3>
      <p class="text-grey-7 text-subtitle1">
        Descubre y filtra más de 200 criaturas digitales
      </p>
    </div>

    <!-- Barra de Herramientas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-input
          v-model="searchText"
          outlined
          rounded
          bg-color="white"
          placeholder="Buscar por nombre..."
          clearable
          class="shadow-1"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="purple-9" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          v-model="selectedLevel"
          :options="levelOptions"
          outlined
          rounded
          bg-color="white"
          placeholder="Filtrar por nivel"
          clearable
          emit-value
          map-options
          class="shadow-1"
        >
          <template v-slot:prepend>
            <q-icon name="filter_list" color="purple-9" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <div class="column items-center">
        <q-spinner-dots color="purple-9" size="4em" />
        <p class="text-grey-7 q-mt-md">Cargando Digimons...</p>
      </div>
    </div>

    <!-- Grid de Tarjetas -->
    <div v-else-if="filteredDigimons.length > 0" class="row q-col-gutter-md">
      <div
        v-for="digimon in filteredDigimons"
        :key="digimon.name"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card
          class="digimon-card rounded-borders"
          :class="`border-${getLevelColor(digimon.level)}`"
        >
          <div :class="`bg-${getLevelColor(digimon.level)}-1`">
            <q-img
              :src="digimon.img"
              :alt="digimon.name"
              ratio="1"
              spinner-color="purple-9"
              class="card-image"
            >
              <div class="absolute-top-right q-pa-sm">
                <q-badge
                  :color="getLevelColor(digimon.level)"
                  class="text-caption text-weight-bold"
                  style="font-size: 0.7rem;"
                >
                  {{ digimon.level }}
                </q-badge>
              </div>
            </q-img>
          </div>
          <q-card-section class="bg-white">
            <div class="text-h6 text-center text-weight-bold text-grey-8">
              {{ digimon.name }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="flex flex-center column q-py-xl">
      <q-icon name="search_off" size="5em" color="grey-4" class="q-mb-md" />
      <p class="text-h5 text-grey-6 text-weight-medium">No se encontraron resultados</p>
      <p class="text-body1 text-grey-5">
        Intenta ajustar los filtros de búsqueda
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

defineOptions({
  name: 'IndexPage'
})

const $q = useQuasar()

// Variables reactivas
const digimons = ref([])
const searchText = ref('')
const selectedLevel = ref(null)
const loading = ref(false)

// Función helper: obtener color según nivel
const getLevelColor = (level) => {
  const colorMap = {
    Fresh: 'blue-grey',
    'In Training': 'light-blue',
    Rookie: 'green',
    Champion: 'blue',
    Ultimate: 'deep-orange',
    Mega: 'purple',
    Armor: 'amber'
  }
  return colorMap[level] || 'grey'
}

// Propiedad computada: niveles únicos
const uniqueLevels = computed(() => {
  const levels = [...new Set(digimons.value.map(d => d.level))]
  return levels.sort()
})

// Opciones para el select (con valor "Todos")
const levelOptions = computed(() => {
  return [
    { label: 'Todos los niveles', value: null },
    ...uniqueLevels.value.map(level => ({ label: level, value: level }))
  ]
})

// Propiedad computada: digimons filtrados
const filteredDigimons = computed(() => {
  return digimons.value.filter(digimon => {
    // Filtro por nombre
    const matchesName = searchText.value
      ? digimon.name.toLowerCase().includes(searchText.value.toLowerCase())
      : true

    // Filtro por nivel
    const matchesLevel = selectedLevel.value
      ? digimon.level === selectedLevel.value
      : true

    return matchesName && matchesLevel
  })
})

// Función para cargar digimons
const fetchDigimons = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://digimon-api.vercel.app/api/digimon')
    digimons.value = response.data

    $q.notify({
      type: 'positive',
      message: `${response.data.length} Digimons cargados exitosamente`,
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('Error al cargar digimons:', error)

    $q.notify({
      type: 'negative',
      message: 'Error al cargar los datos de la API',
      caption: error.message || 'Intenta nuevamente más tarde',
      position: 'top',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}

// Ciclo de vida
onMounted(() => {
  fetchDigimons()
})
</script>

<style scoped>
.digimon-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.digimon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18) !important;
}

.card-image {
  background-color: #f5f5f5;
}

/* Bordes de colores por nivel */
.border-blue-grey {
  border-left-color: #607d8b;
}

.border-light-blue {
  border-left-color: #03a9f4;
}

.border-green {
  border-left-color: #4caf50;
}

.border-blue {
  border-left-color: #2196f3;
}

.border-deep-orange {
  border-left-color: #ff5722;
}

.border-purple {
  border-left-color: #9c27b0;
}

.border-amber {
  border-left-color: #ffc107;
}

.border-grey {
  border-left-color: #9e9e9e;
}
</style>
