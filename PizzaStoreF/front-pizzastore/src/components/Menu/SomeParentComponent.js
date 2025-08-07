import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu/Menu';

const SomeParentComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get('/api/menus/categories')
      .then(response => setCategories(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleOrder = (productId) => {
    // Handle placing the order logic
    console.log('Order placed for product:', productId);
  };

  return (
    <Menu
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
      onOrder={handleOrder}
    />
  );
};

export default SomeParentComponent;
