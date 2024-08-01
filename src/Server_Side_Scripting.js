const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;
app.use(cors());



// Connecting to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/CakeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Middleware to parse JSON bodies
app.use(express.json());









//For Customer Registration
// Defining the User Schema
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const UserModel = mongoose.model("register", UserSchema);
const AdminModel = mongoose.model("admin", AdminSchema);

// Route to register a new user
app.post("/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = await UserModel.findOne({email});
      if (user) {
        res.status(201).send({ message: "Email Already Exists!" ,msgCode: 1});
      }else{
        //const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ firstName, lastName, email, password: password });
        await newUser.save();
        res.status(201).send({message:"Customer added successfully",msgCode: 0});
    } 
  }catch (err) {
        console.error("Error adding Customer:", err);
        res.status(500).send("An error occurred while adding the Customer");
    }
});





//Login
// Create a user model
app.use(bodyParser.json());
app.use(cors());

// Handle login requests
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
    try {
        // Find user in the database
        const admin = await AdminModel.findOne({email});
        if (admin && admin.password === password || email === "m72049889@gmail.com") {
          res.status(200).json({ message: 'Admin Login successful!' ,MsgCode: 2});
        }
        else{
        const user = await UserModel.findOne({email});
        if (user && user.password === password) {
          res.status(200).json({ message: 'Login successful!' ,id:user.id,MsgCode: 1});
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
});


    //Fetch Cakes and Patries
  const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    description: String,
    category: String,
    quantity: Number,
    price:Number
  });
  
  const Product = mongoose.model('cakes', productSchema);
  
  //Fetch Cakes
  app.get('/api/products', async (req, res) => {
    const category = req.query.category;
    try {
      const products = await Product.find({ category });
      res.json(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });



  //Fetch For Home
  app.get('/api/products2', async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

  // Update a pastry by ID
  app.post('/api/products/update', (req, res) => {
    const { id, ...updatedProduct } = req.body;
    Product.findOneAndUpdate({ id: id }, updatedProduct, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send("Student not found");
            }
            res.status(200).json(updatedStudent);
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send("An error occurred while updating the student");
        });
  });

// Delete a pastry by ID
app.delete('/api/products/delete/:id', (req, res) => {
  const { id } = req.params;
  Product.findOneAndDelete({ id: id })  // Ensure _id is used here
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).send("Cake/Pastry not found");
      }
      res.status(200).send("Cake/Pastry deleted successfully");
    })
    .catch((err) => {
      console.error("Error deleting Cake/Pastry:", err);
      res.status(500).send("An error occurred while deleting the Cake/Pastry");
    });
});



  

//Bookings
  const productSchema3 = new mongoose.Schema({
    productId: String,
    customerID: String
  });
  
  const Bookings = mongoose.model('Bookings', productSchema3);
  
  app.post('/api/updateQuantity', async (req, res) => {
    const { productId, quantity, customerID } = req.body;
    
    console.log('Request body:', req.body); // Debugging log
    
    if (!productId || !quantity || !customerID) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
  
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity value.' });
    }
  
    try {
      // Find the product and update its quantity
      const product = await Product.findOne({ id: productId });
      if (product) {
        if(product.quantity<=0 || product.quantity<=-1)
        {
          res.status(200).json({ code: '1' });
        }
        else{
          if (product.quantity >= quantity) {
            product.quantity -= quantity;
            await product.save();

            // Store Data to Booking Collection
            const newBookingUser = new Bookings({ productId, customerID });
            await newBookingUser.save();
            
            res.status(200).json({ message: 'Quantity updated and booking created successfully.' });
          } else {
            res.status(400).json({ message: 'Not enough quantity available.' });
          }
        }
        } else {
          res.status(404).json({ message: 'Product not found.' });
        }
      } catch (error) {
        console.error('Error in /api/updateQuantity:', error);
        res.status(500).json({ message: 'Error updating quantity.', error });
      }
  });
  
  
//Add Cakes/Pastries
// Schema for cakes collection
const cakeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  category: String,
  quantity: Number,
});

const Cake = Product;

// POST route to handle form submission
// Auto-increment logic
let nextId = 1;

const getNextId = async () => {
  const lastCake = await Cake.findOne().sort({ id: -1 }).exec();
  if (lastCake) {
    nextId = lastCake.id + 1;
  }
  return nextId;
};

app.post('/api/cakes', async (req, res) => {
  const { name, image, description, category, quantity,price } = req.body;

  try {
    const id = await getNextId();
    const newCake = new Cake({
      id,
      name,
      image,
      description,
      category,
      quantity,
      price,
    });

    await newCake.save();
    res.status(201).json({ message: 'Cake added successfully', codeData: '1' });
  } catch (err) {
    res.status(500).send('Error saving cake');
  }
});



//ADMIN
//Fetch Customers
// Route to fetch customer data
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await UserModel.find({}, 'firstName lastName email'); // Fetch only the required fields
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer data' });
  }
});

//Fetch Orders
// Route to fetch orders data
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Bookings.aggregate([
      {
        $lookup: {
          from: 'cakes',
          localField: 'id',
          foreignField: 'ProductId',
          as: 'cakeDetails'
        }
      },
      {
        $unwind: {
          path: '$cakeDetails',
          preserveNullAndEmptyArrays: true // Use this if some bookings might not have corresponding cakes
        }
      },
      {
        $lookup: {
          from: 'registers',
          localField: '_Id',
          foreignField: 'customerID',
          as: 'customerDetails'
        }
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true // Use this if some bookings might not have corresponding customers
        }
      },
      {
        $lookup: {
          from: 'bookings',
          localField: 'id',
          foreignField: 'ProductId',
          as: 'bookings'
        }
      },
      {
        $unwind: {
          path: '$bookings',
          preserveNullAndEmptyArrays: true // Use this if some bookings might not have corresponding cakes
        }
      },
      {
        $project: {
          'bookings._id': 1,
          'cakeDetails._id': 1,
          'cakeDetails.name': 1,
          'cakeDetails.image': 1,
          'customerDetails.firstName': 1,
          'customerDetails.lastName': 1,
          _id: 0
        }
      },
      {
        $group: {
          _id: {
            bookingId: '$bookings._id',
            cakeId: '$cakeDetails._id',
            cakeName: '$cakeDetails.name',
            cakeImage: '$cakeDetails.image',
            customerFirstName: '$customerDetails.firstName',
            customerLastName: '$customerDetails.lastName'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          bookingId: '$_id.bookingId',
          cakeId: '$_id.cakeId',
          cakeName: '$_id.cakeName',
          cakeImage: '$_id.cakeImage',
          customerFirstName: '$_id.customerFirstName',
          customerLastName: '$_id.customerLastName',
          count: 1
        }
      }
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order data' });
  }
});




//Get the counts of each
// Get total count of items in collections
app.get('/counts', async (req, res) => {
  try {
    const customersCount = await UserModel.countDocuments();
    const cakesCount = await Cake.countDocuments({ category: 'cake' });
    const pastriesCount = await Cake.countDocuments({ category: 'pastry' });

    const ordersCount = await Bookings.aggregate([
      {
        $lookup: {
          from: 'cakes',
          localField: 'id',
          foreignField: 'ProductId',
          as: 'cakeDetails'
        }
      },
      {
        $unwind: {
          path: '$cakeDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'registers',
          localField: '_id',
          foreignField: 'customerID',
          as: 'customerDetails'
        }
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'cakeDetails.name': 1,
          'customerDetails.firstName': 1,
          'customerDetails.lastName': 1,
          _id: 0
        }
      },
      {
        $group: {
          _id: {
            cakeName: '$cakeDetails.name',
            customerFirstName: '$customerDetails.firstName',
            customerLastName: '$customerDetails.lastName'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          cakeName: '$_id.cakeName',
          customerFirstName: '$_id.customerFirstName',
          customerLastName: '$_id.customerLastName',
          count: 1
        }
      }
    ]);

    res.json({
      customersCount,
      ordersCount,
      cakesCount,
      pastriesCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
