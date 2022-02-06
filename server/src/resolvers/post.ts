import { Post } from "../entities/Post";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;
}

@Resolver()
export class PostResolver {
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

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id') id: number
    ): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input') input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        let post
        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save()
        
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string
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

    @Mutation(() => Boolean)
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