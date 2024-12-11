FROM node:20-alpine as builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["sh", "-c", "npm run start:migrate"]