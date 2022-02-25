import { PostInput } from "../inputs/PostInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int } from "type-graphql"
import { Context } from "../types/types"
import { PostResponse } from "../responses/PostResponse"
import { Post } from "../entities/Post"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"

@Resolver()
export class PostResolver {

    // * ALL POSTS
    @Query(() => [Post])
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit)
            const queryBuilder = getConnection()
                .getRepository(Post)
                .createQueryBuilder("p")
                .where('"createdAt" < :cursor', { cursor })
                .orderBy('"createdAt"', "DESC")
                .take(realLimit)
            if (cursor) {
                queryBuilder.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
            }

            return queryBuilder.getMany()
    }

    // * SINGLE POST
    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    // * CREATE POST
    @Mutation(() => PostResponse)
    @UseMiddleware(Authentication)
    async createPost(
        @Arg('options') options: PostInput,
        @Ctx() { req }: Context
    ): Promise<PostResponse> {
        if (options.title.length <= 2) {
            return {
                errors: [{
                    field: 'title',
                    message: "Title should be atleast two characters long",
                }]
            }
        }

        let post
        try {
            const result = await getConnection().createQueryBuilder().insert().into(Post).values({
                title: options.title,
                text: options.text,
                creatorId: req.session.userId
            }).returning('*').execute()
            post = result.raw[0]
        } catch (err) {
            console.error(err)
        }

        return { post }
    }

    // * UPDATE POST
    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(Authentication)
    async updatePost(
        @Arg('id') id: number,
        @Arg('name', () => String, { nullable: true }) title: string
    ): Promise<Post | null> {
        const post = await Post.findOne(id)
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            await Post.update({ id }, { title })
        }
        return post
    }

    // * DELETE POST
    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async deletePost(
        @Arg('id') id: number
    ): Promise<boolean> {
        try {
            await Post.delete(id)
        } catch {
            return false
        }
        return true
    }

}