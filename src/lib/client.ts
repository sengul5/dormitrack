const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4321/api'

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

// Genel Fetch Fonksiyonu
async function httpClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  // Client-side'da token'ı LocalStorage'dan alabiliriz
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Başarısız yanıtları yakala
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new ApiError(errorData?.message || 'Bir hata oluştu', response.status, errorData)
    }

    // "No Content" (204) durumunu yönet
    if (response.status === 204) {
      return null as unknown as T
    }

    // Başarılı yanıtı JSON olarak dön
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Ağ hataları vs.
    throw new ApiError(error instanceof Error ? error.message : 'Network Error', 500)
  }
}

// Kullanımı kolaylaştıran metodlar
export const client = {
  get: <T>(endpoint: string) => httpClient<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: any) =>
    httpClient<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: any) =>
    httpClient<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: any) =>
    httpClient<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => httpClient<T>(endpoint, { method: 'DELETE' }),

  // Dosya yükleme gibi özel durumlar için (FormData)
  postForm: <T>(endpoint: string, formData: FormData) => {
    // Content-Type header'ını siliyoruz ki tarayıcı boundary'i kendi eklesin
    return httpClient<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': '' } as any, // Type-casting to bypass helper override
    })
  },
}
