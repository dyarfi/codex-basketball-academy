import type { Prisma, Announcement } from "@prisma/client";

import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.AnnouncementCreateArgs>({
  announcement: {
    one: {
      data: {
        title: "String",
        message: "String",
        updatedAt: "2025-07-31T14:46:32.093Z",
      },
    },
    two: {
      data: {
        title: "String",
        message: "String",
        updatedAt: "2025-07-31T14:46:32.093Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<Announcement, "announcement">;
