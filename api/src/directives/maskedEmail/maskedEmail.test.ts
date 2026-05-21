import { mockRedwoodDirective, getDirectiveName } from "@redwoodjs/testing/api";

import maskedEmail from "./maskedEmail";

describe("maskedEmail directive", () => {
  it("declares the directive sdl as schema, with the correct name", () => {
    expect(maskedEmail.schema).toBeTruthy();
    expect(getDirectiveName(maskedEmail.schema)).toBe("maskedEmail");
  });

  it("has a maskedEmail implementation transforms the value", () => {
    const mockExecution = mockRedwoodDirective(maskedEmail, {
      mockedResolvedValue: "foo",
    });

    expect(mockExecution()).toBe("bar");
  });
});
