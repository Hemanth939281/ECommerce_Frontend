import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AOS from "aos";
import "aos/dist/aos.css";

const ProductDetails = () => {
    const [productDetails, setProductDetails] = useState(null);
    const { id } = useParams();
    const { state } = useContext(AuthContext);
    const productAPI = state?.ProductApi || {};
    const userAPI = state?.UserAPI || {};

    const [products] = productAPI.products || [];
    const updateCart = userAPI.updateCart || (() => console.error("updateCart function is missing"));

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
        });
    }, []);

    useEffect(() => {
        const product = products.find((product) => product._id === id);
        setProductDetails(product);
    }, [id, products]);

    function capitalizeFirstLetter(string) {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const getDefaultImage = () => "/api/placeholder/600/600";

    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center p-4 md:p-8">
            {productDetails ? (
                <div 
                    className="container mx-auto p-6 rounded-2xl shadow-2xl max-w-6xl bg-white text-gray-900 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        {/* Product Image Section */}
                        <div 
                            className="flex justify-center items-center relative overflow-hidden rounded-xl"
                            data-aos="fade-right"
                            data-aos-delay="400"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                className="w-full h-96 object-cover rounded-xl shadow-lg transform hover:scale-105 transition duration-700 ease-in-out"
                                src={productDetails?.image?.url || getDefaultImage()}
                                alt={productDetails?.title || "Product Image"}
                                onError={(e) => {
                                    e.target.src = getDefaultImage();
                                }}
                            />
                        </div>

                        {/* Product Information Section */}
                        <div 
                            className="flex flex-col justify-center space-y-6 p-4"
                            data-aos="fade-left"
                            data-aos-delay="600"
                        >
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-gray-900 relative">
                                {capitalizeFirstLetter(productDetails.title)}
                                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
                            </h1>
                            
                            <p className="text-lg font-semibold text-gray-700" data-aos="fade-up" data-aos-delay="700">
                                {productDetails.content}
                            </p>
                            
                            <div 
                                className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-100"
                                data-aos="fade-up"
                                data-aos-delay="800"
                            >
                                <p className="text-md text-gray-600">{productDetails.description}</p>
                            </div>

                            <h4 
                                className="text-2xl font-bold text-gray-800 flex items-center"
                                data-aos="fade-up"
                                data-aos-delay="900"
                            >
                                Price: 
                                <span className="ml-2 text-3xl text-blue-600 font-extrabold">₹{productDetails.price?.toLocaleString()}</span>
                            </h4>

                            <div 
                                className="flex flex-wrap gap-4"
                                data-aos="fade-up"
                                data-aos-delay="1000"
                            >
                                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                    <p className="text-md text-gray-600">
                                        Category: <span className="text-blue-700 font-medium">{capitalizeFirstLetter(productDetails.category)}</span>
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
                                    <p className="text-md text-gray-600">
                                        Sold: <span className="text-purple-700 font-medium">{productDetails.sold}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div 
                                className="flex flex-col sm:flex-row gap-4 mt-4"
                                data-aos="zoom-in"
                                data-aos-delay="1100"
                            >
                                <button
                                    onClick={() => updateCart(productDetails, 1)}
                                    className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center justify-center"
                                >
                                    <ShoppingCart className="mr-2" /> Add to Cart
                                </button>

                                {/* Back to Products Button */}
                                <Link to="/" className="inline-block">
                                    <button className="w-full py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-full shadow hover:bg-gray-300 transition duration-300 flex items-center justify-center">
                                        <ArrowBackIcon className="mr-2" /> Back to Products
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className="text-center"
                    data-aos="fade-up"
                >
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
                    <h1 className="text-xl font-bold text-white">Loading Product Details...</h1>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;