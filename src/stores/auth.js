import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isAuthenticated = ref(!!token.value)

  const login = async (email, password) => {
    try {
      // Simulación de API - En producción, usar tu endpoint real
      // const response = await axios.post('https://api.example.com/login', { email, password })

      // Por ahora, validación manual
      if (email === 'guerrero@peru.com' && password === '12345678') {
        const mockToken = 'mock-jwt-token-' + Date.now()
        const mockUser = {
          id: 1,
          email,
          name: 'Usuario Guerrero'
        }

        token.value = mockToken
        user.value = mockUser
        isAuthenticated.value = true

        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))

        return { success: true }
      } else {
        throw new Error('Credenciales incorrectas')
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión'
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
})
