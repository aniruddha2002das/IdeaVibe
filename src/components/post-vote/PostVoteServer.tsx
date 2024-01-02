import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import PostVoteClient from "./PostVoteClient";
import { getAuthSession } from "@/lib/auth";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

// const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

//! We mainly use this PostVoteServer component to get actual votes amount from database. Because we are showing cache data from redis. Redis doesn't store actual vote amount. So we need to get it from database. We are showing cache data that never be changed like author name, post title, body. But vote amount is not always same. So we use this server component to only query get current vote amount and type. And PostVoteCLient only control after click button what action will perform.

const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    // await wait(3000);
    const post = await getData();

    if (!post) {
      return notFound();
    }

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;

  } else {
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }


  return (
    <PostVoteClient
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
      postId={postId}
    />
  );
};

export default PostVoteServer;
