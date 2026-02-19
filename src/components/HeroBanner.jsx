import { Scan } from 'lucide-react';

const HeroBanner = ({ onActionClick }) => {
    return (
        <div className="px-6 mb-8 sm:px-12">
            <div className="bg-[#f5dfbb] rounded-[2.5rem] p-8 flex items-center relative overflow-hidden h-44 sm:h-64 shadow-lg shadow-cat-orange/10">
                <div className="z-10 w-2/3 md:w-3/5">
                    <div className="py-5">
                        <h3 className="text-[#562c2c] text-xl font-black mb-0 leading-tight sm:text-4xl">
                            Tus productos personalizados favoritos
                        </h3>
                    </div>
                    <button
                        onClick={onActionClick}
                        className="bg-[#562c2c] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 sm:text-base sm:px-8 sm:py-3 sm:rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                        <Scan size={18} />
                        Ver novedades
                    </button>
                </div>
                <img
                    src="https://lh3.googleusercontent.com/u/0/d/1DC_RgKcMVyrABmXl-rfRI9wtIEV4Geg-=s1000"
                    className="absolute -right-4 -bottom-4 w-48 h-48 object-contain rotate-12 sm:w-80 sm:h-80 sm:right-10"
                    alt="Hero product"
                    referrerPolicy="no-referrer"
                />
            </div>
        </div>
    );
};

export default HeroBanner;
