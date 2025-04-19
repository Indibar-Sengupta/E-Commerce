import mongoose from "mongoose";

const orderschema= new mongoose.Schema({
  userID :{
    type : mongoose.Schema.ObjectId,
    ref : "user"
  },
  orderID :{
    type : mongoose.Schema.ObjectId,
    ref : [true, "Provide orderID"],
    unique : true
  },
  productID :  {
    type :  mongoose.Schema.ObjectId,
    ref : "product"
  },
  product_details : {
    name : String,
    image : Array,
  },
  paymentId:{
    type :String,
    default  : ""
  },
  paymentStatus:{
    type :String,
    default  : ""
  },
  delivery_address:{
    type : mongoose.Schema.ObjectId,
    ref  : "address"
  },
  subTotalAmt:{
    type : Number,
    default  : 0
  },
  totalAmt:{
    type : Number,
    default  : 0
  },
  invoice_receipt:{
    type : String,
    default  : ""
  }
},
{
  timestamps : ttrue
})
const ordermodel= mongoose.model('order',orderschema)
export default ordermodel