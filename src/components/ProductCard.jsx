import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { parseDescription } from '../utils/helpers';

const ProductCard = ({ product, setSelectedProduct }) => {
    const meta = parseDescription(product.description);
    const displayPrice = meta.variants.length > 0 ? meta.variants[0].price : '---';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setSelectedProduct(product)}
            className="card-premium md:p-4 p-2 flex flex-col h-full hover:shadow-2xl transition-shadow group cursor-pointer"
        >
            <div className="aspect-square rounded-[2rem] overflow-hidden mb-5 relative group-hover:shadow-lg transition-all duration-500">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=No+Img';
                    }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            <div className="flex-1 px-1">
                <h4 className="text-cat-brown font-black text-base sm:text-lg mb-2 line-clamp-2 leading-tight group-hover:text-cat-orange transition-colors uppercase tracking-tight">
                    {meta.title || product.name}
                </h4>
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-cat-teal-dark font-black text-lg sm:text-xl">
                        {displayPrice.startsWith('$') ? displayPrice : `$${displayPrice}`}
                    </span>
                    <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-cat-orange group-hover:text-white transition-all shadow-inner">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
