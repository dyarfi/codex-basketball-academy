import type { Prisma, InvitationLink } from "@prisma/client";

import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.InvitationLinkCreateArgs>({
  invitationLink: {
    one: {
      data: {
        code: "String6497756",
        url: "String",
        updatedAt: "2025-08-03T03:28:38.470Z",
      },
    },
    two: {
      data: {
        code: "String2072428",
        url: "String",
        updatedAt: "2025-08-03T03:28:38.470Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<InvitationLink, "invitationLink">;
