import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '@/db/instance'
import { link } from '@/db/schema'

export const Route = createFileRoute('/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const destination = await db
          .select({ redirectUrl: link.redirectUrl })
          .from(link)
          .where(eq(link.slug, params.slug))
          .limit(1)
          .get()

        if (!destination) {
          return new Response('Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
          })
        }

        return new Response(null, {
          status: 302,
          headers: { Location: destination.redirectUrl },
        })
      },
    },
  },
})
