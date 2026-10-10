// Centralized API Client with Cloudflare Tunnel & Vercel hybrid support

export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ||
  "https://she-cricket-prophet-promoting.trycloudflare.com"

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${cleanEndpoint}`

  return fetch(url, options)
}
