import { getSession } from '@/lib/auth.functions'
import { Button, Checkbox, Group, Table, Title } from '@mantine/core'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { LuPlus } from 'react-icons/lu'

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
  return (
    <>
      <Group justify="space-between">
        <Title order={3}>All links</Title>
        <Button
          leftSection={<LuPlus size={16} />}
          renderRoot={(props: Record<string, unknown>) => (
            <Link to="/_/create" {...props} />
          )}
        >
          Create
        </Button>
      </Group>
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
    </>
  )
}
