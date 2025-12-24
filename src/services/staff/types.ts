// src/services/staff/types.ts

export type StaffStatus = 'active' | 'busy' | 'offline'
export type StaffRole = 'Cleaner' | 'Security' | 'IT&Network' | 'Maintenance'

export interface StaffMember {
  id: number
  name: string
  role: StaffRole
  phone: string
  status: StaffStatus
  img?: string
}

export interface CreateStaffDTO {
  name: string
  role: StaffRole
  phone: string
}
