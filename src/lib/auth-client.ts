import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:4321',
  plugins: [adminClient()],
})
