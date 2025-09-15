import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaSearch, FaBars } from 'react-icons/fa';


const Navbar: React.FC = () => {
  const [searchExpanded, setSearchExpanded] = useState<boolean>(false);

  const handleSearchToggle = (): void => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <nav 
      id="navbar"
      className="fixed top-0 left-0 right-0 h-17 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between px-[4%] z-50 transition-colors duration-300"
    >
      <Link 
        to="/"
        className="text-netflix-red text-2xl font-bold no-underline flex items-center gap-2 hover:text-netflix-red-hover transition-colors duration-300"
      >
        <FaPlay />
        PoochyFlix
      </Link>

      <div className="hidden md:flex items-center gap-5">
        <Link 
          to="/"
          className="text-white no-underline text-sm font-normal hover:text-netflix-light-gray transition-colors duration-300"
        >
          Inicio
        </Link>
        <Link 
          to="/upload"
          className="text-white no-underline text-sm font-normal hover:text-netflix-light-gray transition-colors duration-300"
        >
          Subir Video
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar videos..."
            className={`bg-transparent border border-white rounded text-white px-3 py-2 transition-all duration-300 ${
              searchExpanded ? 'w-50 opacity-100' : 'w-0 opacity-0'
            }`}
            onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
          />
          <button 
            onClick={handleSearchToggle}
            className="bg-transparent border-none text-white cursor-pointer p-2 flex items-center justify-center hover:text-netflix-light-gray transition-colors duration-300"
          >
            <FaSearch />
          </button>
        </div>

        <Link 
          to="/upload"
          className="bg-netflix-red hover:bg-netflix-red-hover text-white border-none rounded px-4 py-2 no-underline text-sm font-medium flex items-center gap-2 transition-colors duration-300"
        >
          <FaPlus />
          Subir
        </Link>

        <button className="md:hidden bg-transparent border-none text-white cursor-pointer p-2">
          <FaBars />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
