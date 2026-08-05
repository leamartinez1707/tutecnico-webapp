

import { Outlet } from "react-router-dom"
import InstallPrompt from "../components/ui/InstallPrompt"
import ConnectionStatus from "../components/ui/ConnectionStatus"
import { Footer } from "@/components/footer/Footer"
import { Header } from "@/components/header/Header"
import ScrollToTop from "../components/ui/ScrollToTop"



const MainLayout = () => {

    return (
        <div className="overflow-x-hidden w-full">
            <ScrollToTop />
            <Header />
            <ConnectionStatus />
            <main className="min-h-lvh mx-auto mt-16 md:mt-18 w-full">
                <Outlet />
            </main>
            <Footer />
            <InstallPrompt />
        </div>
    )
}

export default MainLayout