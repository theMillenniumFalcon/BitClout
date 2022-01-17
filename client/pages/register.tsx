import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrormap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }} 
            onSubmit={async (values, {setErrors}) => {
                const response = await register(values)
                // * The errors we get from graphql are:
                // * [{field: 'username', message: 'something is wrong'}]
                if (response.data?.register.errors) { // * this is optional chaining
                    setErrors(toErrormap(response.data.register.errors))
                } else if (response.data?.register.user) {
                    // * worked
                    router.push('/')
                }
            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="username" label="Username" />
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type="password" />
                        </Box>
                        <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register