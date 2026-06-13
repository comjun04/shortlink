import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Group,
  Title,
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <AppShell
      header={{
        height: 60,
      }}
      p="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Title fz="h3">Shortlink</Title>
        </Group>
      </AppShellHeader>
      <AppShellMain>Hello World</AppShellMain>
    </AppShell>
  )
}
