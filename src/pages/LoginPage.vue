<template>
  <q-layout view="lHh lpr lFf" class="login-layout">
    <q-page-container>
      <q-page class="row no-wrap window-height">
        <!-- Columna Izquierda: Visual -->
        <div class="col-12 col-md-6 bg-white flex flex-center column q-pa-xl left-panel">
          <!-- Logo en la parte superior -->
          <div class="q-mb-xl text-center">
            <q-icon name="pets" size="3.5rem" color="indigo-7" />
            <div class="text-h5 text-indigo-7 text-weight-bold q-mt-sm">Digimon Codex</div>
          </div>

          <!-- Imagen de los personajes -->
          <div class="illustration-wrapper">
            <q-img
              src="https://wallpapercave.com/wp/5ehb4vx.jpg"
              alt="Digimon Characters"
              fit="contain"
              class="login-illustration"
              spinner-color="indigo-6"
            />
          </div>

          <!-- Texto de bienvenida -->
          <div class="text-center q-mt-xl" style="max-width: 500px;">
            <h4 class="text-h4 text-grey-9 text-weight-medium q-mb-sm" style="line-height: 1.3;">
              Bienvenido de vuelta
            </h4>
            <p class="text-body1 text-grey-7" style="line-height: 1.6;">
              Accede a tu colección digital y explora el mundo de los Digimons
            </p>
          </div>
        </div>

        <!-- Columna Derecha: Formulario -->
        <div class="col-12 col-md-6 bg-indigo-7 flex flex-center column q-pa-xl right-panel">
          <div class="login-form-wrapper">
            <!-- Título del formulario -->
            <div class="text-center q-mb-xl">
              <h3 class="text-h3 text-white text-weight-bold q-mb-sm">
                Iniciar Sesión
              </h3>
              <p class="text-body1 text-white" style="opacity: 0.95;">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <!-- Formulario -->
            <q-form @submit="handleLogin" class="q-gutter-lg full-width">
              <!-- Input Email -->
              <q-input
                v-model="email"
                type="email"
                label="Correo Electrónico"
                outlined
                bg-color="white"
                label-color="white"
                color="indigo-7"
                class="login-input"
                :rules="[val => !!val || 'El correo es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="indigo-7" />
                </template>
              </q-input>

              <!-- Input Password -->
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                outlined
                bg-color="white"
                label-color="white"
                color="indigo-7"
                class="login-input"
                :rules="[val => !!val || 'La contraseña es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="indigo-7" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    color="indigo-7"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Checkbox Remember -->
              <div class="row items-center justify-between q-mt-md">
                <q-checkbox
                  v-model="remember"
                  label="Recordarme"
                  color="orange-5"
                  dark
                  class="text-white"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  label="¿Olvidaste tu contraseña?"
                  class="text-white"
                  style="opacity: 0.9;"
                />
              </div>

              <!-- Botón de Login -->
              <div class="q-mt-xl">
                <q-btn
                  type="submit"
                  label="INGRESAR"
                  class="full-width login-button"
                  rounded
                  unelevated
                  no-caps
                  size="lg"
                  :loading="loading"
                  :disable="loading"
                />
              </div>

              <!-- Link adicional -->
              <div class="text-center q-mt-lg">
                <span class="text-white" style="opacity: 0.9;">
                  ¿No tienes una cuenta?
                </span>
                <q-btn
                  flat
                  dense
                  no-caps
                  label="Regístrate"
                  class="text-orange-4 text-weight-bold q-ml-xs"
                />
              </div>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

defineOptions({
  name: 'LoginPage'
})

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('guerrero@peru.com')
const password = ref('12345678')
const showPassword = ref(false)
const remember = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: '¡Bienvenido!',
        caption: 'Inicio de sesión exitoso',
        position: 'top',
        timeout: 2000
      })

      router.push('/digimons')
    } else {
      $q.notify({
        type: 'negative',
        message: 'Error de autenticación',
        caption: result.message,
        position: 'top',
        timeout: 3000
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error inesperado',
      caption: error.message,
      position: 'top',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
}

.left-panel {
  position: relative;
}

.illustration-wrapper {
  width: 100%;
  max-width: 550px;
}

.login-illustration {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.right-panel {
  position: relative;
  min-height: 100vh;
}

.login-form-wrapper {
  width: 100%;
  max-width: 450px;
}

/* Inputs con fondo blanco */
.login-input :deep(.q-field__control) {
  border-radius: 12px;
}

.login-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.9);
}

.login-input :deep(.q-field__native) {
  color: #1a237e;
  font-weight: 500;
}

/* Botón con degradado naranja/dorado (estilo Agumon/Digivice) */
.login-button {
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  color: white;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 14px 0;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.login-button:hover {
  background: linear-gradient(135deg, #ff6f00 0%, #ff9800 100%);
  box-shadow: 0 12px 32px rgba(255, 152, 0, 0.5);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3);
}

/* Responsive: Ocultar panel izquierdo en móviles */
@media (max-width: 1023px) {
  .left-panel {
    display: none !important;
  }

  .right-panel {
    min-height: 100vh;
  }

  .login-form-wrapper {
    padding: 2rem 1rem;
  }
}

/* Ajustes para pantallas muy pequeñas */
@media (max-width: 600px) {
  .right-panel {
    padding: 2rem 1.5rem !important;
  }

  .login-form-wrapper {
    max-width: 100% !important;
  }
}
</style>
