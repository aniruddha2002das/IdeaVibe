"use client";

import { ExtendedPost } from "@/types/db";
import React, { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subideavibeName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subideavibeName }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // console.log("hey")
  // console.log("subideavibeName", subideavibeName)
  // console.log("subideavibeName", subideavibeName)


  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subideavibeName ? `&subideavibeName=${subideavibeName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage])

  //? --> data.pages --> [[post1,post2,post3], [post4,post5,post6], [post7,post8,post9]]
  //? --> flatMap --> [post1,post2,post3,post4,post5,post6,post7,post8,post9]
  //? --> [post1,post2,post3] --> is a page

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const VotesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index == posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                voteAmt={VotesAmt}
                key={post.id}
                commentAmt={post.comments.length}
                subideavibeName={post.subideavide.name}
                post={post}
              />
            </li>
          );
        } else {
          return (
            <Post
              currentVote={currentVote}
              voteAmt={VotesAmt}
              key={post.id}
              commentAmt={post.comments.length}
              subideavibeName={post.subideavide.name}
              post={post}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <li className='flex justify-center'>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}

    </ul>
  );
};

export default PostFeed;
