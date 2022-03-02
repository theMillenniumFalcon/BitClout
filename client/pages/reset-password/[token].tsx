import { Box, Button, Flex, Input, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useResetPasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Errors from '../../utils/Errors';
import NextLink from 'next/link'
import InputForm from '../../components/InputForm';

const ResetPassword: NextPage = () => {
    const router = useRouter()
    const [, changePassword] = useResetPasswordMutation()
    const [tokenError, setTokenError] = useState('')
    return (
        <Formik initialValues={{ newPassword: '' }}
            onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({
                    newPassword: values.newPassword,
                    token: typeof router.query.token === "string" ? router.query.token : ""
                })
                // * The errors we get from graphql are:
                // * [{field: 'username', message: 'something is wrong'}]
                if (response.data?.resetPassword.errors) {
                    const errorMap = Errors(response.data.resetPassword.errors)
                    if ('token' in errorMap) {
                        setTokenError(errorMap.token)
                    }
                    setErrors(errorMap)
                } else if (response.data?.resetPassword.user) {
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
                            <InputForm name="newPassword" placeholder="new password" label="New Password" type="password" />
                            {tokenError ?
                                (
                                    <Flex>
                                        <Box mr={2} style={{ color: 'red' }}>{tokenError}</Box>
                                        <NextLink href="/forgot-password">
                                            <Link>Click here</Link>
                                        </NextLink>
                                    </Flex>

                                )
                                : null}
                            <Button mt={4} type='submit' colorScheme='red' isLoading={isSubmitting}>Change Password</Button>
                        </Form>
                    </Box>
                </Box>
            )}
        </Formik>
    )
}

export default withUrqlClient(createUrqlClient)(ResetPassword)