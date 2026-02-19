import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ShoppingBag, MessageCircle, Facebook } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';
import { parseDescription } from '../utils/helpers';

const ProductDetail = ({ selectedProduct, setSelectedProduct, selectedVariant, setSelectedVariant, isZoomed, setIsZoomed, activeCategory }) => {
    if (!selectedProduct) return null;

    const selectedProductData = parseDescription(selectedProduct.description);

    const handleWhatsApp = (productName, variant = null, imageUrl = null) => {
        let messageBody = `${CONTACT_CONFIG.MESSAGE} ${productName}`;
        if (variant) messageBody += ` (${variant.name} - ${variant.price})`;
        if (imageUrl) messageBody += `\n\nReferencia del producto: ${imageUrl}`;

        const message = encodeURIComponent(messageBody);
        window.open(`https://wa.me/${CONTACT_CONFIG.WHATSAPP}?text=${message}`, '_blank');
    };

    const handleFacebook = () => {
        window.open(`https://m.me/${CONTACT_CONFIG.FACEBOOK_PAGE}`, '_blank');
    };

    return (
        <AnimatePresence>
            {selectedProduct && selectedProductData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-cat-brown/30 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6"
                    onClick={() => {
                        setSelectedProduct(null);
                        setSelectedVariant(null);
                        setIsZoomed(false);
                    }}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-white w-full max-w-4xl rounded-t-[3rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 md:hidden" />

                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                setSelectedVariant(null);
                            }}
                            className="absolute top-6 right-6 z-[110] w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex md:hidden items-center justify-center text-slate-400 shadow-md active:scale-90 transition-all hover:bg-red-50 hover:text-red-500 hover:rotate-90"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 md:p-10 max-h-[90vh] overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                                <div className="w-full md:w-1/2 group">
                                    <div
                                        onClick={() => setIsZoomed(true)}
                                        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-50 bg-[#f9fbfb] flex items-center justify-center cursor-zoom-in"
                                    >
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            referrerPolicy="no-referrer"
                                            className="w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-cat-brown shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                                            <ZoomIn size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col pt-2">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="bg-cat-beige/60 text-cat-brown px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                            {activeCategory.name}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(null);
                                                setSelectedVariant(null);
                                            }}
                                            className="hidden md:flex w-12 h-12 bg-slate-100 rounded-full items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <h3 className="text-3xl sm:text-4xl font-black text-cat-brown leading-tight mb-4 uppercase tracking-tight">
                                        {selectedProductData.title || selectedProduct.name}
                                    </h3>

                                    <p className="text-slate-500 text-base leading-relaxed mb-6 whitespace-pre-line">
                                        {selectedProductData.description || "Sin descripción disponible."}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        {selectedProductData.variants.length > 0 ? (
                                            <div className="space-y-3 mb-2">
                                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-70 ml-1">Selecciona una opción</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {selectedProductData.variants.map((v, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSelectedVariant(v)}
                                                            className={`p-5 rounded-2xl flex items-center justify-between border transition-all duration-300 ${selectedVariant?.name === v.name
                                                                ? 'bg-cat-orange/10 border-cat-orange shadow-md scale-[1.02]'
                                                                : 'bg-[#f8fafc] border-slate-100 hover:border-cat-orange'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVariant?.name === v.name ? 'border-cat-orange bg-cat-orange' : 'border-slate-300'
                                                                    }`}>
                                                                    {selectedVariant?.name === v.name && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                </div>
                                                                <span className={`font-bold transition-colors ${selectedVariant?.name === v.name ? 'text-cat-orange' : 'text-cat-brown'
                                                                    } text-left`}>{v.name}</span>
                                                            </div>
                                                            <span className={`font-black text-lg ${selectedVariant?.name === v.name ? 'text-cat-orange' : 'text-cat-teal-dark'
                                                                }`}>{v.price.startsWith('$') ? v.price : `$${v.price}`}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-[#f8fafc] p-8 rounded-[2.5rem] flex items-center justify-between border border-slate-100 shadow-inner mb-2">
                                                <div>
                                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-70">Precio sugerido</p>
                                                    <p className="text-4xl font-black text-cat-teal-dark">$---</p>
                                                </div>
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-cat-orange border border-slate-50">
                                                    <ShoppingBag size={32} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => handleWhatsApp(selectedProductData.title || selectedProduct.name, selectedVariant, selectedProduct.image)}
                                                className={`w-full p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all text-lg uppercase tracking-tight ${selectedProductData.variants.length > 0 && !selectedVariant
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                    : 'bg-cat-teal-dark text-white shadow-cat-teal-dark/30 hover:bg-cat-teal-dark/95 active:scale-[0.98]'
                                                    }`}
                                                disabled={selectedProductData.variants.length > 0 && !selectedVariant}
                                            >
                                                <MessageCircle size={24} />
                                                {selectedProductData.variants.length > 0 && !selectedVariant
                                                    ? 'Selecciona una opción'
                                                    : 'Consultar por WhatsApp'}
                                            </button>

                                            <button
                                                onClick={handleFacebook}
                                                className={`w-full p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all text-lg uppercase tracking-tight ${selectedProductData.variants.length > 0 && !selectedVariant
                                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                                                    : 'bg-[#0084FF]/10 text-[#0084FF] border border-[#0084FF]/20 hover:bg-[#0084FF]/20 active:scale-[0.98]'
                                                    }`}
                                                disabled={selectedProductData.variants.length > 0 && !selectedVariant}
                                            >
                                                <Facebook size={24} />
                                                Consultar por Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetail;
