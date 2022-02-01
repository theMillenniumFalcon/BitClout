import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { Link } from "@chakra-ui/react";

const Home = () => {
  const [{ data }] = usePostsQuery({
    variables: { limit: 10 }
  })
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? <div>loading...</div> : data.posts.map((post: any) => <div key={post.id}>{post.title}</div>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)