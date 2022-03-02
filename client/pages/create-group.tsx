import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button, Text } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../components/InputForm'
import { Textarea } from '@chakra-ui/react'
import { useCreatePostMutation, useUserLoggedInQuery } from '../generated/graphql'
import { useRouter } from "next/router"
import Errors from '../utils/Errors'

const CreateGroup: React.FC<{}> = ({ }) => {

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ name: '' }} onSubmit={async (values, { setErrors }) => {

                }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Text mb='7px' fontSize='md'>Name</Text>
                            <InputForm name="name" placeholder="name" label="" />
                            <Box mt={4}>
                                <Text mb='7px' fontSize='md'>Description</Text>
                                <InputForm name="description" placeholder="description" label="" />
                            </Box>
                            <Button mt={4} type='submit' colorScheme='red' isLoading={isSubmitting}>Create Group</Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )

}

export default withUrqlClient(createUrqlClient)(CreateGroup)

