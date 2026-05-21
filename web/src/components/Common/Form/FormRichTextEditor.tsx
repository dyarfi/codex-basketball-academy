import { useState } from 'react'

import { Box } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap'
import { Image } from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
// import { Dropcursor } from '@tiptap/extensions'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@mantine/tiptap/styles.css'

interface RichTextEditorProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  disabled: boolean
}

export function FormRichTextEditor({
  name,
  value,
  onChange,
  defaultValue,
  disabled,
}: RichTextEditorProps) {
  const [values, setValues] = useState(value)
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: values,
    onChange,
  })

  const editor = useEditor({
    // make the text editable (default is true)
    // editable: false,
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setValues(content)
      onChange(content)
    },
  })

  return (
    <Box mb={20}>
      <MantineRichTextEditor
        editor={editor}
        mih={180}
        aria-required
        className="rw-html-editor-wrapper"
      >
        <MantineRichTextEditor.Toolbar>
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold />
            <MantineRichTextEditor.Italic />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.H1 />
            <MantineRichTextEditor.H2 />
            <MantineRichTextEditor.H3 />
            <MantineRichTextEditor.H4 />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Blockquote />
            <MantineRichTextEditor.Hr />
            <MantineRichTextEditor.BulletList />
            <MantineRichTextEditor.OrderedList />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Link />
            <MantineRichTextEditor.Unlink />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.AlignLeft />
            <MantineRichTextEditor.AlignCenter />
            <MantineRichTextEditor.AlignJustify />
            <MantineRichTextEditor.AlignRight />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Undo />
            <MantineRichTextEditor.Redo />
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.Content />
      </MantineRichTextEditor>
      <input
        type="hidden"
        name={name}
        value={values}
        onChange={(event) => handleChange(event.currentTarget.value)}
        disabled={disabled}
      />
    </Box>
  )
}
