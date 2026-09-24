import { init } from '@paralleldrive/cuid2'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, desc, eq, ne } from 'drizzle-orm'
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

const LinkFieldsSchema = z.object({
  slug: z
    .string('Invalid slug')
    .min(1, 'Slug too short')
    .refine((val) => val !== '_', 'Invalid slug')
    .refine((val) => /^[a-z0-9_-]+$/gi.test(val), 'Invalid slug'),
  redirectUrl: z.httpUrl('Invalid redirect URL'),
})

const CreateLinkSchema = LinkFieldsSchema

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

const LinkIdSchema = z.object({
  id: z.string().min(1),
})

export const getLink = createServerFn({ method: 'GET' })
  .validator(LinkIdSchema)
  .handler(async ({ data }) => {
    await requireSession()

    return db
      .select({
        id: link.id,
        slug: link.slug,
        redirectUrl: link.redirectUrl,
      })
      .from(link)
      .where(eq(link.id, data.id))
      .limit(1)
      .get()
  })

const UpdateLinkSchema = LinkFieldsSchema.extend({
  id: z.string().min(1),
})

export const updateLink = createServerFn({ method: 'POST' })
  .validator(UpdateLinkSchema)
  .handler(async ({ data }) => {
    await requireSession()

    const conflictingLink = await db
      .select({ id: link.id })
      .from(link)
      .where(and(eq(link.slug, data.slug), ne(link.id, data.id)))
      .limit(1)
      .get()

    if (conflictingLink) {
      return { success: false as const, error: 'This slug is already in use' }
    }

    const updatedLinks = await db
      .update(link)
      .set({ slug: data.slug, redirectUrl: data.redirectUrl })
      .where(eq(link.id, data.id))
      .returning({ id: link.id })

    if (updatedLinks.length === 0) {
      return { success: false as const, error: 'Link not found' }
    }

    return { success: true as const }
  })

const DeleteLinkSchema = LinkIdSchema

export const deleteLink = createServerFn({ method: 'POST' })
  .validator(DeleteLinkSchema)
  .handler(async ({ data }) => {
    await requireSession()

    const deletedLinks = await db
      .delete(link)
      .where(eq(link.id, data.id))
      .returning({ id: link.id })

    return { success: deletedLinks.length > 0 }
  })
