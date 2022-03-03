import { PostInput } from "../inputs/PostInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int, ObjectType, Field } from "type-graphql"
import { Context } from "../types/types"
import { PostResponse } from "../responses/PostResponse"
import { Post } from "../entities/Post"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"
import { Upvote } from "../entities/Upvote"

@ObjectType()
class PaginationPosts {
    @Field(() => [Post])
    posts: Post[]

    @Field()
    hasMore: boolean
}

@Resolver(Post)
export class PostResolver {

    // * ALL POSTS
    @Query(() => PaginationPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        @Ctx() { req }: Context
    ): Promise<PaginationPosts> {
        const realLimit = Math.min(50, limit) + 1
        const realLimitPlusOne = realLimit + 1

        const replacements: any[] = [realLimitPlusOne]

        if (req.session.userId) {
            replacements.push(req.session.userId)
        }

        let cursorIndex = 3
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
            cursorIndex = replacements.length
        }

        const posts = await getConnection().query(`
            select p.*, 
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email,
                'createdAt', u."createdAt",
                'updatedAt', u."updatedAt"
                ) creator,
            ${req.session.userId ?
                '(select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"'
                : 'null as "voteStatus"'
            }
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $${cursorIndex}` : ""}
            order by p."createdAt" DESC
            limit $1
        `, replacements
        )

        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne }
    }

    // * SINGLE POST
    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id, { relations: ["creator"] })
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

        if (options.text.length <= 0) {
            return {
                errors: [{
                    field: 'text',
                    message: "Text should not be empty",
                }]
            }
        }

        if (!options.groupId) {
            return {
                errors: [{
                    field: 'groupId',
                    message: "Please provide a group name",
                }]
            }
        }

        let post
        try {
            const result = await getConnection().createQueryBuilder().insert().into(Post).values({
                title: options.title,
                text: options.text,
                creatorId: req.session.userId,
                groupId: options.groupId
            }).returning('*').execute()
            post = result.raw[0]
        } catch (err) {
            // * no group error
            if (err.code === 23503) {
                return {
                    errors: [{
                        field: 'groupId',
                        message: "No group has this name"
                    }]
                }
            }
        }

        return { post }
    }

    // * UPDATE POST
    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(Authentication)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Arg('text') text: string,
        @Ctx() { req }: Context
    ): Promise<Post | null> {
        const post = await Post.findOne(id)
        if (!post) {
            return null
        }
        if (post.creatorId !== req.session.userId) {
            throw new Error("not authorized")
        }
        
        const result = getConnection().createQueryBuilder().update(Post).set({ title, text })
        .where('id = :id and "creatorId" = :creatorId', { id, creatorId: req.session.userId }).returning("*").execute()
        
        return (await result).raw[0]
    }

    // * DELETE POST
    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: Context
    ): Promise<boolean> {
        const post = await Post.findOne(id)
        if (!post) {
            return false
        }
        if (post.creatorId !== req.session.userId) {
            throw new Error("not authorized")
        }

        await Upvote.delete({ postId: id })
        await Post.delete({ id })
        
        return true
    }

}