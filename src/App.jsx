import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { GOOGLE_DRIVE_CONFIG } from './config';
import { fetchFolderFiles } from './services/googleDrive';
import { parseDescription } from './utils/helpers';

// Components
import CategoryHeader from './components/CategoryHeader';
import HeroBanner from './components/HeroBanner';
import SearchBar from './components/SearchBar';
import CategoryGrid from './components/CategoryGrid';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import BottomNav from './components/BottomNav';
import HighResLightbox from './components/HighResLightbox';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';
import BrandInfo from './components/BrandInfo';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import RecentlyViewed from './components/RecentlyViewed';

function App() {
  const [activeCategory, setActiveCategory] = useState(GOOGLE_DRIVE_CONFIG.FOLDERS[0]);
  const [productsCache, setProductsCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showBrandInfo, setShowBrandInfo] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });
  const loaderRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Focus the input after a small delay to allow scroll to complete
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (product) {
      setRecentlyViewed(prev => {
        const filtered = prev.filter(p => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 20); // Keep last 20
        localStorage.setItem('recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const loadProducts = async (isNextPage = false, forceRefresh = false) => {
    const currentData = productsCache[activeCategory.id] || { items: [], nextPageToken: null };

    if (loading || loadingMore) return;
    if (isNextPage && !currentData.nextPageToken) return;
    if (!isNextPage && !forceRefresh && currentData.items.length > 0) return;

    if (isNextPage) setLoadingMore(true); else setLoading(true);

    // Artificial delay of 1 second for infinite scroll as requested
    if (isNextPage) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const result = await fetchFolderFiles(activeCategory.id, isNextPage ? currentData.nextPageToken : null);

    setProductsCache(prev => {
      const categoryId = activeCategory.id;
      const prevData = prev[categoryId] || { items: [], nextPageToken: null };

      return {
        ...prev,
        [categoryId]: {
          items: (isNextPage && !forceRefresh) ? [...prevData.items, ...result.files] : result.files,
          nextPageToken: result.nextPageToken
        }
      };
    });
    setLoading(false);
    setLoadingMore(false);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchTerm('');
    // Trigger smooth scroll only on user action
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    // Force scroll to top on page refresh/initial mount
    window.scrollTo(0, 0);
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadProducts(true);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [productsCache, activeCategory]);

  // Added checkAdminStatus function
  const checkAdminStatus = async (accessToken) => {
    try {
      const folder = GOOGLE_DRIVE_CONFIG.FOLDERS.find(f => !['all', 'latest'].includes(f.id));
      if (!folder) return;

      const { cleanFolderId } = await import('./services/googleDrive');
      const folderId = cleanFolderId(folder.id);

      const res = await axios.get(`https://www.googleapis.com/drive/v3/files/${folderId}`, {
        params: { fields: 'capabilities(canAddChildren, canEdit)' },
        headers: { Authorization: `Bearer ${accessToken}` },
        // This prevents Axios from throwing an error on 401/403, 
        // which helps keep the console cleaner in some environments.
        validateStatus: (status) => (status >= 200 && status < 300) || status === 401 || status === 403
      });

      if (res.status === 401 || res.status === 403) {
        setIsAdmin(false);
      } else {
        setIsAdmin(res.data.capabilities?.canAddChildren || false);
      }
    } catch (err) {
      console.error('Unexpected error checking admin status:', err);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('google_user');
  };

  useEffect(() => {
    if (user?.access_token) {
      checkAdminStatus(user.access_token);
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('google_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const currentCategoryData = productsCache[activeCategory.id] || { items: [], nextPageToken: null };
  const products = currentCategoryData.items;

  const filteredProducts = products.filter(p => {
    const parsed = parseDescription(p.description);
    const titleToSearch = parsed.title || p.name;
    return titleToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handlePopState = () => {
      if (isZoomed) {
        setIsZoomed(false);
      } else if (selectedProduct) {
        setSelectedProduct(null);
        setSelectedVariant(null);
      } else if (showProfile) {
        setShowProfile(false);
      } else if (showAdmin) {
        setShowAdmin(false);
        setProductsCache({});
        setTimeout(() => loadProducts(false, true), 100);
      } else if (showBrandInfo) {
        setShowBrandInfo(false);
      } else if (showRecentlyViewed) {
        setShowRecentlyViewed(false);
      }
    };

    if (selectedProduct || isZoomed || showProfile || showAdmin || showBrandInfo || showRecentlyViewed) {
      document.body.style.overflow = 'hidden';
      // Add a history entry for the modal
      window.history.pushState({ modal: true }, "");
      window.addEventListener('popstate', handlePopState);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct, isZoomed, showProfile, showAdmin, showBrandInfo, showRecentlyViewed]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f0f4f4] min-h-screen relative pb-32">

      <div className="max-w-7xl mx-auto">
        <CategoryHeader
          onBrandClick={() => setShowBrandInfo(true)}
          user={user}
        />
        <HeroBanner onActionClick={() => {
          const latestCat = GOOGLE_DRIVE_CONFIG.FOLDERS.find(f => f.id === 'latest');
          if (latestCat) handleCategoryChange(latestCat);
        }} />


        <CategoryGrid
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
        />
        <div
          ref={searchRef}
          className="sticky top-0 z-40 bg-[#051D1F]/5 py-4 transition-all"
          style={{
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
          }}
        >
          <SearchBar ref={searchInputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Product Section */}
        <div className="px-6 mb-12 sm:px-12">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-cat-brown text-xl sm:text-3xl">{activeCategory.name}</h3>
            <span className="bg-white/50 px-4 py-1 rounded-full text-cat-teal-dark font-black text-sm shadow-sm">
              {filteredProducts.length} Items
            </span>
          </div>

          {loading ? (
            <LoadingSpinner fullPage message="Cargando catálogo..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-10">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    setSelectedProduct={handleProductSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={loaderRef} className="py-20 flex justify-center">
            {currentCategoryData.nextPageToken && (
              <LoadingSpinner message="Cargando más productos..." />
            )}
          </div>

          {!loading && filteredProducts.length === 0 && <EmptyState />}
        </div>
      </div>

      <ProductDetail
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
        activeCategory={activeCategory}
      />

      <AnimatePresence>
        {isZoomed && selectedProduct && (
          <HighResLightbox
            setIsZoomed={setIsZoomed}
            product={selectedProduct}
          />
        )}
      </AnimatePresence>

      <BottomNav
        isHidden={!!selectedProduct || showProfile || showAdmin || showBrandInfo || showRecentlyViewed}
        onHomeClick={scrollToTop}
        onBrandClick={() => setShowBrandInfo(true)}
        onSearchClick={scrollToSearch}
        onRecentClick={() => setShowRecentlyViewed(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <AnimatePresence>
        {showProfile && (
          <ProfileView
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            onLogout={handleLogout}
            onClose={() => setShowProfile(false)}
            onAdminClick={() => setShowAdmin(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && user && (
          <AdminPanel
            user={user}
            onClose={() => {
              setShowAdmin(false);
              setProductsCache({}); // Clear all cache
              setTimeout(() => loadProducts(false, true), 100); // Force reload active category
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBrandInfo && (
          <BrandInfo onClose={() => setShowBrandInfo(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRecentlyViewed && (
          <RecentlyViewed
            items={recentlyViewed}
            onClose={() => setShowRecentlyViewed(false)}
            onProductSelect={(product) => {
              setShowRecentlyViewed(false);
              handleProductSelect(product);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
