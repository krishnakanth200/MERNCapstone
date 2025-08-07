import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const categories = [
  {
    name: 'Pizza',
    image: 'https://www.pizzahut.co.in/_next/static/static/images/menu/pizzas.in.a9926df87d2018e94648d42f21d28135.jpg',
    description: 'Delicious pizzas with a variety of toppings to choose from.',
    link: '/products/Pizza'
  },
  {
    name: 'Pasta',
    image: 'https://api.pizzahut.io/v1/content/en-in/in-1/images/side/tandoori-paneer-pasta-single.fb174afb4c037117481d4bb2bf6ad1e3.1.jpg',
    description: 'Hearty pasta dishes with rich sauces.',
    link: '/products/Pasta'
  },
  {
    name: 'Sides',
    image: 'https://www.pizzahut.co.in/_next/static/static/images/menu/sides.in.c990a97aa3479a5f5ff83851f8aa0a5f.jpg',
    description: 'Crunchy sides and appetizers to complement your meal.',
    link: '/products/Sides'
  },

  {
    name: 'Drinks',
    image: 'https://www.pizzahut.co.in/_next/static/static/images/menu/drinks.in.1b3f9278478b39b66e516f8746c88d7b.jpg',
    description: 'Refreshing drinks to quench your thirst.',
    link: '/products/Drinks'
  },
  {
    name: 'Desserts',
    image: 'https://www.pizzahut.co.in/_next/static/static/images/menu/desserts.in.bbd71eefd158755883b453fed36fcc50.jpg',
    description: 'Sweet desserts to end your meal on a high note.',
    link: '/products/Desserts'
  },
  {
    name: 'Combos',
    image: 'https://pizzahut.co.in/_next/static/static/images/menu/deals.in.5a74e59ab67d678e3d0668417616f951.jpg',
    description: 'Special combos and deals for a complete meal.',
    link: '/products/Combos'
  },
  {
    name: 'New Launches',
    image: 'https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2023-04/Pizza%20Hut%20has%20launched%2010%20exciting%20and%20unique%20flavours_11zon.jpg',
    description: 'Exciting new items that have just launched.',
    link: '/products/NewLaunches'
  }
];

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="menu-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <h1>Menu</h1>
      <div className="category-cards">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div key={index} className="category-card">
              <Link to={category.link}>
                <img src={category.image} alt={category.name} className="category-image" />
                <div className="category-info">
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <button className="view-more-button">View More</button>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-results">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
