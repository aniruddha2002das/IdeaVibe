import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubideavibeValidator } from "@/lib/validators/subideavibe";
import { z } from "zod";

export async function POST(req: Request){
    try {
        const session = await getAuthSession();

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name } = SubideavibeValidator.parse(body);

        const subideavibeExists = await db.subideavibe.findFirst({
            where: {
                name: name
            }
        });

        if(subideavibeExists){
            return new Response('Subideavibe is already exists', { status: 409 });
        }

        const subideavibe = await db.subideavibe.create({
            data: {
                name,
                creatorId: session.user.id
            }
        })

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subideavideId: subideavibe.id
            }
        })

        return new Response(subideavibe.name);

    } catch (error) {
        // If any data parsing related error
        if(error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 });
        }

        return new Response('Could not create a new Subideavibe', { status: 500 });
    }
}