import mongoose from "mongoose";

const cartproductschema= new mongoose.Schema({
  productId : {
    type : mongoose.Schema.ObjectId,
    ref : "product"
  },
  quantity : {
    type : Number,
    default : 0
  },
  userId : {
    type : mongoose.Schema.ObjectId,
    ref : "user"
  },
  userId : {
    type : mongoose.Schema.ObjectId,
    ref : "user"
  },

},
{
  timestamps : true
})
const cartproductmodel = mongoose.model('cartproduct',cartproductschema)
export default cartproductmodel