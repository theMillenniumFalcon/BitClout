import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrormap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter()
    const [, login] = useLoginMutation()
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }} 
            onSubmit={async (values, {setErrors}) => {
                const response = await login(values)
                // * The errors we get from graphql are:
                // * [{field: 'username', message: 'something is wrong'}]
                if (response.data?.login.errors) { // * this is optional chaining
                    setErrors(toErrormap(response.data.login.errors))
                } else if (response.data?.login.user) {
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
                        <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)