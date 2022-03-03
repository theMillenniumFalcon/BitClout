import { GroupInput } from "../inputs/GroupInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int } from "type-graphql"
import { Context } from "../types/types"
import { GroupResponse } from "../responses/GroupResponse"
import { Group } from "../entities/Group"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"

@Resolver()
export class GroupResolver {

    // * ALL GROUPS
    @Query(() => [Group], { nullable: true })
    async groups(): Promise<Group[]> {
        // await delay(3000)
        return Group.find()
    }

    // * SINGLE GROUP
    @Query(() => Group, { nullable: true })
    group(@Arg("id", () => Int) id: number): Promise<Group | undefined> {
        return Group.findOne(id)
    }

    // * CREATE GROUP
    @Mutation(() => GroupResponse)
    @UseMiddleware(Authentication)
    async createGroup(
        @Arg('options') options: GroupInput,
        @Ctx() { }: Context
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
                description: options.description
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
        @Arg('id') id: number,
        @Arg('name', () => String, { nullable: true }) name: string
    ): Promise<Group | null> {
        const group = await Group.findOne(id)
        if (!group) {
            return null
        }
        if (typeof name !== 'undefined') {
            await Group.update({ id }, { name })
        }
        return group
    }

    // * DELETE GROUP
    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async deleteGroup(
        @Arg('id') id: number
    ): Promise<boolean> {
        try {
            await Group.delete(id)
        } catch {
            return false
        }
        return true
    }

}