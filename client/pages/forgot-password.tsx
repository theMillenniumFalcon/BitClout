import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { withUrqlClient } from "next-urql"
import React, { useState } from "react"
import InputForm from "../components/InputForm"
import { useForgotPasswordMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ email: "" }}
                    onSubmit={async (values) => {
                        await forgotPassword(values)
                        setComplete(true)
                    }}>
                    {({ isSubmitting }) => complete ? (
                        <Box>Please check your inbox</Box>
                    ) : (
                        <Form>
                            <InputForm name="email" placeholder="email" label="Enter yor registered email" />
                            <Button mt={4} type='submit' colorScheme='red' isLoading={isSubmitting}>Forgot Password</Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)