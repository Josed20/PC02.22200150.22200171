<template>
  <q-page class="page-container">
    <!-- Hero Section -->
    <div class="hero-section text-center q-mb-xl q-pt-lg">
      <h2 class="text-h3 text-weight-light text-grey-9 q-mb-sm">
        <q-icon name="pets" size="2rem" class="q-mr-sm" color="purple-7" />
        Explorador Digital
      </h2>
      <p class="text-subtitle1 text-grey-6 text-weight-light">
        Descubre y filtra más de 200 criaturas digitales
      </p>
    </div>

    <!-- Barra de Búsqueda Flotante -->
    <div class="search-container q-mb-xl">
      <div class="row q-col-gutter-lg justify-center">
        <div class="col-12 col-sm-5 col-md-4">
          <q-input
            v-model="searchText"
            outlined
            rounded
            bg-color="white"
            placeholder="Buscar por nombre..."
            clearable
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-5 col-md-4">
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
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="tune" color="grey-6" />
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <div class="column items-center">
        <q-spinner-dots color="purple-7" size="4em" />
        <p class="text-grey-6 q-mt-md text-weight-light">Cargando Digimons...</p>
      </div>
    </div>

    <!-- Grid de Tarjetas -->
    <div v-else-if="filteredDigimons.length > 0" class="cards-grid row q-col-gutter-lg">
      <div
        v-for="digimon in filteredDigimons"
        :key="digimon.name"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card
          class="digimon-card card-hover"
          :data-level="digimon.level"
        >
          <div class="card-image-wrapper">
            <q-img
              :src="digimon.img"
              :alt="digimon.name"
              ratio="1"
              spinner-color="purple-7"
              class="digimon-image"
            >
              <div class="absolute-top-right q-pa-md">
                <q-badge
                  :color="getLevelColor(digimon.level)"
                  rounded
                  class="level-badge"
                >
                  {{ digimon.level }}
                </q-badge>
              </div>
            </q-img>
          </div>
          <q-card-section class="q-pa-md">
            <div
              class="text-h6 text-center text-weight-medium"
              :class="`text-${getLevelColor(digimon.level)}-9`"
            >
              {{ digimon.name }}
            </div>
          </q-card-section>
          <div
            class="level-accent"
            :style="{ backgroundColor: getLevelColorHex(digimon.level) }"
          ></div>
        </q-card>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="flex flex-center column q-py-xl">
      <q-icon name="search_off" size="5em" color="grey-4" class="q-mb-md" />
      <p class="text-h5 text-grey-6 text-weight-light">No se encontraron resultados</p>
      <p class="text-body1 text-grey-5 text-weight-light">
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

// Función helper: obtener color hexadecimal
const getLevelColorHex = (level) => {
  const colorMap = {
    Fresh: '#607d8b',
    'In Training': '#03a9f4',
    Rookie: '#4caf50',
    Champion: '#2196f3',
    Ultimate: '#ff5722',
    Mega: '#9c27b0',
    Armor: '#ffc107'
  }
  return colorMap[level] || '#9e9e9e'
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
/* Página */
.page-container {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  min-height: 100vh;
  padding: 1rem;
}

/* Hero Section */
.hero-section {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Barra de Búsqueda Flotante */
.search-container {
  max-width: 900px;
  margin: 0 auto;
}

.search-input {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.search-input:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-input:focus-within {
  box-shadow: 0 4px 24px rgba(103, 58, 183, 0.2);
}

/* Grid de Tarjetas */
.cards-grid {
  max-width: 1400px;
  margin: 0 auto;
}

/* Tarjeta de Digimon */
.digimon-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Efecto hover premium */
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-hover[data-level="Fresh"]:hover {
  box-shadow: 0 12px 40px rgba(96, 125, 139, 0.25);
}

.card-hover[data-level="In Training"]:hover {
  box-shadow: 0 12px 40px rgba(3, 169, 244, 0.25);
}

.card-hover[data-level="Rookie"]:hover {
  box-shadow: 0 12px 40px rgba(76, 175, 80, 0.25);
}

.card-hover[data-level="Champion"]:hover {
  box-shadow: 0 12px 40px rgba(33, 150, 243, 0.25);
}

.card-hover[data-level="Ultimate"]:hover {
  box-shadow: 0 12px 40px rgba(255, 87, 34, 0.25);
}

.card-hover[data-level="Mega"]:hover {
  box-shadow: 0 12px 40px rgba(156, 39, 176, 0.25);
}

.card-hover[data-level="Armor"]:hover {
  box-shadow: 0 12px 40px rgba(255, 193, 7, 0.25);
}

/* Contenedor de Imagen */
.card-image-wrapper {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 1.5rem;
}

.digimon-image {
  border-radius: 8px;
}

/* Badge del Nivel */
.level-badge {
  padding: 6px 14px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Acento de Color Inferior */
.level-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: height 0.3s ease;
}

.digimon-card:hover .level-accent {
  height: 5px;
}

/* Responsive */
@media (max-width: 600px) {
  .page-container {
    padding: 0.5rem;
  }

  .hero-section h2 {
    font-size: 1.8rem;
  }

  .search-container {
    padding: 0 0.5rem;
  }
}
</style>
