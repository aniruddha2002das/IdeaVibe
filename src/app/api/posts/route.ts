import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunitiesIds: string[] = []

    if (session?.user.id) {
        const followedCommunities = db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                subideavide: true
            }
        })

        followedCommunitiesIds = (await followedCommunities).map((sub) => sub.subideavide.id)
    }

    try {
        const { limit, page, subideavibeName } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subideavibeName: z.string().nullish().optional(),
            })
            .parse({
                subideavibeName: url.searchParams.get('subideavibeName'),
                limit: url.searchParams.get('limit'),
                page: url.searchParams.get('page'),
            })

       

        let whereClause = {}

        if (subideavibeName) {
            whereClause = {
                subideavide: {
                    name: subideavibeName,
                },
            }
        } else if (session) {
            whereClause = {
                subideavide: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            }
        }

        // console.log("subideavibeName",subideavibeName)

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                subideavide: true,
                votes: true,
                author: true,
                comments: true
            },
            where: whereClause
        })

        // console.log("posts",posts)

        return new Response(JSON.stringify(posts))

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 400 })
        }

        return new Response('Could not fetch posts', { status: 500 })
    }

}






