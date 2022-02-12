import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type inputformprops = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    name: string
}

// * '' => false
// * 'error message stuff' => true

const InputForm: React.FC<inputformprops> = ({label, size, ...props}) => {
    const [field, {error}] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputForm