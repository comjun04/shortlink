import { sqliteTable } from 'drizzle-orm/sqlite-core'
import * as t from 'drizzle-orm/sqlite-core'

// https://better-auth.com/docs/concepts/database#user
export const user = sqliteTable('user', {
  id: t.text('id').primaryKey(),
  name: t.text('name').notNull(),
  email: t.text('email').notNull().unique(),
  emailVerified: t.integer('email_verified').notNull(),
  image: t.text('image'),
  createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const schema = { user }
