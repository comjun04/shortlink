import { authClient } from '@/lib/auth-client'
import { getSession } from '@/lib/auth.functions'
import { AppShell, Group, Menu, UnstyledButton, Text } from '@mantine/core'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { LuChevronDown, LuLogOut } from 'react-icons/lu'

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
          <Text fz="h2">Shortlink</Text>
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
