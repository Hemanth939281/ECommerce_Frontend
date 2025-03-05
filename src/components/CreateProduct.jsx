import { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    product_id: '',
    title: '',
    content: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const { state } = useContext(AuthContext);
  const token = state.token;

  const [message, setMessage] = useState(''); // For displaying messages
  const [loading, setLoading] = useState(false); // Loading state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file input (image upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    setProductData({ ...productData, image: file });
  };

  // Step 1: Upload image to Cloudinary via backend
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', productData.image); // Append the image file

      // Upload image via your backend
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', authorization: token },
        withCredentials: true, // Send the token
      });
      const res = await axios.get("http://localhost:5000/api/upload", {
        headers: {
          'Content-Type': 'multipart/form-data',
            Authorization: token
        },
        withCredentials:true
    });

      return response.data.url; // Return the Cloudinary image URL
    } catch (error) {
      console.log('Error uploading image:',error.response.data.msg || error.message)
      throw new Error('Image upload failed.');
    }
  };

  // Step 2: Submit product data along with the image URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload the image first and get the URL
      const imageUrl = await uploadImage();

      // Prepare the product data including the uploaded image URL
      const productDetails = {
        product_id: productData.product_id,
        title: productData.title,
        content: productData.content,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image: imageUrl, // Use the image URL from Cloudinary
      };

      // Send product data to backend for product creation
      const response = await axios.post('http://localhost:5000/api/products', productDetails, {
        headers: { authorization: token },
        withCredentials: true, // Send token and cookies
      });

      setMessage(response.data.message); // Show success message
      setLoading(false);
    } catch (err) {
      setMessage('Product creation failed.');
      setLoading(false);
      alert(err.response.data.msg || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Create a Product</h2>
      {message && <p className="text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product form fields */}
        <div className="mb-4">
          <label htmlFor="product_id" className="block mb-1 font-bold">Product ID</label>
          <input
            type="text"
            name="product_id"
            value={productData.product_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 font-bold">Title</label>
          <input
            type="text"
            name="title"
            value={productData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block mb-1 font-bold">Content</label>
          <textarea
            name="content"
            value={productData.content}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-bold">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-1 font-bold">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block mb-1 font-bold">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block mb-1 font-bold">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
