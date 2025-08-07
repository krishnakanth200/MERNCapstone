import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products');
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5002/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error deleting product');
    }
  };

  const handleEdit = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  const handleAdd = () => {
    navigate('/update-product');
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <div className="header-container">
        <h2>Product List</h2>
        <button className="add-product-button" onClick={handleAdd}>Add New Product</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {error && <p>{error}</p>}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image || 'default-image-url'} alt={product.name} />
            <div className="product-card-body">
              <h5 className="product-card-title">{product.name}</h5>
              <p className="product-card-price">${product.price}</p>
              <div className="product-card-buttons">
                <button onClick={() => handleEdit(product._id)}>Update</button>
                <button className="delete" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
