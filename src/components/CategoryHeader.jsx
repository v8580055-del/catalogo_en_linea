import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const CategoryHeader = ({ user, onBrandClick }) => {
    return (
        <div className="px-6 pt-12 pb-6 flex justify-between items-center sm:px-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-cat-brown sm:text-4xl uppercase tracking-tighter">
                    Hola, {user ? user.given_name : 'Cliente'} 👋
                </h2>
                <p className="text-slate-500 text-xs sm:text-lg font-medium opacity-70">Explora nuestro catálogo exclusivo</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 group cursor-pointer"
            >
                {/* <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cat-orange leading-none mb-1">Tu Tienda</p>
                    <p className="text-lg font-black text-cat-brown leading-none">FAVORITA</p>
                </div> */}
                <div
                    onClick={onBrandClick}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-cat-orange rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-cat-orange/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <ShoppingBag size={28} className="sm:size-[32px]" />
                </div>
            </motion.div>
        </div>
    );
};

export default CategoryHeader;
