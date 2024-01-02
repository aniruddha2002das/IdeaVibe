import { MiniCreatePost } from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
  params: {
    slug: string
  }
}


const Page = async ({ params } : Props) => {

  const { slug } = params;

  const session = await getAuthSession();

  const subideavibe = await db.subideavibe.findFirst({ 
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subideavide: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS
      }
    }
  })

  // console.log(subideavibe?.name)


  if(!subideavibe){
    return notFound();
  }

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subideavibe.name}
      </h1>

      <MiniCreatePost session={session}/>

      <PostFeed subideavibeName={subideavibe.name} initialPosts={subideavibe.posts}/>
    </>
  )
}

export default Page


