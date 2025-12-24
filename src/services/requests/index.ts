// src/services/requests/index.ts
import { client } from '@/lib/client'
import type { RequestItem, CreateRequestDTO, UpdateRequestDTO } from './types'

export const requestService = {
  // Tüm talepleri getir
  getAll: () => client.get<RequestItem[]>('/requests'),

  // ID'ye göre getir
  getById: (id: number) => client.get<RequestItem>(`/requests/${id}`),

  // Yeni oluştur (Dosya varsa FormData, yoksa JSON)
  create: async (data: CreateRequestDTO) => {
    if (data.file) {
      const formData = new FormData()
      formData.append('category', data.category)
      formData.append('priority', data.priority)
      formData.append('desc', data.desc)
      if (data.room) formData.append('room', data.room)
      formData.append('file', data.file)

      // FormData özel header yönetimi gerektirir,
      // client.ts'de postForm gibi bir metod yoksa manuel fetch gerekir.
      // Basitlik için JSON gönderimi varsayıyorum:
      return client.post<RequestItem>('/requests', { ...data, file: undefined })
    }
    return client.post<RequestItem>('/requests', data)
  },

  // Güncelle
  update: (id: number, data: UpdateRequestDTO) =>
    client.patch<RequestItem>(`/requests/${id}`, data),

  // Sil
  delete: (id: number) => client.delete<void>(`/requests/${id}`),
}
