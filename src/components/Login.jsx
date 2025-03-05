import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
    });
    
    // Fetch a random image on first load
    const fetchImage = async () => {
      try {
        const res = await fetch('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920');
        setImageUrl(res.url);
      } catch (error) {
        console.error('Image loading failed:', error);
      }
    };
    
    fetchImage();
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('https://ecommerce-5wip.onrender.com/users/login', values, {
        withCredentials: true,
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      toast.success('Login successful');
      navigate('/');
      window.location.reload();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 p-6 border border-gray-100 rounded-2xl shadow-xl">
        {imageUrl && <img src={imageUrl} alt="Login Illustration" className="rounded-xl shadow-lg w-full h-[26rem]" />}
      </div>
      
      {/* Form Section */}
      <div data-aos="fade-up" className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 border border-gray-100 md:w-1/2">
        <h2 data-aos="fade-down" data-aos-delay="200" className="text-3xl font-bold text-center mb-8 text-indigo-800">
          Welcome Back
        </h2>
        
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email Field */}
              <div data-aos="fade-up" data-aos-delay="300">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" placeholder="Enter your email" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password Field */}
              <div data-aos="fade-up" data-aos-delay="400">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" placeholder="Enter your password" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <div data-aos="fade-up" data-aos-delay="500">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md">
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                <p className="mt-6 text-center text-sm text-gray-600">
                  Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300">Sign up</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
