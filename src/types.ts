import { z } from "@hono/zod-openapi";

const countrySchema = z.object({
  rank: z.number(),
  capital: z.string(),
  country: z.string(),
  population: z.string(),
});

type Country = z.infer<typeof countrySchema>;

export { countrySchema, type Country };
