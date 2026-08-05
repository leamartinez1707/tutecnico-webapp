import DashboardUi from "@/components/technician/DashboardUI"
import UserDashboardNew from "@/components/user/UserDashboardNew"
import { useAuth } from "@/context/AuthContext"

const DashboardPage = () => {
    const { user } = useAuth()
    return (
        <div>
            {user?.technician ? <DashboardUi /> : <UserDashboardNew />}
        </div>
    )
}

export default DashboardPage;