import { useState } from 'react'

import { useDisclosure } from '@mantine/hooks'

export function useFilePicker() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSelect = (file) => {
    setSelectedFile(file)
    close()
  }

  return {
    setSelectedFile,
    file: selectedFile,
    openPicker: open,
    PickerModal: (props) => (
      <props.component
        opened={opened}
        onClose={close}
        onSelect={handleSelect}
      />
    ),
    opened,
  }
}
