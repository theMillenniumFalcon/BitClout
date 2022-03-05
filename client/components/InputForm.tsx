import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea, Select } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  textarea?: boolean
  select?: boolean
}

const InputForm: React.FC<InputFieldProps> = ({ label, textarea, select, size: _, ...props }) => {
  let InputSelectOrTextarea = Input as any
  if (textarea) {
    InputSelectOrTextarea = Textarea
  } else if (select) {
    InputSelectOrTextarea = Select
  }
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputSelectOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputForm