import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  SparklesIcon,
  UserGroupIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, resetTokenAndCredentials } from '@/store/authSlice';
import CartDrawer from './CartDrawer';


const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
  { name: 'Home', to: '/shop/home', icon: HomeIcon },
  { name: 'Men', to: '/shop/listing?category=men', icon: UserIcon },
  { name: 'Women', to: '/shop/listing?category=women', icon: SparklesIcon },
  { name: 'Kids', to: '/shop/listing?category=kids', icon: UserGroupIcon },
  { name: 'Accessories', to: '/shop/listing?category=accessories', icon: TagIcon },
  {name: 'Products', to: '/shop/listing', icon: ShoppingBagIcon}
];


  const handleLogout = () => {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials())
    sessionStorage.clear()
    navigate('/auth/login')
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow sticky top-0 z-50">
      {/* Top Bar */}
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Menu Button for small screens */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(true)} className="text-gray-700">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Brand */}
        <div className="text-center flex-1">
          <Link to="/shop/home" className="inline-flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 8h14l1 12H4L5 8z"
              />
            </svg>
            <h1 className="text-3xl font-extrabold tracking-wide text-blue-600">SHOPEASE</h1>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
         <Link
            to="#"
            onClick={() => setIsCartOpen(true)}
            className="text-gray-700 hover:text-blue-600 relative"
          >
            <ShoppingCartIcon className="w-6 h-6" />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full px-1.5 shadow">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          {/* Avatar with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || <UserCircleIcon className="w-6 h-6 text-blue-600" />}
              </div>
              <span className="hidden sm:block font-medium capitalize">
                {user?.name?.split(' ')[0]}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/shop/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex justify-center space-x-8 py-2 bg-gray-100 text-gray-700 font-medium w-full">
        {categories.map(({ name, to, icon: Icon }) => (
          <Link
            key={name}
            to={to}
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Side Sheet Menu */}
      {menuOpen && (
        <>
         {/* Blurred Overlay */}
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"
            onClick={() => setMenuOpen(false)}
          />


          {/* Side Sheet */}
          <div className="fixed top-0 left-0 h-full w-[250px] bg-white z-50 shadow-lg flex flex-col">
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 px-4 py-6 text-base text-gray-800">
              {categories.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 hover:text-blue-600"
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
     <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userId={user?.id}
      />


    </header>
    
  );
};

export default Header;
