import React, { useEffect } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Textarea } from '@chakra-ui/react'
import { useCreatePostMutation, useMeQuery } from '../generated/graphql'
import { useRouter } from "next/router"
import Layout from '../components/Layout'

const CreatePost: React.FC<{}> = ({}) => {
    const [{ data, fetching }] = useMeQuery()
    const router = useRouter()
    useEffect(() => {
        if (!data?.me) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [fetching, data, router])
    const [, createPost] = useCreatePostMutation()
    return (
        <Layout>
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
                        <InputField name="title" placeholder="title" label="Title" />
                        <Box mt={4}>
                            <Textarea textarea="true" name="text" placeholder="text..." label="Body" />
                        </Box>
                        <Button mt={4} textarea type='submit' colorScheme='teal' isLoading={isSubmitting}>Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )

}

export default withUrqlClient(createUrqlClient)(CreatePost)

