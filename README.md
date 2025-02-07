# BUNCHAT AI BACKEND
Nusachat Backend with Hono and BUN

# To install dependencies:
- copy .env.example to .env
```sh
# install vendor
bun install

# migrate data
bunx prisma migrate dev --name init
```
- comment for testing purpose on node_modules\pdf-parse\index.js (If error)

To run:
```sh
bun dev 
or 
bun run dev
```

# Prisma
```sh
# to re-migrate
bunx prisma migrate dev

# To migrate All
bunx prisma migrate dev --name init

# To run specify model
bunx prisma migrate dev --name posts

# To regenerate
bunx prisma generate
bunx prisma migrate dev --name create_train_methods_table
```

# Unit test
```sh
# To Run All Unit Test
$ bun test
```