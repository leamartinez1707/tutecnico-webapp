import { useAuth } from "@/context/AuthContext";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks";

const FavoriteIcon = ({ technicianId }: { technicianId: number }) => {
    const { user } = useAuth();
    const { data: favorites } = useFavorites();
    const addFavoriteMutation = useAddFavorite();
    const removeFavoriteMutation = useRemoveFavorite();

    if (!user || !favorites) return null;
    const favorite = favorites.find(fav => (fav.technician.id === technicianId));
    const isFavorite = !!favorite;

    const handleFavorites = async () => {
        if (isFavorite && favorite) {
            await removeFavoriteMutation.mutateAsync(technicianId);
        } else {
            await addFavoriteMutation.mutateAsync(technicianId);
        }
    };

    console.log("isFavorite:", isFavorite);
    console.log(favorites);
    return (
        <div className="w-full text-center">
            <button className={`${isFavorite ? 'bg-violet-500 hover:bg-violet-600' : 'bg-red-500 hover:bg-red-600'} hover:fill-transparent transition-colors duration-200 hover:cursor-pointer w-full rounded py-2 font-semibold text-white`} onClick={handleFavorites}>
                {isFavorite ? " Remover de favoritos" : " Agregar a favoritos"}
            </button>
        </div>
    );
};

export default FavoriteIcon;