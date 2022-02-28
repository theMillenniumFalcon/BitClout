import { PostInput } from "../inputs/PostInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int, FieldResolver, Root, ObjectType, Field } from "type-graphql"
import { Context } from "../types/types"
import { PostResponse } from "../responses/PostResponse"
import { Post } from "../entities/Post"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"

@ObjectType()
class PaginationPosts {
    @Field(() => [Post])
    posts: Post[]

    @Field()
    hasMore: boolean
}

@Resolver(Post)
export class PostResolver {

    // * TEXT SNIPPET
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
        return root.text.slice(0, 50)
    }

    // * ALL POSTS
    @Query(() => PaginationPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginationPosts> {
        const realLimit = Math.min(50, limit) + 1
        const realLimitPlusOne = realLimit + 1

        const replacements: any[] = [realLimitPlusOne]

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
        }

        const posts = await getConnection().query(
            `
          select p.*, 
          json_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
          ) creator 
          from post p
          inner join public.user u on u.id = p."creatorId"
          ${cursor ? `where p."createdAt" < $2` : ""}
          order by p."createdAt" DESC
          limit $1
          `,
            replacements
        )

        // const queryBuilder = getConnection()
        //     .getRepository(Post)
        //     .createQueryBuilder("p")
        //     .innerJoinAndSelect("p.creator", "u", '"u.id = p."creatorId"')
        //     .orderBy('p."createdAt"', "DESC")
        //     .take(realLimitPlusOne)

        // if (cursor) {
        //     queryBuilder.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
        // }

        // const posts = await queryBuilder.getMany()

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