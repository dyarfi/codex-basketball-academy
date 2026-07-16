import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'

import {
  Container,
  Group,
  Button,
  Modal,
  TextInput,
  Badge,
  Text,
  Box,
  Stack,
  Loader,
  Alert,
  ActionIcon,
  Image,
  Table,
  Input,
  Checkbox,
  CopyButton,
  Center,
  Anchor,
  Breadcrumbs,
} from '@mantine/core'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import {
  Trash,
  PencilSimple,
  Plus,
  Cloud,
  Upload,
  X,
} from '@phosphor-icons/react'
import { IconAlertCircle, IconCopy, IconCopyCheck } from '@tabler/icons-react'

import { useParams, routes, Link } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import MediaForm from 'src/components/Common/MediaForm/MediaForm'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import {
  GET_MEDIA_LISTS,
  CREATE_MEDIA,
  UPDATE_MEDIA,
  DELETE_MEDIA,
} from 'src/graphql/media-queries'
import { useAppTheme } from 'src/providers/ThemeProvider'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

export const MediaComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search } = useParams()
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))

  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )

  const { isDark } = useAppTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(
    false,
    {
      onOpen: () => console.log('Opened'),
      onClose: () => setModalContent(''),
    }
  )
  const [modalContent, setModalContent] = useState('')

  // const [page, setPage] = useState(1)
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)

  const [editingMedia, setEditingMedia] = useState<any>(null)
  const [isDeleteMediaModalOpen, setIsDeleteMediaModalOpen] = useState(false)
  const [mediaIdToDelete, setMediaIdToDelete] = useState<number | null>(null)
  const hasMountedSearch = useRef(false)

  useEffect(() => {
    if (!hasMountedSearch.current) {
      hasMountedSearch.current = true
      return
    }
    setCurrentPage(1)
  }, [debouncedSearchQuery])

  // Media form
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    pathName: '',
    mimeType: '',
    size: 0,
    publicId: '',
    isPublic: false,
  })

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
  }

  const {
    data: mediaData,
    loading,
    error,
    refetch,
  } = useQuery(GET_MEDIA_LISTS, {
    variables,
  })

  const [createMediaMutation] = useMutation(CREATE_MEDIA, {
    onCompleted: () => {
      toast.success('Media created successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create Media')
    },
  })

  const [updateMediaMutation] = useMutation(UPDATE_MEDIA, {
    onCompleted: () => {
      toast.success('Media updated successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update Media')
    },
  })

  const [deleteMediaMutation] = useMutation(DELETE_MEDIA, {
    onCompleted: () => {
      toast.success('Media deleted successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete Media')
    },
  })

  const medias = mediaData?.mediaLists?.medias || []
  const totalCount = mediaData?.mediaLists?.count || 0
  const totalPages = Math.ceil(totalCount / 10)

  const handleOpenModal = (media?: any) => {
    if (media) {
      setEditingMedia(media)
      setFormData({
        name: media.name,
        url: media.url,
        pathName: media.pathName || '',
        mimeType: media.mimeType,
        size: media.size,
        publicId: media.publicId || '',
        isPublic: media.isPublic,
      })
    } else {
      setEditingMedia(null)
      setFormData({
        name: '',
        url: '',
        pathName: '',
        mimeType: '',
        size: 0,
        publicId: '',
        isPublic: false,
      })
    }
    open()
  }

  const handleSaveMedia = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Media name and URL are required')
      return
    }

    try {
      const input = {
        name: formData.name,
        url: formData.url,
        pathName: formData.pathName,
        mimeType: formData.mimeType,
        size: formData.size,
        publicId: formData.publicId,
        isPublic: formData.isPublic,
        order: 0,
        folderId: null,
        uploadedAt: new Date().toISOString(),
      }

      if (editingMedia) {
        await updateMediaMutation({
          variables: {
            id: editingMedia.id,
            input: {
              name: formData.name,
              url: formData.url,
              pathName: formData.pathName,
              mimeType: formData.mimeType,
              size: formData.size,
              publicId: formData.publicId,
              isPublic: formData.isPublic,
            },
          },
        })
      } else {
        await createMediaMutation({
          variables: {
            input,
          },
        })
      }
      close()
    } catch (error) {
      toast.error('Error saving media')
      console.error(error)
    }
  }

  const handleDeleteMedia = (id: number) => {
    setMediaIdToDelete(id)
    setIsDeleteMediaModalOpen(true)
  }

  const handleConfirmDeleteMedia = async () => {
    if (!mediaIdToDelete) return

    try {
      await deleteMediaMutation({ variables: { id: mediaIdToDelete } })
      setIsDeleteMediaModalOpen(false)
      setMediaIdToDelete(null)
    } catch (error) {
      toast.error('Error deleting media')
      console.error(error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith('image/')
  }

  if (loading) {
    return (
      <Container
        size="xl"
        py={{ base: 'sm', sm: 'md', md: 'xl' }}
        px={{ base: 'xs', sm: 'md' }}
      >
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load Media: {error.message}
        </Alert>
      </Container>
    )
  }

  const surfaceClass = isDark
    ? 'border-slate-800 bg-slate-900'
    : 'border-slate-200 bg-slate-50'

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs mb="lg" separator="→">
        <Anchor component={Link} to={routes.adminPanel()} size="sm">
          Admin Panel
        </Anchor>
        <Anchor component={Link} to={routes.adminGalleries()} size="sm">
          Galleries
        </Anchor>
        <Text size="sm" c="dimmed">
          Medias
        </Text>
      </Breadcrumbs>
      <Group justify="space-between" mb="lg" grow align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Media Management
          </Text>
          <Text size="sm" className="text-slate-500">
            Manage your media library with image previews
          </Text>
        </div>
        <Button
          leftSection={<Plus size={16} weight="bold" />}
          onClick={() => handleOpenModal()}
          color="blue"
        >
          Upload Media
        </Button>
      </Group>
      {/* Search Bar */}
      <Input
        placeholder="Search media by name, URL, or path..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value)
          setPage(1)
        }}
        mb="lg"
        leftSection={<Upload size={16} />}
      />
      {medias.length === 0 ? (
        <Alert color="blue" icon={<Cloud />}>
          No media yet. Upload your first image to get started.
        </Alert>
      ) : (
        <Box className={`${surfaceClass} overflow-hidden rounded-lg border`}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 80 }}>Preview</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Public</Table.Th>
                <Table.Th style={{ width: 100 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {medias.map((media) => (
                <Table.Tr key={media.id}>
                  <Table.Td>
                    {isImageFile(media.mimeType) ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded border object-contain">
                        <Image
                          src={media.url}
                          alt={media.name}
                          fit="cover"
                          height={48}
                          width={48}
                          fallbackSrc="https://placehold.co/48x48?text=No Image"
                          onClick={() => {
                            setModalContent(media.url)
                            openModal()
                          }}
                        />
                      </div>
                    ) : (
                      <Badge size="sm" variant="light">
                        {media.mimeType.split('/')[1] || 'FILE'}
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {media.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light">
                      {media.mimeType.split('/')[1] || media.mimeType}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatFileSize(media.size)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      color={media.isPublic ? 'green' : 'gray'}
                      variant="light"
                    >
                      {media.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        size="sm"
                        color="blue"
                        onClick={() => handleOpenModal(media)}
                        variant="light"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        color="red"
                        onClick={() => handleDeleteMedia(media.id)}
                        variant="light"
                      >
                        <Trash size={16} weight="bold" />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <AdminPagination
          label="medias"
          totalItems={totalCount}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminMedias as RouteBuilder}
          query={{
            search: debouncedSearchQuery || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />
      )}
      {/* Upload Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Upload Media"
        size="xl"
        centered
      >
        <Stack gap="md" h="full">
          {editingMedia ? (
            <>
              <TextInput
                label="Media Name"
                placeholder="Enter media name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <TextInput
                label="Media URL"
                placeholder="Enter media URL"
                disabled
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
                rightSection={
                  <CopyButton value={formData.url}>
                    {({ copied, copy }) => (
                      <Button
                        color={copied ? 'teal' : 'blue'}
                        onClick={copy}
                        title="Copy URL"
                      >
                        {copied ? (
                          <IconCopyCheck size={18} />
                        ) : (
                          <IconCopy size={18} />
                        )}
                      </Button>
                    )}
                  </CopyButton>
                }
                rightSectionWidth={'sm'}
              />

              {formData.mimeType && (
                <Group grow>
                  <div>
                    <Text size="sm" fw={500}>
                      MIME Type
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formData.mimeType}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" fw={500}>
                      Size
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatFileSize(formData.size)}
                    </Text>
                  </div>
                </Group>
              )}

              <Checkbox
                label="Make Public"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isPublic: e.currentTarget.checked,
                  })
                }
              />

              <Group justify="flex-end">
                <Button variant="light" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMedia} color="blue">
                  {editingMedia ? 'Update' : 'Upload'} Media
                </Button>
              </Group>
            </>
          ) : (
            <>
              {/* Dropzone Form */}
              <MediaForm size="xl" />
            </>
          )}
        </Stack>
      </Modal>
      {/* Preview Image Modal */}
      {modalOpened && modalContent && (
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          withCloseButton={false}
          size="auto"
          padding={0}
          m={0}
        >
          <Image src={modalContent} w={'100%'} alt={modalContent} />
        </Modal>
      )}
      <ConfirmDelete
        isOpen={isDeleteMediaModalOpen}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        onConfirm={handleConfirmDeleteMedia}
        onCancel={() => {
          setIsDeleteMediaModalOpen(false)
          setMediaIdToDelete(null)
        }}
      />{' '}
    </Container>
  )
}

export default MediaComponent
