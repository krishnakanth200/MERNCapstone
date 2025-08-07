import React from "react";
import { Container, Row, Col, Table, Image } from "react-bootstrap";
import { FiPhoneCall } from "react-icons/fi";
import { ImMobile } from "react-icons/im";
import { AiOutlineMail } from "react-icons/ai";
import "./Contact.css"; // Import the CSS file

const Contact = () => {
  return (
    <>
      <Container className="container">
        <Row>
          <Col md={6}>
            <h1>Welcome to Circular-Pi Pizza Store!</h1>
            <p>
              At Circular-Pi, we are passionate about crafting delicious, handcrafted pizzas that bring joy to your taste buds. From our unique circular pies to classic favorites, we use only the freshest ingredients to ensure every bite is a delight.
            </p>
            <p>
              Whether you have questions about our menu, need help with an order, or just want to say hello, we’re here for you. Reach out to us through the contact information below. We look forward to hearing from you and serving you the best pizza in town!
            </p>

            <Table striped bordered hover className="text-center table">
              <thead>
                <tr>
                  <th colSpan={3} className="text-center">
                    --- Contact Details ---
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FiPhoneCall size={24} />
                  </td>
                  <td>Phone</td>
                  <td>0123-456789</td>
                </tr>
                <tr>
                  <td>
                    <ImMobile size={24} />
                  </td>
                  <td>Mobile</td>
                  <td>1234567890</td>
                </tr>
                <tr>
                  <td>
                    <AiOutlineMail size={24} />
                  </td>
                  <td>Email</td>
                  <td>contact@circularpi.com</td>
                </tr>
              </tbody>
            </Table>

            <div className="contact-info">
              <h2>Our Location</h2>
              <p>
                Visit us at our store to enjoy a fresh pizza or pick up your order. We're conveniently located in the heart of the city, and our friendly staff is always ready to welcome you!
              </p>
              <p>
                <strong>Address:</strong> 456 Pizza Lane, Flavor Town, FT 12345
              </p>
            </div>
          </Col>
          <Col md={6}>
            <Image
              src="https://images.pexels.com/photos/6407621/pexels-photo-6407621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Circular-Pi Pizza Store"
              className="image"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Contact;
