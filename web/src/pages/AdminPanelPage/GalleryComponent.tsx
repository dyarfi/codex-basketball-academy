import React, { useState, useMemo } from 'react'

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
  Table,
  Box,
  Card,
  Stack,
  Select,
  Loader,
  Alert,
  ActionIcon,
  Image,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  Trash,
  PencilSimple,
  Plus,
  Images as ImagesIcon,
} from '@phosphor-icons/react'
import { IconAlertCircle } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import {
  GET_GALLERIES,
  CREATE_GALLERY,
  UPDATE_GALLERY,
  DELETE_GALLERY,
  CREATE_GALLERY_MEDIA,
  DELETE_GALLERY_MEDIA,
  GET_GALLERY,
} from 'src/graphql/galleries-queries'
import { useAppTheme } from 'src/providers/ThemeProvider'

export const GalleryComponent = () => {
  const { isDark } = useAppTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [mediaOpened, { open: openMedia, close: closeMedia }] =
    useDisclosure(false)
  const [editingGallery, setEditingGallery] = useState<any>(null)
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(
    null
  )
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [mediaFormData, setMediaFormData] = useState({
    name: '',
    description: '',
    image: '',
  })

  const {
    data: galleriesData,
    loading,
    error,
    refetch,
  } = useQuery(GET_GALLERIES)

  const { data: galleryData } = useQuery(GET_GALLERY, {
    variables: { id: selectedGalleryId },
    skip: !selectedGalleryId,
  })

  const [createGalleryMutation] = useMutation(CREATE_GALLERY, {
    refetchQueries: [{ query: GET_GALLERIES }],
    onCompleted: () => {
      success('Gallery created successfully')
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to create Gallery')
    },
    awaitRefetchQueries: true,
  })

  const [updateGalleryMutation] = useMutation(UPDATE_GALLERY, {
    refetchQueries: [{ query: GET_GALLERIES }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      success('Gallery updated successfully')
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to update Gallery')
    },
  })

  const [deleteGalleryMutation] = useMutation(DELETE_GALLERY, {
    refetchQueries: [{ query: GET_GALLERIES }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      success('Gallery deleted successfully')
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete Gallery')
    },
  })

  const [createGalleryMediaMutation] = useMutation(CREATE_GALLERY_MEDIA, {
    refetchQueries: [
      { query: GET_GALLERY, variables: { id: selectedGalleryId } },
      { query: GET_GALLERIES },
    ],
    onCompleted: () => {
      success('Gallery Media created successfully')
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to create Gallery')
    },
  })

  const [deleteGalleryMediaMutation] = useMutation(DELETE_GALLERY_MEDIA, {
    refetchQueries: [
      { query: GET_GALLERY, variables: { id: selectedGalleryId } },
      { query: GET_GALLERIES },
    ],
    onCompleted: () => {
      success('Gallery Media deleted successfully')
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete Gallery')
    },
  })

  const galleries = galleriesData?.galleries || []
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
  }

  const handleSaveGallery = async () => {
    if (!formData.name.trim()) {
      toastError('Gallery name is required')
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
      toastError('Error saving gallery')
      console.error(error)
    }
  }

  const handleDeleteGallery = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this gallery?')) {
      return
    }

    try {
      await deleteGalleryMutation({ variables: { id } })
      success('Gallery deleted successfully')
      refetch()
    } catch (error) {
      toastError('Error deleting gallery')
      console.error(error)
    }
  }

  const handleOpenMediaModal = (galleryId: number) => {
    setSelectedGalleryId(galleryId)
    setMediaFormData({ name: '', description: '', image: '' })
    openMedia()
  }

  const handleSaveMedia = async () => {
    if (!mediaFormData.name.trim() || !mediaFormData.image.trim()) {
      toastError('Image name and URL are required')
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
      success('Image added successfully')
      setMediaFormData({ name: '', description: '', image: '' })
      refetch()
      closeMedia()
    } catch (error) {
      toastError('Error adding image')
      console.error(error)
    }
  }

  const handleDeleteMedia = async (mediaId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      await deleteGalleryMediaMutation({ variables: { id: mediaId } })
      success('Image deleted successfully')
      refetch()
    } catch (error) {
      toastError('Error deleting image')
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

      {galleries.length === 0 ? (
        <Alert color="blue" icon={<ImagesIcon />}>
          No galleries yet. Create your first gallery to get started.
        </Alert>
      ) : (
        <Grid gutter={{ base: 'xs', sm: 'md' }} mb="xl">
          {galleries.map((gallery) => (
            <Grid.Col key={gallery.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                shadow="sm"
                padding="md"
                radius="md"
                className={`${surfaceClass} border`}
              >
                <Card.Section
                  p="md"
                  className={isDark ? 'bg-slate-800' : 'bg-slate-100'}
                >
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {gallery.name}
                      </Text>
                      <Text size="xs" className="text-slate-500" lineClamp={2}>
                        {gallery.description || 'No description'}
                      </Text>
                    </div>
                    <Badge size="sm" variant="light">
                      {gallery.images?.length || 0} images
                    </Badge>
                  </Group>
                </Card.Section>

                <Stack gap="xs" mt="md">
                  {gallery.images && gallery.images.length > 0 && (
                    <Group gap="xs">
                      {gallery.images.slice(0, 3).map((img) => (
                        <div
                          key={img.id}
                          className="relative h-16 w-16 overflow-hidden rounded border"
                        >
                          <Image
                            src={img.image}
                            alt={img.name}
                            fit="cover"
                            height={64}
                            width={64}
                          />
                        </div>
                      ))}
                    </Group>
                  )}

                  <Group grow>
                    <Button
                      size="xs"
                      leftSection={<ImagesIcon size={14} weight="bold" />}
                      onClick={() => handleOpenMediaModal(gallery.id)}
                      color="blue"
                      variant="light"
                    >
                      Media
                    </Button>
                    <ActionIcon
                      size="sm"
                      color="blue"
                      onClick={() => handleOpenModal(gallery)}
                      variant="light"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      color="red"
                      onClick={() => handleDeleteGallery(gallery.id)}
                      variant="light"
                    >
                      <Trash size={16} weight="bold" />
                    </ActionIcon>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
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
        size="md"
      >
        <Stack gap="md">
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
          <TextInput
            label="Image URL"
            placeholder="Enter image URL or path"
            value={mediaFormData.image}
            onChange={(e) =>
              setMediaFormData({ ...mediaFormData, image: e.target.value })
            }
          />

          {currentGallery?.images && currentGallery.images.length > 0 && (
            <div>
              <Text size="sm" fw={600} mb="xs">
                Gallery Images ({currentGallery.images.length})
              </Text>
              <Box className={`${surfaceClass} p-md rounded border`}>
                <Group gap="xs" wrap="wrap">
                  {currentGallery.images.map((img) => (
                    <div key={img.id} className="relative">
                      <div className="relative h-20 w-20 overflow-hidden rounded border">
                        <Image
                          src={img.image}
                          alt={img.name}
                          fit="cover"
                          height={80}
                          width={80}
                        />
                      </div>
                      <ActionIcon
                        size="xs"
                        color="red"
                        className="absolute -right-1 -top-1"
                        onClick={() => handleDeleteMedia(img.id)}
                      >
                        <Trash size={12} weight="bold" />
                      </ActionIcon>
                    </div>
                  ))}
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Container>
  )
}

export default GalleryComponent
