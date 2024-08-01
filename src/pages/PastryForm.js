import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../CSS/PastryForm.css';

const PastryForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: '',
    description: '',
    category: '',
    quantity: '',
    price: '', // Added price field
  });

  const [pastries, setPastries] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products2');
        const data = await response.json();
        setPastries(data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cakes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Show success message
        Swal.fire("Success", "Pastry added successfully");
  
        // Reset form data
        setFormData({
          id: '',
          name: '',
          image: '',
          description: '',
          category: '',
          quantity: '',
          price: '', // Reset price field
        });
        setEditingId(null);
  
        // Re-fetch the pastries
        const fetchProducts = async () => {
          try {
            const response = await fetch('http://localhost:3001/api/products2');
            const data = await response.json();
            setPastries(data);
          } catch (error) {
            console.error('Error fetching products', error);
          }
        };
  
        fetchProducts();
  
      } else {
        Swal.fire("Error", "Failed to add pastry");
      }
    } catch (error) {
      console.error('Error adding product', error);
      Swal.fire("Error", "There was an error adding the product");
    }
  };
  
 
  //Udapte Product
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...formData }),
      });
      const data = await response.json();
      if (response.ok) {
        setPastries((prevPastries) =>
          prevPastries.map((item) => (item.id === editingId ? data : item))
        );
        Swal.fire("Success", "Pastry updated successfully");
      } else {
        Swal.fire("Error", "Failed to update pastry");
      }
      setFormData({
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        quantity: '',
        price: '', // Reset price field
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product', error);
      Swal.fire("Error", "There was an error updating the product");
    }
  };

  const handleEdit = (pastry) => {
    setFormData(pastry);
    setEditingId(pastry.id);
  };

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

      setPastries(pastries.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Pastry Details</h2>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="name">Name</label></td>
              <td>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="image">Image URL</label></td>
              <td>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="description">Description</label></td>
              <td>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="category">Category</label></td>
              <td>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="cake">Cake</option>
                  <option value="pastry">Pastry</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="quantity">Quantity</label></td>
              <td>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="price">Price</label></td> {/* Added price label */}
              <td>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" style={{backgroundColor:'green'}}>Submit</button>
      </form>
      <div className="table-container">
        <h2>Pastries</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th> {/* Added Price column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pastries.map((pastry) => (
              <tr key={pastry.id}>
                <td>{pastry.name}</td>
                <td><img src={pastry.image} alt={pastry.name} width="50" /></td>
                <td>{pastry.description}</td>
                <td>{pastry.category}</td>
                <td>{pastry.quantity}</td>
                <td>${pastry.price}</td> {/* Display price */}
                <td>
                  <button onClick={() => handleEdit(pastry)} style={{backgroundColor:'blue'}}>Edit</button>
                  <button onClick={() => handleDelete(pastry.id)} style={{backgroundColor:'red'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastryForm;
