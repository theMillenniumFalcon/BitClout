import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import InputForm from '../components/InputForm'
import Errors from '../utils/Errors'
import { useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'

interface loginProps { }

const Login: React.FC<loginProps> = ({ }) => {
    const router = useRouter()
    const [, login] = useLoginMutation()
    return (
        <Formik initialValues={{ username: "", email: "", password: "" }} onSubmit={async (values, { setErrors }) => {
            const response = await login(values)
            if (response.data?.login.errors) {
                setErrors(Errors(response.data.login.errors))
            } else if (response.data?.login.user) {
                // * worked
                router.push('/')
            }
        }}>
            {({ isSubmitting }) => (
                <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
                >
                    <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                        <Form>
                            <Box>
                                <InputForm name="username" placeholder="username" label="Username" />
                            </Box>
                            <Box mt={4}>
                                <InputForm name="password" placeholder="password" label="Password" type="password" />
                            </Box>
                            <Flex>
                                <Button mt={4} type='submit' colorScheme='blue' isLoading={isSubmitting}>Login</Button>
                                <NextLink href="/forgot-password">
                                    <Link ml='auto'>Forgot Password?</Link>
                                </NextLink>
                            </Flex>
                        </Form>
                    </Box>
                </Box>
            )}
        </Formik>
    )
}

export default withUrqlClient(createUrqlClient)(Login)