import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;

    @Field(() => Int)
    groupId: number;
}