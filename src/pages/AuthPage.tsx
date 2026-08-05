import { useLocation } from "react-router-dom"
import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"

const AuthPage = () => {

    const { pathname } = useLocation()
    const isLogin = pathname === '/login'

    return (
        <div className="flex flex-col items-center w-full h-auto min-h-screen relative">
            {isLogin ? <Login /> : <Register />}
        </div>
    )
}

export default AuthPage