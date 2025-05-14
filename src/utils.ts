import { type Country } from "./types";

async function getFileContent(filePath: string) {
  const file = Bun.file(filePath);
  const text = await file.text();

  return text;
}

async function getCsvData(filePath: string) {
  const text = await getFileContent(filePath);

  const lines = text.split("\n");
  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const values = line.split(",");

    const dataLine = {
      rank: Number(values[0]),
      capital: values[1],
      country: values[2],
      population: values[3],
    };

    return dataLine;
  });
}

async function writeCsvData(filePath: string, parsed: Country) {
  const text = await getFileContent(filePath);

  const lines = text.split("\n");
  const headerLine = lines[0];
  const dataLines = lines.slice(1);
  const newLine = [parsed.rank, parsed.capital, parsed.country, parsed.population].join(",");

  const updatedFile = [headerLine, ...dataLines, newLine].join("\n");
  await Bun.write(filePath, updatedFile);

  return {
    rank: parsed.rank,
    capital: parsed.capital,
    country: parsed.country,
    population: parsed.population,
  };
}

async function editCsvData(filePath: string, index: number, data: Country[]) {
  const text = await getFileContent(filePath);

  const lines = text.split("\n");
  const headerLine = lines[0];
  const newLines = data.map((item) => {
    return [item.rank, item.capital, item.country, item.population].join(",");
  });

  const updatedFile = [headerLine, ...newLines].join("\n");
  await Bun.write(filePath, updatedFile);

  return {
    rank: data[index].rank,
    capital: data[index].capital,
    country: data[index].country,
    population: data[index].population,
  };
}

export { editCsvData, getCsvData, writeCsvData };
