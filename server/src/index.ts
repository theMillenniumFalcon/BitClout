require('dotenv').config()
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import microConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/Post"

const PORT = process.env.PORT || 4000

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()

    const app = express()

    app.get('/', (_, res) => {
        res.send("Server is working fine!")
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    })

    apolloServer.applyMiddleware({ app })

    const server = app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })

    process.on('unhandledRejection', (err, _) => {
        console.log(`Logged Error: ${err}`)
        server.close(() => process.exit(1))
    })
    
}
main().catch((error) => {
    console.error(error)
})
