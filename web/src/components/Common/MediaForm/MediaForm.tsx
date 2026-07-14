import { useState, useRef, useEffect, useCallback } from 'react'

import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Image,
  MantineSize,
  Paper,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core'
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
  IconCheck,
  IconCheckFilled,
  IconPhoto,
  IconUpload,
  IconX,
} from '@tabler/icons-react'

// import { useParams } from '@redwoodjs/router'

import { useFileUploader } from 'src/hooks/useFileUploader'

// import MediasCell from '../MediasCell'
type UploadedFiles = Record<string, string>

export default function FileUploader({
  folderId = 'gallery',
  propertyId,
  page = 1,
  search = '',
  size = 'lg',
  type = 'dropzone',
  mode = 'multiple',
  onUploaded,
}: {
  folderId?: string
  propertyId?: string
  page?: number
  search?: string
  size?: MantineSize
  type?: string
  mode?: 'single' | 'multiple'
  onUploaded?: (uploadedFiles: UploadedFiles) => void
}) {
  // const { page = 1, search } = useParams()
  const openRef = useRef<() => void>(null)

  const [progress, setProgress] = useState<{ [fileName: string]: number }>({})
  const [filesUploading, setFilesUploading] = useState<FileWithPath[]>([])

  const { uploadFiles, uploading, uploadedFiles, errors, loading } =
    useFileUploader({
      folderId,
      propertyId,
      onProgress: (percent, file) => {
        setProgress((prev) => ({ ...prev, [file.name]: percent }))
      },
    })

  const handleOnUploaded = useCallback(
    (files: UploadedFiles[]) => {
      onUploaded?.(files)
    },
    [onUploaded]
  )

  useEffect(() => {
    handleOnUploaded(uploadedFiles)
  }, [uploadedFiles, handleOnUploaded, onUploaded])

  const handleDrop = async (acceptedFiles: FileWithPath[]) => {
    setFilesUploading(acceptedFiles)
    setProgress({})
    await uploadFiles(acceptedFiles)
  }

  return (
    <>
      <Dropzone
        openRef={openRef}
        onDrop={handleDrop}
        multiple={mode !== 'single'}
        accept={IMAGE_MIME_TYPE}
        loading={uploading}
        maxSize={10 * 1024 ** 2}
      >
        {type === 'button' ? (
          <Button
            onClick={() => openRef.current?.()}
            style={{ pointerEvents: 'all' }}
            radius={4}
            size={size}
            leftSection={<IconUpload size={18} />}
          >
            Upload files
          </Button>
        ) : (
          <Container fluid p={0} size={size}>
            <Paper
              className="bg-gray-100"
              p={0}
              m={0}
              shadow="sm"
              withBorder
              style={{ cursor: 'pointer' }}
            >
              <Group align="center" p={size} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload
                    size={size === 'xs' ? 26 : 52}
                    color="var(--mantine-color-blue-6)"
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={size === 'xs' ? 26 : 52}
                    color="var(--mantine-color-red-6)"
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    size={size === 'xs' ? 26 : 52}
                    color="var(--mantine-color-dimmed)"
                    stroke={1.5}
                  />
                </Dropzone.Idle>
                {/* <div>
                  <Text size="xl" inline>
                    {placeholder}
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    {multiple
                      ? 'Attach multiple, each file should not exceed 5mb'
                      : 'Attach file that should not exceed 5mb'}
                  </Text>
                </div> */}
                <Text size="sm" c="dimmed" inline mt={0}>
                  Attach or Drop file{mode !== 'single' ? 's' : ''} that should
                  not exceed 5mb
                </Text>
              </Group>
            </Paper>
          </Container>
        )}
      </Dropzone>
      <Box>
        {/* Progress Bars */}
        {uploading &&
          filesUploading.map((file) => (
            <Box key={file.name} m={'md'}>
              <Text size="sm" fw={500}>
                {file.name}
              </Text>
              <Progress
                value={progress[file.name] || 0}
                size="sm"
                color="blue"
                radius="xl"
              />
            </Box>
          ))}

        {/* Errors */}
        {errors.length > 0 && (
          <Box className="space-y-1 text-sm text-red-500" m={'md'}>
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </Box>
        )}

        {/* Previews */}
        {type === 'dropzone' && uploadedFiles.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 4 }} m={'md'}>
            {uploadedFiles.map((file) =>
              file.mimeType.startsWith('image') ? (
                <Box key={file.id} pos={'relative'}>
                  <ActionIcon
                    pos={'absolute'}
                    top={1}
                    right={1}
                    variant="gradient"
                    size="xs"
                    color="red"
                    // onClick={() => handleDeleteMedia(img.id)}
                    title="Image Uploaded"
                  >
                    <IconCheckFilled size={14} />
                  </ActionIcon>
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="w-full rounded object-cover shadow"
                    h={186}
                  />
                  <Text c={'dimmed'} size="xs" mt={4}>
                    {file.name}
                  </Text>
                </Box>
              ) : (
                <Box key={file.id}>
                  <div className="flex items-center gap-2 rounded bg-gray-100 p-4 text-sm">
                    📄 {file.name}
                  </div>
                  <Text c={'dimmed'} size="xs" mt={4}>
                    {file.name}
                  </Text>
                </Box>
              )
            )}
          </SimpleGrid>
        )}
      </Box>
      {/* <UploadMode /> */}
    </>
  )
}
