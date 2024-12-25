import { Link } from 'react-router-dom';
import { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    localStorage.setItem('searchQuery', query); // Lưu giá trị tìm kiếm vào localStorage
  };

  return (
    <div className="flex items-center gap-4">
      <form>
      {/* Thanh tìm kiếm */}
      <input
        className="border border-gray-300 text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies"
      />

      {/* Nút tìm kiếm */}
      <Link to="/search" className='ml-1'>
        <button type='submit'
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleSearch}
        >
          Search
        </button>
        
      </Link>
      </form>
    </div>
    
  );
};

export default SearchBar;
