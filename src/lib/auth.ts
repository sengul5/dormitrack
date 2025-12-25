import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { admin as adminPlugin } from 'better-auth/plugins'
import { ac, admin, student, staff } from '@lib/rbac'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: new Pool({
    connectionString: import.meta.env.DSN!,
  }),
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        student,
        staff,
      },
    }),
  ],
})

export default auth
