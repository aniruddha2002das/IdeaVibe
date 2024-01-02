import { z } from 'zod';

export const SubideavibeValidator = z.object({
    name: z.string().min(3).max(21)
})

export const SubideavibeSubscriptionValidator = z.object({
    subideavibeId : z.string()
})

export type CreatesubideavibePayload = z.infer<typeof SubideavibeValidator>
export type SubscribeToSubideavibePayload = z.infer<typeof SubideavibeSubscriptionValidator>

