// src/services/complaints/types.ts

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type ComplaintStatus = 'Pending' | 'Investigating' | 'Resolved' | 'Open'

export interface Complaint {
  id: number
  name: string
  img?: string
  category: string
  room: string
  severity: SeverityLevel
  date: string
  status: ComplaintStatus
  desc: string
  rated?: boolean
  rating?: number
}

export interface CreateComplaintDTO {
  category: string
  severity: SeverityLevel
  desc: string
  room?: string
}

export interface FeedbackDTO {
  rating: number
  comment?: string
}
