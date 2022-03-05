import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../components/InputForm'
import { useCreateGroupMutation, useUserLoggedInQuery } from '../generated/graphql'
import { useRouter } from "next/router"
import Errors from '../utils/Errors'

const CreateGroup: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const [{ data, fetching }] = useUserLoggedInQuery()
    useEffect(() => {
        if (!data?.userLoggedIn) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [fetching, data, router])
    const [, createGroup] = useCreateGroupMutation()

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ name: '', description: '' }} onSubmit={async (values, { setErrors }) => {
                    const response = await createGroup(values)
                    const { error } = response
                    if (response.data?.createGroup.errors) {
                        setErrors(Errors(response.data.createGroup.errors))
                    } if (error?.message.includes('not authenticated')) {
                        router.replace('/login')
                    } else if (response.data?.createGroup.group) {
                        router.push('/')
                    }

                }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <InputForm name="name" placeholder="name" label="Name" />
                            <Box mt={4}>
                                <InputForm name="description" placeholder="description" label="Description" />
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

