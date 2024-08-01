import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

const CakesTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Function to get query parameters
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const category = getQueryParam('category'); // Get the category from query parameters

    if (category) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:3001/api/products', { params: { category } });
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching product data:', error);
          setError('Failed to load products.');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [location.search]); // Re-run the effect if query parameters change

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Cakes Table</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell><img src={product.image}/></TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>Rs: {product.price}/-</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CakesTable;
