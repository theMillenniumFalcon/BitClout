import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type inputfieldprops = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    name: string
}

// * '' => false
// * 'error message stuff' => true

const InputField: React.FC<inputfieldprops> = ({label, size, ...props}) => {
    const [field, {error}] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputField