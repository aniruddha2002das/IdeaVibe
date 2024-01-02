import CommentsSection from "@/components/CommentsSection"
import EditorOutput from "@/components/EditorOutput"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { buttonVariants } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'


const SubIdeaVibePostPage = async ({ params }: PageProps) => {

  const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId
      },
      include: {
        votes: true,
        author: true
      }
    })
  }

  if (!post && !cachedPost) {
    return notFound();
  }

  //* We mainly use this PostVoteServer component to get actual votes amount from database. Because we are showing cache data from redis. Redis doesn't store actual vote amount. So we need to get it from database. We are showing cache data that never be changed like author name, post title, body. But vote amount is not always same. So we use this server component to only query get current vote amount and type. And PostVoteCLient only control after click button what action will perform. So PostVoteServer only works to find actual vote and send it to PostVoteClient component. PostVoteClient component only works is to show data and control what action will perform after click button.

   /*1) Static data direct showing 
   2) To show actual vote amount we go to PostVoteClient component via PostVoteServer component.
   3) PostVoteServer component is dowing database query. So it may take time. So to handle this stuff we are use Suspense. We rendering PostVoteShell component until PostVoteServer component is not send data PostClientComponent and PostClientComponent does not data in UI. */

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>

        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error on server component */}
          <PostVoteServer postId={post?.id ?? cachedPost?.id} getData={async () => {
            return await db.post.findUnique({
              where: {
                id: params.postId
              },
              include: {
                votes: true
              }
            })
          }} />
        </Suspense>

        <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
          <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />


          <Suspense fallback={<Loader2 className=" h-5 w-5 animate-spin text-zinc-500"/>}>
            {/* @ts-expect-error server component*/}
            <CommentsSection postId={post?.id ?? cachedPost?.id}/>
          </Suspense>

        </div>

      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}


export default SubIdeaVibePostPage;



