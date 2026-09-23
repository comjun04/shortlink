import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getSession } from '@/lib/auth.functions'

export const Route = createFileRoute('/_unauthenticated')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (session != null) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
