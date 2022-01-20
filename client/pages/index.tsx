import { withUrqlClient } from "next-urql";
import NavBar from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";


const Home = () => {
  const [{ data }] = usePostsQuery()
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      <br />
      {!data ? <div>loading...</div> : data.posts.map((post: any) => <div key={post.id}>{post.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)