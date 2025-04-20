// Step 12 Create a middleware
import jwt from 'jsonwebtoken'
const auth=async (req, res,next)=>{
try {
  // It is the bearer token ex= ["Bearer","token"]
  const token=req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1])
  // 12. you can see token in terminal
  console.log("token",token)
  console.log("cookies", req.cookies);
  console.log("headers", req.headers);

  // Now check if token is not available
  if(!token){
  // 12. Here we need to past the next controller otherwise in postman no response will shown
    return res.status(401).json({
      message: "Provide token"
    })
  }
  // 12. verify the token from the .env
  const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
  // 12. Here we get the token id
  console.log('decode',decode)
  // 12. Now check if the token id  is expired or not
  if(!decode)
  {
    return res.status(401).json({
      message : "Unauthorised access",
      error : true,
      success : false
    })
  }
  // 12. This is a user Id we can use in out logoutcontroller 
    // Here we change the userId with this id so that in logout it can be checked
    // It maybe a question why this is even though both are same
  req.userId=decode.id

  // 12. After this we neded to pass to next means to the logout part
  next()

} catch (error) {
  return res.status(500).json({
    message : error.message || error,
    error : true,
    success : false
  })
}
}
export default auth