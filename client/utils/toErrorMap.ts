import { FieldError } from "../generated/graphql";

export const toErrormap = (errors: FieldError[]) => {
    const errormap: Record<string, string> = {}
    errors.forEach(({field, message}) => {
        errormap[field] = message
    })

    return errormap
}