import type { Prisma, GalleryMedia } from "@prisma/client";

import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.GalleryMediaCreateArgs>({
  galleryMedia: {
    one: { data: { name: "String", description: "String", image: "String" } },
    two: { data: { name: "String", description: "String", image: "String" } },
  },
});

export type StandardScenario = ScenarioData<GalleryMedia, "galleryMedia">;
