const express = require("express");
const cors = require("cors");
const Port = 3000;
const app = express();
const db = require('./config/mongoose');

const productRoutes = require('./routes/product_routes');

//dotenv.config();

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', productRoutes);

app.listen(Port, () =>{
    console.log(`Server is running on port: ${Port}`);
})