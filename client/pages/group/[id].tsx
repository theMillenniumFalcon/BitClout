import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useRouter } from 'next/router'
import { useGroupQuery, useUserLoggedInQuery } from '../../generated/graphql'
import { Box, Button, Heading, Text, Link, Badge } from '@chakra-ui/react'
import NextLink from 'next/link'
import NavBar from "../../components/NavBar"
import NoPage from '../../components/NoPage'

interface GroupProps { }

const Group: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const Id = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{ data, error, fetching }] = useGroupQuery({
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
    if (!data?.group) {
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
                            <Heading as='h3' size='lg' mb={4}>{data.group.name}</Heading>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Badge variant='outline' colorScheme='red' mr={4}>
                                    <Text fontSize='sm'>{data?.group?.membersNumber}</Text>
                                    <Text fontSize='xs'>
                                        {data?.group?.membersNumber !== 1 ? (
                                            <div>members</div>
                                        ) : (
                                            <div>member</div>
                                        )}
                                    </Text>
                                </Badge>
                            </Box>
                            <Button
                                size='md'
                                height='45px'
                                width='120px'
                                border='2px'
                                colorScheme='red'
                                variant='solid'
                                onClick={() => { }}
                            >
                                Join Group
                            </Button>
                        </Box>
                    </Box>
                    <Text fontSize='md'>{data?.group?.description}</Text>
                </Box>
            </Box>
        </>
    )

}

export default withUrqlClient(createUrqlClient)(Group)
