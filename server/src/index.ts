import "reflect-metadata"
require('dotenv').config()
import { COOKIE, __prod__ } from "./constants/constants"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { TestResolver } from "./resolvers/test"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import Redis from 'ioredis'
import session from 'express-session'
import connnectRedis from 'connect-redis'
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import cors from 'cors'
import { createConnection } from 'typeorm'
import { User } from "./entities/User"
import { Post } from "./entities/Post"
import path from "path"

const PORT = process.env.PORT || 4000

const main = async () => {

    const connection = await createConnection({
        type: "postgres",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: true,
        synchronize: false,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User]
    })

    await connection.runMigrations()

    // await User.delete({})
    // await Post.delete({})

    const app = express()

    const RedisStore = connnectRedis(session)
    const redis = new Redis()

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))

    redis.on("error", (err) => {
        console.log("Error " + err);
    })

    app.use(session({
        name: COOKIE,
        store: new RedisStore({
            client: redis,
            disableTTL: true,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 1,
            httpOnly: true,
            sameSite: 'lax', // * protecting csrf
            secure: __prod__ // * cookie only works in https
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
    }))

    app.get('/', (_, res) => {
        res.send("Server is working fine!")
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TestResolver, PostResolver, UserResolver],
            validate: false
        }),
        // * context is an object that is accessible to all the resolvers
        context: ({ req, res }) => ({ req, res, redis }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
    })

    apolloServer.start().then((_) => {
        apolloServer.applyMiddleware({ app, cors: { origin: false } })
        const server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        })
        process.on('unhandledRejection', (err, _) => {
            console.log(`Logged Error: ${err}`)
            server.close(() => process.exit(1))
        })
    })
}
main().catch((error) => {
    console.error(error)
})