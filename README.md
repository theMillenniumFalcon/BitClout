# BitClout

BitClout is a social media application that allows users to create posts, vote on them and join groups in accordance with their interests.

## Tech and major tools used in this project:

- React and Next.js are used in the frontend using typescript.
- PostgreSQL is used as a database.
- TypeORM is the ORM in this project.
- Redis is used as a cache store.
- A node based backend is developed using graphQL to serve as the server.
- URQL is used to transfer data between the server and the UI.

## Config / Secrets environment variables

Copy `.env.example` from the server folder to `.env` and add your private information

*Note: never commit this file, it should be ignored by Git*

```
DATABASE_URL=
REDIS_URL=
PORT=
SESSION_SECRET=
CORS_ORIGIN=
```

## Installation

### SSH

```bash
$ git clone git@github.com:theMillenniumFalcon/BitClout.git
```

### GitHub CLI

```bash
$ gh repo clone theMillenniumFalcon/BitClout
```

### HTTPS

```bash
$ git clone https://github.com/theMillenniumFalcon/BitClout
```


```bash
$ cd client
$ npm install
```

```bash
$ cd server
$ npm install
```

## Running the app

### For client
```bash
# development
$ npm run dev

# production mode
$ npm run build
```

### For server
```bash
# watch mode
$ npm run watch

# development
$ npm run dev

# production mode
$ npm run build
```

## Project Structure

### server
    .
    ├── dist                    # Compiled javascript files
    ├── src                     # Source files
    └── ...

### client
    .
    ├── generated               # Typescript hooks generated using graphQL
    ├── graphql                 # GraphQL files
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

### I have another question!

Feel free to ask us on [Twitter](https://twitter.com/nishankstwt)! You can also email us at nishankpr2002@gmail.com.