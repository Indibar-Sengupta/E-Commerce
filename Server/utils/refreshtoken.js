// Step 11 Create tokens
import jwt from "jsonwebtoken"
import Usermodel from "../models/user_model.js"

const generaterefreshtoken =async (userId)=>{
  // 11. jwt.sign is a build in function which pass payload here we pass id
      // This is the payload user id
  const token =await jwt.sign({id : userId},
      // Next will be the private key present in .env 
    process.env.SECRET_KEY_REFRESH_TOKEN,
      // fINALLY THE EXPIRATION TIME
      {expiresIn : '7d'}
    )

    // So we need to update the token once it expires
    const updaterefreshtoken= await Usermodel.updateOne({_id : userId},{refresh_token : token})
    return token
}
export default generaterefreshtoken