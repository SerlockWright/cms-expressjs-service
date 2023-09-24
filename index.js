const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// route
const userRoute = require('./routes/user.route');

dotenv.config();
app.use(cors());


// connect DB
const uri = process.env.DB_CONNECT;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin_db").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
mongoose.connect(
  uri, 
  {
    useNewUrlParser: true
  }
)
.then(() => console.log("You successfully connected to MongoDB!"))
.catch(err => console.log('Connect Fail: ', err))

// send html
app.get('/', (_, res) => {
  res.send('API running');
})

// middlewares
app.use(express.json({ extend: true }));

app.listen(3000, () => {
  console.log(`Server Up and running localhost:${3000}`)
})

// route
app.use('/api/users', userRoute)


/* domain: localhost:3000/
- /api/user -> user route (get all, get one user, update user, delete user)
- /api/product -> user route (get all, get one product, update product, delete product)
*/













/*
- controller -> call api -> retrive api FE, response BE
- service -> code logic -> get, delete, update data in database
- middleware -> 1 thằng trung gian giữa FE vs BE. Example: authenticate, authorize
- route -> direction api.
- module
*/
