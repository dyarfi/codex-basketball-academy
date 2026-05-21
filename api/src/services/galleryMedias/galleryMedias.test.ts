import type { GalleryMedia } from '@prisma/client'

import {
  galleryMedias,
  galleryMedia,
  createGalleryMedia,
  updateGalleryMedia,
  deleteGalleryMedia,
} from './galleryMedias'
import type { StandardScenario } from './galleryMedias.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('galleryMedias', () => {
  scenario('returns all galleryMedias', async (scenario: StandardScenario) => {
    const result = await galleryMedias()

    expect(result.length).toEqual(Object.keys(scenario.galleryMedia).length)
  })

  scenario(
    'returns a single galleryMedia',
    async (scenario: StandardScenario) => {
      const result = await galleryMedia({ id: scenario.galleryMedia.one.id })

      expect(result).toEqual(scenario.galleryMedia.one)
    }
  )

  scenario('creates a galleryMedia', async () => {
    const result = await createGalleryMedia({
      input: { name: 'String', description: 'String', image: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.image).toEqual('String')
  })

  scenario('updates a galleryMedia', async (scenario: StandardScenario) => {
    const original = (await galleryMedia({
      id: scenario.galleryMedia.one.id,
    })) as GalleryMedia
    const result = await updateGalleryMedia({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a galleryMedia', async (scenario: StandardScenario) => {
    const original = (await deleteGalleryMedia({
      id: scenario.galleryMedia.one.id,
    })) as GalleryMedia
    const result = await galleryMedia({ id: original.id })

    expect(result).toEqual(null)
  })
})
