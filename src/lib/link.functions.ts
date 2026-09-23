import { init } from '@paralleldrive/cuid2'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { db } from '@/db/instance'
import { link } from '@/db/schema'
import { auth } from '@/lib/auth'

type CreateLinkData = {
  slug: string
  redirectUrl: string
}

const createId = init()

function validateCreateLinkData(data: unknown): CreateLinkData {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid link data')
  }

  const { slug, redirectUrl } = data as Record<string, unknown>

  if (
    typeof slug !== 'string' ||
    slug.length === 0 ||
    slug === '_' ||
    !/^[a-z0-9_-]+$/i.test(slug)
  ) {
    throw new Error('Invalid slug')
  }

  if (typeof redirectUrl !== 'string') {
    throw new Error('Invalid redirect URL')
  }

  try {
    const url = new URL(redirectUrl)

    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.hostname === 'localhost'
    ) {
      throw new Error('Invalid redirect URL')
    }
  } catch {
    throw new Error('Invalid redirect URL')
  }

  return { slug, redirectUrl }
}

export const createLink = createServerFn({ method: 'POST' })
  .validator(validateCreateLinkData)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() })

    if (!session) {
      throw new Error('Unauthorized')
    }

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
