import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { Box, Link, Stack, Heading, Text, Button } from '@chakra-ui/react'
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import NavBar from "../components/NavBar"
import { useState } from 'react'

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
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
        <br />
        <br />
        <Box>
          {fetching && !data ? (
            <div>Loading...</div>
          ) : (
            <Stack spacing={8}>
              {data?.posts?.posts.map((post) =>
                <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                  <Heading fontSize="xl">
                    <NextLink href={`/post/${encodeURIComponent(post.id)}`} key={post.id}>
                      <Link color='black' mr={5}>
                        {post.title}
                        <br />
                      </Link>
                    </NextLink>
                  </Heading>
                  <Text mt={4}>{post.textSnippet}...</Text>
                </Box>
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
        </Box>
      </Box>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Home)