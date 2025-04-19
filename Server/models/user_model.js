// Step 4 create Schema and model
import mongoose from "mongoose";

// 4. mongoose.schema is a constructor where we define the columns for our user table
const userSchema=new mongoose.Schema({
  // 4. Column name
  name : {
    // 4. Declare datatype
    type : String,
    //  4. It is like NOT NULL if someone didn't provide name the array message will be shown
    required : [true,"Provide name"]
  },
  email : {
    type : String,
    required : [true,"Provide email"],
    // 4. to keep it unique
    unique : [true, "Already Registered"]
  },
  password : {
    type : String,
    required : [true,"Provide password"]
  },
  avatar : {
    type : String,
    // 4. if not given it can be null also by default Null
    default : ""
  },
  mobile : {
    type : Number,
    default : null
  },  
  refresh_token : {
    type : String,
    default : ""
  },
  verify_email : {
    type : Boolean,
    default : false
  }, 
  last_login_date : {
    type : Date,
    default : ""
  },  
  status : {
    type : String,
    // enum used to make sure no other value will be stored here
    enum : ["Active","Inactive","Suspended"],
    // By deafult Active only admin can deactivate
    default : "Active"
  }, 
  // Here we want to store the array of objects
  address_details : [
    {
      // It will be store of array of the object ID
        // So basically ID is something mongoDB give bydefault so we arre using that for joining
      type : mongoose.Schema.ObjectId,
      // This ref refers to the collection in which it will be joining
        //  Here "address" is another collection
      ref : 'address'
    }
  ],
  shopping_cart : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'cartProduct'
    }
  ],
  orderHistory : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'order'
    }
  ],
  forgot_password_otp : {
    type : String,
    default : null
  },
  forgot_password_expiry : {
    type : Date,
    default : ""
  },
  role : {
    type: String,
    enum : ["Admin","User"],
    default : "User"
  }

},
// These remaining two field Created At and Updated At will be generate byDefault so we keep it outside the {}
{
  // timestamps is a keyword of mongo Db which create two field "Created At" and "Updated At" by default 
    // and because we make it true it work once the user fill the form
  timestamps : true
})

// 4. Now create the User model

// 4. mongoose.model is a by default function of mongoose to create a model
      // structure mongoose.model("name","Schema you create")
const Usermodel = mongoose.model("user",userSchema)

export default Usermodel