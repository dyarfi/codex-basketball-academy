import * as React from 'react'
import type { GlobalTypes } from '@storybook/csf'
import type { Preview, StoryContext, StoryFn } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import theme from 'config/mantine.config'
import '@mantine/core/styles.css'
/** @see {@link https://storybook.js.org/docs/7/essentials/toolbars-and-globals#global-types-and-the-toolbar-annotation | Global types and the toolbar annotation}  */
export const globalTypes: GlobalTypes = {}
/**
 * An example, no-op storybook decorator. Use a function like this to create decorators.
 * @see {@link https://storybook.js.org/docs/7/essentials/toolbars-and-globals#create-a-decorator | Create a decorator}
 */
const _exampleDecorator = (StoryFn: StoryFn, _context: StoryContext) => (
  <StoryFn />
)
/** @see {@link https://storybook.js.org/docs/7/essentials/toolbars-and-globals#create-a-decorator | Create a decorator} */
const withMantine = (Story: StoryFn) => (
  <MantineProvider theme={theme}>
    <Story />
  </MantineProvider>
)
const preview: Preview = {
  decorators: [withMantine],
}
