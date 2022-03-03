import { Field, InputType, Int } from "type-graphql";

@InputType()
export class GroupInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Int)
    member: number;
}