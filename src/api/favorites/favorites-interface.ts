import { UserFavorites } from "@/types"

export interface UserFavoritesResponse {
    items: UserFavorites[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}