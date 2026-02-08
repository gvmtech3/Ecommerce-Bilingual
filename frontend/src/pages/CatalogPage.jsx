// src/pages/CatalogPage.jsx - ✅ 100% BILINGUAL
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Filter,
  ChevronDown,
} from "lucide-react";
import image1 from "../assets/images/customer-silk.jpg";
import image2 from "../assets/images/story-silk-detail.jpg";
import image3 from "../assets/images/hero-silk.jpg";

const PRODUCTS = [
  {
    id: 1,
    name: "Pure Silk Blouse",
    price: 89,
    image: image1,
    category: "blouses",
  },
  {
    id: 2,
    name: "Cashmere Scarf",
    price: 129,
    image: image2,
    category: "scarves",
  },
  {
    id: 3,
    name: "Satin Evening Dress",
    price: 199,
    image: image1,
    category: "dresses",
  },
  {
    id: 4,
    name: "Mulberry Silk Shirt",
    price: 95,
    image: image2,
    category: "shirts",
  },
  {
    id: 5,
    name: "Velvet Wrap Dress",
    price: 175,
    image: image1,
    category: "dresses",
  },
  {
    id: 6,
    name: "Silk Kimono Robe",
    price: 149,
    image: image3,
    category: "robes",
  },
  {
    id: 7,
    name: "Satin Slip Dress",
    price: 89,
    image: image2,
    category: "dresses",
  },
  {
    id: 8,
    name: "Cashmere Blend Cardigan",
    price: 159,
    image: image3,
    category: "tops",
  },
  {
    id: 9,
    name: "Silk Palazzo Pants",
    price: 119,
    image: image2,
    category: "pants",
  },
  {
    id: 10,
    name: "Embroidered Silk Blouse",
    price: 115,
    image: image3,
    category: "blouses",
  },
  {
    id: 11,
    name: "Satin Corset Top",
    price: 95,
    image: image2,
    category: "tops",
  },
  {
    id: 12,
    name: "Luxury Silk Shawl",
    price: 79,
    image: image1,
    category: "scarves",
  },
];

function CatalogPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [addingProduct, setAddingProduct] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const unique = [...new Set(PRODUCTS.map((p) => p.category))];
    return ["all", ...unique];
  }, []);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddToCart = async (product) => {
    setAddingProduct(product.id);
    setAddedFeedback(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    addToCart(product);
    setAddingProduct(null);
    setAddedFeedback(product.id);

    setTimeout(() => setAddedFeedback(null), 2000);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  const getButtonContent = (product) => {
    if (addingProduct === product.id) {
      return (
        <span className="flex items-center gap-2">
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {t("catalog.adding") || "Adding..."}
        </span>
      );
    }

    if (addedFeedback === product.id) {
      return (
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          {t("catalog.added") || "Added! ✓"}
        </span>
      );
    }

    return t("catalog.addToCart") || "Add to Cart";
  };

  const getCategoryName = (category) => {
    if (category === "all") return t("catalog.all") || "All Products";
    
    const categoryTranslations = {
      blouses: t("catalog.categories.blouses") || "Blouses",
      scarves: t("catalog.categories.scarves") || "Scarves",
      dresses: t("catalog.categories.dresses") || "Dresses",
      shirts: t("catalog.categories.shirts") || "Shirts",
      robes: t("catalog.categories.robes") || "Robes",
      tops: t("catalog.categories.tops") || "Tops",
      pants: t("catalog.categories.pants") || "Pants",
    };
    
    return categoryTranslations[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
            {t("nav.collection") || "Our Collection"}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-[#5A5A5A] leading-relaxed">
            {t("catalog.subtitle") || "Discover our exquisite collection of premium silk garments."}
          </p>
        </div>

        {/* COMPACT FILTER DROPDOWN - TOP RIGHT */}
        <div className="flex justify-between items-center mb-16">
          {/* Filter Results */}
          <div className="text-lg text-[#5A5A5A]">
            <span className="font-semibold text-[#13293D]">
              {filteredProducts.length}
            </span>{" "}
            {t("catalog.productsCount", { count: filteredProducts.length }) || "products"}
            {selectedCategory !== "all" && (
              <span className="ml-2 capitalize text-sm">
                ({getCategoryName(selectedCategory)})
              </span>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-[#13293D]/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold uppercase tracking-wide text-sm text-[#13293D] hover:bg-[#E9E0D8]"
            >
              <Filter className="h-5 w-5" />
              <span>{getCategoryName(selectedCategory)}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D9A441]/20 z-50 overflow-hidden">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`w-full text-left px-6 py-4 font-semibold uppercase tracking-wide text-sm transition-all hover:bg-[#E9E0D8] hover:scale-[1.02] ${
                      selectedCategory === category
                        ? "bg-[#13293D]/10 text-[#13293D] font-bold border-r-4 border-[#13293D]"
                        : "text-[#5A5A5A] hover:text-[#13293D]"
                    }`}
                  >
                    {getCategoryName(category)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {currentProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-[#D9A441]/20 hover:border-[#D9A441]/40">
                {/* Product Image - FIXED */}
                <div className="h-80 w-full overflow-hidden bg-linear-to-br from-[#F6F3F0] to-[#E9E0D8] group-hover:from-[#E9E0D8] group-hover:to-[#D9A441]/10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="p-8">
                  <span className="inline-block bg-[#D9A441]/20 text-[#D9A441] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                    {getCategoryName(product.category)}
                  </span>

                  <h3 className="font-serif text-2xl text-[#13293D] mb-4 group-hover:text-[#D9A441] transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-3xl font-bold text-[#13293D] tracking-tight">
                      ${product.price}
                    </span>
                    <span className="text-sm text-[#5A5A5A] font-medium uppercase tracking-wide">
                      {t("catalog.inStock") || "In Stock"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingProduct === product.id}
                    className={`w-full py-4 px-6 rounded-2xl font-serif font-semibold uppercase tracking-widest text-lg shadow-xl transition-all duration-300 flex items-center justify-center text-white ${
                      addingProduct === product.id
                        ? "bg-[#5A5A5A]/80 cursor-not-allowed shadow-none scale-95"
                        : addedFeedback === product.id
                        ? "bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25 scale-[1.02]"
                        : "bg-linear-to-r from-[#13293D] to-[#1A365D] hover:from-[#0F1E35] hover:to-[#13293D] hover:shadow-[#13293D]/25 hover:scale-[1.02]"
                    }`}
                  >
                    {getButtonContent(product)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center text-[#5A5A5A]">
              <p className="text-lg">
                {t("pagination.showing", {
                  from: indexOfFirstProduct + 1,
                  to: Math.min(indexOfLastProduct, filteredProducts.length),
                  total: filteredProducts.length,
                }) || `Showing ${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredProducts.length)} of ${filteredProducts.length} products`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#13293D]/30 text-[#13293D] font-semibold uppercase tracking-wide hover:bg-[#E9E0D8] hover:border-[#13293D]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
                {t("pagination.previous") || "Previous"}
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-12 h-12 rounded-2xl font-serif text-lg font-semibold transition-all shadow-md ${
                      currentPage === pageNum
                        ? "bg-[#13293D] text-white shadow-[#13293D]/25 scale-105"
                        : "border-2 border-[#13293D]/30 text-[#13293D] hover:bg-[#E9E0D8] hover:border-[#13293D]/50 hover:shadow-lg"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#13293D]/30 text-[#13293D] font-semibold uppercase tracking-wide hover:bg-[#E9E0D8] hover:border-[#13293D]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {t("pagination.next") || "Next"}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
