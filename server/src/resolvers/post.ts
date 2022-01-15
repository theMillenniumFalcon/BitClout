import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() ctx: MyContext): Promise<Post[]> {
        return ctx.em.find(Post, {})
    }

    @Query(() => Post, { nullable: true })
    post(@Arg('id') id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
        return ctx.em.findOne(Post, { id })
    }

    @Mutation(() => Post)
    async createPost(@Arg('title') title: string, @Ctx() ctx: MyContext): Promise<Post> {
        const post = ctx.em.create(Post, {title})
        await ctx.em.persistAndFlush(post)
        return post
    }
}