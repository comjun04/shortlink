import { getSession } from '@/lib/auth.functions'
import { Outlet, redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (session == null) {
      throw redirect({ to: '/_/login' })
    }

    return { user: session.user }
  },
})

function RouteComponent() {
  return <Outlet />
}
