import {
  Box,
  Button,
  Code,
  Container,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import z from 'zod'

import { BaseUrl } from '@/constant'
import { getLink, updateLink } from '@/lib/link.functions'

const FormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .refine(
      (val) => val !== '_',
      'This slug is used as an internal path and cannot be used',
    )
    .refine(
      (val) => /^[a-z0-9_-]+$/gi.test(val),
      'Slug contains invalid characters',
    ),
  redirectUrl: z.httpUrl('Input is not a valid URL'),
})

export const Route = createFileRoute('/_main/_/link/$id')({
  beforeLoad: async ({ params }) => {
    const link = await getLink({ data: { id: params.id } })

    if (!link) {
      throw notFound()
    }

    return { link }
  },
  component: EditLinkPage,
})

function EditLinkPage() {
  const { link } = Route.useRouteContext()

  return <EditLinkForm link={link} />
}

function EditLinkForm({
  link,
}: {
  link: { id: string; slug: string; redirectUrl: string }
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateLinkFn = useServerFn(updateLink)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm({
    mode: 'controlled',
    initialValues: { slug: link.slug, redirectUrl: link.redirectUrl },
    validateInputOnChange: true,
    validate: schemaResolver(FormSchema, { sync: true }),
  })

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await updateLinkFn({ data: { id: link.id, ...values } })

      if (!result.success) {
        if (result.error === 'This slug is already in use') {
          form.setFieldError('slug', result.error)
        } else {
          setSubmitError(result.error)
        }
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['links'] })
      await navigate({ to: '/' })
    } catch {
      setSubmitError('Unable to update the link. Please try again.')
    }
  })

  return (
    <Container>
      <Title order={3}>Edit link</Title>

      <Box mt="md">
        <form onSubmit={handleSubmit}>
          <Box>
            <TextInput
              required
              label="Slug"
              leftSection="/"
              {...form.getInputProps('slug')}
            />
            <Text>
              The updated link will be{' '}
              <Code>
                {BaseUrl}/{form.values.slug}
              </Code>
            </Text>
          </Box>

          <TextInput
            required
            label="Redirect URL"
            type="url"
            mt="md"
            {...form.getInputProps('redirectUrl')}
          />

          {submitError && (
            <Text c="red" mt="sm">
              {submitError}
            </Text>
          )}

          <Button type="submit" mt="md" loading={form.submitting}>
            Save changes
          </Button>
        </form>
      </Box>
    </Container>
  )
}
