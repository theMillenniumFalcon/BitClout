import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputForm from '../components/InputForm'
import { Textarea } from '@chakra-ui/react'
import { useCreatePostMutation, useUserLoggedInQuery } from '../generated/graphql'
import { useRouter } from "next/router"

const CreatePost: React.FC<{}> = ({}) => {
    const [{ data, fetching }] = useUserLoggedInQuery()
    const router = useRouter()
    useEffect(() => {
        if (!data?.userLoggedIn) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [fetching, data, router])
    const [, createPost] = useCreatePostMutation()
    return (
        <>
            <Formik initialValues={{ title: '', text: '' }}
                onSubmit={async (values) => {
                    const { error } = await createPost({input: values})
                    if (error?.message.includes("not authenticated")) {
                        router.replace('/login')
                    } else {
                        router.push('/')
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputForm name="title" placeholder="title" label="Title" />
                        <Box mt={4}>
                            <Textarea textarea="true" name="text" placeholder="text..." label="Body" />
                        </Box>
                        <Button mt={4} textarea type='submit' colorScheme='teal' isLoading={isSubmitting}>Create Post</Button>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default withUrqlClient(createUrqlClient)(CreatePost)

