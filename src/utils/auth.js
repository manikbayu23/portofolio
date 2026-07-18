let routerInstance = null
let refreshTimeoutId = null

export function setRouter(router) {
  routerInstance = router
}

export function clearAuth() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('token_expires_at')
  localStorage.removeItem('user')

  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }
}

export function redirectToLogin() {
  if (routerInstance) {
    routerInstance.push({ name: 'Login' })
  } else {
    window.location.href = '/login'
  }
}

export function isTokenExpired() {
  const expiresAtStr = localStorage.getItem('token_expires_at')
  if (!expiresAtStr) return true
  const expiresAt = parseInt(expiresAtStr, 10)
  // Check if token expires in less than 30 seconds
  return Date.now() >= (expiresAt - 30000)
}

export async function refreshAccessToken() {
  const refreshTokenValue = localStorage.getItem('refresh_token')
  if (!refreshTokenValue) {
    clearAuth()
    redirectToLogin()
    return null
  }

  try {
    const response = await fetch('https://n8n.mbwebcreations.my.id/webhook/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshTokenValue })
    })

    // Jika response status nya 401, hapus token dan login ulang
    if (response.status === 401) {
      clearAuth()
      redirectToLogin()
      return null
    }

    const data = await response.json()

    // jika response status nya false, hapus token dan login ulang
    if (data.success === false || data.status === false) {
      clearAuth()
      redirectToLogin()
      return null
    }

    if (data.success && data.data) {
      const { access_token, refresh_token, expires_in } = data.data
      
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
      }
      if (expires_in) {
        localStorage.setItem('token_expires_at', (Date.now() + expires_in * 1000).toString())
      }

      // Reschedule next refresh
      scheduleTokenRefresh()

      return access_token
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
  }
  return null
}

export function scheduleTokenRefresh() {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }

  const token = localStorage.getItem('access_token')
  const refreshTokenValue = localStorage.getItem('refresh_token')
  if (!token || !refreshTokenValue) return

  const expiresAtStr = localStorage.getItem('token_expires_at')
  if (!expiresAtStr) return

  const expiresAt = parseInt(expiresAtStr, 10)
  const buffer = 30 * 1000 // 30 seconds buffer
  const delay = expiresAt - Date.now() - buffer

  if (delay <= 0) {
    // Already expired or close to it, refresh now
    refreshAccessToken()
  } else {
    // Schedule refresh
    refreshTimeoutId = setTimeout(async () => {
      await refreshAccessToken()
    }, delay)
  }
}
