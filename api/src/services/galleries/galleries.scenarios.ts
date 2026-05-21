import type { Prisma, Gallery } from "@prisma/client";

import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.GalleryCreateArgs>({
  gallery: {
    one: { data: { name: "String" } },
    two: { data: { name: "String" } },
  },
});

export type StandardScenario = ScenarioData<Gallery, "gallery">;
