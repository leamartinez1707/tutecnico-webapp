export interface ReviewsResponse {
    items: ReviewItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    date: string;
    user: {
        id: number;
        username: string;
        profilePhotoUrl?: string;
    };
    technician: {
        id: number;
        username: string;
        specialization: string;
        services: string[];
        profilePhotoUrl?: string;
    };
}
