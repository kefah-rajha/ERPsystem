import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import  cors from 'cors';
import authRouter from "./Router/auth.router"
import userRouter from "./Router/user.router"
import categoryRouter from "./Router/category.router"
import productRouter from "./Router/products.router" 
import  supplierRouter  from "./Router/supplier.router";




import { connect } from "mongoose";

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
app.use(cookieParser())
const corsOptions: cors.CorsOptions = {
  origin: 'http://your-client-domain.com', // Replace with your client's origin
  credentials: true, // Allow cookies
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));
connect('mongodb://127.0.0.1:27017/ERPsystem').then(
  () => {console.log("connect is done")},
  (err:unknown) => { console.log(err) }
);
app.use(express.json({  limit: '50mb'}))
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}))
app.get("/", (req: Request, res: Response) => {

  res.send("Express + TypeScript Server");
});
app.use("/api",authRouter)
app.use("/api",userRouter)
app.use("/api",categoryRouter)
app.use("/api",productRouter)
app.use("/api",supplierRouter)









app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});