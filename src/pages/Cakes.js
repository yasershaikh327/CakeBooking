import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import '../CSS/Cakes.css';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

function Cakes() {
  const [selectedOption, setSelectedOption] = useState('pastry');
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/products?category=${selectedOption}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleQuantityChange = (id, event) => {
    console.log(`Updating quantity for product ID ${id}: ${event.target.value}`);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: event.target.value,
    }));
  };

  const handleClick = async (id) => {
    const quantity = quantities[id]?.trim();
    console.log(`Clicked buy for product ID ${id}, quantity: ${quantity}`);

    if (!quantity || isNaN(quantity) || parseInt(quantity, 10) < 1) {
      Swal.fire('Please enter a valid quantity.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/updateQuantity', {
        productId: id,
        quantity: parseInt(quantity, 10),
        customerID: localStorage.getItem("authToken")
      });

      Swal.fire(response.data.message);
      if (response.data.code === '1') {
        Swal.fire('Out of Stock!!!');
      } else {
        const response1 = await axios.get(`http://localhost:3001/api/products?category=${selectedOption}`);
        setProducts(response1.data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Swal.fire('There is not enough stock at this moment.');
    }
  };

  return (
    <div>
      <h1>Our Cakes</h1>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="products" name="products" value={selectedOption} onChange={handleOptionChange}>
          <FormControlLabel value="pastry" control={<Radio />} label="Pastries" />
          <FormControlLabel value="cake" control={<Radio />} label="Cakes" />
        </RadioGroup>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity Available</TableCell>
              {isLoggedIn && (
                <>
                  <TableCell>Select Quantity</TableCell>
                  <TableCell>Buy</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image} alt={product.name} className="product-image" style={{ width: '100px', height: '100px', borderRadius: '20px' }} />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  {isLoggedIn && (
                    <>
                      <TableCell>
                        <input
                          type='number'
                          min='1'
                          style={{ textAlign: 'center', fontFamily: 'cursive', fontSize: 'large' }}
                          value={quantities[product.id] || ''}
                          onChange={(e) => handleQuantityChange(product.id, e)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          style={{ color: 'green', border: '2px solid green', fontWeight: 'bold' }}
                          onClick={() => handleClick(product.id)}
                          disabled={(quantities[product.id]?.trim() === '' || quantities[product.id] === undefined || product.quantity < parseInt(quantities[product.id], 10))}
                        >
                          BUY
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Cakes;
