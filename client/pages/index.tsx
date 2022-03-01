import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { Box, Link, Stack, Heading, Text, Button, Badge, Flex, IconButton } from '@chakra-ui/react'
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import NavBar from "../components/NavBar"
import { useState } from 'react'
import Upvote from "../components/Upvote";

const Home = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({ variables })

  if (!fetching && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Box w="800px" mx="auto" p={5}>
        <NextLink href='/create-post'>
          <Button size='md' height='45px' width='120px' border='2px' my={2} colorScheme='purple' variant='outline'>
            <Link style={{ textDecoration: "none" }}>Create Post</Link>
          </Button>
        </NextLink>
        <br />
        <br />
        <Box>
          {fetching && !data ? (
            <div>Loading...</div>
          ) : (
            <Stack spacing={8}>
              {data?.posts?.posts.map((post) =>
                <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                  <Upvote post={post} />
                  <Box>
                    <Heading fontSize="xl">
                      <NextLink href={`/post/${encodeURIComponent(post.id)}`} key={post.id}>
                        <Link color='black' mr={5}>
                          {post.title}
                          <br />
                        </Link>
                      </NextLink>
                    </Heading>
                    <Badge colorScheme='purple' variant='subtle'>
                      posted by: {post.creator.username}
                    </Badge>
                  </Box>
                </Flex>
              )}
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
          <Box display="flex" h="80px" alignItems="center" justifyContent="center">
            Made with ❤️ by
            <Link href="https://github.com/theMillenniumFalcon" target="_blank" style={{ textDecoration: "none" }}>
              <pre> Nishank</pre>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Home)