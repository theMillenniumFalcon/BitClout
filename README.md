## Tech and major tools used in this project:

- React
- Typescript
- GraphQL
- Apollo
- Node.js
- PostgreSQL
- TypeORM
- Redis
- Next.js
- TypeGraphQL
- Node-argon2
- GraphQL Code Generator
- Joi

# BitCLout

Random Paragraph

## Deployment

You can find sandbox deployment at https://sandbox.codeforcause.org

## Build Setup

### For client
```bash
# install dependencies
npm install

# development run
npm run dev

# build for production
npm run build
```

### For server
```bash
# install dependencies
npm install

# compile to javascript
npm run watch

# development run
npm run dev

# build for production
npm run build
```

## Project Structure

### server
    .
    ├── dist                    # Compiled javascript files
    ├── src                     # Source files
    └── ...

### client
    .
    ├── .next                   # Internal nextJS files
    ├── generated               # Typescript hooks generated using graphQL
    ├── graphql                 # GraphQL queries and mutations
    ├── pages                   # nextJS pages
    ├── public                  # assets
    ├── styles                  # CSS files
    └── ...

### server src Structure

    .
    ├── ...
    ├── src
    │   ├── ...
    │   ├── entities            # Entities for database tables
    │   ├── migrations          # TypeORM migrations
    |   ├── index.ts            # Starting point
    │   └── ...
    └── ...
