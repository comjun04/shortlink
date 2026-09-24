import {
  Button,
  Checkbox,
  Group,
  Modal,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'

import { getSession } from '@/lib/auth.functions'
import { deleteLink, getLinks } from '@/lib/link.functions'

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
  const queryClient = useQueryClient()
  const getLinksFn = useServerFn(getLinks)
  const deleteLinkFn = useServerFn(deleteLink)
  const [linkToDelete, setLinkToDelete] = useState<{
    id: string
    slug: string
  } | null>(null)
  const linksQuery = useQuery({
    queryKey: ['links'],
    queryFn: () => getLinksFn(),
  })
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteLinkFn({ data: { id } })

      if (!result.success) {
        throw new Error('Link not found')
      }
    },
    onSuccess: async () => {
      setLinkToDelete(null)
      await queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const closeDeleteModal = () => {
    if (!deleteMutation.isPending) {
      setLinkToDelete(null)
      deleteMutation.reset()
    }
  }

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
                  <Button
                    renderRoot={(props: Record<string, unknown>) => (
                      <Link
                        to="/_/link/$id"
                        params={{ id: link.id }}
                        {...props}
                      />
                    )}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      deleteMutation.reset()
                      setLinkToDelete({ id: link.id, slug: link.slug })
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={linkToDelete !== null}
        onClose={closeDeleteModal}
        title="Delete link"
        centered
        closeOnClickOutside={!deleteMutation.isPending}
        closeOnEscape={!deleteMutation.isPending}
        withCloseButton={!deleteMutation.isPending}
      >
        <Text>
          Are you sure you want to delete the link{' '}
          <Text span fw={600}>
            /{linkToDelete?.slug}
          </Text>
          ? This action cannot be undone.
        </Text>

        {deleteMutation.isError && (
          <Text c="red" mt="sm">
            Unable to delete the link. Please try again.
          </Text>
        )}

        <Group justify="flex-end" mt="lg">
          <Button
            variant="default"
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (linkToDelete) {
                deleteMutation.mutate(linkToDelete.id)
              }
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  )
}
