import { withUrqlClient } from "next-urql";
import { useDeletePostMutation, useGroupQuery, useGroupsQuery, usePostsQuery, useUserLoggedInQuery } from "../generated/graphql";
import { Box, Link, Stack, Heading, Button, Badge, Flex, Text } from '@chakra-ui/react'
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import NavBar from "../components/NavBar"
import { useState } from 'react'
import Upvote from "../components/Upvote";
import QueryFail from "../components/QueryFail";

const Home = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({ variables })
  const [, deletePost] = useDeletePostMutation()
  const [{ data: userLoggedInData }] = useUserLoggedInQuery()
  const [{ data: groupsData, fetching: groupsFetching }] = useGroupsQuery()
  const [{ data: groupData }] = useGroupQuery({})

  if (!fetching && !data) {
    return (
      <Box height="100vh" width="100vw">
        <QueryFail />
      </Box>
    )
  }

  return (
    <>
      <NavBar />
      <Box display="flex" flexDirection="row">
        <Box w="60%" mx="50px" p={5}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <NextLink href='/create-post'>
              <Button size='md' height='45px' width='120px' border='2px' my={4} colorScheme='red' variant='solid'>
                <Link style={{ textDecoration: "none" }}>Create Post</Link>
              </Button>
            </NextLink>
            <NextLink href='/explore-groups'>
              <Button size='md' height='45px' width='150px' border='2px' my={4} colorScheme='red' variant='solid'>
                <Link style={{ textDecoration: "none" }}>Explore Groups</Link>
              </Button>
            </NextLink>
          </Box>
          <Box>
            {fetching && !data ? (
              <div>Loading...</div>
            ) : (
              <Stack spacing={8}>
                {data?.posts?.posts.map((post) => !post ? null : (
                  <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                    <Upvote post={post} />
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Heading fontSize="xl" mb={2}>
                          <NextLink href={`/post/${encodeURIComponent(post.id)}`} key={post.id}>
                            <Link color='black' mr={5}>
                              {post.title}
                            </Link>
                          </NextLink>
                        </Heading>
                        <Badge colorScheme='purple' variant='subtle'>
                          {post.creator.username}
                        </Badge>
                      </Box>
                      {userLoggedInData?.userLoggedIn?.id !== post.creator.id ? null : (
                        <Box>
                          <Button
                            size='md'
                            height='45px'
                            width='120px'
                            border='2px'
                            colorScheme='red'
                            variant='solid'
                            onClick={() => { deletePost({ id: post.id }) }}
                          >
                            Delete Post
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                ))}
              </Stack>
            )}
            {data && data.posts.hasMore ? (
              <Button my={5} isLoading={fetching} colorScheme='red' variant='outline' onClick={() => {
                setVariables({
                  limit: variables.limit, cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                })
              }}>
                Load more
              </Button>
            ) : null}
            <Box display="flex" h="50px" alignItems="center" justifyContent="center">
              Made with ❤️ by
              <Link href="https://github.com/theMillenniumFalcon" target="_blank" style={{ textDecoration: "none" }}>
                <pre> Nishank</pre>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box w="40%" mx="50px" p={5} zIndex={1} position="sticky"
          style={{ position: "-webkit-sticky", top: "70px" }}
        >
          <Heading as='h3' size='lg' mt={2} mb={4}>Your Groups:</Heading>
          <Box>
            {groupsFetching && !groupsData ? (
              <div>Loading...</div>
            ) : (
              <>
                {userLoggedInData?.userLoggedIn?.id ? (
                  <Stack spacing={8}>
                    {groupsData?.groups?.map((group) => !group ? null : (
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
                            <Text fontSize='sm'>{group?.membersNumber}</Text>
                            <Text fontSize='xs'>
                              {group?.membersNumber !== 1 ? (
                                <div>members</div>
                              ) : (
                                <div>member</div>
                              )}
                            </Text>
                          </Badge>
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                ) : (
                  <Stack>
                    <Flex p={5} shadow="md" borderWidth="1px">
                      <Text fontSize='md'>
                        Please login to see your groups...
                      </Text>
                    </Flex>
                  </Stack>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Home)