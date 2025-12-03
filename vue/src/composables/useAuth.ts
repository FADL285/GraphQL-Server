import { useMutation } from 'villus'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { LOGIN, REGISTER } from '@/graphql/queries'
import { getErrorMessage } from '@/utils/errors'
import type { LoginResponse, RegisterResponse } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const { execute: loginMutation, isFetching: isLoggingIn } = useMutation<LoginResponse>(LOGIN)
  const { execute: registerMutation, isFetching: isRegistering } =
    useMutation<RegisterResponse>(REGISTER)

  async function login(
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      authStore.setLoading(true)
      const { data, error } = await loginMutation({ username, password })

      if (error) {
        return { success: false, error: getErrorMessage(error) }
      }

      if (data?.login) {
        authStore.setAuth(data.login.token, data.login.user)

        // Redirect to intended page or home
        const redirect = route.query.redirect as string
        router.push(redirect || '/')

        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (err) {
      return { success: false, error: getErrorMessage(err) }
    } finally {
      authStore.setLoading(false)
    }
  }

  async function register(
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      authStore.setLoading(true)
      const { data, error } = await registerMutation({ username, password })

      if (error) {
        return { success: false, error: getErrorMessage(error) }
      }

      if (data?.register) {
        authStore.setAuth(data.register.token, data.register.user)
        router.push('/')
        return { success: true }
      }

      return { success: false, error: 'Registration failed' }
    } catch (err) {
      return { success: false, error: getErrorMessage(err) }
    } finally {
      authStore.setLoading(false)
    }
  }

  function logout(): void {
    authStore.clearAuth()
    router.push('/login')
  }

  return {
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    username: authStore.username,
  }
}
