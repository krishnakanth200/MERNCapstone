import React, { useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const UpdateProduct = ({ productId }) => {
  const navigate = useNavigate();
  const isEditing = Boolean(productId); // Check if we're editing an existing product

  useEffect(() => {
    if (isEditing) {
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5002/api/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const product = response.data;
          setInitialValues({
            name: product.name,
            price: product.price,
            tax: product.tax,
            discount: product.discount,
            description: product.description,
            imageurl: product.imageurl,
            category: product.category,
          });
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      fetchProductDetails();
    } else {
      setInitialValues({
        name: '',
        price: '',
        tax: '',
        discount: '',
        description: '',
        imageurl: '',
        category: '',
      });
    }
  }, [productId, isEditing]);

  const [initialValues, setInitialValues] = React.useState({
    name: '',
    price: '',
    tax: '',
    discount: '',
    description: '',
    imageurl: '',
    category: '',
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`http://localhost:5002/api/products/${productId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post('http://localhost:5002/api/products', values, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      setStatus('success');
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(5, 'Name must be at least 5 characters').required('Name is required'),
    price: Yup.number().min(1, 'Price must be greater than 0').required('Price is required'),
    tax: Yup.number().min(0, 'Tax must be 0 or more').required('Tax is required'),
    description: Yup.string().required('Description is required'),
    imageurl: Yup.string().url('Invalid URL').required('Image URL is required'),
    category: Yup.string().required('Category is required'),
  });

  return (
    <div className='container' style={{ marginTop: '80px' }}>
      <h2>{isEditing ? 'Update Product' : 'Add Product'}</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className='mb-3'>
              <label className='form-label'>Name</label>
              <Field type="text" name="name" className='form-control' />
              <ErrorMessage name="name" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Price</label>
              <Field type="number" name="price" className='form-control' />
              <ErrorMessage name="price" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Tax</label>
              <Field type="number" name="tax" className='form-control' />
              <ErrorMessage name="tax" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Discount</label>
              <Field type="number" name="discount" className='form-control' />
              <ErrorMessage name="discount" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Description</label>
              <Field as="textarea" name="description" className='form-control' />
              <ErrorMessage name="description" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Image URL</label>
              <Field type="text" name="imageurl" className='form-control' />
              <ErrorMessage name="imageurl" component="div" className='text-danger' />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Category</label>
              <Field type="text" name="category" className='form-control' />
              <ErrorMessage name="category" component="div" className='text-danger' />
            </div>
            <button type="submit" className='btn btn-primary' disabled={isSubmitting}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {status === 'success' && <p className='text-success mt-3'>Product saved successfully!</p>}
            {status === 'error' && <p className='text-danger mt-3'>Error saving product.</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateProduct;
