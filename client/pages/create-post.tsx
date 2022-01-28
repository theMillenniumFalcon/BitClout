import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Wrapper from '../components/Wrapper'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Textarea } from '@chakra-ui/react'

interface createpostprops {}

const CreatePost: React.FC<{}> = ({}) => {
    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ title: '', text: '' }}
                onSubmit={async (values) => {
                    console.log(values)
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" placeholder="title" label="Title" />
                        <Box mt={4}>
                            <Textarea name="text" placeholder="text..." label="Body" />
                        </Box>
                        <Button mt={4} textarea type='submit' colorScheme='teal' isLoading={isSubmitting}>Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )

}

export default withUrqlClient(createUrqlClient)(CreatePost)

