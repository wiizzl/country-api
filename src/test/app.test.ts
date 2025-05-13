import { describe, expect, it } from "bun:test";

import app from "../index";

describe("Country API", () => {
  it("/GET countries", async () => {
    const req = new Request("http://localhost:3000/countries", { method: "GET" });
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const countries = await res.json();

    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBe(191);

    for (const country of countries) {
      expect(country).toHaveProperty("rank");
      expect(country).toHaveProperty("capital");
      expect(country).toHaveProperty("country");
      expect(country).toHaveProperty("population");
      expect(country.rank).toBeGreaterThanOrEqual(1);
      expect(country.capital).not.toBeEmpty();
      expect(country.country).not.toBeEmpty();

      const populationNumber = Number(country.population.replace(/\s/g, ""));
      expect(populationNumber).toBeGreaterThanOrEqual(1);
    }
  });

  it("/POST countries", async () => {
    const data = {
      rank: 193,
      capital: "New Capital",
      country: "New Country",
      population: "1 000 000",
    };

    const req = new Request("http://localhost:3000/countries", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await app.fetch(req);

    expect(res.status).toBe(201);

    const country = await res.json();

    expect(country).toHaveProperty("rank");
    expect(country).toHaveProperty("capital");
    expect(country).toHaveProperty("country");
    expect(country).toHaveProperty("population");

    expect(country.rank).toBe(193);
    expect(country.capital).toBe("New Capital");
    expect(country.country).toBe("New Country");
    expect(country.population).toBe("1 000 000");
  });

  it("/GET countries/{rank}", async () => {
    const req = new Request("http://localhost:3000/countries/193", { method: "GET" });
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const country = await res.json();

    expect(country).toHaveProperty("rank");
    expect(country).toHaveProperty("capital");
    expect(country).toHaveProperty("country");
    expect(country).toHaveProperty("population");

    expect(country.rank).toBe(193);
    expect(country.capital).not.toBeEmpty();
    expect(country.country).not.toBeEmpty();

    const populationNumber = Number(country.population.replace(/\s/g, ""));
    expect(populationNumber).toBeGreaterThanOrEqual(1);
  });

  it("/PUT countries/{rank}", async () => {
    const data = {
      rank: 193,
      capital: "New Capital",
      country: "New Country",
      population: "2 000 000",
    };

    const req = new Request("http://localhost:3000/countries/193", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const country = await res.json();

    expect(country).toHaveProperty("rank");
    expect(country).toHaveProperty("capital");
    expect(country).toHaveProperty("country");
    expect(country).toHaveProperty("population");

    expect(country.rank).toBe(193);
    expect(country.capital).toBe("New Capital");
    expect(country.country).toBe("New Country");
    expect(country.population).toBe("2 000 000");
  });
});
