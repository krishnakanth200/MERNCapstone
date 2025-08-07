import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Popup from './Popup'; // Ensure Popup is correctly imported
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/reviews/product/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        const checkAdmin = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setIsAdmin(user.role === 'admin');
            }
        };

        fetchProduct();
        fetchReviews();
        checkAdmin();
    }, [id]);

    const addToCart = async () => {
        if (!product) return; // Ensure product is defined

        try {
            const response = await axios.post('http://localhost:5002/api/cart/add', {
                productId: id,
                quantity: 1,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('Cart updated:', response.data);
            setShowPopup(true);

            // Hide popup after 4 seconds (handled by Popup component)
            setTimeout(() => {
                setShowPopup(false);
            }, 4000);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5002/api/products/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const submitReview = async () => {
        try {
            await axios.post('http://localhost:5002/api/reviews', {
                product: id,
                rating: newReview.rating,
                comment: newReview.comment,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewReview({ rating: 0, comment: '' });
            const updatedReviews = await axios.get(`http://localhost:5002/api/reviews/product/${id}`);
            setReviews(updatedReviews.data);
        } catch (error) {
            console.error('Error submitting review:', error);
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

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="product-detail">
            <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Tax: ${product.tax}</p>
                    <p>Discount: {product.discount}%</p>
                    <div className="rating">
                        {renderStars(product.averageRating)}
                        <span>({product.averageRating})</span>
                    </div>
                    <button onClick={addToCart}>Add to Cart</button>
                </div>
            </div>

            {isAdmin && (
                <div className="admin-controls">
                    <button onClick={() => console.log('Edit Product')}>Edit Product</button>
                    <button onClick={handleDelete}>Delete Product</button>
                </div>
            )}

            <div className="reviews-section">
                <h3>Reviews</h3>
                <div className="reviews">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review._id} className="review">
                                <p><strong>{review.user.username}:</strong> {review.comment}</p>
                                <div>{renderStars(review.rating)}</div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
                <div className="add-review">
                    <h4>Add a Review</h4>
                    <div className="star-rating">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={30}
                                color={index < newReview.rating ? "#ffc107" : "#e4e5e9"}
                                onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                    </div>
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Comment"
                    />
                    <button onClick={submitReview}>Submit Review</button>
                </div>
            </div>

            {/* Popup Component */}
            <Popup 
                message="Item added to cart!" 
                show={showPopup} 
                onClose={() => setShowPopup(false)} 
            />
        </div>
    );
};

export default ProductDetail;
