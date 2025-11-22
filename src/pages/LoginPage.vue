<template>
  <q-page class="row full-height">

    <div class="col-12 col-md-6 bg-primary flex flex-center relative-position login-visual-panel">

      <div class="q-pa-md text-white text-center">
        <q-img
          :src="digimonSlides[currentIndex].img"
          alt="Digimon"
          fit="cover"
          class="digimon-slider-image"
          style="max-width: 400px; height: 300px; opacity: 0.3;"
        />

        <div class="absolute-center q-pa-lg">
          <div class="text-h3 text-weight-bold text-orange-4">∞</div>
          <div class="text-h4 text-weight-bolder q-mt-md">{{ digimonSlides[currentIndex].title }}</div>
          <p class="q-mt-sm text-subtitle1">{{ digimonSlides[currentIndex].subtitle }}</p>
        </div>

        <div class="q-mt-lg flex justify-center q-gutter-xs absolute-bottom q-pb-lg">
          <q-btn
            v-for="(slide, index) in digimonSlides"
            :key="index"
            :icon="index === currentIndex ? 'fiber_manual_record' : 'radio_button_unchecked'"
            :color="index === currentIndex ? 'orange-4' : 'grey-5'"
            round
            flat
            size="xs"
            @click="currentIndex = index"
          />
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 flex flex-center q-pa-lg">
      <q-card style="width: 100%; max-width: 400px;" class="shadow-8 q-pa-md">

        <q-card-section class="text-center">
          <div class="text-h5 text-primary text-weight-bold">Welcome Back</div>
          <p class="text-grey-7">Log in para acceder al Mundo Digital.</p>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSubmit" class="q-gutter-md">

            <q-banner v-if="error" dense rounded class="bg-red-1 text-red-10">
              <template v-slot:avatar>
                <q-icon name="error" color="red" />
              </template>
              {{ error }}
            </q-banner>

            <q-input
              v-model="email"
              type="email"
              label="Email"
              outlined
              required
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              v-model="password"
              type="password"
              label="Password"
              outlined
              required
            >
              <template v-slot:prepend><q-icon name="lock" /></template>
            </q-input>

            <div class="q-pt-md">
              <q-btn
                label="Login"
                type="submit"
                color="orange-6"
                text-color="white"
                class="full-width"
                :loading="loading"
              />
            </div>

            <div class="text-center q-mt-md">
              <q-btn flat dense color="primary" label="Create an account" to="/register" />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// --- DATA: Configuración del Slider ---
const digimonSlides = [
  {
    img: 'https://digimon-api.vercel.app/api/img/agumon.jpg',
    title: '¡Inicia tu Aventura!',
    subtitle: 'Encuentra a tu compañero Digimon perfecto y evoluciona sin límites.'
  },
  {
    img: 'https://digimon-api.vercel.app/api/img/gabumon.jpg',
    title: 'Tecnología Digital',
    subtitle: 'Conéctate al Mundo Digital a través de tu Digivice.'
  },
  {
    img: 'https://digimon-api.vercel.app/api/img/wargreymon.jpg',
    title: 'Evolución y Poder',
    subtitle: 'Lleva tu potencial al nivel Mega y supera cualquier desafío.'
  }
]

// --- ESTADOS ---
const email = ref('guerrero@peru.com') // Valor inicial sugerido
const password = ref('12345678') // Valor inicial sugerido
const error = ref(null)
const loading = ref(false)
const currentIndex = ref(0) // Para el slider
let sliderInterval = null // Para la función de cambio automático

const router = useRouter()

// --- LÓGICA DEL SLIDER AUTOMÁTICO ---
const startSlider = () => {
  sliderInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % digimonSlides.length
  }, 5000) // Cambia cada 5 segundos
}

// Iniciar el slider al montar el componente
onMounted(() => {
  startSlider()
})

// Limpiar el intervalo al desmontar el componente (para evitar fugas de memoria)
onUnmounted(() => {
  clearInterval(sliderInterval)
})

// --- LÓGICA DE AUTENTICACIÓN ---
const handleSubmit = async () => {
  error.value = null
  loading.value = true

  const loginData = {
    email: email.value,
    password: password.value
  }

  try {
    // Usando axios para la solicitud
    const response = await axios.post('https://storedb-api.onrender.com/node-api/users/signin', loginData, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*'
      }
    })

    // La API devuelve éxito (código 200/201)
    if (response.data && response.data.token) {
      // 1. Guardar el Token
      localStorage.setItem('userToken', response.data.token)

      // 2. Redirigir al listado de Digimons
      router.push('/digimons')
    } else {
      // Manejar respuesta de API sin token (si fuera el caso)
      error.value = 'Respuesta de servidor inválida o token no recibido.'
    }
  } catch (err) {
    // Manejar errores de red o errores de validación (ej: 401 Unauthorized)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Error al conectar. Verifica tus credenciales o el servidor.'
    }
    console.error('Error de Login:', err)
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
/* Estilos para asegurar el diseño de dos columnas */
.login-visual-panel {
  /* Fondo principal Azul Oscuro de Digimon */
  background-color: #003366;
}

/* Estilos para la imagen del slider dentro del panel visual */
.digimon-slider-image {
  /* Ocupa todo el espacio del contenedor, pero con opacidad para que se vea el texto */
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

/* El card del formulario de login */
.q-card {
  border-radius: 10px;
}

/* Media Query para pantallas pequeñas: el panel visual desaparece o se hace pequeño */
@media (max-width: 1024px) {
  .login-visual-panel {
    /* Oculta la columna visual en móviles para dar espacio al formulario */
    display: none !important;
  }
  .col-md-6 {
    /* El formulario ocupa todo el ancho en móviles */
    width: 100%;
    max-width: 100%;
  }
}
</style>
