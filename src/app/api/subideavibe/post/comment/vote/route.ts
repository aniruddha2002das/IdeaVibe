import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";


export async function PATCH(req: Request){
    try {
        const body = await req.json();

        const { commentId,voteType } = CommentVoteValidator.parse(body);

        const session = await getAuthSession();

        if(!session?.user.id){
            return new Response('Unauthorized', { status: 401 })
        }

        // //! check if user has already voted on this post

        const existingVote = await db.commentVote.findFirst({
            where: {
                commentId,
                userId: session.user.id
            }
        })

        if(existingVote){

            //! if vote type is the same as existing vote, delete the vote
            if(existingVote.type === voteType){
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    }
                })
            }
            else if(existingVote.type !== voteType){
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
            }

            return new Response("OK", { status: 200 })
                
        }

        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId
            }
        })

        return new Response("OK", { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response(
            'Could not vote to reply at this time. Please try later',
            { status: 500 }
        )
    }
}