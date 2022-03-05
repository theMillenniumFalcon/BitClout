import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { Box, Button, Text } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../../../components/InputForm'
import { Textarea } from '@chakra-ui/react'
import { usePostQuery, useUpdatePostMutation, useUserLoggedInQuery } from '../../../generated/graphql'
import { useRouter } from "next/router"
import NoPage from '../../../components/NoPage'

interface EditPageProps { }

const EditPost: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const Id = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{ data, error }] = usePostQuery({
        pause: Id === -1,
        variables: {
            id: Id
        }
    })
    const [{ data: userLoggedInData, fetching: userLoggedInFetching }] = useUserLoggedInQuery()
    const [, updatePost] = useUpdatePostMutation()

    if (userLoggedInFetching) {
        return (
            <Box w="800px" mx="auto" p={5}>Loading...</Box>
        )
    }
    if (error) {
        return (
            <Box w="800px" mx="auto" p={5}>{error.message}</Box>
        )
    }
    if (!data?.post) {
        return (
            <Box height="100vh" width="100vw">
                <NoPage />
            </Box>

        )
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ title: data.post.title, text: data.post.text }} onSubmit={async (values, { setErrors }) => {
                    updatePost({ id: Id, ...values })
                    router.back()
                }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <InputForm name="title" placeholder="title" label="Title" />
                            <Box mt={4}>
                                <InputForm textarea name="text" placeholder="text..." label="Body" />
                            </Box>
                            <Button mt={4} type='submit' colorScheme='red' isLoading={isSubmitting}>Edit Post</Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )

}

export default withUrqlClient(createUrqlClient)(EditPost)