import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useRouter } from 'next/router'
import { usePostQuery } from '../../generated/graphql'
import { Box, Heading, Text } from '@chakra-ui/react'
import NavBar from "../../components/NavBar"
import NoPage from '../../components/NoPage'

interface PageProps { }

const Post: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const Id = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{ data, error, fetching }] = usePostQuery({
        pause: Id === -1,
        variables: {
            id: Id
        }
    })
    if (fetching) {
        return (
            <>
                <NavBar />
                <Box w="800px" mx="auto" p={5}>Loading...</Box>
            </>
        )
    }
    if (error) {
        return (
            <>
                <NavBar />
                <Box w="800px" mx="auto" p={5}>{error.message}</Box>
            </>
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
        <>
            <NavBar />
            <Box w="800px" mx="auto" p={5}>
                <Box p={5} shadow="md" borderWidth="1px">
                    <Heading as='h3' size='lg' mb={4}>{data.post.title}</Heading>
                    <Text fontSize='md'>{data?.post?.text}</Text>
                </Box>
            </Box>
        </>
    )

}

export default withUrqlClient(createUrqlClient)(Post)

