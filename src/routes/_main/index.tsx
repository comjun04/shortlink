import { Button, Checkbox, Group, Table, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { LuPlus } from 'react-icons/lu'

import { getSession } from '@/lib/auth.functions'
import { getLinks } from '@/lib/link.functions'

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
  const getLinksFn = useServerFn(getLinks)
  const linksQuery = useQuery({
    queryKey: ['links'],
    queryFn: () => getLinksFn(),
  })

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
          {linksQuery.isPending && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text c="dimmed" ta="center">
                  Loading links…
                </Text>
              </Table.Td>
            </Table.Tr>
          )}

          {linksQuery.isError && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text c="red" ta="center">
                  Unable to load links.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}

          {linksQuery.isSuccess && linksQuery.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text c="dimmed" ta="center">
                  No links created yet.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}

          {linksQuery.data?.map((link) => (
            <Table.Tr key={link.id}>
              <Table.Td>
                <Checkbox />
              </Table.Td>
              <Table.Td>{link.slug}</Table.Td>
              <Table.Td>
                <a href={link.redirectUrl}>{link.redirectUrl}</a>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Button>Edit</Button>
                  <Button variant="danger">Delete</Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
