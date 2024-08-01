import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders'); // Replace with your API endpoint
        console.log('Fetched orders:', response.data); // Log the response data
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching order data');
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;


  //Remove Cake
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      const result = await response.text(); // Assuming the server responds with plain text
      console.log('Product deleted:', result);

    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
       <h1> Orders Table</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => {
              console.log('Order:', order); // Log each order to check its structure
              const { bookingId, cakeName,customerFirstName, customerLastName } = order; // Access the properties directly from the order object

              return (
                <TableRow key={bookingId}>
                  <TableCell>{bookingId}</TableCell>
                  <TableCell>{cakeName}</TableCell>
                  <TableCell>{customerFirstName}</TableCell>
                  <TableCell>{customerLastName}</TableCell>
                  <TableCell>{customerLastName}</TableCell>
                  <TableCell><button  onClick={() => handleDelete(bookingId)}  style={{backgroundColor:'#1f6904f5',fontSize:'x-small'}}>Paid</button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderTable;
