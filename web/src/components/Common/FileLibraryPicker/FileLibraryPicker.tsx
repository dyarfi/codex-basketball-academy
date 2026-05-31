import { Modal, Image, SimpleGrid, Button, TextInput, Box } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'

import { useQuery } from '@redwoodjs/web'

const MEDIA_QUERY = gql`
  query FindMediaListsPicker($page: Int!, $search: String) {
    mediaLists(page: $page, search: $search) {
      medias {
        id
        name
        url
        mimeType
      }
      count
    }
  }
`

export default function FileLibraryPicker({
  opened = false,
  placeholder = 'file_name.jpg',
  onClose,
  onSelect,
}: {
  opened?: boolean
  placeholder?: string
  onClose: () => {}
  onSelect: (params: any) => {}
}) {
  const [value, setValue] = useDebouncedState('', 600)
  const { data, loading } = useQuery(MEDIA_QUERY, {
    variables: { page: 1, search: value },
  })

  const onSearchAction = (search: string) => {
    setValue(search)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Search or Select a file"
    >
      <Box mb={20}>
        <TextInput
          radius={'sm'}
          name="search"
          size={'xs'}
          leftSection={<IconSearch size={16} />}
          placeholder={placeholder}
          onChange={(event) => onSearchAction(event.currentTarget.value)}
          defaultValue={value}
        />
      </Box>
      <SimpleGrid cols={2} spacing="md">
        {!loading &&
          data &&
          data.mediaLists &&
          data.mediaLists?.medias.map((file: any) => (
            <Button
              className="cursor-pointer border-none transition hover:shadow-xl"
              m={0}
              p={0}
              w={'100%'}
              h={'200px'}
              variant="transparent"
              radius={'md'}
              key={file.id}
              onClick={() => {
                onSelect(file)
                onClose()
              }}
            >
              {file.mimeType.startsWith('image') ? (
                <Image src={file.url} alt={file.name} radius="md" />
              ) : (
                <div className="rounded bg-gray-100 p-4 text-sm">
                  {file.name}
                </div>
              )}
            </Button>
          ))}
      </SimpleGrid>
    </Modal>
  )
}
