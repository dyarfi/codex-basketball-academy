import { createTheme, rem } from '@mantine/core'

/**
 * This object will be used to override Mantine theme defaults.
 * See https://mantine.dev/theming/mantine-provider/#theme-object for theming options
 * @type {import("@mantine/core").MantineThemeOverride}
 */
const theme = createTheme({
  primaryColor: 'blue',
  focusRing: 'never',
  // defaultRadius: "xl",
  // fontFamily: roboto.style.fontFamily,
  headings: {
    // properties for all headings
    // fontFamily: montserrat.style.fontFamily,
    fontWeight: '900',
    // properties for individual headings, all of them are optional
    sizes: {
      h1: {
        fontSize: rem(36),
        lineHeight: '1.4',
      },
      h2: { fontSize: rem(30), lineHeight: '1.5' },
      // ...up to h6
      h6: { fontWeight: '900' },
    },
  },
  components: {
    Paper: {
      defaultProps: {
        shadow: 'md',
      },
    },
    // Paper: Paper.extend({
    //   defaultProps: {
    //     bg: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAANklEQVQoU2NkIBIwEqmOgXyFU6dObQDZkp2dDaZhAMVEmCKYJLJi8hSCTCLKanwhQL6vcZkKAMbtEAuAaq67AAAAAElFTkSuQmCC)",
    //   },
    // }),
    //   Button: Button.extend({
    //     defaultProps: {
    //       color: "cyan",
    //       variant: "outline",
    //       radius: 20,
    //     },
    //   }),
    // Button: {
    //   defaultProps: {
    //     color: 'blue',
    //     // variant: 'outline',
    //     // radius: 30,
    //     // radius: 0,
    //   },
    // },
    MenuDropdown: {
      defaultProps: {
        // radius: 0,
        color: 'cyan',
        variant: 'outline',
      },
    },
    TextInput: {
      defaultProps: {
        // radius: 0,
      },
    },
    Textarea: {
      defaultProps: {
        // radius: 0,
      },
    },
  },
})

export default createTheme(theme)
