import { getSession } from '@/lib/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_/_unauthenticated')({
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
