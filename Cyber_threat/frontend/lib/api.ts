// Centralized API Client with localtunnel & Vercel hybrid support

export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ||
  "https://tricky-boats-happen.loca.lt"

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${cleanEndpoint}`

  const headers = new Headers(options.headers || {})
  headers.set("Bypass-Tunnel-Reminder", "true")

  return fetch(url, {
    ...options,
    headers,
  })
}
