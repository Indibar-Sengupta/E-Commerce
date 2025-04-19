// Step 1 connection with server start
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// 1. to connect dotenv package
dotenv.config()
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
// 3. if you using "module" type (check the documentation and package.json what is module type)
      // then if you want to call a function from a file you need to add the extension also like= .js
import connectDB from './config/connectDB.js';
// 7. Connect the user roouter
import userrouter from './routers/user_router.js';

const app=express()
app.use(cors({
  // 1. It is able to access cookies from the client side that's why credential : true
  credential : true,
  // 1. Here we can passs aarray as well as a strings
        // But here we are connect it using .env file
  origin: process.env.FRONTEND_URL
}))
// 1. All request come in form of json
app.use(express.json())

app.use(cookieParser())
// 1. It work as logger when any api call in the terminal it will be display
app.use(morgan())
// 
app.use(helmet({
  // 1. Because when use front and backend in different domain it shows error
        // to prevent it we use this
  crossOriginResourcePolicy : false
}))
// 1. It is because if our port is facing error it will automatically chage to something different
const PORT=8080 || process.env.PORT

app.get("/",(req,res)=>{
  // 1. Server to client side response
  res.json({
    message: "Server is running"+PORT
  })
})

// 7. Now connect the user router
  // Here the userrouter function will be call with attached path
app.use('/api/user',userrouter)

// 3. To check whether DB is connected
// connectDB();

// 3. PORT inside DB to make sure server run only if DB connected
connectDB().then(()=>{

  // 1. For running the server
  app.listen(PORT,()=>
  {
    console.log("Server is running in localhost:",PORT)
  })

})