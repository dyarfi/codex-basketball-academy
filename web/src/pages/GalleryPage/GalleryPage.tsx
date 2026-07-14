import { useState, useMemo } from 'react'

import { Carousel } from '@mantine/carousel'
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Modal,
  Text,
  TextInput,
  Badge,
  Card,
  Stack,
  Loader,
  Alert,
  Center,
  ActionIcon,
  Paper,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure, useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import {
  IconPhoto,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { Program } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { GET_GALLERIES } from 'src/graphql/galleries-queries'

import '@mantine/carousel/styles.css'
import DefaultLayout from 'src/layouts/DefaultLayout'

// import classes from './GalleryPage.module.css'

// interface CardProps {
//   image: string
//   title: string
//   category: string
// }

// function CardCarousel({ image, title, category }: CardProps) {
//   return (
//     <Paper
//       shadow="md"
//       p="xl"
//       radius="md"
//       style={{ backgroundImage: `url(${image})` }}
//       className={classes.card}
//     >
//       <div>
//         <Text className={classes.category} size="xs">
//           {category}
//         </Text>
//         <Title order={3} className={classes.title}>
//           {title}
//         </Title>
//       </div>
//       <Button variant="white" color="dark">
//         Read article
//       </Button>
//     </Paper>
//   )
// }

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300)

  const [selectedGallery, setSelectedGallery] = useState<any>(null)
  const [lightboxOpened, { open: openLightbox, close: closeLightbox }] =
    useDisclosure(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data, loading, error } = useQuery<{ programs: Program[] }>(
    GET_GALLERIES
  )

  const galleries = data?.galleries ?? []

  const filteredGalleries = useMemo(() => {
    return galleries.filter(
      (gallery: any) =>
        gallery.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        gallery.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    )
  }, [galleries, debouncedSearchTerm])

  const handleGalleryClick = (gallery: any) => {
    if (gallery?.images && gallery?.images?.length === 0) {
      return alert('no images')
    }
    setSelectedGallery(gallery)
    setCurrentImageIndex(0)
    openLightbox()
  }

  // const datas = [
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Best forests to visit in North America',
  //     category: 'nature',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Hawaii beaches review: better than you think',
  //     category: 'beach',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Mountains at night: 12 best locations to enjoy the view',
  //     category: 'nature',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Aurora in Norway: when to visit for best experience',
  //     category: 'nature',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Best places to visit this winter',
  //     category: 'tourism',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //     title: 'Active volcanos reviews: travel at your own risk',
  //     category: 'nature',
  //   },
  // ]

  // const theme = useMantineTheme()
  // const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  // const slides = datas.map((item) => (
  //   <Carousel.Slide key={item.title}>
  //     <CardCarousel {...item} />
  //   </Carousel.Slide>
  // ))

  return (
    <DefaultLayout
      metaTags={{
        title: 'Our Gallery Basketball Academy',
        description: 'Our Gallery Basketball Academy',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 text-white">
          <Container size="lg">
            <div>
              <h1 className="mb-2 text-5xl font-bold">Our Gallery</h1>
              <p className="text-lg text-blue-100">
                Explore moments from our basketball academy community
              </p>
            </div>
          </Container>
        </section>

        {/* <section className="top-16"> */}
        <section className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
          <Container size="lg">
            <TextInput
              placeholder="Search galleries..."
              leftSection={<IconSearch size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              size="md"
              radius="lg"
            />
          </Container>
        </section>

        <section className="px-4 py-12">
          <Container size="lg">
            {loading && (
              <Center py={120}>
                <Loader size="sm" />
              </Center>
            )}

            {error && (
              <Alert color="red" title="Error">
                Failed to load gallery. {error.message}
              </Alert>
            )}

            {!loading && !error && filteredGalleries.length === 0 && (
              <Center py={120}>
                <Stack align="center" gap="md">
                  <IconPhoto size={64} strokeWidth={1} color="gray" />
                  <div>
                    <Text size="lg" fw={500} ta="center">
                      {galleries.length === 0
                        ? 'No galleries yet'
                        : 'No galleries found'}
                    </Text>
                    <Text size="sm" c="gray" ta="center">
                      {galleries.length === 0
                        ? 'Check back soon for gallery updates'
                        : 'Try adjusting your search criteria'}
                    </Text>
                  </div>
                  {galleries.length > 0 && (
                    <Button
                      onClick={() => setSearchTerm('')}
                      variant="light"
                      color="blue"
                    >
                      Clear Search
                    </Button>
                  )}
                </Stack>
              </Center>
            )}

            {/* <Carousel
              slideSize={{ base: '100%', sm: '50%' }}
              slideGap={2}
              emblaOptions={{ align: 'start', slidesToScroll: mobile ? 1 : 2 }}
              nextControlProps={{ 'aria-label': 'Next slide' }}
              previousControlProps={{ 'aria-label': 'Previous slide' }}
            >
              {slides}
            </Carousel> */}

            {!loading && !error && filteredGalleries.length > 0 && (
              <Grid gutter={{ base: 'md', sm: 'lg' }}>
                {filteredGalleries.map((gallery: any) => (
                  <Grid.Col key={gallery.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <Card
                      shadow="sm"
                      padding="0"
                      radius="lg"
                      className="overflow-hidden transition-all duration-300 hover:shadow-xl"
                      onClick={() => handleGalleryClick(gallery)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Card Header */}
                      <Card.Section
                        className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600"
                        py="xl"
                        px="lg"
                      >
                        {gallery.images && gallery.images.length > 0 ? (
                          <>
                            <Image
                              src={gallery.images[0].image}
                              alt={gallery.name}
                              h={200}
                              fit="cover"
                              className="absolute inset-0"
                            />
                            <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          </>
                        ) : (
                          <Box className="flex h-48 items-center justify-center bg-gray-200">
                            <IconPhoto size={48} color="gray" strokeWidth={1} />
                          </Box>
                        )}
                      </Card.Section>

                      {/* Card Content */}
                      <Card.Section p="lg" className="relative z-10 -mt-20">
                        <Box
                          p="md"
                          radius="lg"
                          className="border border-gray-100 bg-white shadow-md"
                        >
                          <Group
                            justify="space-between"
                            align="flex-start"
                            mb="xs"
                          >
                            <Text fw={700} size="lg" lineClamp={1}>
                              {gallery.name}
                            </Text>
                            {gallery.images && gallery.images.length > 0 && (
                              <Badge size="sm" variant="light" color="blue">
                                {gallery.images.length}{' '}
                                {gallery.images.length === 1
                                  ? 'photo'
                                  : 'photos'}
                              </Badge>
                            )}
                          </Group>

                          <Text size="sm" c="gray" lineClamp={2} mb="sm">
                            {gallery.description || 'No description available'}
                          </Text>

                          <Group justify="space-between" align="center">
                            <Text size="xs" c="gray">
                              {format(
                                parseISO(gallery.createdAt),
                                'MMM dd, yyyy'
                              )}
                            </Text>
                            {gallery.images && gallery.images.length > 0 && (
                              <Button
                                size="compact-sm"
                                color="blue"
                                leftSection={<IconSearch size={14} />}
                              >
                                View
                              </Button>
                            )}
                          </Group>
                        </Box>
                      </Card.Section>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Container>
        </section>

        {/* Lightbox Modal */}
        <Modal
          withCloseButton={false}
          opened={lightboxOpened}
          onClose={closeLightbox}
          size="xxl"
          fullScreen
          padding={0}
          radius={0}
          classNames={{
            content: 'bg-black',
          }}
        >
          {selectedGallery &&
            selectedGallery.images &&
            selectedGallery.images.length > 0 && (
              <Box className="flex h-full flex-col bg-black">
                {/* Header */}
                <Group
                  justify="space-between"
                  p="xs"
                  gap={0}
                  className="border-b border-gray-800 bg-gray-900"
                >
                  <div>
                    <Text size="lg" fw={700} c="white">
                      {selectedGallery.name}
                    </Text>
                    <Text size="sm" c="gray">
                      {currentImageIndex + 1} of {selectedGallery.images.length}
                    </Text>
                  </div>
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={closeLightbox}
                    size="lg"
                  >
                    ✕
                  </Button>
                </Group>

                {/* Image Carousel */}
                <Box className="flex h-auto flex-1 items-center justify-center overflow-hidden">
                  <Carousel
                    // loop
                    // align="center"
                    withIndicators
                    previousControlIcon={<IconChevronLeft size={16} />}
                    nextControlIcon={<IconChevronRight size={16} />}
                    // classNames={{
                    //   control: 'text-white hover:bg-gray-700/50',
                    //   indicator: 'bg-gray-600 hover:bg-gray-400',
                    // }}
                    onSlideChange={setCurrentImageIndex}
                    initialSlide={currentImageIndex}
                  >
                    {selectedGallery.images.map((image: any) => (
                      <Carousel.Slide key={image.id}>
                        <Box mih={'100%'}>
                          <Image
                            src={image.image}
                            alt={image.name}
                            fit="contain"
                            // height={'100vw'}
                          />
                        </Box>
                        {image.name}
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                </Box>

                {/* Image Info */}
                <Box p="lg" className="border-t border-gray-800 bg-gray-900">
                  <Text fw={600} size="md" c="white" mb="xs">
                    {selectedGallery.images[currentImageIndex]?.name}
                  </Text>
                  <Text size="sm" c="gray">
                    {selectedGallery.images[currentImageIndex]?.description}
                  </Text>
                </Box>
              </Box>
            )}
        </Modal>
      </div>
    </DefaultLayout>
  )
}

export default GalleryPage
