import { betterAuth } from 'better-auth/minimal'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/instance'
import { schema } from '@/db/schema'

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
  trustedOrigins: (process.env.BETTER_AUTH_TRUST_LOCALHOST ?? '')
    .split(',')
    .filter((d) => d.trim().length > 0),
  basePath: '/_/api/auth',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array
  logger: {
    level: 'info',
  },
})
