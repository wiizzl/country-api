# see https://bun.sh/guides/ecosystem/docker

FROM oven/bun:latest
WORKDIR /country-api

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .
RUN bun run build

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start"]