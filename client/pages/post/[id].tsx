import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useRouter } from 'next/router'
import { usePostQuery, useUserLoggedInQuery } from '../../generated/graphql'
import { Box, Button, Heading, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import NavBar from "../../components/NavBar"
import NoPage from '../../components/NoPage'
import Upvote from '../../components/Upvote'

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
    const [{ data: userLoggedInData }] = useUserLoggedInQuery()

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
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Upvote post={data.post} />
                            <Heading as='h3' size='lg' mb={4}>{data.post.title}</Heading>
                        </Box>
                        {userLoggedInData?.userLoggedIn?.id !== data.post.creator.id ? null : (
                            <NextLink href={`/post/edit/${encodeURIComponent(data.post.id)}`}>
                                <Button
                                    size='md'
                                    height='45px'
                                    width='120px'
                                    border='2px'
                                    colorScheme='red'
                                    variant='solid'
                                    onClick={() => { }}
                                >
                                    <Link style={{ textDecoration: "none" }}>Edit Post</Link>
                                </Button>
                            </NextLink>
                        )}
                    </Box>
                    <Text fontSize='md'>{data?.post?.text}</Text>
                </Box>
            </Box>
        </>
    )

}

export default withUrqlClient(createUrqlClient)(Post)

