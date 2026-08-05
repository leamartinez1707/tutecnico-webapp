import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
        <section className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-zinc-900 to-black relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute -inset-10 opacity-20 pointer-events-none select-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
            </div>

            <h1 className="text-[8rem] md:text-[10rem] font-extrabold text-white tracking-widest drop-shadow-lg z-10">404</h1>
            <div className="bg-zinc-800/70 px-6 py-3 text-lg rounded-full shadow-lg text-zinc-200 font-semibold mb-8 z-10 border border-zinc-700">
                Página no encontrada
            </div>
            <Link to="/" className="z-10">
                <button
                    className="relative px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg border-2 border-blue-700 transition-colors duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                    Volver al inicio
                </button>
            </Link>
        </section>
    )
}

export default NotFoundPage