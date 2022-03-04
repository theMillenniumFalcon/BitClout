import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button, Select, Text } from '@chakra-ui/react'
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
                }}>
                    {({ isSubmitting }) => (
                        <Box>
                            <Box>
                                <Select placeholder='Select a group' variant='filled' width="200px" mb={3}>
                                    {groupsData?.groups?.map((group) => !group ? null : (
                                        <option value='option1'>{group?.name}</option>
                                    ))}
                                </Select>
                            </Box>
                            <Form>
                                <Text mb='7px' fontSize='md'>Title</Text>
                                <InputForm name="title" placeholder="title" label="" />
                                <Box mt={4}>
                                    <Text mb='7px' fontSize='md'>Body</Text>
                                    <Textarea name="text" placeholder="text..." />
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

