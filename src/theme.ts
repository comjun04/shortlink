import { createTheme, defaultVariantColorsResolver } from '@mantine/core'

const theme = createTheme({
  variantColorResolver: (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input)

    if (input.variant === 'danger') {
      return {
        background: 'var(--mantine-color-red-9)',
        hover: 'var(--mantine-color-red-8)',
        color: 'var(--mantine-color-white)',
        border: 'none',
      }
    }

    return defaultResolvedColors
  },
})

export default theme
