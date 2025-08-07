import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const endpoint = selectedCategory ? 
          `http://localhost:5002/api/products/category/${selectedCategory}` :
          'http://localhost:5002/api/products';
        const response = await axios.get(endpoint);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const filtered = products
      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(product => {
        const price = parseFloat(product.price);
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        return (
          (isNaN(min) || price >= min) &&
          (isNaN(max) || price <= max)
        );
      });
    setFilteredProducts(filtered);
  }, [searchTerm, minPrice, maxPrice, products]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5002/api/cart/add', {
        productId,
        quantity: 1,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding product to cart.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        size={20}
        color={index < rating ? "#ffc107" : "#e4e5e9"}
        style={{ marginRight: 5 }}
      />
    ));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="product-list-container">
      <h1>{selectedCategory || 'All Products'}</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="price-filters">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>
        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="Pizza">Pizzas</option>
            <option value="Sides">Sides</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
            <option value="Pastas">Pastas</option>
            <option value="Combos">Combos</option>
            <option value="NewLaunches">New Launches</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-cards">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>Price: {product.price}</p>
                <p>{product.description}</p>
                <div className="rating">
                  {renderStars(product.averageRating)}
                  <span>{product.averageRating}</span>
                </div>
                <button className="btn btn-primary" onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductList;
