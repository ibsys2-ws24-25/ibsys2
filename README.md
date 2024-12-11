# IbSys Production Tool

In order to only start the app for review use this command.

```bash
docker compose up --build -d
```

After a successful run of the command looking like this.

```bash
[+] Building 34.3s (19/19) FINISHED                                                                                                                                                                        docker:desktop-linux
 => [app internal] load build definition from Dockerfile                                                                                                                                                                   0.0s
 => => transferring dockerfile: 591B                                                                                                                                                                                       0.0s
 => WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 1)                                                                                                                                             0.0s
 => [app internal] load metadata for docker.io/library/node:20-alpine                                                                                                                                                      0.9s
 => [app internal] load .dockerignore                                                                                                                                                                                      0.0s
 => => transferring context: 2B                                                                                                                                                                                            0.0s
 => [app builder 1/8] FROM docker.io/library/node:20-alpine@sha256:426f843809ae05f324883afceebaa2b9cab9cb697097dbb1a2a7a41c5701de72                                                                                        0.0s
 => [app internal] load build context                                                                                                                                                                                      0.8s
 => => transferring context: 2.39MB                                                                                                                                                                                        0.7s
 => CACHED [app builder 2/8] RUN apk add --no-cache openssl                                                                                                                                                                0.0s
 => CACHED [app builder 3/8] WORKDIR /app                                                                                                                                                                                  0.0s
 => CACHED [app builder 4/8] COPY package*.json ./                                                                                                                                                                         0.0s
 => CACHED [app builder 5/8] RUN npm install                                                                                                                                                                               0.0s
 => [app builder 6/8] COPY . .                                                                                                                                                                                             6.3s
 => [app builder 7/8] RUN npx prisma generate                                                                                                                                                                              1.3s
 => [app builder 8/8] RUN npm run build                                                                                                                                                                                   18.9s 
 => CACHED [app stage-1 4/8] COPY --from=builder /app/next.config.mjs ./                                                                                                                                                   0.0s 
 => [app stage-1 5/8] COPY --from=builder /app/.next ./.next                                                                                                                                                               0.4s 
 => [app stage-1 6/8] COPY --from=builder /app/node_modules ./node_modules                                                                                                                                                 2.2s 
 => [app stage-1 7/8] COPY --from=builder /app/package*.json ./                                                                                                                                                            0.2s 
 => [app stage-1 8/8] COPY --from=builder /app/prisma ./prisma                                                                                                                                                             0.0s 
 => [app] exporting to image                                                                                                                                                                                               1.7s 
 => => exporting layers                                                                                                                                                                                                    1.7s
 => => writing image sha256:1374651d81532c2d7f1263ea75551be830b690bde66cc3eb7a9d80e4f8354252                                                                                                                               0.0s
 => => naming to docker.io/library/ibsys2-app                                                                                                                                                                              0.0s
 => [app] resolving provenance for metadata file                                                                                                                                                                           0.0s
[+] Running 2/2
 ✔ Container ibsys2-app-1       Started                                                                                                                                                                                    0.5s 
 ✔ Container ibsys2-postgres-1  Started
```

Now the app and database are running. You can navigate to [http://localhost:3000](http://localhost:3000)

## Getting Started

First run the development database:

```bash
docker compose -f compose/db/compose.yml up -d
```

Open [http://localhost:5050](http://localhost:5050) with your browser to see the pgadmin login page.

### Run the prisma migrations

Before running the app you have to migrate and seed the database. This has to be done once.

```bash
# Migrate to current schema
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
