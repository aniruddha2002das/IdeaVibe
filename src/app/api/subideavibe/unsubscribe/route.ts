import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubideavibeSubscriptionValidator } from "@/lib/validators/subideavibe";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session  = await getAuthSession();
        if(!session?.user){
            return new Response("Unauthorized", { status: 401 });
        }
        

        const body = await req.json();

        const { subideavibeId } = SubideavibeSubscriptionValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subideavideId: subideavibeId,
                userId: session.user.id
            }
        })

        if(!subscriptionExists){
            return new Response("You are not subscribed to this subideavibe", { status: 400 });
        }

        //! check if the user is the owner of the subideavibe
        const subideavibe = await db.subideavibe.findFirst({
            where: {
                id: subideavibeId,
                creatorId: session.user.id,
            }
        })

        if(subideavibe){
            return new Response("You are the owner of this subideavibe, you can't unsubscribe", { status: 400 });
        }

        await db.subscription.delete({
            where: {
                userId_subideavideId: {
                    subideavideId: subideavibeId,
                    userId: session.user.id
                }
            }
        })

        return new Response(subideavibeId);

    } catch (error) {
        // If any data parsing related error
        if(error instanceof z.ZodError) {
            return new Response("Invalid request data is passed!", { status: 422 });
        }

        return new Response('Could not unsubscribe, please try latter.', { status: 500 });
    }
}