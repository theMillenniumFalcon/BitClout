import { Context } from "../types/types";
import { Arg, Resolver, Mutation, Ctx, UseMiddleware, Int } from "type-graphql"
import { Authentication } from "../middleware/Authentication";
import { getConnection } from "typeorm";

@Resolver()
export class MemberResolver {

    @Mutation(() => Boolean)
    @UseMiddleware(Authentication)
    async member(
        @Arg('groupId', () => Int) groupId: number,
        @Arg('members', () => Int) members: number,
        @Ctx() { req }: Context
    ) {
        const userId = req.session.userId
        // await Member.insert({ userId, groupId, members })

        await getConnection().query(`
            START TRANSACTION;

            insert into member ("userId", "groupId", members)
            values(${userId}, ${groupId}, ${members});

            update group
            set member = member + ${members}
            where id = ${groupId};

            COMMIT;
        `)

        return true
    }
}