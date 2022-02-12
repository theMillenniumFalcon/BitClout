import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputForm from '../components/InputForm'
import { useRegisterMutation } from '../generated/graphql'
import { toErrormap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()
    return (
        <Wrapper size="small">
            <Formik initialValues={{ email: "", username: "", password: "" }} 
            // onSubmit={async (values, {setErrors}) => {
            //     const response = await register({ options: values })
            //     // * The errors we get from graphql are:
            //     // * [{field: 'username', message: 'something is wrong'}]
            //     if (response.data?.register.errors) { // * this is optional chaining
            //         setErrors(toErrormap(response.data.register.errors))
            //     } else if (response.data?.register.user) {
            //         // * worked
            //         router.push('/')
            //     }
            // }}
            onSubmit={(values) => {
                console.log(values)
            }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputForm name="username" placeholder="username" label="Username" />
                        <Box mt={4}>
                            <InputForm name="email" placeholder="email" label="Email" />
                        </Box>
                        <Box mt={4}>
                            <InputForm name="password" placeholder="password" label="Password" type="password" />
                        </Box>
                        <Button mt={4} type='submit' colorScheme='blue' isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register)