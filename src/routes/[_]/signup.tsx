import TypedAnchor from '@/components/TypedAnchor'
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
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_/signup')({
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
            Sign Up
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
            <Button fullWidth mt="xl" radius="md">
              Sign Up
            </Button>

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
