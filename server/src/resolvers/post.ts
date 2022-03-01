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

    // * UPVOTES
    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() { req }: Context
    ) {
        const isUpvote = value !== -1
        const realValue = isUpvote ? 1 : -1
        const userId = req.session.userId
        const upvote = await Upvote.findOne({ where: { postId, userId } })

        // * the user has voted on the post before and they are changing their vote
        if (upvote && upvote.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    update upvote
                    set value = $1
                    where "postId" = $2 and "userId" = $3
                `, [realValue, postId, userId])

                await tm.query(`
                    update post
                    set points = points + $1
                    where id = $2
                `, [2 * realValue, postId])
            })
        } else if (!upvote) {
            // * has never voted on the post before
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    insert into upvote ("userId", "postId", value)
                    values ($1, $2, $3);
                `, [userId, postId, realValue])

                await tm.query(`
                    update post
                    set points = points + $1
                    where id = $2;
                `, [realValue, postId])
            
            })
        } 

        return true
    }

    // * ALL POSTS
    @Query(() => PaginationPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        @Ctx() { req }: Context
    ): Promise<PaginationPosts> {
        const realLimit = Math.min(50, limit) + 1
        const realLimitPlusOne = realLimit + 1

        const replacements: any[] = [realLimitPlusOne, req.session.userId]

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
        }

        const posts = await getConnection().query(`
            select p.*, 
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email,
                'createdAt', u."createdAt",
                'updatedAt', u."updatedAt"
                ) creator
            ${req.session.userId ? 
                '(select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"' 
                : 'null as "voteStatus"'
            }
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $3` : ""}
            order by p."createdAt" DESC
            limit $1
        `, replacements
        )

        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne }
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