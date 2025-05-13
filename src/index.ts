import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { join } from "path";

import { editCsvData, getCsvData, writeCsvData } from "./utils";

import { type Country, countrySchema } from "./types";

const app = new OpenAPIHono();

const filePath = join(__dirname, "./data/data.csv");

app.get("/swagger", swaggerUI({ url: "/doc" }));

app.doc("/doc", {
  info: {
    title: "Country Data API",
    description: "RESTful API for retrieving country data",
    version: "1.0.0",
  },
  openapi: "3.1.0",
});

app.openapi(
  createRoute({
    method: "get",
    path: "/countries",
    summary: "Retrieve a list of countries",
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(countrySchema).openapi({}) } },
      },
    },
  }),
  async (c) => {
    const data = await getCsvData(filePath);

    return c.json(data, 200);
  }
);

app.openapi(
  createRoute({
    method: "post",
    path: "/countries",
    summary: "Create a new country",
    requestBody: {
      required: true,
      content: { "application/json": { schema: {} } },
    },
    responses: {
      201: {
        description: "Created",
      },
      400: {
        description: "Bad Request",
      },
    },
  }),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = countrySchema.parse(body);

      const data = await writeCsvData(filePath, parsed);

      return c.json(data, 201);
    } catch {
      return c.text("Bad Request", 400);
    }
  }
);

app.openapi(
  createRoute({
    method: "get",
    path: "/countries/{rank}",
    summary: "Retrieve information about a specific country",
    parameters: [
      {
        name: "rank",
        in: "path",
        description: "Country rank",
        required: true,
        schema: { type: "integer", minimum: 1 },
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: countrySchema.openapi({}) } },
      },
    },
  }),
  async (c) => {
    const rank = Number(c.req.param("rank"));
    const data = await getCsvData(filePath);
    const country = data.find((item: Country) => Number(item.rank) === rank);

    return c.json(country, 200);
  }
);

app.openapi(
  createRoute({
    method: "put",
    path: "/countries/{rank}",
    summary: "Update information of an existing country",
    parameters: [
      {
        name: "rank",
        in: "path",
        description: "Country rank",
        required: true,
        schema: { type: "integer", minimum: 1 },
      },
    ],
    requestBody: {
      required: true,
      content: { "application/json": { schema: { type: "object" } } },
    },
    responses: {
      200: { description: "OK" },
      400: { description: "Bad Request" },
    },
  }),
  async (c) => {
    try {
      const rank = Number(c.req.param("rank"));
      const body = await c.req.json();
      const updatedCountry = countrySchema.parse(body);

      const data = await getCsvData(filePath);
      const index = data.findIndex((item: Country) => Number(item.rank) === rank);

      data[index] = updatedCountry;
      const newData = await editCsvData(filePath, index, data);

      return c.json(newData, 200);
    } catch {
      return c.text("Bad Request", 400);
    }
  }
);

export default app;
