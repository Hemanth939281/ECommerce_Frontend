import { useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
    const { state } = useContext(AuthContext);
    
    const isAdmin = state?.UserAPI?.isAdmin || false;
    const updateCart = state?.UserAPI?.updateCart;

    // State for products
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
        });
    }, []);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products");
                console.log("Fetched Products:", res.data); // Debugging
        
                // Check if the response contains a 'products' array
                if (res.data?.products && Array.isArray(res.data.products)) {
                    setProducts(res.data.products);
                    setFilteredProducts(res.data.products);
                } else {
                    console.error("Unexpected product response:", res.data);
                    toast.error("Error fetching products.");
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                toast.error("Failed to load products.");
                setIsLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/category");
                console.log("Fetched Categories:", res.data); // Debugging
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    // Filtering products based on category & search
    useEffect(() => {
        if (!products?.length) return;

        let filtered = [...products];

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (product) => product?.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (product) =>
                    product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchTerm]);

    // Handle product check
    const handleCheck = (id) => {
        const updatedProducts = products.map((product) =>
            product._id === id ? { ...product, checked: !product.checked } : product
        );
        setProducts(updatedProducts);
    };

    // Handle product delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setFilteredProducts((prev) => prev.filter((product) => product._id !== id));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast.error("Failed to delete product");
        }
    };

    const getDefaultImage = () => "/api/placeholder/300/300";

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-xl font-semibold text-blue-600 flex flex-col items-center" data-aos="fade-up">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    Loading products...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between py-6 bg-gradient-to-b from-blue-50 to-white">
            {/* Category and Search Filters */}
            <div 
                className="w-full flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 md:space-x-6 py-6 px-8 bg-white shadow-md rounded-lg mx-auto max-w-7xl"
                data-aos="fade-down"
                data-aos-delay="100"
            >
                <div className="flex gap-4 w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    />
                    <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex items-center w-full md:w-auto">
                    <label htmlFor="category" className="mr-3 text-lg font-semibold text-gray-700">
                        Filter by Category:
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name.toLowerCase()}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-8 max-w-7xl mx-auto">
                {filteredProducts.map((product, index) => {
                    if (!product || !product._id) return null;

                    return (
                        <div 
                            key={product._id} 
                            className="relative group" 
                            data-aos="fade-up" 
                            data-aos-delay={100 + (index % 5) * 100}
                        >
                            <Link to={`/detail/${product._id}`} className="block">
                                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-2 hover:scale-105">
                                    {isAdmin && (
                                        <input
                                            type="checkbox"
                                            checked={product.checked || false}
                                            onChange={() => handleCheck(product._id)}
                                            className="absolute top-4 left-4 h-5 w-5 accent-blue-500"
                                        />
                                    )}
                                    <div className="overflow-hidden rounded-lg mb-4 relative">
                                        <img
                                            className="w-full h-48 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                                            src={product?.image?.url || getDefaultImage()}
                                            alt={product?.title || "Product image"}
                                            onError={(e) => {
                                                e.target.src = getDefaultImage();
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                        {product?.title || "Untitled Product"}
                                    </h3>
                                    <p className="text-sm text-gray-600 flex-grow mt-2 line-clamp-2">
                                        {product?.description || "No description available"}
                                    </p>
                                    <p className="text-xl font-bold text-blue-600 mt-4">
                                        ₹{product?.price?.toLocaleString() || "Price unavailable"}
                                    </p>
                                </div>
                            </Link>

                            <div className="mt-4 flex flex-col space-y-2">
                                {isAdmin ? (
                                    <>
                                        <button onClick={() => handleDelete(product._id)}
                                            className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => updateCart && updateCart(product)}
                                        className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-105">
                                        <ShoppingCartIcon className="mr-2" /> Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && !isLoading && (
                <div 
                    className="w-full text-center py-12" 
                    data-aos="fade-up"
                >
                    <div className="text-3xl font-semibold text-gray-400 mb-4">No products found</div>
                    <p className="text-gray-500">Try changing your search criteria or category filter</p>
                </div>
            )}
        </div>
    );
};

export default Home;