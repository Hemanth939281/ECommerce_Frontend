import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Curated list of high-quality, relevant images for registration forms - defined OUTSIDE the component
const curated_images = [
  {
    desktop: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&h=900",
    mobile: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&h=300",
    alt: "Team collaboration at desk",
    headline: "Join Our Community",
    subheading: "Connect with professionals and start your journey with us today."
  },
  {
    desktop: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&h=900",
    mobile: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&h=300",
    alt: "Business team meeting",
    headline: "Better Together",
    subheading: "Create an account and discover new opportunities with our platform."
  },
  {
    desktop: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&h=900",
    mobile: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=300",
    alt: "Collaborative workspace",
    headline: "Welcome Aboard",
    subheading: "Take the first step toward achieving your goals with us."
  },
  {
    desktop: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&h=900",
    mobile: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&h=300", 
    alt: "Modern workspace with laptop",
    headline: "Start Your Journey",
    subheading: "Join thousands of users already benefiting from our services."
  },
  {
    desktop: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&h=900",
    mobile: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&h=300",
    alt: "Digital collaboration",
    headline: "Create Your Account",
    subheading: "Unlock premium features and connect with our community."
  }
];

const Register = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Now we can reference curated_images since it's defined before this line
  const [imageIndex] = useState(() => Math.floor(Math.random() * curated_images.length));

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:5000/users/register', values, {
        withCredentials: true,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.accessToken);

      navigate('/login');
      toast.success('Registration successful');
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Get the selected image data
  const selectedImage = curated_images[imageIndex];

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
        <img 
          src={selectedImage.desktop} 
          alt={selectedImage.alt}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute z-20 bottom-0 left-0 right-0 p-12 text-white">
          <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">{selectedImage.headline}</h1>
          <p className="text-xl opacity-90" data-aos="fade-up" data-aos-delay="100">
            {selectedImage.subheading}
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div 
          data-aos="fade-up" 
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <h2 
            data-aos="fade-down" 
            data-aos-delay="200" 
            className="text-3xl font-bold text-center mb-8 text-indigo-800"
          >
            Create Account
          </h2>
          
          {/* Mobile only image */}
          <div className="mb-6 rounded-xl overflow-hidden lg:hidden" data-aos="zoom-in">
            <img 
              src={selectedImage.mobile} 
              alt={selectedImage.alt} 
              className="w-full h-48 object-cover"
            />
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div data-aos="fade-up" data-aos-delay="300">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div data-aos="fade-up" data-aos-delay="500">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div data-aos="fade-up" data-aos-delay="600">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                  <p className="text-center text-sm mt-6 text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300">Log In</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;