
import axios from "axios";
import { useState, useEffect } from "react";

const ProductAPI = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get("https://ecommerce-5wip.onrender.com/api/products");
                setProducts(res.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        getProducts();
    }, []); 

    return {
        products: [products, setProducts]
    };
};

export default ProductAPI;
