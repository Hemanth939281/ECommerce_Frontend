import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserAPI = (token) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (!token) return;
        
        const getUser = async () => {
            try {
                const res = await axios.get("https://ecommerce-5wip.onrender.com/users/info", {
                    headers: { Authorization: token },
                    withCredentials: true,
                });
                
                setIsLoggedIn(true);
                setUser(res.data);
                setIsAdmin(res.data.role === 1);
                setIsLoading(false);
                
                // Fetch cart data
                try {
                    const cartRes = await axios.get("https://ecommerce-5wip.onrender.com/api/getCart", {
                        headers: { Authorization: token },
                    });
                    setCart(cartRes.data.cart);
                } catch (error) {
                    console.error("Cart fetch error:", error.response?.data?.msg || error.message);
                }
            } catch (error) {
                console.error("User fetch error:", error.response?.data?.msg || error.message);
                setIsLoading(false);
            }
        };
        
        getUser();
    }, [token]);

    // Update Cart Function (Add or Update)
    const updateCart = async (product, quantity = 1) => {
        if (!user) {
            return alert("Please log in to update the cart.");
        }
        
        const newCart = [...cart]; // Copy current cart
        const index = newCart.findIndex((item) => item.productId === product._id);
        
        if (index !== -1) {
            // If item exists, update quantity
            newCart[index].quantity = quantity;
        } else {
            // If item doesn't exist, add new item
            newCart.push({ productId: product._id, quantity });
        }
        
        try {
            const res = await axios.post(
                "https://ecommerce-5wip.onrender.com/api/updateCart",
                { cart: newCart }, // Backend expects entire cart array
                { headers: { Authorization: token } }
            );
            
            setCart(res.data.cart);
            
            // Show toast and wait for it to be visible before redirecting
            toast.success("Cart updated successfully!");
            
            return res.data;
        } catch (error) {
            console.error("Update cart error:", error.response?.data?.msg || error.message);
            toast.error("Failed to update cart");
            throw error;
        }
    };

    // Delete Cart Item Function
    const deleteCartItem = async (productId) => {
        if (!user) {
            return alert("Please log in to modify the cart.");
        }
        
        try {
            const res = await axios.delete(`https://ecommerce-5wip.onrender.com/api/deleteCartItem/${productId}`, {
                headers: { Authorization: token },
            });
            
            setCart(res.data.cart); // Ensure the response contains the updated cart
            toast.success("Item removed from cart");
            return res.data;
        } catch (error) {
            console.error("Delete cart item error:", error.response?.data?.msg || error.message);
            toast.error("Failed to remove item");
            throw error; // Rethrow the error so it can be caught in the component
        }
    };

    return {
        isLoggedIn,
        isAdmin,
        user,
        cart,
        setCart,
        isLoading,
        updateCart,
        deleteCartItem,
    };
};

export default UserAPI;