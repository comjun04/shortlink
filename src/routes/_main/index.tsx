import { authClient } from '@/lib/auth-client'
import { getSession } from '@/lib/auth.functions'
import { Menu, Text, UnstyledButton } from '@mantine/core'
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Button,
  Checkbox,
  Group,
  Table,
  Title,
} from '@mantine/core'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { LuChevronDown, LuLogOut } from 'react-icons/lu'

export const Route = createFileRoute('/_main/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/_/login' })
    }
    return { user: session.user }
  },

  component: Home,
})

function Home() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  return (
    <AppShell
      header={{
        height: 60,
      }}
      p="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Title fz="h3">Shortlink</Title>
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
      </AppShellHeader>
      <AppShellMain>
        <Title order={3} size="h3">
          All links
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox />
              </Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Checkbox />
              </Table.Td>
              <Table.Td>sample-id</Table.Td>
              <Table.Td>
                <a href="https://google.com">https://google.com</a>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Button>Edit</Button>
                  <Button variant="danger">Delete</Button>
                </Group>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>
                <Checkbox />
              </Table.Td>
              <Table.Td>sample-id</Table.Td>
              <Table.Td>
                <a href="https://google.com">https://google.com</a>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Button>Edit</Button>
                  <Button variant="danger">Delete</Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </AppShellMain>
    </AppShell>
  )
}
