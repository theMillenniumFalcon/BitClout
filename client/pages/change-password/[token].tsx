import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/router';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrormap } from '../../utils/toErrorMap';
import login from '../login';

const ChangePassword: NextPage<{token: string}> = ({ token }) => {
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: '' }} 
            onSubmit={async (values, {setErrors}) => {
                // const response = await login(values)
                // // * The errors we get from graphql are:
                // // * [{field: 'username', message: 'something is wrong'}]
                // if (response.data?.login.errors) { // * this is optional chaining
                //     setErrors(toErrormap(response.data.login.errors))
                // } else if (response.data?.login.user) {
                //     // * worked
                //     router.push('/')
                // }
            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="newPassword" placeholder="new password" label="New Password" type="password" />
                        <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Change Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default ChangePassword