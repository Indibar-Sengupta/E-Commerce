import mongoose from "mongoose";

const subcategoryschema= new mongoose.Schema({
  name : {
    type : String,
    default : ""
  },
  image : {
    type : Array,
    default : []
  },
  category : [
    {
      type : mongoose.Schema.ObjectId,
      ref : "category"
    }
  ]
},
{
  timestamps : true
})
const subcategorymodel= mongoose.model("subcategory",subcategoryschema)
export default subcategorymodel