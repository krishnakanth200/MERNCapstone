import React from 'react';
import './Home.css'; 
// Carousel Component
const Carousel = () => {
  const images = [
    'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
    'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg',
    'https://images.pexels.com/photos/1878346/pexels-photo-1878346.jpeg',
    'https://images.pexels.com/photos/1460873/pexels-photo-1460873.jpeg',
    'https://images.pexels.com/photos/1435900/pexels-photo-1435900.jpeg'
  ];

  return (
    <div className="carousel">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
      ))}
    </div>
  );
};

// Typing Animation Component
const TypingAnimation = () => {
  const [text, setText] = React.useState('');
  const fullText = "  Welcome to Circular-Pie";

  React.useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index += 1;
      if (index >= fullText.length-1) 
        clearInterval(intervalId);
    }, 100);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <h1><b>{text}</b></h1>
  );
};

// About Section Component
const AboutSection = () => {
  const historyItems = [
    {
      title: 'Ancient Beginnings',
      description: 'Pizza has been around since ancient times, with flatbreads being topped with various ingredients.',
      image: 'https://www.rd.com/wp-content/uploads/2022/03/GettyImages-530662286-history-of-pizza-ADedit.jpg'
    },
    {
      title: 'Medieval Innovations',
      description: 'During the medieval era, pizzas began to resemble the modern pizza with the addition of tomatoes and cheese.',
      image: 'https://www.historytoday.com/sites/default/files/articles/pizza.jpg'
    },
    {
      title: 'Modern Day Pizza',
      description: 'Pizza became globally popular in the 20th century, with endless variations and toppings.',
      image: 'https://images.pexels.com/photos/162744/tomatoes-tomato-quiche-red-yellow-162744.jpeg'
    }
  ];

  return (
    <div className="about-section">
      <h2>About the Pizza Store</h2>
      <div className="cards-container">
        {historyItems.map((item, index) => (
          <div key={index} className="card">
            <img src={item.image} alt={item.title} className="card-image" />
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="home-container">
      <Carousel />
      <div className="store-name">
        <TypingAnimation />
      </div>
      <AboutSection />
    </div>
  );
};

export default Home;
