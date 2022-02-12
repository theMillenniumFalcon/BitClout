import { Box, Button, Flex, Input, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrormap } from '../../utils/toErrorMap';
import NextLink from 'next/link'

const ChangePassword: NextPage = () => {
    const router = useRouter()
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
    return (
        <Wrapper size="small">
            <Formik initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({ newPassword: values.newPassword,
                        token : typeof router.query.token === "string" ? router.query.token : ""
                    })
                    // * The errors we get from graphql are:
                    // * [{field: 'username', message: 'something is wrong'}]
                    if (response.data?.changePassword.errors) { // * this is optional chaining
                        const errorMap = toErrormap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        // * worked
                        router.push('/')
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Input name="newPassword" placeholder="new password" label="New Password" type="password" />
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
                        <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Change Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)