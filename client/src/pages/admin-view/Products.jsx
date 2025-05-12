import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/admin-view/ImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/ProductSlice';
import toast from 'react-hot-toast';
import AdminProductCard from '@/components/admin-view/AdminProductCard'; // Assuming you have the AdminProductCard component
import { Edit } from 'lucide-react';

const Products = () => {
  const { productList } = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();
  const [showSheet, setShowSheet] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(false);
  const [editMode,setEditMode]=useState(false)

  const [formData, setFormData] = useState({
    id:'',
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    stock: '',
    imageUrl: '', // If ImageUpload returns a URL, link it here
  });

  const toggleSheet = () => {
    setShowSheet(!showSheet);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const data = {
      ...formData,
      image: formData.imageUrl,
      totalStock: Number(formData.stock),
    };
  
    if (editMode) {
      dispatch(editProduct({ id: formData.id, formdata: data }))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success("Product updated successfully!");
          dispatch(fetchAllProducts());
        }
      });
    } else {
      dispatch(addProduct(data)).then((res) => {
        if (res?.payload?.success) {
          toast.success("Product added successfully!");
          dispatch(fetchAllProducts());
        }
      });
    }
  
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      salePrice: '',
      stock: '',
      imageUrl: '',
    });
    setResetImageUpload(true);
    setEditMode(false);
    setShowSheet(false);
  };
  

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Products</h2>
        <button
          onClick={toggleSheet}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Product
        </button>
      </div>
      <p className="text-lg text-gray-600 mb-6">Add, edit, or remove products from your store.</p>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {productList && productList.map((product) => (
          <AdminProductCard
            key={product._id}
            product={product}
            onEdit={(product) => {
              setFormData({
                id:product._id,
                title: product.title || '',
                description: product.description || '',
                category: product.category || '',
                brand: product.brand || '',
                price: product.price || '',
                salePrice: product.salePrice || '',
                stock: product.stock || '',
                imageUrl: product.image || '',
              });
              setShowSheet(true);
              setEditMode(true);
            }}
            onDelete={(id) => {
              if (window.confirm("Are you sure you want to delete this product?")) {
                dispatch(deleteProduct(id)).then((res) => {
                  if (res?.payload?.success) {
                    toast.success("Product deleted successfully!");
                    dispatch(fetchAllProducts());
                  } else {
                    toast.error("Failed to delete product.");
                  }
                });
              }
            }}
            
          />
        ))}
      </div>

      {/* Form Modal */}
      {showSheet && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 cursor-pointer"
          onClick={toggleSheet}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 w-full max-w-md bg-white shadow-xl h-full z-50 transform transition-transform duration-300 ${
          showSheet ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-3xl font-bold">{editMode?'Edit Product':'Add Product'}</h2>
            <button
              onClick={toggleSheet}
              type="button"
              className="text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>

          <ImageUpload
            onUpload={(url) => {
              setFormData((prev) => ({ ...prev, imageUrl: url }));
              setResetImageUpload(false); // Reset only once
            }}
            reset={resetImageUpload}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="">Select a category</option>
              <option value="kids">Kids</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="accessories">Accessories</option>
              <option value="footwear">Footwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="">Select a brand</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="puma">Puma</option>
              <option value="levi">Levi's</option>
              <option value="zara">Zara</option>
              <option value="h&m">H&M</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter original price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price ($)</label>
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter discounted price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter total stock quantity"
            />
          </div>

          <div className="p-6 border-t bg-white sticky bottom-0 left-0 z-50 ">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded cursor-pointer"
            >
              {editMode?'Edit Product':'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
