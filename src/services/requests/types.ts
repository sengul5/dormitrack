// src/services/requests/types.ts

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type RequestStatus = 'Active' | 'In Progress' | 'Completed' | 'Pending'

export interface RequestItem {
  id: number
  name: string // Öğrenci adı
  studentId?: string
  img?: string // Avatar URL
  category: string
  room: string
  priority: PriorityLevel
  date: string // ISO string
  status: RequestStatus
  desc: string
  evidenceUrl?: string // Eklenen fotoğraf
}

// Yeni kayıt oluştururken gönderilecek veri
export interface CreateRequestDTO {
  category: string
  priority: PriorityLevel
  desc: string
  room?: string
  file?: File | null // Dosya varsa
}

// Güncelleme için
export interface UpdateRequestDTO {
  status?: RequestStatus
  priority?: PriorityLevel
  assignedTo?: number // Staff ID
}
