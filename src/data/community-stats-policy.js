import { __resolveReferencedExerciseId, __resolveReferencedUserId } from "./type-policies";



export const CommunityStatsPolicy = {
    BaseStat: {
        fields: {
            e: __resolveReferencedExerciseId,
            by: __resolveReferencedUserId
        }
    }
} 