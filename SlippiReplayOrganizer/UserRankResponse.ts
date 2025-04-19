import { ZodObject, ZodType, z } from 'zod'
export const UserRankResponseSchema = z.object({
    data: z.object({
        getConnectCode: z.object({
            user: z.object({
                rankedNetplayProfile: z.object({
                    ratingOrdinal: z.number()
                })
            })
        })
    })
});
export type UserRankResponse = z.infer<typeof UserRankResponseSchema>;