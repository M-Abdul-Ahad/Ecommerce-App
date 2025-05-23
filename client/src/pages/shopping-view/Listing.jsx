import { fetchAllShoppingProducts } from '@/store/shoppingProductsSlice';
import { fetchCartItmes, addToCart } from '@/store/cartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductDetailsDialog from '@/components/shopping-view/ProductDetailsDialog';
import SearchBar from '@/components/shopping-view/SearchBar';

const filterOptions = {
  category: [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'footwear', label: 'Footwear' },
  ],
  brand: [
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
    { id: 'puma', label: 'Puma' },
    { id: 'levi', label: "Levi's" },
    { id: 'zara', label: 'Zara' },
    { id: 'h&m', label: 'H&M' },
  ],
};

const sortOptions = [
  { id: 'price-lowtohigh', label: 'Price: Low to High' },
  { id: 'price-hightolow', label: 'Price: High to Low' },
  { id: 'title-atoz', label: 'Title: A to Z' },
  { id: 'title-ztoa', label: 'Title: Z to A' },
];

const ITEMS_PER_PAGE = 16;

const Listing = () => {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].id);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.auth.user);

  const { productList } = useSelector((state) => state.shoppingProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchAllShoppingProducts());
    const userId = user?.id;
    if (userId) {
      dispatch(fetchCartItmes({ userId }));
    }

    const urlParams = new URLSearchParams(location.search);
    const urlCategories = urlParams.getAll('category');
    const urlBrands = urlParams.getAll('brand');
    const urlSort = urlParams.get('sort') || selectedSort;
    const urlKeyword = urlParams.get('keyword') || '';

    setSelectedCategories(urlCategories);
    setSelectedBrands(urlBrands);
    setSelectedSort(urlSort);
    setSearchTerm(urlKeyword);

    setCurrentPage(1); // Reset page when URL params change
  }, [dispatch, user, location.search]);

  const handleAddToCart = (product) => {
    const userId = user?.id;
    dispatch(
      addToCart({
        userId,
        productId: product._id,
        quantity: 1,
      })
    ).then(() => {
      dispatch(fetchCartItmes({ userId }));
      toast.success('Item Added to Cart!');
    });
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    updateUrl(newCategories, selectedBrands);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleBrandChange = (brandId) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(newBrands);
    updateUrl(selectedCategories, newBrands);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSortChange = (sortId) => {
    setSelectedSort(sortId);
    setCurrentPage(1); // Reset page on sort change
  };

  const updateUrl = (categories, brands, keyword = '') => {
    const params = new URLSearchParams();
    categories.forEach((category) => params.append('category', category));
    brands.forEach((brand) => params.append('brand', brand));
    if (keyword.trim()) {
      params.set('keyword', keyword);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      updateUrl(selectedCategories, selectedBrands, searchTerm);
      setCurrentPage(1); // Reset page on search term change
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategories, selectedBrands]);

  const filteredProducts = productList.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category?.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand?.toLowerCase());

    const keyword = searchTerm.trim().toLowerCase();
    const matchesSearch =
      keyword === '' ||
      product.title.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-lowtohigh':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-hightolow':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'title-atoz':
        return a.title.localeCompare(b.title);
      case 'title-ztoa':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <aside className="w-[200px] bg-white p-4 shadow-md hidden md:block">
        <h2 className="font-semibold text-xl mb-4 border-b pb-2">Filters</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 border-b pb-2">Category</h3>
          <ul className="space-y-1">
            {filterOptions.category.map((opt) => (
              <li key={opt.id}>
                <label className="inline-flex items-center space-x-2">
                  <input
                    checked={selectedCategories.includes(opt.id)}
                    onChange={() => handleCategoryChange(opt.id)}
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand Filter */}
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b pb-2">Brand</h3>
          <ul className="space-y-1">
            {filterOptions.brand.map((opt) => (
              <li key={opt.id}>
                <label className="inline-flex items-center space-x-2">
                  <input
                    checked={selectedBrands.includes(opt.id)}
                    onChange={() => handleBrandChange(opt.id)}
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 ml-4">
              Shop Our Best Sellers
            </h2>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <hr className="mt-4 border-gray-300" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 flex-grow">
          {paginatedProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No products available.
            </p>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-md relative transition-transform duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col justify-between mb-6"
              >
                <div className="relative">
                  {/* Sale Badge */}
                  {product.salePrice > 0 && product.salePrice < product.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm z-10">
                      SALE
                    </span>
                  )}

                  <img
                    src={product.image || 'https://via.placeholder.com/200'}
                    alt={product.title}
                    className="w-full h-48 object-contain rounded mb-3"
                  />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{product.title}</h4>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    {product.salePrice > 0 && product.salePrice < product.price ? (
                      <>
                        <p className="text-gray-400 line-through text-sm">
                          ${product.price}
                        </p>
                        <p className="text-green-600 font-bold">
                          ${product.salePrice}
                        </p>
                      </>
                    ) : (
                      <p className="text-blue-600 font-bold">${product.price}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDialogOpen(true);
                    }}
                    className="w-full text-center bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition cursor-pointer"
                  >
                    See Details
                  </button>

                  {product.totalStock === 0 ? (
                    <button
                      disabled
                      className="w-full text-center bg-red-100 text-red-500 py-1 rounded cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full text-center bg-gray-200 hover:bg-gray-300 py-1 rounded transition cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Back
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>

        <ProductDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
};

export default Listing;
