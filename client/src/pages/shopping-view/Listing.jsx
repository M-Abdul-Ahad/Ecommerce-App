import { fetchAllShoppingProducts } from '@/store/shoppingProductsSlice';
import { fetchCartItmes, addToCart } from '@/store/cartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductDetailsDialog from '@/components/shopping-view/ProductDetailsDialog';


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

const Listing = () => {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].id);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);


  const { productList } = useSelector((state) => state.shoppingProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  dispatch(fetchAllShoppingProducts());
  const userId = user?.id;
  if (userId) {
    dispatch(fetchCartItmes({ userId }))
  }
}, [dispatch, user]);



  const handleAddToCart = (product) => {
  const userId = user?.id

  dispatch(addToCart({
    userId,
    productId: product._id,
    quantity: 1,
  })).then(() => {
    dispatch(fetchCartItmes({ userId }))
    toast.success('Item Added to Cart!')
  });
};


  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const filteredProducts = productList.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category?.toLowerCase());
    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand?.toLowerCase());
    return matchesCategory && matchesBrand;
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
      <main className="flex-1 p-6">
        <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 ml-4">
            Shop Our Best Sellers
          </h2>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No products available.</p>
          ) : (
            sortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-md relative transition-transform duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col justify-between mb-6"
              >
                {/* Sale Badge */}
                {product.salePrice > 0 && product.salePrice < product.price && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm">
                    SALE
                  </span>
                )}

                <div className="relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/200'}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded mb-3"
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
                        <p className="text-gray-400 line-through text-sm">${product.price}</p>
                        <p className="text-green-600 font-bold">${product.salePrice}</p>
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
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full text-center bg-gray-200 hover:bg-gray-300 py-1 rounded transition cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
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
