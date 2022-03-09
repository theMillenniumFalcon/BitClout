import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useRouter } from 'next/router'
import { useDeleteGroupMutation, useGroupQuery, useMemberMutation, useUserLoggedInQuery } from '../../generated/graphql'
import { Box, Button, Heading, Text, IconButton, Badge, Stack, Flex } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import NavBar from "../../components/NavBar"
import NoPage from '../../components/NoPage'
import NextLink from 'next/link'

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
    const [, member] = useMemberMutation()
    const [, deleteGroup] = useDeleteGroupMutation()
    const realValue = (data?.group?.membersnumber) as any + 1

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
                                    <Text fontSize='sm'>{data?.group?.membersnumber}</Text>
                                    <Text fontSize='xs'>
                                        {data?.group?.membersnumber !== 1 ? (
                                            <div>members</div>
                                        ) : (
                                            <div>member</div>
                                        )}
                                    </Text>
                                </Badge>
                            </Box>
                            <Box>
                                {userLoggedInData?.userLoggedIn?.id === data?.group.creatorId ? null : (
                                    <Button
                                        size='md'
                                        height='45px'
                                        width='120px'
                                        border='2px'
                                        colorScheme='red'
                                        variant='solid'
                                        mr={4}
                                        onClick={async () => {
                                            await member({
                                                groupId: (data?.group?.id) as number,
                                                value: realValue
                                            })
                                        }}
                                    >
                                        Join Group
                                    </Button>
                                )}
                            </Box>
                            <Box>
                                {userLoggedInData?.userLoggedIn?.id !== data?.group.creatorId ? null : (
                                    <Box>
                                        <NextLink href={`/group/edit/${encodeURIComponent(data.group.id)}`}>
                                            <IconButton
                                                colorScheme='red'
                                                aria-label='Edit group'
                                                size='lg'
                                                height='45px'
                                                mr={4}
                                                icon={<EditIcon />}
                                            />
                                        </NextLink>
                                        <IconButton
                                            colorScheme='red'
                                            aria-label='Delete group'
                                            size='lg'
                                            height='45px'
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                deleteGroup({ id: (data?.group?.id) as any })
                                                router.replace('/')
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Text fontSize='md' mb={3}>{data?.group?.description}</Text>
                    <Stack spacing={8}>
                        {data?.group.posts?.map((post) => !post ? null : (
                            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Heading fontSize="xl">
                                            <NextLink href={`/post/${encodeURIComponent(post.id)}`} key={post.id}>
                                                {post.title}
                                            </NextLink>
                                        </Heading>
                                    </Box>
                                </Box>
                            </Flex>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </>
    )

}

export default withUrqlClient(createUrqlClient)(Group)
