// Step 11 Create tokens
import jwt from "jsonwebtoken"
const generateaccesstoken =async (userId)=>{
  // 11. jwt.sign is a build in function which pass payload here we pass id
      // This is the payload user id
  const token =await jwt.sign({id : userId},
      // Next will be the private key present in .env 
    process.env.SECRET_KEY_ACCESS_TOKEN,
      // fINALLY THE EXPIRATION TIME
      {expiresIn : '5h'}
    )
    return token
}
export default generateaccesstoken