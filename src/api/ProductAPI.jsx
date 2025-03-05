// import axios from "axios";
// import {useState, useEffect} from "react";

// const ProductAPI = () =>{
//     const [products, setproducts] = useState([]);
//    try{

//     const getProducts = async () =>{ 
//         const res = await axios.get("http://localhost:5000/api/products");
//         setproducts(res.data.products);
//     }

//     useEffect(() =>{
//         getProducts();
//     },[getProducts])
//    }
//    catch(error){
//         console.log(error);
//     }

//     return {
//         products:[products, setproducts]
//     }
// }

// export default ProductAPI;
import axios from "axios";
import { useState, useEffect } from "react";

const ProductAPI = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products");
                setProducts(res.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        getProducts();
    }, []); // Empty dependency array to run only once

    return {
        products: [products, setProducts]
    };
};

export default ProductAPI;
