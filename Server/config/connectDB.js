// Step 3 Connection with Mongo DB
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// 3. checking whether MONGODB_URI available or not
if(!process.env.MONGODB_URI){
  // 3. It is a function which is created to show the error
  throw new error(
    "Please provide MONGODB_URI in the .env file"
  )
}

// 3. Using ofasync-await is to give time to  connect from DB
async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("DB Connected")
  } catch (error) {
      console.log("MongoDB connection error",error)
      // 3. So if it is showing error we need to stop the server
      process.exit(1)
  }
}

export default connectDB