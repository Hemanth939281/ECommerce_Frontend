import { createContext, useState, } from "react";
import ProductApi from "../api/ProductAPI";
const AuthContext = createContext();
import { useEffect } from "react";
import axios from "axios";
import UserAPI from "../api/UserAPI";

export const AuthProvider = ({ children }) => {
  
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [token, setToken] = useState(null);


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openLoginModal = () =>{
    setShowLoginModal(true);
    closeModal();
  }

  const closeLoginModal = () =>{
    setShowLoginModal(false);
  }

  const refreshtoken = async () =>{
   try{
    const refreshtoken = await axios.get("https://ecommerce-5wip.onrender.com/users/refreshtoken",{
      withCredentials:true
    });
    console.log("refreshtoken",refreshtoken.data.accessToken);
    setToken(refreshtoken.data.accessToken);
   }
   catch(error){
     console.log("error refreshing token", error);
     localStorage.removeItem("accessToken");
     setToken(null);
   }
  }

  useEffect(() =>{
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if(token){
      refreshtoken()
    } else {
      setToken(null);
    }
  },[])


  const state = {
    token: [token, setToken],
    ProductApi: ProductApi(),
    UserAPI: UserAPI(token),
  }
  return (
    <AuthContext.Provider value={{ state, openModal, closeModal,setShowModal, showModal, openLoginModal, closeLoginModal, showLoginModal}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
