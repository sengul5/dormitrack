// src/services/complaints/index.ts
import { client } from '@/lib/client'
import type { Complaint, CreateComplaintDTO, FeedbackDTO } from './types'

export const complaintService = {
  getAll: () => client.get<Complaint[]>('/complaints'),

  getMyComplaints: () => client.get<Complaint[]>('/complaints/me'),

  create: (data: CreateComplaintDTO) => client.post<Complaint>('/complaints', data),

  // Şikayete puan verme
  giveFeedback: (id: number, data: FeedbackDTO) =>
    client.post<void>(`/complaints/${id}/feedback`, data),
}
