import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { Link } from "@chakra-ui/react";
import NavBar from "../components/NavBar"

const Home = () => {
  const [{ data }] = usePostsQuery()
  return (
    <>
      <NavBar />
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)