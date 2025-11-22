<template>
  <q-layout view="lHh lpr lFf" class="login-layout">
    <q-page-container>
      <q-page class="row no-wrap full-height">
        <!-- Columna Izquierda: Ilustración -->
        <div class="col-12 col-md-6 bg-white flex flex-center relative-position left-panel">
          <!-- Logo pequeño en esquina superior izquierda -->
          <div class="absolute-top-left q-pa-lg">
            <q-icon name="pets" size="2.5rem" color="indigo-6" />
            <span class="text-h6 text-indigo-6 q-ml-sm text-weight-bold">Digimon Codex</span>
          </div>

          <!-- Ilustración centrada -->
          <div class="illustration-container q-pa-xl">
            <q-img
              src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
              alt="Login Illustration"
              fit="contain"
              style="max-width: 500px; width: 100%;"
              spinner-color="indigo-6"
            />
            <div class="text-center q-mt-lg">
              <h5 class="text-h5 text-grey-8 text-weight-medium q-mb-sm">
                Bienvenido de vuelta
              </h5>
              <p class="text-body1 text-grey-6">
                Accede a tu colección digital de Digimons
              </p>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Formulario de Login -->
        <div class="col-12 col-md-6 bg-indigo-6 flex column right-panel">
          <!-- Barra de navegación superior -->
          <div class="top-nav q-pa-lg row justify-end q-gutter-md">
            <q-btn flat dense no-caps class="text-white" label="Home" />
            <q-btn flat dense no-caps class="text-white" label="About Us" />
            <q-btn flat dense no-caps class="text-white" label="Services" />
            <q-btn flat dense no-caps class="text-white text-weight-bold" label="Sign In" />
          </div>

          <!-- Formulario centrado -->
          <div class="flex-center column full-width q-px-xl" style="flex: 1;">
            <div class="login-form-container" style="width: 100%; max-width: 450px;">
              <!-- Título del formulario -->
              <div class="text-center q-mb-xl">
                <h3 class="text-h3 text-white text-weight-bold q-mb-sm">
                  Sign In
                </h3>
                <p class="text-body1 text-white" style="opacity: 0.9;">
                  Enter your credentials to access your account
                </p>
              </div>

              <!-- Formulario -->
              <q-form @submit="handleLogin" class="q-gutter-lg">
                <!-- Input Email -->
                <q-input
                  v-model="email"
                  type="email"
                  label="Email Address"
                  standout="bg-white text-indigo-6"
                  rounded
                  label-color="white"
                  dark
                  :rules="[val => !!val || 'Email is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" class="text-indigo-6" />
                  </template>
                </q-input>

                <!-- Input Password -->
                <q-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  standout="bg-white text-indigo-6"
                  rounded
                  label-color="white"
                  dark
                  :rules="[val => !!val || 'Password is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" class="text-indigo-6" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer text-indigo-6"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <!-- Remember & Forgot Password -->
                <div class="row items-center justify-between q-mt-md">
                  <q-checkbox
                    v-model="remember"
                    label="Remember me"
                    color="pink-5"
                    dark
                    class="text-white"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    label="Forgot password?"
                    class="text-white"
                    style="opacity: 0.8;"
                  />
                </div>

                <!-- Botón de Login -->
                <div class="q-mt-xl">
                  <q-btn
                    type="submit"
                    label="LOGIN"
                    class="full-width login-button"
                    rounded
                    no-caps
                    size="lg"
                    :loading="loading"
                    :disable="loading"
                  />
                </div>

                <!-- Link de registro -->
                <div class="text-center q-mt-lg">
                  <span class="text-white" style="opacity: 0.9;">
                    Don't have an account?
                  </span>
                  <q-btn
                    flat
                    dense
                    no-caps
                    label="Sign Up"
                    class="text-white text-weight-bold q-ml-xs"
                  />
                </div>
              </q-form>

              <!-- Credenciales de prueba -->
              <div class="q-mt-xl q-pa-md" style="background: rgba(255,255,255,0.1); border-radius: 12px;">
                <p class="text-caption text-white text-center q-mb-xs" style="opacity: 0.9;">
                  <q-icon name="info" size="sm" class="q-mr-xs" />
                  Test Credentials:
                </p>
                <p class="text-caption text-white text-center q-mb-none text-weight-medium">
                  guerrero@peru.com / 12345678
                </p>
              </div>
            </div>
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

.illustration-container {
  max-width: 600px;
}

.right-panel {
  position: relative;
  overflow-y: auto;
}

.top-nav {
  flex-shrink: 0;
}

.login-button {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 8px 24px rgba(255, 71, 87, 0.4);
  transition: all 0.3s ease;
}

.login-button:hover {
  box-shadow: 0 12px 32px rgba(255, 71, 87, 0.5);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

@media (max-width: 1023px) {
  .left-panel {
    display: none !important;
  }

  .right-panel {
    min-height: 100vh;
  }

  .top-nav {
    justify-content: center !important;
  }

  .login-form-container {
    padding: 2rem 1rem;
  }
}

@media (max-width: 600px) {
  .right-panel {
    padding: 0 !important;
  }

  .top-nav {
    font-size: 0.85rem;
    padding: 1rem !important;
  }

  .login-form-container {
    max-width: 100% !important;
  }
}
</style>
