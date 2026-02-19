import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Heart, Target, Star, Instagram, Facebook } from 'lucide-react';

const BrandInfo = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto"
        >
            {/* Elegant Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-6 sm:px-12 flex items-center justify-between">
                <button
                    onClick={onClose}
                    className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-cat-brown hover:bg-slate-100 active:scale-95 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cat-orange leading-none mb-1">Sobre Nosotros</span>
                    <h2 className="text-xl font-black text-cat-brown uppercase tracking-tighter">Nuestra Marca</h2>
                </div>
                <div className="w-12" /> {/* Spacer for centering */}
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 sm:px-12">

                {/* Hero Section */}
                <div className="relative rounded-[3rem] overflow-hidden bg-cat-orange/5 p-12 mb-16 text-center">
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-cat-orange rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-cat-orange/30 mx-auto mb-8 transform -rotate-6">
                            <ShoppingBag size={48} />
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-cat-brown mb-6 tracking-tighter uppercase">Pasión por lo <br />Personalizado</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                            Creamos más que productos; diseñamos recuerdos tangibles. Cada detalle está pensado para reflejar tu personalidad y hacer cada momento único.
                        </p>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cat-orange/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cat-teal-light/20 rounded-full blur-3xl" />
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-black text-cat-brown mb-3 uppercase tracking-tight">Hecho con Amor</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Dedicamos tiempo y cuidado a cada pieza que sale de nuestro taller.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target size={32} />
                        </div>
                        <h3 className="text-xl font-black text-cat-brown mb-3 uppercase tracking-tight">Precisión</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Calidad garantizada en cada impresión y acabado de nuestros productos.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Star size={32} />
                        </div>
                        <h3 className="text-xl font-black text-cat-brown mb-3 uppercase tracking-tight">Exclusividad</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Diseños únicos que no encontrarás en ningún otro catálogo.</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-16">
                    <section>
                        <h2 className="text-3xl font-black text-cat-brown mb-8 uppercase tracking-tighter flex items-center gap-4">
                            <span className="w-12 h-1 bg-cat-orange rounded-full" /> Nuestra Historia
                        </h2>
                        <div className="prose prose-lg text-slate-600 font-medium leading-relaxed max-w-none">
                            <p>
                                Comenzamos como un pequeño proyecto familiar con un sueño simple: traer color y personalización a los objetos cotidianos. Hoy, nos enorgullece ser el destino favorito de quienes buscan un regalo especial o un detalle único para su hogar u oficina.
                            </p>
                            <p className="mt-4">
                                Trabajamos con los mejores materiales para asegurar que tus productos no solo se vean bien hoy, sino que duren por mucho tiempo rescatando esos momentos especiales.
                            </p>
                        </div>
                    </section>

                    {/* Social links / Contact */}
                    <section className="bg-cat-teal-dark rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl font-black text-center uppercase tracking-tighter mb-2">¡Síguenos en redes!</h2>
                            <p className="text-white/60 font-medium text-center">Entérate de nuestras novedades y procesos.</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all">
                                <Instagram size={32} />
                            </a>
                            <a href="#" className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all">
                                <Facebook size={32} />
                            </a>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-24 text-center pb-12">
                    <p className="text-slate-400 text-xs text-center font-black uppercase tracking-[0.5em] mb-4">Hecho con Pasión</p>
                    <p className="text-cat-brown text-sm text-center font-bold">© 2026 - Catálogo Exclusivo</p>
                </div>
            </div>
        </motion.div>
    );
};

export default BrandInfo;
