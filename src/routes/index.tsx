import { getSession } from '@/lib/auth.functions'
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
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
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
  return (
    <AppShell
      header={{
        height: 60,
      }}
      p="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Title fz="h3">Shortlink</Title>
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
