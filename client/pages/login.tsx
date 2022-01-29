import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrormap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'

interface loginProps { }

const Login: React.FC<loginProps> = ({ }) => {
    const router = useRouter()
    const [, login] = useLoginMutation()
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    // * The errors we get from graphql are:
                    // * [{field: 'username', message: 'something is wrong'}]
                    if (response.data?.login.errors) { // * this is optional chaining
                        setErrors(toErrormap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        if (typeof router.query.next === 'string') {
                            router.push(router.query.next)
                        } else {
                            // * worked
                            router.push('/')
                        }
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type="password" />
                        </Box>
                        <Box>
                            <Flex mt={2}>
                                <NextLink href="/forgot-password">
                                    <Link ml="auto">Forgot Password</Link>
                                </NextLink>
                            </Flex>
                        </Box>
                        <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)