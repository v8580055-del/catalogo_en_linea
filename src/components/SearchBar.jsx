import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = React.forwardRef(({ searchTerm, setSearchTerm }, ref) => {
    return (
        <div className="px-6 sm:px-12">
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    ref={ref}
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white rounded-[2rem] py-5 pl-14 pr-6 text-cat-brown shadow-sm focus:outline-none focus:ring-4 focus:ring-cat-teal-light/10 transition-all font-medium text-lg border border-slate-100"
                />
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
