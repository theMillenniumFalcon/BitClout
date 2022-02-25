import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../components/InputForm'
import { Textarea } from '@chakra-ui/react'
import { useCreatePostMutation, useUserLoggedInQuery } from '../generated/graphql'
import { useRouter } from "next/router"
import Errors from '../utils/Errors'

const CreatePost: React.FC<{}> = ({ }) => {
    const [{ data, fetching }] = useUserLoggedInQuery()
    const router = useRouter()
    useEffect(() => {
        if (!data?.userLoggedIn) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [fetching, data, router])
    const [, createPost] = useCreatePostMutation()
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ title: '', text: '' }} onSubmit={async (values, { setErrors }) => {
                    const response = await createPost(values)
                    const { error } = response
                    if (response.data?.createPost.errors) {
                        setErrors(Errors(response.data.createPost.errors))
                    } if (error?.message.includes('not authenticated')) {
                        router.replace('/login')
                    } else if (response.data?.createPost.post) {
                        router.push('/')
                    }
                }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <InputForm name="title" placeholder="title" label="Title" />
                            <Box mt={4}>
                                <Textarea textarea="true" name="text" placeholder="text..." label="Body" />
                            </Box>
                            <Button mt={4} textarea type='submit' colorScheme='red' isLoading={isSubmitting}>Create Post</Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )

}

export default withUrqlClient(createUrqlClient)(CreatePost)

