import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { withUrqlClient } from "next-urql"
import React, { useState } from "react"
import InputForm from "../components/InputForm"
import Layout from "../components/Layout"
import Wrapper from "../components/Wrapper"
import { useForgotPasswordMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    return (
        <Wrapper size="small">
            <Formik initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword(values)
                    setComplete(true)
                }}>
                {({ isSubmitting }) => complete ? (
                    <Box>Check your inbox</Box>
                ) : (
                    <Form>
                        <InputForm name="email" placeholder="email" label="Email" />
                        <Button mt={4} type='submit' colorScheme='blue' isLoading={isSubmitting}>Forgot Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)