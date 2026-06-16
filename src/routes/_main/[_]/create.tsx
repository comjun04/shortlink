import {
  Box,
  Button,
  Code,
  Container,
  TextInput,
  Text,
  Title,
} from '@mantine/core'
import { isUrl, useForm } from '@mantine/form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const baseUrl = import.meta.env.VITE_BASE_URL.slice(
    0,
    import.meta.env.VITE_BASE_URL.endsWith('/') ? -1 : 0,
  )

  const form = useForm({
    mode: 'controlled',
    initialValues: { slug: '', redirectUrl: '' },
    validateInputOnChange: true,
    validate: {
      slug: (value) => {
        if (value.length < 1) return 'Slug cannot be empty'
        if (value === '_')
          return 'This slug is used as internal paths and cannot be used'

        if (/^[a-z0-9_-]+$/gi.test(value)) return null
        else return 'Slug contains invalid characters'
      },
      redirectUrl: isUrl('Input is not a valid URL'),
    },
  })

  return (
    <Container>
      <Title order={3}>Create new Link</Title>

      <Box mt="md">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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

          <Button type="submit" mt="md">
            Create
          </Button>
        </form>
      </Box>
    </Container>
  )
}
