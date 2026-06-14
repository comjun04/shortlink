import { Anchor, AnchorProps } from '@mantine/core'
import { Link, LinkOptions } from '@tanstack/react-router'
import { FC, ReactNode } from 'react'

interface TypedAnchorProps extends AnchorProps {
  to: NonNullable<LinkOptions['to']>
  children: ReactNode
}

// Mantine `Anchor` with tanstack router `Link` component, with `to` parameter fully-typed
const TypedAnchor: FC<TypedAnchorProps> = ({ to, ...props }) => {
  return (
    <Anchor
      {...props}
      renderRoot={(props: Record<string, unknown>) => (
        <Link {...props} to={to} />
      )}
    />
  )
}

export default TypedAnchor
