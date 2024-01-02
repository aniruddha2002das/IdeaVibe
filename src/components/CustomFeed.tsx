import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db"
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {

  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      subideavide: true
    }
  })

  const posts = await db.post.findMany({
    where: {
      subideavide: {
        name: {
          in: followedCommunities.map((community) => community.subideavide.id)
        }
      }
    },
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

  // const temp = posts[posts.length - 1]; 
  // console.log(posts);

  return (
    <PostFeed initialPosts={posts}/>
  )
}

export default CustomFeed