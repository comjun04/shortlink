import { init } from '@paralleldrive/cuid2'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { desc } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db/instance'
import { link } from '@/db/schema'
import { auth } from '@/lib/auth'

const createId = init()

async function requireSession() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

const CreateLinkSchema = z.object(
  {
    slug: z
      .string('Invalid slug')
      .min(1, 'Slug too short')
      .refine((val) => val !== '_', 'Invalid slug')
      .refine((val) => /^[a-z0-9_-]+$/gi.test(val), 'Invalid slug'),
    redirectUrl: z.httpUrl('Invalid redirect URL'),
  },
  'Invalid data',
)

export const createLink = createServerFn({ method: 'POST' })
  .validator(CreateLinkSchema)
  .handler(async ({ data }) => {
    await requireSession()

    const insertedLinks = await db
      .insert(link)
      .values({
        id: createId(),
        slug: data.slug,
        redirectUrl: data.redirectUrl,
      })
      .onConflictDoNothing({ target: link.slug })
      .returning({ id: link.id })

    if (insertedLinks.length === 0) {
      return { success: false as const, error: 'This slug is already in use' }
    }

    return { success: true as const }
  })

export const getLinks = createServerFn({ method: 'GET' }).handler(async () => {
  await requireSession()

  return db
    .select({
      id: link.id,
      slug: link.slug,
      redirectUrl: link.redirectUrl,
    })
    .from(link)
    .orderBy(desc(link.createdAt))
})
