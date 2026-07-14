import React, { useState, useEffect } from 'react'

import {
  Container,
  Grid,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  Badge,
  Text,
  Box,
  Card,
  Stack,
  Loader,
  Alert,
  ActionIcon,
  Image,
  Flex,
} from '@mantine/core'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { Plus, Images as ImagesIcon } from '@phosphor-icons/react'
import {
  IconAdjustments,
  IconAlertCircle,
  IconPencil,
  IconPhoto,
  IconTrash,
  IconX,
} from '@tabler/icons-react'

import { useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import FileLibraryPicker from 'src/components/Common/FileLibraryPicker/FileLibraryPicker'
import MediaForm from 'src/components/Common/MediaForm/MediaForm'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import {
  GET_PAGINATED_GALLERIES,
  CREATE_GALLERY,
  UPDATE_GALLERY,
  DELETE_GALLERY,
  CREATE_GALLERY_MEDIA,
  DELETE_GALLERY_MEDIA,
  GET_GALLERY,
} from 'src/graphql/galleries-queries'
import { useFilePicker } from 'src/hooks/useFilePicker'
import { useAppTheme } from 'src/providers/ThemeProvider'

const PAGE_SIZE = 10

const getPageFromParam = (page: any): number => {
  const pageNum = parseInt(page as string, 10)
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum
}

export const GalleryComponent = () => {
  const { isDark } = useAppTheme()
  const { file, setSelectedFile, openPicker, PickerModal } = useFilePicker()
  const { page = 1, search } = useParams()

  const [opened, { open, close }] = useDisclosure(false)

  const [mediaOpened, { open: openMedia, close: closeMedia }] =
    useDisclosure(false)
  const [editingGallery, setEditingGallery] = useState<any>(null)
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(
    null
  )
  const [isDeleteGalleryModalOpen, setIsDeleteGalleryModalOpen] =
    useState(false)
  const [galleryIdToDelete, setGalleryIdToDelete] = useState<number | null>(
    null
  )
  const [isDeleteMediaModalOpen, setIsDeleteMediaModalOpen] = useState(false)
  const [mediaIdToDelete, setMediaIdToDelete] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)

  // Gallery form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  // Media Gallery form
  const [mediaFormData, setMediaFormData] = useState({
    name: '',
    description: '',
    image: '',
  })
  // Medias Uploaded
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})

  // Pagination variables
  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
  }

  const {
    data: galleriesData,
    loading,
    error,
    refetch,
  } = useQuery(GET_PAGINATED_GALLERIES, { variables })

  useEffect(() => {
    if (file?.url) {
      setMediaFormData({ ...mediaFormData, image: file?.url })
    }
  }, [file?.url, mediaFormData])

  useEffect(() => {
    if (uploadedFiles?.length) {
      setMediaFormData({ ...mediaFormData, image: uploadedFiles[0]?.url })
      setUploadedFiles({})
    }
  }, [mediaFormData, uploadedFiles])

  const { data: galleryData } = useQuery(GET_GALLERY, {
    variables: { id: selectedGalleryId },
    skip: !selectedGalleryId,
  })

  const [createGalleryMutation] = useMutation(CREATE_GALLERY, {
    refetchQueries: [{ query: GET_PAGINATED_GALLERIES, variables }],
    onCompleted: () => {
      toast.success('Gallery created successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create Gallery')
    },
    awaitRefetchQueries: true,
  })

  const [updateGalleryMutation] = useMutation(UPDATE_GALLERY, {
    refetchQueries: [{ query: GET_PAGINATED_GALLERIES, variables }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success('Gallery updated successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update Gallery')
    },
  })

  const [deleteGalleryMutation] = useMutation(DELETE_GALLERY, {
    refetchQueries: [{ query: GET_PAGINATED_GALLERIES, variables }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success('Gallery deleted successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete Gallery')
    },
  })

  const [createGalleryMediaMutation] = useMutation(CREATE_GALLERY_MEDIA, {
    refetchQueries: [
      { query: GET_GALLERY, variables: { id: selectedGalleryId } },
      { query: GET_PAGINATED_GALLERIES, variables },
    ],
    onCompleted: () => {
      toast.success('Gallery Media created successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create Gallery')
    },
  })

  const [deleteGalleryMediaMutation] = useMutation(DELETE_GALLERY_MEDIA, {
    refetchQueries: [
      { query: GET_GALLERY, variables: { id: selectedGalleryId } },
      { query: GET_PAGINATED_GALLERIES, variables },
    ],
    onCompleted: () => {
      toast.success('Gallery Media deleted successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete Gallery')
    },
  })

  const galleries = galleriesData?.paginatedGalleries?.items || []
  const {
    totalCount = 0,
    totalPages = 1,
    hasNextPage = false,
    hasPreviousPage = false,
  } = galleriesData?.paginatedGalleries || {}
  const currentGallery = galleryData?.gallery || null

  const handleOpenModal = (gallery?: any) => {
    if (gallery) {
      setEditingGallery(gallery)
      setFormData({
        name: gallery.name,
        description: gallery.description || '',
      })
    } else {
      setEditingGallery(null)
      setFormData({ name: '', description: '' })
    }
    open()
    setSelectedFile(null)
  }

  const handleSaveGallery = async () => {
    if (!formData.name.trim()) {
      toast.error('Gallery name is required')
      return
    }

    try {
      if (editingGallery) {
        await updateGalleryMutation({
          variables: {
            id: editingGallery.id,
            input: {
              name: formData.name,
              description: formData.description,
              status: 1,
            },
          },
        })
      } else {
        await createGalleryMutation({
          variables: {
            input: {
              name: formData.name,
              description: formData.description,
            },
          },
        })
      }
      close()
    } catch (error) {
      toast.error('Error saving gallery')
      console.error(error)
    }
  }

  const handleDeleteGallery = (id: number) => {
    setGalleryIdToDelete(id)
    setIsDeleteGalleryModalOpen(true)
  }

  const handleConfirmDeleteGallery = async () => {
    if (!galleryIdToDelete) return

    try {
      await deleteGalleryMutation({ variables: { id: galleryIdToDelete } })
      setIsDeleteGalleryModalOpen(false)
      setGalleryIdToDelete(null)
    } catch (error) {
      toast.error('Error deleting gallery')
      console.error(error)
    }
  }

  const handleOpenMediaModal = (galleryId: number) => {
    setSelectedGalleryId(galleryId)
    openMedia()
    setMediaFormData({ name: '', description: '', image: '' })
    setSelectedFile(null)
  }

  const handleSaveMedia = async () => {
    if (!mediaFormData.image.trim()) {
      toast.error('Select an image first')
      return
    }
    if (!mediaFormData.name.trim() || !mediaFormData.description.trim()) {
      toast.error('Image name and Description are required')
      return
    }

    try {
      await createGalleryMediaMutation({
        variables: {
          input: {
            name: mediaFormData.name,
            description: mediaFormData.description,
            image: mediaFormData.image,
            galleryId: selectedGalleryId,
          },
        },
      })
      setMediaFormData({ name: '', description: '', image: '' })
      closeMedia()
    } catch (error) {
      toast.error('Error adding image')
      console.error(error)
    }
  }

  const handleDeleteMedia = (mediaId: number) => {
    setMediaIdToDelete(mediaId)
    setIsDeleteMediaModalOpen(true)
  }

  const handleConfirmDeleteMedia = async () => {
    if (!mediaIdToDelete) return

    try {
      await deleteGalleryMediaMutation({ variables: { id: mediaIdToDelete } })
      setIsDeleteMediaModalOpen(false)
      setMediaIdToDelete(null)
    } catch (error) {
      toast.error('Error deleting image')
      console.error(error)
    }
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

  const surfaceClass = isDark
    ? 'border-slate-800 bg-slate-900'
    : 'border-slate-200 bg-slate-50'

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load Galleries: {error.message}
        </Alert>
      </Container>
    )
  }
  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Group justify="space-between" mb="lg" grow align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Galleries Management
          </Text>
          <Text size="sm" className="text-slate-500">
            Manage photo galleries and media
          </Text>
        </div>
        <Button
          leftSection={<Plus size={16} weight="bold" />}
          onClick={() => handleOpenModal()}
          color="blue"
        >
          New Gallery
        </Button>
      </Group>

      <Group mb="lg" grow>
        <TextInput
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value)
            setCurrentPage(1)
          }}
        />
      </Group>

      {galleries.length === 0 ? (
        <Alert color="blue" icon={<ImagesIcon />}>
          No galleries yet. Create your first gallery to get started.
        </Alert>
      ) : (
        <>
          <Grid gutter={{ base: 'xs', sm: 'md' }} mb="xl">
            {galleries.map((gallery: any) => (
              <Grid.Col key={gallery.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  shadow="none"
                  padding="md"
                  radius="md"
                  className={`${surfaceClass} border`}
                >
                  <Card.Section
                    p="md"
                    className={isDark ? 'bg-slate-800' : 'bg-slate-100'}
                  >
                    <Box>
                      <Group justify="space-between" align="stretch" mb={2}>
                        <Text fw={600} size="sm" lineClamp={1}>
                          {gallery.name}
                        </Text>
                        <Badge
                          size="sm"
                          variant="light"
                          // pos={'absolute'}
                          // right={4}
                          // top={4}
                        >
                          {gallery.images?.length || 0} images
                        </Badge>
                      </Group>
                      <Text size="xs" className="text-slate-500" lineClamp={2}>
                        {gallery.description.substring(0, 60) ||
                          'No description'}
                      </Text>
                    </Box>
                  </Card.Section>

                  <Stack gap="xs" mt="md">
                    {gallery.images && gallery.images.length > 0 ? (
                      <Group gap="xs">
                        {gallery.images.slice(0, 4).map((img) => (
                          <Box key={img.id} pos="relative">
                            <Image
                              src={img.image}
                              alt={img.name}
                              w={'88'}
                              h={'88'}
                              fit="cover"
                              bdrs={'sm'}
                            />
                            <ActionIcon
                              pos={'absolute'}
                              top={1}
                              right={1}
                              variant="gradient"
                              size="xs"
                              color="red"
                              onClick={() => handleDeleteMedia(img.id)}
                              title="Remove Image"
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          </Box>
                        ))}
                      </Group>
                    ) : (
                      <Box h="full">
                        <Text size="xs" c="gray">
                          Empty, please add your image media first
                        </Text>
                      </Box>
                    )}

                    <Group grow>
                      <Button
                        size="compact-xs"
                        leftSection={<IconPhoto size={13} />}
                        onClick={() => handleOpenMediaModal(gallery.id)}
                        color="blue"
                        variant="light"
                        title="Manage Images"
                        fz={'10'}
                      >
                        MANAGE
                      </Button>
                      <Button
                        size="compact-xs"
                        leftSection={<IconPencil size={14} />}
                        color="blue"
                        onClick={() => handleOpenModal(gallery)}
                        variant="light"
                        title="Update Gallery"
                        fz={'10'}
                      >
                        UPDATE
                      </Button>
                      <Button
                        size="compact-xs"
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleDeleteGallery(gallery.id)}
                        variant="light"
                        title="Remove Gallery"
                        fz={'10'}
                      >
                        REMOVE
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          {totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Gallery Modal */}
      <Modal opened={opened} onClose={close} title="Gallery" size="md">
        <Stack gap="md">
          <TextInput
            label="Gallery Name"
            placeholder="Enter gallery name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Enter gallery description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            minRows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSaveGallery} color="blue">
              {editingGallery ? 'Update' : 'Create'} Gallery
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Media Modal */}
      <Modal
        opened={mediaOpened}
        onClose={closeMedia}
        title="Add Image to Gallery"
        size="lg"
      >
        <Stack gap="sm">
          <Group>
            <Button
              onClick={openPicker}
              radius={4}
              size="xs"
              leftSection={<IconAdjustments size={18} />}
            >
              Select Image
            </Button>
            <PickerModal component={FileLibraryPicker} />
            <MediaForm
              size="xs"
              mode="single"
              type="button"
              onUploaded={setUploadedFiles}
            />
            {/* <MediaForm
              size="xs"
              type="default"
              onUploaded={(files) => {
                // console.log({ files })
                handleOnUploaded(files)
              }}
            /> */}
          </Group>
          <Box>
            {mediaFormData.image && (
              <>
                <TextInput
                  label="Image Name"
                  placeholder="Enter image name"
                  value={mediaFormData.name}
                  onChange={(e) =>
                    setMediaFormData({ ...mediaFormData, name: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  placeholder="Enter image description"
                  value={mediaFormData.description}
                  onChange={(e) =>
                    setMediaFormData({
                      ...mediaFormData,
                      description: e.target.value,
                    })
                  }
                  minRows={2}
                />
              </>
            )}

            {mediaFormData.image && (
              <Image
                src={mediaFormData.image}
                fallbackSrc="https://placehold.co/200x260?text=Image"
                alt={mediaFormData.image}
                // w={'100%'}
                h={260}
                fit="cover"
                radius="md"
                mt={15}
              />
            )}
            <TextInput
              name="image"
              type="hidden"
              defaultValue={mediaFormData.image}
              className="rw-input invisible h-0"
            />
          </Box>
          {currentGallery?.images && currentGallery.images.length > 0 && (
            <div>
              <Text size="sm" fw={600} mb="xs">
                Gallery Images ({currentGallery.images.length})
              </Text>
              <Box className={`${surfaceClass} rounded border`} py={'4'}>
                <Group gap="xs" wrap="wrap" justify="center">
                  {currentGallery.images.map(
                    (img: { id: number; image: string; name: string }) => (
                      <Box key={img.id} pos="relative">
                        <Image
                          src={img.image}
                          alt={img.name}
                          h={'72'}
                          fit="cover"
                          bdrs={'sm'}
                        />
                        <ActionIcon
                          pos={'absolute'}
                          top={1}
                          right={1}
                          variant="gradient"
                          size="xs"
                          color="red"
                          onClick={() => handleDeleteMedia(img.id)}
                          title="Remove Image"
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Box>
                    )
                  )}
                </Group>
              </Box>
            </div>
          )}

          <Group justify="flex-end">
            <Button variant="light" onClick={closeMedia}>
              Cancel
            </Button>
            <Button onClick={handleSaveMedia} color="blue">
              Add Image
            </Button>
          </Group>
        </Stack>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteGalleryModalOpen}
        title="Delete Gallery"
        message="Are you sure you want to delete this gallery? This action will permanently remove the gallery and all associated images."
        onConfirm={handleConfirmDeleteGallery}
        onCancel={() => {
          setIsDeleteGalleryModalOpen(false)
          setGalleryIdToDelete(null)
        }}
      />

      <ConfirmDelete
        isOpen={isDeleteMediaModalOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={handleConfirmDeleteMedia}
        onCancel={() => {
          setIsDeleteMediaModalOpen(false)
          setMediaIdToDelete(null)
        }}
      />
    </Container>
  )
}

export default GalleryComponent
