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
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const signIn = createServerFn().handler(async (ctx) => {
  await auth.api.signInEmail({
    body: {
      email: 'test@example.com',
      password: 'mypassword',
    },
  })
})

export const Route = createFileRoute('/_/login')({
  component: RouteComponent,
})

function RouteComponent() {
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
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              radius="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              radius="md"
            />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button
              fullWidth
              mt="xl"
              radius="md"
              onClick={() => signIn().catch(console.error)}
            >
              Sign in
            </Button>
          </Paper>
        </Container>
      </Center>
    </main>
  )
}
