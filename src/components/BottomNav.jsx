import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User, Clock } from 'lucide-react';

const BottomNav = ({ isHidden, onHomeClick, onBrandClick, onSearchClick, onRecentClick, onProfileClick }) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pointer-events-none transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="max-w-2xl mx-auto bg-white/90 backdrop-blur-2xl border border-white/50 px-8 py-5 flex justify-between items-center rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] pointer-events-auto"
            >
                <button
                    onClick={onHomeClick}
                    className="nav-pill nav-pill-active hover:scale-110 transition-transform"
                >
                    <Home size={26} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Inicio</span>
                </button>
                <button
                    onClick={onSearchClick}
                    className="nav-pill hover:text-cat-brown hover:scale-110 transition-transform"
                >
                    <Search size={26} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Buscar</span>
                </button>
                <div
                    onClick={onBrandClick}
                    className="bg-cat-orange p-4 rounded-3xl shadow-2xl shadow-cat-orange/40 -mt-20 text-white cursor-pointer hover:rotate-12 hover:scale-110 active:scale-90 transition-all font-black"
                >
                    <ShoppingBag size={32} />
                </div>
                <button
                    onClick={onRecentClick}
                    className="nav-pill hover:text-cat-brown hover:scale-110 transition-transform"
                >
                    <Clock size={26} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Vistos</span>
                </button>
                <button
                    onClick={onProfileClick}
                    className="nav-pill hover:text-cat-brown hover:scale-110 transition-transform"
                >
                    <User size={26} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
                </button>
            </motion.div>
        </div>
    );
};

export default BottomNav;
