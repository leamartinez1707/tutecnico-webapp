import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { getRatingColor, formatDate, averageRating } from '@/lib/utils'
import { Calendar, MessageSquare, Search, Star } from 'lucide-react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Review } from '@/types'

interface ReviewsDataProps {
    reviews: Review[]
}

const ReviewsData = ({ reviews: reviewsFiltered }: ReviewsDataProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
    const params = useParams()
    const technicianUsername = params.username || '';

    // Si se proporciona un ID de técnico, filtrar las reseñas por ese ID.
    if (technicianUsername) {
        reviewsFiltered = reviewsFiltered.filter(review => review.technician.username === technicianUsername)
    }
    // Filtrar reseñas según múltiples criterios
    const filteredReviews = reviewsFiltered && reviewsFiltered.length > 0 ?
        reviewsFiltered
            .filter((review) => review.comment.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter((review) => selectedRating === null || review.rating === selectedRating)
            .filter(() => !showVerifiedOnly || true) // Asumimos que todas están verificadas por ahora
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : null // Ordenar por fecha descendente

    // Función para manejar el filtro de rating
    const handleRatingFilter = (rating: number | null) => {
        setSelectedRating(rating)
    }

    // Función para toggle de verificadas
    const handleVerifiedToggle = () => {
        setShowVerifiedOnly(!showVerifiedOnly)
    }

    // Función para renderizar estrellas
    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Reseñas</h1>
                            <p className="text-gray-600">Opiniones y calificaciones de nuestros clientes</p>
                        </div>
                        <Link
                            className='inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium mt-4 sm:mt-0'
                            to={'/mapa'}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al panel
                        </Link>
                    </div>

                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                        {/* Calificación promedio */}
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200 justify-center">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{averageRating(reviewsFiltered).toFixed(1)}</h2>
                                    <p className="text-gray-600 font-medium">Calificación promedio</p>
                                    <div className="flex justify-center mt-2">
                                        {renderStars(Math.round(averageRating(reviewsFiltered)))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estadísticas numéricas */}
                        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{reviewsFiltered?.length}</h3>
                                    <p className="text-gray-600 text-sm font-medium">Total de reseñas</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{reviewsFiltered?.filter((r) => r.rating >= 4).length}</h3>
                                    <p className="text-gray-600 text-sm font-medium">Reseñas positivas (4+)</p>
                                </CardContent>
                            </Card>

                            {/* Distribución de calificaciones */}
                            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-2">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-900">Distribución de calificaciones</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = reviewsFiltered?.filter(r => r.rating === rating).length || 0;
                                            const percentage = reviewsFiltered?.length ? (count / reviewsFiltered.length) * 100 : 0;
                                            return (
                                                <div key={rating} className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 w-12">
                                                        <span className="text-sm font-medium text-gray-700">{rating}</span>
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Búsqueda y filtros */}
                    <Card className="bg-white border-0 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Buscar en comentarios..."
                                        className="pl-10 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-gray-600 font-medium">Filtros:</span>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`cursor-pointer transition-colors ${selectedRating === null
                                                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                                                : "bg-gray-50 hover:bg-gray-100"
                                                }`}
                                            onClick={() => handleRatingFilter(null)}
                                        >
                                            Todas
                                        </Badge>
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <Badge
                                                key={rating}
                                                variant="outline"
                                                className={`cursor-pointer transition-colors ${selectedRating === rating
                                                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                                onClick={() => handleRatingFilter(rating)}
                                            >
                                                {rating}★
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Solo verificadas</span>
                                        <div
                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${showVerifiedOnly ? "bg-blue-500" : "bg-gray-200"
                                                }`}
                                            onClick={handleVerifiedToggle}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform ${showVerifiedOnly ? "translate-x-5" : "translate-x-0.5"
                                                }`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                Mostrando {filteredReviews?.length || 0} de {reviewsFiltered?.length || 0} reseñas
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de reseñas */}
                    {filteredReviews?.length === 0 || !filteredReviews ? (
                        <Card className="bg-white border-0 shadow-sm">
                            <CardContent className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron reseñas</h3>
                                <p className="text-gray-600 max-w-md mx-auto">No hay reseñas que coincidan con tu búsqueda. Intenta con diferentes términos o filtros.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews?.map((review) => (
                                <Card key={review.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 border-2 border-gray-100">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                                            <img src={review.user.profilePhotoUrl} alt="Foto perfil de usuario" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {/* Badge de verificación */}
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold text-gray-900">{review.user.username}</h4>
                                                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">Verificado</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="flex items-center">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={`font-semibold ${getRatingColor(review.rating)}`}
                                                        >
                                                            {review.rating.toFixed(1)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(review.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Paginación simple si hay muchas reseñas */}
                    {/* {reviews?.length > 2 && (
                        <PaginationUi />
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default ReviewsData