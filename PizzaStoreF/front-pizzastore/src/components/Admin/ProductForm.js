import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductForm.css'; // Import the updated CSS file

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Update state for image URL
  const [category, setCategory] = useState('');
  const [tax, setTax] = useState('');
  const [discount, setDiscount] = useState('');
  const [availability, setAvailability] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { productId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5002/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const product = response.data;
          setName(product.name);
          setPrice(product.price);
          setDescription(product.description);
          setImageUrl(product.image || ''); // Update to handle image URL
          setCategory(product.category);
          setTax(product.tax || '');
          setDiscount(product.discount || '');
          setAvailability(product.availability !== undefined ? product.availability : true);
        } catch (err) {
          console.error('Error fetching product details:', err);
          setError('Error fetching product details');
        }
      };

      fetchProductDetails();
    }
  }, [productId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      price,
      description,
      image: imageUrl, // Use image URL
      category,
      tax,
      discount,
      availability,
    };

    
    console.log('Image URL:', imageUrl);
    console.log('Product Data:', productData);

    try {
      if (productId) {
        await axios.put(`http://localhost:5002/api/products/${productId}`, productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Product updated successfully');
      } else {
        await axios.post('http://localhost:5002/api/products', productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Product added successfully');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error submitting the form:', err);
      setError('Error submitting the form');
    }
  };

  return (
    <div className="product-form-container" style={{ marginTop: '80px' }}>
      <h2>{productId ? 'Update Product' : 'Add New Product'}</h2>
      {error && <p className="product-form-text-danger">{error}</p>}
      {success && <p className="product-form-text-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="product-form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            className="product-form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="product-form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="product-form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="product-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="product-form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="product-form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            className="product-form-control"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="product-form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="product-form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Pizza">Pizza</option>
            <option value="Drinks">Drinks</option>
            <option value="Combos">Combos</option>
            <option value="Desserts">Desserts</option>
            <option value="Sides">Sides</option>
            <option value="Pastas">Pastas</option>
            <option value="New Launches">New Launches</option>
          </select>
        </div>
        <div className="product-form-group">
          <label htmlFor="tax">Tax</label>
          <input
            type="number"
            className="product-form-control"
            id="tax"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
        </div>
        <div className="product-form-group">
          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            className="product-form-control"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <div className="product-form-group">
          <label htmlFor="availability">Available</label>
          <input
            type="checkbox"
            id="availability"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
          />
        </div>
        <button type="submit" className="product-form-btn-primary">
          {productId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
