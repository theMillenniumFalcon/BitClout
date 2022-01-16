import { User } from "../entities/User";
import { Arg, Field, InputType, Mutation, Resolver, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "../types";
import argon2 from 'argon2'

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
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() ctx: MyContext
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
        const user = ctx.em.create(User, {username: options.username, password: hashedPassword})
        try {
            await ctx.em.persistAndFlush(user)
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
            console.log('message: ' + err.message)
        }
        
        return {user}
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<UserResponse> {
        const user = await ctx.em.findOne(User, {username: options.username.toLowerCase()})
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

        return {user}
    }
}