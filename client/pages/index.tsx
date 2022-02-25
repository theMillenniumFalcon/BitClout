import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { Box, Link } from '@chakra-ui/react'
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import NavBar from "../components/NavBar"

const Home = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10
    }
  })
  return (
    <>
      <NavBar />
      <Box w="800px" mx="auto" bg="yellow" p={5}>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
        <br />
        <br />
        <Box>
          All Posts:
          <br />
          {!data ? (
            <div>Loading...</div>
          ) : (
            <Box>
              {data.posts?.map((post) =>
                <NextLink href={`/post/${encodeURIComponent(post.id)}`} key={post.id}>
                  <Link color='black' mr={5}>
                    {post.title}
                    <br />
                  </Link>
                </NextLink>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Home)