import { FieldError } from "../generated/graphql";

const Errors = (errors: FieldError[]) => {
    const errormap: Record<string, string> = {}
    errors.forEach(({field, message}) => {
        errormap[field] = message
    })

    return errormap
}

export default Errors