import { useState } from 'react'

import { Box, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react'
// import { t } from 'i18next'

import classess from './FormDropZone.module.css'
import '@mantine/dropzone/styles.css'

export default function FormDropZone({
  params,
  onChange,
  placeholder = 'Drop images here',
  defaultValue = '',
}: {
  params: {
    maxFiles: number
    multiple?: boolean
    label?: string
    size?: string
  }
  onChange: (arg: string[]) => {}
  placeholder: string
  defaultValue?: string
}) {
  const {
    maxFiles = 1,
    multiple = false,
    label = 'Image',
    size = 'lg',
  } = params
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [uploadResult, setUploadResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [cover, setCover] = useState<string>(defaultValue)

  const handleUpload = (file: any) => {
    setLoading(true)
    if (!file[0]) {
      alert('Please select a file first!')
      return
    }
    try {
      const res: any = onChange(file[0])
      if (res.error) {
        setFiles([])
        setUploadResult(`Error: ${res.message}`)
      } else {
        setCover('')
        setFiles(file)
        setUploadResult(`File uploaded successfully! URL: ${res.secure_url}`)
      }
    } catch (error) {
      setFiles([])
      setUploadResult('Upload failed. Please try again.')
    }
    setLoading(false)
  }

  const previews =
    cover || defaultValue ? (
      <Image src={defaultValue} width={'100%'} alt="Replace" fit="cover" />
    ) : (
      files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file)
        return (
          <Image
            key={index}
            src={imageUrl}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
            alt="Upload"
          />
        )
      })
    )

  return (
    <Box mb={size === 'lg' ? 20 : 0} className={classess.rootDropZone}>
      <label htmlFor="image">{label}</label>
      <Dropzone
        accept={['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']}
        onDrop={handleUpload}
        onReject={(files) => console.log('rejected files', files)}
        loading={loading}
        disabled={loading}
        maxFiles={maxFiles}
        multiple={multiple}
        maxSize={5 * 1024 ** 2}
      >
        <Group
          justify="center"
          gap={size === 'lg' ? 'xl' : 'xs'}
          mih={size === 'lg' ? 120 : 50}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              {placeholder}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {multiple ? 'admin.attachMultiFile' : 'admin.attachFile'}
            </Text>
          </div>
        </Group>
      </Dropzone>
      {previews ? (
        <SimpleGrid
          cols={{ base: 1, sm: 4 }}
          mt={10}
          // mt={previews.length > 0 ? "xl" : 0}
        >
          {previews}
        </SimpleGrid>
      ) : (
        ''
      )}
    </Box>
  )
}
