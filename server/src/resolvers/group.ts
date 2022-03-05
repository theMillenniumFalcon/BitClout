import { GroupInput } from "../inputs/GroupInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int } from "type-graphql"
import { Context } from "../types/types"
import { GroupResponse } from "../responses/GroupResponse"
import { Group } from "../entities/Group"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"
import { Member } from "../entities/Member"
import { Post } from "../entities/Post"
import { Upvote } from "../entities/Upvote"

@Resolver(Group)
export class GroupResolver {

    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async member(
        @Arg('groupId', () => Int) groupId: number,
        @Arg('members', () => Int) members: number,
        @Ctx() { req }: Context
    ) {
        const isMembers = members > 0
        const realMembers = isMembers ? members : 1
        const { userId } = req.session

        await Member.insert({ userId, groupId, members: realMembers })

        await Group.update({ id: groupId }, { membersNumber: members + members })

        return true
    }

    // * ALL GROUPS
    @Query(() => [Group], { nullable: true })
    async groups(): Promise<Group[]> {
        // await delay(3000)
        return Group.find({ relations: ["posts", "members"]})
    }

    // * SINGLE GROUP
    @Query(() => Group, { nullable: true })
    group(@Arg("id", () => Int) id: number): Promise<Group | undefined> {
        return Group.findOne(id, { relations: ["posts", "members"]})
    }

    // * CREATE GROUP
    @Mutation(() => GroupResponse)
    @UseMiddleware(Authentication)
    async createGroup(
        @Arg('options') options: GroupInput,
        @Ctx() { req }: Context
    ): Promise<GroupResponse> {
        if (options.name.length <= 2 || options.name.length >= 20) {
            return {
                errors: [{
                    field: 'name',
                    message: "group name should be between two and twenty characters long",
                }]
            }
        }

        let group
        try {
            const result = await getConnection().createQueryBuilder().insert().into(Group).values({
                name: options.name,
                description: options.description,
                creatorId: req.session.userId
            }).returning('*').execute()
            group = result.raw[0]
        } catch (err) {
            // * duplicate group name error
            if (err.code === process.env.DUPLICATE_ERROR_CODE) {
                return {
                    errors: [{
                        field: 'name',
                        message: "group with this name already taken"
                    }]
                }
            }
        }

        return { group }
    }

    // * UPDATE GROUP
    @Mutation(() => Group, { nullable: true })
    @UseMiddleware(Authentication)
    async updateGroup(
        @Arg('id', () => Int) id: number,
        @Arg('name') name: string,
        @Arg('description') description: string,
        @Ctx() { req }: Context
    ): Promise<Group | null> {
        const group = await Group.findOne(id)
        if (!group) {
            return null
        }
        if (group.creatorId !== req.session.userId) {
            throw new Error("not authorized")
        }

        const result = getConnection().createQueryBuilder().update(Group).set({ name, description })
            .where('id = :id and "creatorId" = :creatorId', { id, creatorId: req.session.userId }).returning("*").execute()

        return (await result).raw[0]
    }

    // * DELETE GROUP
    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async deleteGroup(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: Context
    ): Promise<boolean> {
        const group = await Group.findOne(id)
        if (!group) {
            return false
        }
        if (group.creatorId !== req.session.userId) {
            throw new Error("not authorized")
        }

        await Upvote.delete({ postId: id })
        await Member.delete({ groupId: id })
        await Post.delete({ groupId: id })
        await Group.delete({ id })
        
        return true
    }

}