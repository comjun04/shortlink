import TypedAnchor from '@/components/TypedAnchor'
import { authClient } from '@/lib/auth-client'
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core'
import { Space } from '@mantine/core'
import { Title } from '@mantine/core'
import { Center } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
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
            Sign Up
          </Text>

          <Paper withBorder shadow="sm" p={22} mt="sm" radius="md">
            <form
              onSubmit={form.onSubmit((values) => {
                authClient.signUp
                  .email({
                    name: values.username,
                    email: values.email,
                    password: values.password,
                  })
                  .then(() => navigate({ to: '/' }))
                  .catch(console.error)
              })}
            >
              <TextInput
                label="Username"
                placeholder="Choose your username"
                required
                radius="md"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                mt="md"
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
              <Button type="submit" fullWidth mt="xl" radius="md">
                Sign Up
              </Button>
            </form>

            <Text ta="center" mt="sm">
              Already have an account?{' '}
              <TypedAnchor to="/_/login">Login</TypedAnchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </main>
  )
}
