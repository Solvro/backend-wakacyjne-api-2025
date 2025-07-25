import { z } from "zod";

import { ZodValidationPipe } from "./zod-validation.pipe";

describe("ZodValidationPipe", () => {
  it("should be defined", () => {
    expect(new ZodValidationPipe(z.object({}))).toBeDefined();
  });
});
