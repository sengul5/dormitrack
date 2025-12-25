// Astro'da env değişkenlerine erişim import.meta.env ile yapılır
const BASE_URL = import.meta.env.PUBLIC_API_URL || '/api'

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function httpClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Endpoint başında / varsa çakışmayı önlemek için temizle
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${BASE_URL}${cleanEndpoint}`

  // FormData kontrolü
  const isFormData = options.body instanceof FormData

  const headers: HeadersInit = {
    // Eğer FormData gönderiyorsak Content-Type'ı tarayıcıya bırakmalıyız (boundary eklemesi için)
    // Değilse varsayılan olarak JSON kabul et
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  const config: RequestInit = {
    ...options,
    headers,
    // Better Auth cookie'lerini (session) göndermek için kritik ayar:
    credentials: 'include',
  }

  try {
    const response = await fetch(url, config)

    // Başarısız yanıtları yakala
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new ApiError(
        errorData?.message || `Hata: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    // "No Content" (204) durumunu yönet
    if (response.status === 204) {
      return null as unknown as T
    }

    // Yanıtın JSON olup olmadığını kontrol et
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    // JSON değilse text olarak dön (bazen gerekebilir)
    return (await response.text()) as unknown as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Ağ hataları vs.
    console.error('API Request Failed:', error)
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

  // FormData için özel metod (Content-Type otomatik ayarlanır)
  postForm: <T>(endpoint: string, formData: FormData) => {
    return httpClient<T>(endpoint, {
      method: 'POST',
      body: formData,
    })
  },
}
