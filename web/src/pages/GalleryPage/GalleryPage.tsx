import { useState, useMemo } from 'react'

import { Box, Button, Flex, Group, Image, Text } from '@mantine/core'
import { IconPhoto, IconPhotoSpark } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { Program } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import Footer from 'src/components/Footer/Footer'
import Navigation from 'src/components/Navigation/Navigation'
import { GET_GALLERIES } from 'src/graphql/galleries-queries'

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, error } = useQuery<{ programs: Program[] }>(
    GET_GALLERIES
  )

  const galleries = data?.galleries ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main>
        <section className="bg-blue-600 px-4 py-12 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-4 text-4xl font-bold">Our Gallery</h1>
            <p className="text-lg text-blue-100">
              Browse gallery and find the right fit for your next season.
            </p>
          </div>
        </section>

        <section className="sticky top-16 z-40 bg-white px-4 py-6 shadow-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search Gallery
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            {loading && (
              <div className="py-12 text-center text-xl text-gray-500">
                Loading gallery...
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                Failed to load gallery. {error.message}
              </div>
            )}

            {!loading && !error && galleries.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xl text-gray-500">
                  No programs found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    // setSelectedLevel('ALL')
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && !error && galleries.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {galleries.map((gallery: any) => (
                  <article
                    key={gallery.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4 text-white">
                      <h3 className="mb-1 text-xl font-bold">{gallery.name}</h3>
                      <Button
                        radius={'xl'}
                        leftSection={<IconPhoto size={14} />}
                        variant="outline"
                        color="white"
                        size="compact-xs"
                        my={6}
                      >
                        {format(parseISO(gallery.createdAt), 'dd-MM-yyyy')}
                      </Button>
                      <p className="line-clamp-2 text-sm text-blue-100">
                        {gallery.description || 'No description available yet.'}
                      </p>
                    </div>

                    <Flex pos="relative" justify={'start'}>
                      {gallery.images.length && gallery.images.length > 0 ? (
                        gallery.images.map((image) => (
                          <Image
                            key={image.image}
                            src={image.image}
                            w="120"
                            h="120"
                            fit="cover"
                          />
                        ))
                      ) : (
                        <Text
                          size="xs"
                          variant="text"
                          mx="auto"
                          my={'xs'}
                          c="grey"
                        >
                          Not uploaded yet
                        </Text>
                      )}
                    </Flex>
                  </article>
                ))}
              </div>
            ) : (
              ''
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default GalleryPage
