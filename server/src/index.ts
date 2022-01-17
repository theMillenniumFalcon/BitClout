import "reflect-metadata"
require('dotenv').config()
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
import microConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import redis from 'redis'
import session from 'express-session'
import connnectRedis from 'connect-redis'
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"

const PORT = process.env.PORT || 4000

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()

    const app = express()

    const RedisStore = connnectRedis(session)
    const redisClient = redis.createClient()

    redisClient.on("error", (err) => {
        console.log("Error " + err);
    });

    app.use(session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: Number(process.env.SESS_EXPIRY),
                httpOnly: true,
                sameSite: 'lax', // * csrf
                secure: __prod__ // * cookie only works in https
            },
            saveUninitialized: false,
            secret: process.env.SECRET as string,
            resave: false,
        }))

    app.get('/', (_, res) => {
        res.send("Server is working fine!")
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        // * context is an object that is accessible to all the resolvers
        context: ({ req, res }) => ({ em: orm.em, req, res }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
    })

    apolloServer.start().then((_) => {
        apolloServer.applyMiddleware({ app })
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