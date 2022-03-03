import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Navbar from '../components/NavBar'
import NextLink from 'next/link'
import { useGroupsQuery } from "../generated/graphql";
import { Box, Flex, Stack, Link, Button, Heading, Text, Badge } from '@chakra-ui/react'
import QueryFail from '../components/QueryFail'

interface exploregroupsProps { }

const ExploreGroups: React.FC<exploregroupsProps> = ({ }) => {
    const [{ data, fetching }] = useGroupsQuery()

    if (!fetching && !data) {
        return (
            <Box height="100vh" width="100vw">
                <QueryFail />
            </Box>
        )
    }

    return (
        <>
            <Navbar />
            <Box w="650px" mx="auto" p={5}>
                <NextLink href='/create-group'>
                    <Button size='md' height='45px' width='120px' border='2px' my={4} colorScheme='red' variant='solid'>
                        <Link style={{ textDecoration: "none" }}>Create Group</Link>
                    </Button>
                </NextLink>
                <Box>
                    {fetching && !data ? (
                        <div>Loading...</div>
                    ) : (
                        <Stack spacing={8}>
                            {data?.groups?.map((group) => !group ? null : (
                                <Flex key={group.id} p={5} shadow="md" borderWidth="1px" align="center" justify="space-between">
                                    <Box>
                                        <Heading fontSize="xl" mb={2}>
                                            <NextLink href={`/group/${encodeURIComponent(group.id)}`} key={group.id}>
                                                <Link color='black' mr={5}>
                                                    {group.name}
                                                </Link>
                                            </NextLink>
                                        </Heading>
                                        <Text fontSize='md'>{group.description}</Text>
                                    </Box>
                                    <Box>
                                        <Badge variant='outline' colorScheme='red' mr={4}>
                                            <Text fontSize='sm'>69</Text>
                                            <Text fontSize='xs'>members</Text>
                                        </Badge>
                                    </Box>
                                </Flex>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default withUrqlClient(createUrqlClient)(ExploreGroups)