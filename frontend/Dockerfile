FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
