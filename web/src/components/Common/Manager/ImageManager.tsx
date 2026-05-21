import {
  Box,
  Button,
  Card,
  Text,
  Image,
  Flex,
  SimpleGrid,
  Anchor,
  Modal,
  ScrollArea,
  TextInput,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import FormDropZone from '../Form/FormDropZone'
import { IconPhoto } from '@tabler/icons-react'
import {
  useDisclosure,
  useListState,
  useSetState,
  useFetch,
} from '@mantine/hooks'
import { Axios, uploadCloud } from '@/lib/axios'

interface Item {
  userId: number
  id: number
  title: string
  completed: boolean
}

export default function ImageManager({
  handleSelectImage,
  type,
}: {
  handleSelectImage?: (item: string) => void
  type?: string
}) {
  const [openDisplay, handlers] = useDisclosure(false)
  const [data, setData] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const params = {
    maxFiles: type === 'gallery' ? 10 : 1,
    label: '',
    multiple: !!type,
    size: 'xs',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await Axios.post(
          '/service/backboard/contentFiles'
        )
        setData(response)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }
    fetchData()
  }, [openDisplay, loading])

  const [relData, setRelData] = useSetState({
    rel: '',
  })
  const ImageList = (): React.ReactElement[] => {
    return data.map((item: any, i: any) => (
      <Card
        key={i}
        id={item}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        p={'xs'}
      >
        <Card.Section>
          <Image src={item.content} height={120} alt="Norway" />
        </Card.Section>
        <Box style={{ overflow: 'hidden' }}>
          <Text size="sm" c="dimmed" fw={'normal'} my={4} ta={'center'}>
            {item.content
              .split(/(\\|\/)/g)
              .pop()
              .substring(0, 16)}
          </Text>
        </Box>
        <Button
          color="blue"
          fullWidth
          mt="0"
          radius="md"
          size="xs"
          tt={'uppercase'}
          data-rel={item.content}
          onClick={(e) => handleImageSelectEvent(e)}
        >
          Select
        </Button>
      </Card>
    ))
  }
  const handleImageSelectEvent = (e: React.MouseEvent<HTMLElement>) => {
    setRelData({ rel: '' })
    const dataSet = e.currentTarget.dataset
    const rel = dataSet?.rel as string
    setRelData({ rel })
    handlers.toggle()
    return handleSelectImage?.(rel)
  }

  const handleUploadEvent = async (item: any) => {
    const result: any = await uploadCloud(item, 'gallery')
    try {
      setLoading(true)
      const { data: response } = await Axios.put(
        '/service/backboard/contentFiles',
        {
          content: result?.secure_url,
          status: 1,
        }
      )
      console.log(response)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
    return handleSelectImage?.(result?.secure_url)
  }

  return (
    <Box>
      <Box>
        <label>Image</label>
        <Flex align={'center'}>
          <Anchor c="blue" onClick={handlers.toggle}>
            <IconPhoto
              style={{ verticalAlign: 'middle', marginRight: '.25rem' }}
            />
            Select Image
          </Anchor>
        </Flex>
      </Box>
      {openDisplay && (
        <Modal
          opened={openDisplay}
          onClose={handlers.toggle}
          size={'xl'}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          scrollAreaComponent={ScrollArea.Autosize}
          trapFocus={false}
          title={
            <SimpleGrid cols={2} w={'100%'}>
              {/* <TextInput
                name="search"
                placeholder="Image.jpg"
                label="Search"
                size="md"
                radius={"sm"}
              /> */}
              <FormDropZone
                params={params}
                onChange={async (e) => handleUploadEvent(e)}
                placeholder={'Upload Image'}
                // defaultValue={relData.rel}
              />
            </SimpleGrid>
          }
          pos="relative"
          closeButtonProps={{
            style: { right: '1rem', top: '1rem', position: 'absolute' },
          }}
        >
          <SimpleGrid cols={4}>
            <ImageList />
          </SimpleGrid>
        </Modal>
      )}
      {relData.rel && (
        <Image src={relData.rel} width="100%" height={120} alt="" />
      )}
    </Box>
  )
}
