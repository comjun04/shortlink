import TypedAnchor from '@/components/TypedAnchor'
import { auth } from '@/lib/auth'
import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Group,
  PasswordInput,
  Space,
  Text,
  Title,
} from '@mantine/core'
import { Container, Paper, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const signIn = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    })
  })

export const Route = createFileRoute('/_/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
  })

  return (
    <main style={{ height: '100dvh' }}>
      <Center h="100%">
        <Container size="32rem" flex="1">
          <Title ta="center">Shortlink</Title>

          <Space h="md" />

          <Text ta="center" fz="h2">
            Login
          </Text>

          <Paper withBorder shadow="sm" p={22} mt="sm" radius="md">
            <form
              onSubmit={form.onSubmit((values) => {
                console.log(values)
                signIn({
                  data: {
                    email: values.email,
                    password: values.password,
                  },
                })
              })}
            >
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                radius="md"
                type="email"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                radius="md"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Anchor component="button" size="sm">
                  Forgot password?
                </Anchor>
              </Group>
              <Button type="submit" fullWidth mt="xl" radius="md">
                Sign in
              </Button>
            </form>

            <Text ta="center" mt="sm">
              <TypedAnchor to="/_/signup">Create Account</TypedAnchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </main>
  )
}
