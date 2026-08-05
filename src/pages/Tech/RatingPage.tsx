import { useParams } from "react-router-dom"
import { TechnicianDetail } from "@/components/technician/TechnicianDetail"
import { useReviewsByTechnician } from "@/hooks"
import ReviewsData from "@/components/reviews/ReviewsData"
import { useAuth } from "@/context/AuthContext"

export const RatingPage = () => {
    const { username } = useParams<{ username: string }>();
    const { user } = useAuth()

    // Obtener reviews según el tipo de usuario
    const { data: reviews = [] } = useReviewsByTechnician(user?.username);

    // Si hay username en la URL, mostrar el perfil del técnico
    if (username) {
        return <TechnicianDetail />;
    }

    if (!user) return null; // Ensure user is defined before proceeding

    // Transform reviews to match ReviewItem interface
    const transformedReviews = reviews.map(review => ({
        ...review,
        technician: {
            ...review.technician,
            username: review.user?.username || ''
        }
    }));

    return (
        <ReviewsData
            reviews={transformedReviews}
        />
    )
}

export default RatingPage;

