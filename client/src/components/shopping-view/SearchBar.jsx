
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
      className="w-full md:w-96 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
    />
  );
};

export default SearchBar;
