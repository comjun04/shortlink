import {
  Box,
  Button,
  Code,
  Container,
  TextInput,
  Text,
  Title,
} from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import z from 'zod'

import { createLink } from '@/lib/link.functions'

const FormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .refine(
      (val) => val !== '_',
      'This slug is used as internal paths and cannot be used',
    )
    .refine(
      (val) => /^[a-z0-9_-]+$/gi.test(val),
      'Slug contains invalid characters',
    ),
  redirectUrl: z.httpUrl('Input is not a valid URL'),
})

export const Route = createFileRoute('/_main/_/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const createLinkFn = useServerFn(createLink)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const baseUrl = import.meta.env.VITE_BASE_URL.slice(
    0,
    import.meta.env.VITE_BASE_URL.endsWith('/') ? -1 : 0,
  )

  const form = useForm({
    mode: 'controlled',
    initialValues: { slug: '', redirectUrl: '' },
    validateInputOnChange: true,
    validate: schemaResolver(FormSchema, { sync: true }),
  })

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await createLinkFn({ data: values })

      if (!result.success) {
        form.setFieldError('slug', result.error)
        return
      }

      await navigate({ to: '/' })
    } catch {
      setSubmitError('Unable to create the link. Please try again.')
    }
  })

  return (
    <Container>
      <Title order={3}>Create new Link</Title>

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
              The created Link will be{' '}
              <Code>
                {baseUrl}/{form.values.slug}
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
            Create
          </Button>
        </form>
      </Box>
    </Container>
  )
}
