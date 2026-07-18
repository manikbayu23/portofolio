import { refreshAccessToken } from './auth'

export async function apiFetch(url, options = {}) {
  options.headers = options.headers || {}

  // Set default JSON Content-Type if not provided
  if (!(options.headers instanceof Headers) && !options.headers['Content-Type'] && !options.headers['content-type']) {
    options.headers['Content-Type'] = 'application/json'
  }

  // Attach access token
  const token = localStorage.getItem('access_token')
  if (token) {
    if (options.headers instanceof Headers) {
      options.headers.set('Authorization', `Bearer ${token}`)
    } else {
      options.headers['Authorization'] = `Bearer ${token}`
    }
  }

  let response = await fetch(url, options)

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken()
    if (newAccessToken) {
      // Retry the original request with the new access token
      if (options.headers instanceof Headers) {
        options.headers.set('Authorization', `Bearer ${newAccessToken}`)
      } else {
        options.headers['Authorization'] = `Bearer ${newAccessToken}`
      }
      response = await fetch(url, options)
    }
  }

  return response
}
