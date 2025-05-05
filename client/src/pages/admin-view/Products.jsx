import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/admin-view/ImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchAllProducts } from '@/store/ProductSlice';
import toast from 'react-hot-toast';

const Products = () => {
  const {productList}=useSelector(state=>state.adminProducts)
  const dispatch=useDispatch()
  const [showSheet, setShowSheet] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(false);


  const [formData, setFormData] = useState({
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

  dispatch(addProduct({
    ...formData,
    image: formData.imageUrl,
  })).then((data) => {
    if (data?.payload?.success) {
      dispatch(fetchAllProducts());

      // Reset the form
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
      setShowSheet(false);

      // Show success toast
      toast.success("Product added successfully!");
    }
  });
};


  useEffect(()=>{
    dispatch(fetchAllProducts())
  },[dispatch])
  
 console.log(productList,'productlist')
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
      <p className="text-lg text-gray-600">Add, edit, or remove products from your store.</p>

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
            <h2 className="text-xl font-bold">Add Product</h2>
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
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
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
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="sony">Sony</option>
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
              Submit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
