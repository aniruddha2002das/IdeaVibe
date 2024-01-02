import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db"
import PostFeed from "./PostFeed";

const GeneralFeed = async () => {

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      subideavide: true,
      comments: true
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS
  }); 

  return (
    <PostFeed initialPosts={posts}/>
  )
}

export default GeneralFeed