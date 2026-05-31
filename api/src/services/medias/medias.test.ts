import type { Media } from "@prisma/client";

import { medias, media, createMedia, updateMedia, deleteMedia } from "./medias";
import type { StandardScenario } from "./medias.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("medias", () => {
  scenario("returns all medias", async (scenario: StandardScenario) => {
    const result = await medias();

    expect(result.length).toEqual(Object.keys(scenario.media).length);
  });

  scenario("returns a single media", async (scenario: StandardScenario) => {
    const result = await media({ id: scenario.media.one.id });

    expect(result).toEqual(scenario.media.one);
  });

  scenario("creates a media", async () => {
    const result = await createMedia({
      input: {
        name: "String",
        url: "String",
        mimeType: "String",
        size: 6908809,
      },
    });

    expect(result.name).toEqual("String");
    expect(result.url).toEqual("String");
    expect(result.mimeType).toEqual("String");
    expect(result.size).toEqual(6908809);
  });

  scenario("updates a media", async (scenario: StandardScenario) => {
    const original = (await media({ id: scenario.media.one.id })) as Media;
    const result = await updateMedia({
      id: original.id,
      input: { name: "String2" },
    });

    expect(result.name).toEqual("String2");
  });

  scenario("deletes a media", async (scenario: StandardScenario) => {
    const original = (await deleteMedia({
      id: scenario.media.one.id,
    })) as Media;
    const result = await media({ id: original.id });

    expect(result).toEqual(null);
  });
});
