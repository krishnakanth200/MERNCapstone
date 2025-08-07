import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/products/search', {
                params: {
                    name: searchTerm,
                    category: category,
                    price: price,
                    availability: availability,
                },
            });
            onSearch(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="text"
                    placeholder="Availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="filter-input"
                />
            </div>
        </div>
    );
};

export default SearchBar;
