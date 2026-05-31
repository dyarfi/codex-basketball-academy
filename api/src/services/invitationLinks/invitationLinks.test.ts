import type { InvitationLink } from "@prisma/client";

import {
  invitationLinks,
  invitationLink,
  createInvitationLink,
  updateInvitationLink,
  deleteInvitationLink,
} from "./invitationLinks";
import type { StandardScenario } from "./invitationLinks.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("invitationLinks", () => {
  scenario(
    "returns all invitationLinks",
    async (scenario: StandardScenario) => {
      const result = await invitationLinks();

      expect(result.length).toEqual(
        Object.keys(scenario.invitationLink).length,
      );
    },
  );

  scenario(
    "returns a single invitationLink",
    async (scenario: StandardScenario) => {
      const result = await invitationLink({
        id: scenario.invitationLink.one.id,
      });

      expect(result).toEqual(scenario.invitationLink.one);
    },
  );

  scenario("creates a invitationLink", async () => {
    const result = await createInvitationLink({
      input: {
        code: "String632183",
        url: "String",
        updatedAt: "2025-08-03T03:28:38.167Z",
      },
    });

    expect(result.code).toEqual("String632183");
    expect(result.url).toEqual("String");
    expect(result.updatedAt).toEqual(new Date("2025-08-03T03:28:38.167Z"));
  });

  scenario("updates a invitationLink", async (scenario: StandardScenario) => {
    const original = (await invitationLink({
      id: scenario.invitationLink.one.id,
    })) as InvitationLink;
    const result = await updateInvitationLink({
      id: original.id,
      input: { code: "String62717182" },
    });

    expect(result.code).toEqual("String62717182");
  });

  scenario("deletes a invitationLink", async (scenario: StandardScenario) => {
    const original = (await deleteInvitationLink({
      id: scenario.invitationLink.one.id,
    })) as InvitationLink;
    const result = await invitationLink({ id: original.id });

    expect(result).toEqual(null);
  });
});
