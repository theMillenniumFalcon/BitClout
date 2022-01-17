import { User } from "../entities/User";
import { Arg, Field, InputType, Mutation, Resolver, Ctx, ObjectType, Query } from "type-graphql";
import { MyContext } from "../types";
import argon2 from 'argon2'
import { EntityManager} from '@mikro-orm/postgresql'

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async me (@Ctx() { em, req }: MyContext) {
        // * you are not logged in
        if (!req.session.userId) {
            return null
        }
        const user = await em.findOne(User, { id: req.session.userId })
        return user
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { req, em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: 'username',
                    message: "length must be greater than 2"
                }]
            }
        }

        if (options.password.length <= 2) {
            return {
                errors: [{
                    field: 'password',
                    message: "length must be greater than 2"
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        let user
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username: options.username, 
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date()
            }).returning("*")
            user = result[0]
        } catch (err) {
            // * duplicate username error
            if (err.code === process.env.ERR_CODE) {
                return {
                    errors: [{
                        field: 'username',
                        message: "username already taken"
                    }]
                }
            }
        }

        // * store user id session
        // * this will set a cookie on the user
        // * keep them logged in
        req.session.userId = user.id
        
        return {user}
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username.toLowerCase()})
        if (!user) {
           return {
               errors: [{
                   field: 'username',
                   message: "that username doesn't exist"
               }]
           } 
        }
        const validPassword = await argon2.verify(user.password, options.password)
        if (!validPassword) {
            return {
                errors: [{
                    field: 'password',
                    message: "incorrect password"
                }]
            }
        }

        req.session.userId = user.id

        return {user}
    }
}