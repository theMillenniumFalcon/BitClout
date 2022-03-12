# BitClout

BitClout is a social media application that allows users to create posts, vote on them and join groups in accordance with their interests.

## Tech and major tools used in this project:

- React and Next.js are used in the frontend using typescript.
- PostgreSQL is used as a database.
- TypeORM is the oPRM in this project.
- Redis is used as a cache store.
- A node based backend is developed using graphQL to serve as the server.
- URQL is used to transfer data between the server and the UI.

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
