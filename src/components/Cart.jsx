import { useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import ProductAPI from "../api/ProductAPI";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AOS from "aos";
import "aos/dist/aos.css";

const Cart = () => {
    const { state } = useContext(AuthContext);
    const userAPI = state?.UserAPI || {};
    const deleteCartItem = userAPI.deleteCartItem || (() => console.error("deleteCartItem is not defined"));
    const updateCart = userAPI.updateCart || (() => console.error("updateCart is not defined"));
    
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const { products } = ProductAPI();
    const [allProducts] = products;

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: false,
            mirror: true,
        });
    }, []);

    // Merge cart data with product details whenever cart or products change
    useEffect(() => {
        if (userAPI.cart && allProducts.length > 0) {
            const enrichedCart = userAPI.cart.map(cartItem => {
                const product = allProducts.find(p => p._id === cartItem.productId);
                return product ? { 
                    ...product, 
                    quantity: cartItem.quantity,
                    productId: cartItem.productId // Make sure productId is also in the enriched item
                } : null;
            }).filter(item => item !== null);
            
            setCartItems(enrichedCart);
            setIsLoading(false);
        } else if (userAPI.cart && userAPI.cart.length === 0) {
            setCartItems([]);
            setIsLoading(false);
        }
    }, [userAPI.cart, allProducts]);

    // Update Quantity
    const updateQuantity = async (productId, delta) => {
        // Find the cart item
        const currentItem = cartItems.find(item => item._id === productId);
        if (!currentItem) return;
        
        // Calculate new quantity
        const newQuantity = Math.max(1, (currentItem.quantity || 1) + delta);
        
        // Update local state for immediate UI feedback
        setCartItems(prev => 
            prev.map(item => 
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
        
        // Call the API to update the cart
        try {
            // Pass the product object and new quantity to updateCart
            await updateCart({ _id: productId }, newQuantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
            // Revert to previous state if error occurs
            setCartItems(prev => 
                prev.map(item => 
                    item._id === productId ? { ...item, quantity: currentItem.quantity } : item
                )
            );
        }
    };

    // Delete Item
    const handleDelete = async (productId) => {
        try {
            // Show user feedback immediately
            setCartItems(prev => prev.filter(item => item._id !== productId));
            
            // Call API to delete the item
            await deleteCartItem(productId);
            console.log("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting item:", error);
            // If there's an error, refresh the cart data
            if (userAPI.cart) {
                const enrichedCart = userAPI.cart.map(cartItem => {
                    const product = allProducts.find(p => p._id === cartItem.productId);
                    return product ? { ...product, quantity: cartItem.quantity, productId: cartItem.productId } : null;
                }).filter(item => item !== null);
                
                setCartItems(enrichedCart);
            }
        }
    };

    const totalAmount = cartItems.reduce((acc, item) => 
        acc + (item.price || 0) * (item.quantity || 1), 0);

    const getDefaultImage = () => "/api/placeholder/300/300";

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center" data-aos="fade-up">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-xl text-gray-600 font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white">
            <div 
                className="w-full max-w-7xl"
                data-aos="fade-down"
                data-aos-delay="100"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 text-center">Your Shopping Cart</h2>
                <div className="w-20 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            </div>
            
            {cartItems.length === 0 ? (
                <div 
                    className="text-center py-12 bg-white rounded-xl shadow-md w-full max-w-2xl"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <div className="text-8xl text-gray-300 mb-4 flex justify-center">🛒</div>
                    <p className="text-2xl text-gray-600 mb-4">Your cart is empty</p>
                    <p className="text-gray-500 mb-8">Add some products to your cart and come back!</p>
                    <a 
                        href="/" 
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg inline-block"
                    >
                        Continue Shopping
                    </a>
                </div>
            ) : (
                <div className="w-full max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {cartItems.map((item, index) => (
                            <div
                                key={item._id}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                                data-aos="fade-up"
                                data-aos-delay={100 + (index % 5) * 100}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <div className="mb-4 overflow-hidden rounded-lg">
                                    <img
                                        className="w-full h-48 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                                        src={item?.image?.url || getDefaultImage()}
                                        alt={item.title || "Product Image"}
                                        onError={(e) => {
                                            e.target.src = getDefaultImage();
                                        }}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {item.title || "No Title"}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description || "No Description"}</p>
                                <p className="text-xl font-bold text-blue-600 mb-4">₹{item.price?.toLocaleString() || 0}</p>
                                
                                <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-full p-1">
                                    <button
                                        onClick={() => updateQuantity(item._id, -1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-200 rounded-full focus:outline-none hover:bg-gray-100 transition-all shadow-sm"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold px-4">{item.quantity || 1}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-200 rounded-full focus:outline-none hover:bg-gray-100 transition-all shadow-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 font-medium">
                                        Total: <span className="text-blue-600 font-bold">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                    </p>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                                        aria-label="Remove item"
                                    >
                                        <DeleteOutlineIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div 
                        className="mt-12 bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="mb-4 sm:mb-0">
                            <p className="text-gray-600 mb-1">Cart Total</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            <ShoppingCartCheckoutIcon /> Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;