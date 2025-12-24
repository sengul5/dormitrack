// src/services/staff/index.ts
import { client } from '@/lib/client'
import type { StaffMember, CreateStaffDTO } from './types'

export const staffService = {
  getAll: () => client.get<StaffMember[]>('/staff'),

  getAvailable: () => client.get<StaffMember[]>('/staff?status=active'),

  create: (data: CreateStaffDTO) => client.post<StaffMember>('/staff', data),

  updateStatus: (id: number, status: StaffMember['status']) =>
    client.patch<StaffMember>(`/staff/${id}`, { status }),

  delete: (id: number) => client.delete<void>(`/staff/${id}`),
}
