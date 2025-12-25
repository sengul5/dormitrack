import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

export const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'], // <-- Permissions available for created roles
} as const

export const ac = createAccessControl(statement)

export const student = ac.newRole({
  project: ['create'],
})

export const staff = ac.newRole({
  project: ['create', 'update'],
})

export const admin = ac.newRole({
  project: ['create', 'update', 'delete'],
  user: ['ban'],
})
