import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./services/users.js";
import { createServer } from "http";
import listEndpoints from "express-list-endpoints";
import authRouter from "./services/auth.js";
import productRouter from "./services/product.js";
import { compareSync } from "bcrypt";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/users", userRouter);
app.use("/auth", authRouter);
// app.use("/carts", cartRouter);
app.use("/products", productRouter);


const server = createServer(app);

 console.log(listEndpoints(app))

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
    console.log('SUCCESS: connected to MONGODB');
    server.listen(PORT, () => {
      listEndpoints(app);
      console.log('SERVER listening on: ' + PORT);
    });
  });
  