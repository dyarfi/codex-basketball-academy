import type { Prisma, Media } from "@prisma/client";

import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.MediaCreateArgs>({
  media: {
    one: {
      data: {
        name: "String",
        url: "String",
        mimeType: "String",
        size: 6951068,
      },
    },
    two: {
      data: {
        name: "String",
        url: "String",
        mimeType: "String",
        size: 8609426,
      },
    },
  },
});

export type StandardScenario = ScenarioData<Media, "media">;
