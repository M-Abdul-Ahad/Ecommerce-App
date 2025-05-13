import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '@/components/shopping-view/BannerCarousel';
import ProductDetailsDialog from '@/components/shopping-view/ProductDetailsDialog';
import { FaMale, FaFemale, FaChild, FaHatCowboy, FaShoePrints } from 'react-icons/fa';
import { fetchAllShoppingProducts } from '@/store/shoppingProductsSlice';
import { fetchCartItmes, addToCart } from '@/store/cartSlice';
import toast from 'react-hot-toast';

const categories = [
  { id: 'men', label: 'Men', icon: <FaMale /> },
  { id: 'women', label: 'Women', icon: <FaFemale /> },
  { id: 'kids', label: 'Kids', icon: <FaChild /> },
  { id: 'accessories', label: 'Accessories', icon: <FaHatCowboy /> },
  { id: 'footwear', label: 'Footwear', icon: <FaShoePrints /> },
];

const brands = [
  {
    id: 'nike',
    label: 'Nike',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="h-10" />,
  },
  {
    id: 'adidas',
    label: 'Adidas',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" className="h-10" />,
  },
  {
    id: 'puma',
    label: 'Puma',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_Logo.svg" alt="Puma" className="h-10" />,
  },
  {
    id: 'levi',
    label: "Levi's",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Levi%27s_logo.svg" alt="Levi's" className="h-8" />,
  },
  {
    id: 'zara',
    label: 'Zara',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Zara_Logo_2019.svg" alt="Zara" className="h-6" />,
  },
  {
    id: 'h&m',
    label: 'H&M',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" alt="H&M" className="h-8" />,
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { productList } = useSelector((state) => state.shoppingProducts);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllShoppingProducts());
    if (user?.id) {
      dispatch(fetchCartItmes({ userId: user.id }));
    }
  }, [dispatch, user]);

  const handleAddToCart = (product) => {
    const userId = user?.id;
    if (!userId) return;

    dispatch(addToCart({ userId, productId: product._id, quantity: 1 }))
      .then(() => dispatch(fetchCartItmes({ userId })))
      .then(() => toast.success('Item Added to Cart!'));
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/listing?category=${categoryId}`);
  };

  const handleBrandClick = (brandId) => {
    navigate(`/shop/listing?brand=${brandId}`);
  };

  // Filter products where salePrice is > 0 and salePrice is less than the regular price
  const featuredProducts = productList.filter(
    (product) => product.salePrice > 0 && product.salePrice < product.price
  ); // Adjusted to meet the condition

  return (
    <>
      <div className="w-full h-[550px]">
        <BannerCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-10">
            Shop Our Best Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex flex-col items-center justify-center w-32 h-32 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-2 text-gray-600">{category.icon}</div>
                <span className="text-sm font-medium text-gray-800">{category.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-10">
            Shop by Famous Brands
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand.id)}
                className="flex flex-col items-center justify-center w-32 h-32 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="mb-2">{brand.icon}</div>
                <span className="text-sm font-medium text-gray-800">{brand.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">
            Featured Products - On Sale Now!
          </h2>
          {featuredProducts.length === 0 ? (
            <p className="text-gray-500">No featured products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md relative transition-transform duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col justify-between mb-6"
                >
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
              ))}
            </div>
          )}
        </div>

        <ProductDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
};


export default Home;
