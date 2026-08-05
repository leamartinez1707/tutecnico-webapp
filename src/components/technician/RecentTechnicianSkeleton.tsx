const RecentTechnicianSkeleton = () => {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-700 rounded-2xl" />
            <div className="p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-4" />
                <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-700 rounded-full w-20" />
                    <div className="h-6 bg-gray-700 rounded-full w-16" />
                    <div className="h-6 bg-gray-700 rounded-full w-12" />
                </div>
                <div className="h-4 bg-gray-600 rounded w-full mb-2" />
                <div className="h-4 bg-gray-600 rounded w-5/6" />
            </div>
        </div>
    )
}

export default RecentTechnicianSkeleton