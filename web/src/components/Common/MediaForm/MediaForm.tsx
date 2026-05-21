import { useState } from 'react'

import {
  Box,
  Container,
  Group,
  Image,
  Paper,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core'
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'

// import { useParams } from '@redwoodjs/router'

import { useFileUploader } from 'src/hooks/useFileUploader'

import MediasCell from '../MediasCell'

export default function FileUploader({
  folderId = 'gallery',
  propertyId,
  page = 1,
  search = '',
}) {
  // const { page = 1, search } = useParams()
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

  const handleDrop = async (acceptedFiles: FileWithPath[]) => {
    setFilesUploading(acceptedFiles)
    setProgress({})
    await uploadFiles(acceptedFiles)
  }

  return (
    <Container fluid p={0}>
      <Paper className="bg-gray-100" p={0} m={0} shadow="sm" withBorder>
        <Dropzone
          onDrop={handleDrop}
          multiple
          accept={IMAGE_MIME_TYPE}
          loading={uploading}
          maxSize={10 * 1024 ** 2}
        >
          <Group align="center" p="xl" style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                size={52}
                color="var(--mantine-color-blue-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={52}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                size={52}
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
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach or Drop files that should not exceed 5mb
            </Text>
          </Group>
        </Dropzone>

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
          <Box className="text-sm text-red-500 space-y-1" m={'md'}>
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </Box>
        )}

        {/* Previews */}
        {uploadedFiles.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 4 }} m={'md'}>
            {uploadedFiles.map((file) =>
              file.mimeType.startsWith('image') ? (
                <Box key={file.id}>
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="w-full object-cover rounded shadow"
                    h={186}
                  />
                  <Text c={'dimmed'} size="xs" mt={4}>
                    {file.name}
                  </Text>
                </Box>
              ) : (
                <Box key={file.id}>
                  <div className="p-4 bg-gray-100 rounded text-sm flex items-center gap-2">
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
      </Paper>
      <Box my={20} mx={0} px={0}>
        <MediasCell page={Number(page)} search={search} library />
      </Box>
    </Container>
  )
}
