import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button, Text, Select } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../components/InputForm'
import { Textarea } from '@chakra-ui/react'
import { useCreatePostMutation, useGroupsQuery, useUserLoggedInQuery } from '../generated/graphql'
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
    const [{ data: groupsData }] = useGroupsQuery()

    const [, createPost] = useCreatePostMutation()
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgGradient='linear(to-b, rgba(0, 0, 0, 0) 0%, rgba(90, 0, 0, 1) 100%)'
        >
            <Box w="700px" mx="auto" bg="white" p={7} borderRadius='20px'>
                <Formik initialValues={{ title: '', text: '', groupId: 0 }} onSubmit={async (values, { setErrors }) => {
                    const response = await createPost(values)
                    const { error } = response
                    if (response.data?.createPost.errors) {
                        setErrors(Errors(response.data.createPost.errors))
                    } if (error?.message.includes('not authenticated')) {
                        router.replace('/login')
                    } else if (response.data?.createPost.post) {
                        router.push('/')
                    }
                    console.log(values)
                }}>
                    {({ isSubmitting }) => (
                        <Box>
                            <Form>
                                <InputForm select name="groupId" placeholder='Select a group' width="200px" label="Select a group">
                                    {groupsData?.groups?.map((group) => !group ? null : (
                                        <option key={group?.id} value={group?.id}>{group?.name}</option>
                                    ))}
                                </InputForm>
                                <Box mt={4}>
                                    <InputForm name="title" placeholder="title" label="Title" />
                                </Box>
                                <Box mt={4}>
                                    <InputForm textarea name="text" placeholder="text..." label="Body" />
                                </Box>
                                <Button mt={4} type='submit' colorScheme='red' isLoading={isSubmitting}>Create Post</Button>
                            </Form>
                        </Box>
                    )}
                </Formik>
            </Box>
        </Box>
    )

}

export default withUrqlClient(createUrqlClient)(CreatePost)

