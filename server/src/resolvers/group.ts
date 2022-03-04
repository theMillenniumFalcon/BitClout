import { GroupInput } from "../inputs/GroupInput"
import { Arg, Query, Resolver, Mutation, Ctx, UseMiddleware, Int } from "type-graphql"
import { Context } from "../types/types"
import { GroupResponse } from "../responses/GroupResponse"
import { Group } from "../entities/Group"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm"
import { Member } from "../entities/Member"

@Resolver(Group)
export class GroupResolver {

    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async member(
        @Arg('groupId', () => Int) groupId: number,
        @Arg('members', () => Int) members: number,
        @Ctx() { req }: Context
    ) {
        const isMember = members > 0
        const realMember = isMember ? 1 : 0
        const { userId } = req.session

        await Member.insert({ userId, groupId, members: realMember })

        await Group.update({ id: groupId }, { membersNumber: members + 1 })

        // await getConnection().query(`
        //     START TRANSACTION;

        //     insert into member ("userId", "groupId", members)
        //     values(${userId}, ${groupId}, ${realMember});

        //     update group
        //     set membersNumber = membersNumber + ${realMember}
        //     where id = ${groupId};

        //     COMMIT;
        // `)

        return true
    }

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
                description: options.description,
                membersNumber: options.membersNumber
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