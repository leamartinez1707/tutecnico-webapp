import DashboardUi from "@/components/technician/DashboardUI"
import UserDashboardNew from "@/components/user/UserDashboardNew"
import { useAuth } from "@/context/AuthContext"
import { useLocation } from "react-router-dom"
import { userPaths } from "@/routes/routesConfig"

const DashboardPage = () => {
    const { user } = useAuth()
    const location = useLocation()

    if (location.pathname === userPaths.map) {
        return <UserDashboardNew />
    }

    return (
        <div>
            {user?.technician ? <DashboardUi /> : <UserDashboardNew />}
        </div>
    )
}

export default DashboardPage;