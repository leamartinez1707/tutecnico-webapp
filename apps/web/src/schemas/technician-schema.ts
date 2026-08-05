import { z } from "zod";

export const ReviewSchema = z.object({
    "id": z.number(),
    "rating": z.number(),
    "comment": z.string(),
    "date": z.coerce.date(),
});

export const TechReviewSchema = z.object({
    "specialization": z.string(),
    "services": z.array(z.string()),
    "id": z.number(),
    "latitude": z.string(),
    "longitude": z.string(),
    "username": z.string(),
    "firstName": z.string(),
    "lastName": z.string(),
    "phone": z.string(),
    "email": z.string(),
    "address": z.string(),
    "reviews": z.array(ReviewSchema),
    "bookings": z.array(z.any()),
});