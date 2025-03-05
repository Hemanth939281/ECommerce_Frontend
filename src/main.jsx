import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error from './components/Error.jsx'; 
import { AuthProvider } from './components/AuthContext.jsx';
import Login from './components/Login.jsx';
import Cart from './components/Cart.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Register from './components/Register.jsx';
import CreateProduct from './components/CreateProduct.jsx';
import Contact from './components/Contact..jsx';
const appRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/about",
                    element: <About />
                },
                {
                    path: "/cart",
                    element: <Cart />
                },
                {
                    path: "/contact",
                    element:<Contact />
                },
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/register",
                    element: <Register />
                },
                {
                    path: "/detail/:id",
                    element: <ProductDetails />
                },
                {
                    path: "/create_product",
                    element: <CreateProduct/>
                }
            ],
            errorElement: <Error />
        },
    ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={appRouter} />
    </AuthProvider>
);
