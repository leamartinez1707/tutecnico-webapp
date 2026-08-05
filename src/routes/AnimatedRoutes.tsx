import Loader from "@/components/loader/Loader"
import { Suspense, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./Router"

const AnimatedRoutes = () => {

    // Deshabilitar console logs en producción de manera más robusta
    useEffect(() => {
        if (import.meta.env.PROD) {
            console.log = () => { }
            console.warn = () => { }
            console.error = () => { }
            console.debug = () => { }
        }
    }, []);

    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Router />
            </Suspense>
        </BrowserRouter>
    )
}

export default AnimatedRoutes