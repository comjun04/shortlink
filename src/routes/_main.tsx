import {
  AppShell,
  Button,
  Group,
  Menu,
  UnstyledButton,
  Text,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { LuChevronDown, LuLogOut } from 'react-icons/lu'

import { authClient } from '@/lib/auth-client'
import { getSession } from '@/lib/auth.functions'

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

function Logo() {
  return (
    <Button
      variant="transparent"
      p={0}
      c="dark"
      renderRoot={(props: Record<string, unknown>) => (
        <Link to="/" {...props} />
      )}
    >
      <Text fz="h2">Shortlink</Text>
    </Button>
  )
}

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  return (
    <AppShell
      header={{
        height: 60,
      }}
      p="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Logo />

          <Menu>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Text>{user.name}</Text>
                  <LuChevronDown size={16} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<LuLogOut size={16} />}
                onClick={() => {
                  authClient
                    .signOut()
                    .then(() => navigate({ to: '/_/login' }))
                    .catch(console.error)
                }}
              >
                <Text>Logout</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
