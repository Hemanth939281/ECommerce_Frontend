import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "./AuthContext";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { FaChevronDown } from 'react-icons/fa';
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setShowModal, showModal, state } = useContext(AuthContext);
  const isLogged = state.UserAPI.isLoggedIn;
  const isAdmin = state.UserAPI.isAdmin;
  const user = state.UserAPI.user;
  const cart = state.UserAPI.cart;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const logoutUser = async () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    window.location.reload();
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const adminRouter = () => (
    <>
      <Link
        to="/create_product"
        className="block text-gray-700 hover:text-orange-500 font-bold px-3"
        onClick={() => setIsOpen(false)}
      >
        Create Products
      </Link>
    </>
  );

  const loggedRouter = () => (
    <div className="relative text-center">
      <button
        className="flex items-center mx-auto gap-2 text-gray-700 hover:text-orange-500 font-bold focus:outline-none"
        onClick={() => setShowModal(!showModal)}
      >
        {user?.name}
        <FaChevronDown />
      </button>
      {showModal && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-center z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            onClick={logoutUser}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white sticky top-0 left-0 z-50 shadow-md p-2" data-aos="fade-down">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-800">{isAdmin ? "Admin" : "Rakshakh"}</h1>
          </div>
          <div className="hidden md:flex space-x-4 py-4">
            <Link to="/" className="text-gray-700 hover:text-orange-500 font-bold transition-colors duration-300">Home</Link>
            {isAdmin ? adminRouter() : (
              <>
                <Link to="/about" className="text-gray-700 hover:text-orange-500 font-bold transition-colors duration-300">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-orange-500 font-bold transition-colors duration-300">Contact</Link>
                <Link to="/cart" className="relative font-bold text-gray-700 hover:text-orange-500 transition-colors duration-300">
                  <span className="bg-[crimson] text-white p-1 rounded-full absolute lg:-top-6 lg:-right-2 text-xs flex items-center justify-center min-w-6 min-h-6">{cart.length}</span>
                  <ShoppingCart />
                </Link>
              </>
            )}
            {isLogged ? loggedRouter() : (
              <Link to="/login">
                <button className="px-6 py-1 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition duration-300">Login</button>
              </Link>
            )}
          </div>
          <div className="flex md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 hover:text-gray-600 focus:outline-none">
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden text-center`}>
        <div className="px-2 pt-2 pb-4 sm:px-4" data-aos="fade-down" data-aos-duration="300">
          <Link to="/" className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2" onClick={toggleMenu}>Home</Link>
          
          {isAdmin ? (
            // Admin Mobile Menu
            <Link 
              to="/create_product" 
              className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2" 
              onClick={toggleMenu}
            >
              Create Products
            </Link>
          ) : (
            // Regular User Mobile Menu
            <>
              <Link to="/about" className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2" onClick={toggleMenu}>About</Link>
              <Link to="/contact" className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2" onClick={toggleMenu}>Contact</Link>
              <Link to="/cart" className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2 relative" onClick={toggleMenu}>
                Cart
                {cart.length > 0 && (
                  <span className="bg-[crimson] text-white p-1 rounded-full absolute -top-2 ml-1 text-xs flex items-center justify-center min-w-5 min-h-5">{cart.length}</span>
                )}
              </Link>
            </>
          )}
          
          {isLogged ? (
            <div className="block text-center py-2">
              {loggedRouter()}
            </div>
          ) : (
            <Link to="/login" className="block text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2" onClick={toggleMenu}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;