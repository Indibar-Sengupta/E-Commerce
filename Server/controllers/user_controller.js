// Step 5 creating or register new users

// make sure to write .js in every file which are imported cause we are using "type : module"  in this project
import Usermodel from "../models/user_model.js";
// Because it is a package so no need to use .js
  //  and we use bcrypt to make password into #
import bcryptjs from "bcryptjs"
import sendEmail from "../config/sendEmail.js";
import verifyemailtemplate from "../utils/verifyEmailTemplate.js";
import generateaccesstoken from "../utils/accesstoken.js";
import generaterefreshtoken from "../utils/refreshtoken.js";
import uploadimage from "../utils/uploadimageCloudinary.js";
import generateOtp from "../utils/generateotpforforgotpassword.js";
import forgotpasswordemailtemplate from "../utils/forgotpasswordEmailTemplate.js"
// 16. For refresh token
import jwt from 'jsonwebtoken'

export async function registerusercontroller(req,res) {
  try {
    //5.Now ask the client to fill the value
      // Here in user_model there are some required field and just extract from the request body
      const {name, email, password} = req.body
    // 5. Now if these mandatory field not given then it will show error in client side
      if (!name || !email || !password)
      {
        // 5. 400 is a client side error
        console.log('Missing fields');
        return res.status(400).json({
          message : "Name, Email and password is mandatory",
          error : true,
          success : false
        })
      }
      // 5. Now we want to fetch wheter email is pre regitered
        // we use await because it might take time to fetch the data from the server
        // and using Usermodel DB we are finding the email ID
      const user= await Usermodel.findOne({email})

      if(user)
      {
        return res.json({
          message : "User already registered",
          error : "true",
          success : "false"
        })
      }

      // 5. Now we need to convert the password in the # format
        // to give us this security we need "bycrypt"

      // 5. To do this we use salt and hash
        // salt generate some random number and also how much number to be add
          // Structure= .genSalt(10)
      const salt = await bcryptjs.genSalt(10)
      // 5. It is a function to convert password to hash
        // Structure= .hash(providedpassword,)
      const hashpassword = await bcryptjs.hash(password,salt)
      
      // 5. Now insert into database
      const payload = {
        name,
        email,
        password : hashpassword
      }

      const newUser = new Usermodel(payload)
      const save = await newUser.save()
      // 6. It will be after verifyemail section and verifyemailTemplate.js
        // so when user click on verify email link we want to take it to frint end not on the backend
        // ${process.env.FRONTEND_URL}=this is for calling the URL 
        // /verify-email is a string
        // ? is for passing parameter as URL
        // code=${save?._id} passing the id of save variable {for ?. check optional chaining}
      const verifyEmailUrl= `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

      // 6. After this we need to check whether the email is valid or not to do this we will send email
        // 6. to do this we need resend.com 1st connect the resend with this and install here
      const verifyemail= await sendEmail({
        sendTo : email,
        subject : "Verification email from Mudikhana",
        // 6. This is a template to create template we create a html file inside utils
        html : verifyemailtemplate({
            name,
            url : verifyEmailUrl
        })
      })

      // 6. If everything fine then user created successfully
      return res.json({
        message : "User registered Successfully",
        error : false,
        success : true,
        data : save
      })

  } catch (error) {
    // 5. status code is given cause if it is error then it is server error not mandatory
      // we pass the message from the json message
    return res.status(500).json({      
    message : error.message || error,
    error : true,
    success : false
    })
  }
}

// 8th Step= email verification done by user
  // Once user click the link provided in the email a new link will open present in the FRONTEND in .env
    // in which the "code" is there mentioned in the line-67
export async function verifyemailcontroller(req,res) {
  try {
    // 8. Now get the code from url
    const code = req.body.code;
      // You can write like this also it means fetch code param from req and add in variable code
      // const {code}= req.body
    // 9. Using code we fetch the database and check is there any user present with the code
    const user= await Usermodel.findOne({_id : code})
    if(!user)
    {
      return res.status(400).json({      
        message : "Invalid User",
        error : true,
        success : false
        })
    }
    // 9. If present then update code of mongo db
    const updateuserverify_email= await Usermodel.updateOne({_id : code},
      {
        verify_email : true
      }
    )
    return res.json({
      message : "Successfully verify the email",
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({      
      message : error.message || error,
      error : true,
      success : false
      })
  }
  
}

// 10th step create login for user

export async function loginusercontroller(req,res){

  try {
    const {email,password} = req.body
    
    const user= await Usermodel.findOne({email})

    // 10. First we will check wheter user is already registered
    if(!user){
      return res.status(400).json({
        message : "User not registered",
        error : true,
        success : false
      })
    }

    // 10. First we will check wheter user is Active or suspended to do that we get from user_model
    if(user.status !=='Active'){
      return res.status(400).json({
        message : "User Deactivate contact to Admin",
        error : true,
        success : false
      })
    }

    // 10. Here instead of findOne we use compare because password is created as in bcryptjs(hash)
      // so that's why to remove the random value we need to use bcrypt.compare
    const checkpassword= await bcryptjs.compare (password,user.password)

    if(!checkpassword){
      return res.status(400).json({
        message : "Incorrect Password Please try again",
        error : true,
        success : false
      })
    }

    // 11. Now for login we need to pass the refresh and access token to client side
    const accesstoken = await generateaccesstoken(user._id)
    const refreshtoken = await generaterefreshtoken(user._id)

    const cookieoption={
      httpOnly :true,
      // false for dev true for prod
      secure : false, //true
      // samesite : "None" because our front and backend in different domain that's why otherwise cookies will not set
        // Basically None for production Lax for dev
      sameSite : "Lax" //None
    }
    // 11. here we need to pass the tokens in cookies and cookies is a built in function 
      // otherwise whennever the server refresh it will leave
    res.cookie('accessToken',accesstoken,cookieoption)
    res.cookie('refreshToken',refreshtoken,cookieoption)

    return res.json({
      message : "Login Successfully",
      error: false,
      success : true,
      // We need to pass the token also
      data : {
        accesstoken,
        refreshtoken
      }
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error: true,
      success : false
    })
  }
}

// 11. Step to logout option

export async function logoutusercontroller(req,res) {
  
  // 11. In login we provide the access token so in logout we need to remove it
  try {

    // 11. We want that logout only call those person who has login to do that we create a middleware
    // 12. After creating middleware auth.js we store the uId which need to be logout
    const userid=req.userId

    const cookieoption={
      httpOnly :true,
      // false for dev true for prod
      secure : false, //true
      // samesite : "None" because our front and backend in different domain that's why otherwise cookies will not set
        // Basically None for production Lax for dev
      sameSite : "Lax" //None
    }
    // name of the Token we provide during login
    res.clearCookie("accessToken",cookieoption)
    res.clearCookie("refreshToken",cookieoption)

    // 12. after accessing the userId from auth.js and check in the DB search with ID
    const removeRefreshtoken= await Usermodel.findByIdAndUpdate(userid,{
      refresh_token : ""
    })

    return res.json({
      message : "Logout Successfull",
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

// 13. Now add to make user upload pic we want that only those who are login they can upload to do this we did in router
export async function uploadAvatar(req,res){
  try {
    // 13. To do this need to use multer so install multer and create a multer middleware and connect in router
      // and this is we getting from multer middleware due to pic is a file so we fetch file samehere
    const image=req.file
    // 13. So we want only login person to do so in router we passing auth middleware so we can fetch Id from auth
      // middleware just like we did for logout
    const userId=req.userId
    console.log("image",image)

    const upload= await uploadimage(image)
    // 13. Calling the uploadimage file
    const updateUse=await Usermodel.findByIdAndUpdate(userId,{
      avatar : upload.url
    })

    // 13. Also we want to push the url in the mongo
    return res.json({
      message : "Upload Profile",
      error: false,
      success : true,
      // 13. In data all the image's thing will be shownbut we need only url but here just for testing we pass full data 
      data : upload,
      // 13. And this is the url which is going to insertrd along with the userID which will be fetched
      insertedData : {
        _id : userId,
        avatar : upload.url
      }
    })

  }catch (error) {
      return res.status(500).json({
        message : error.message || error,
        error : true,
        success : false
      })
    }
}

// 14th Step Update user details
export async function updateUserdetails(req,res){
  try {
    // 14. Here if user want to update  it's details those who is logged in so from auth middleware
    const userId=req.userId
    const {name, email, mobile, password}=req.body

      // 14. we can update those who are already present so first we need to check whether it is present or not
    const updateData = {};
    let hashpassword=""
    // 14. It check if name is there then add the new name
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (mobile) updateData.mobile = mobile;
      if (password) {
        const salt = await bcryptjs.genSalt(10);
        hashpassword = await bcryptjs.hash(password, salt);
        updateData.password = hashpassword;
      }
      // 14. And here on the basis of ID the data will be updated on their respected columns
      const updateUser = await Usermodel.findByIdAndUpdate(userId,updateData,{
        // <-- returns the updated document
        new: true,
      });

      return res.json({
        message : "Data Updated Successfully",
        error : false,
        success : true,
        data : updateUser
      })

  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

// 15 Step. Forgot password
export async function forgotpassword(req,res){
  try {
    const {email}=req.body
    const user=await Usermodel.findOne({email})

    if(!user){
      return res.status(400).json({
        message : "User Not Registered",
        error : true,
        success : false
      })
    }
    
    // 15. Create a function ffor create random number as otp
    const otp= generateOtp()
    // Now expiration of otp in 1 hour
    const expiretime=new Date()+60*60*1000 
    // Now we have to store it in the database so that we can check the forgot password
      // Here we not just want to find but update these field
    const update= await Usermodel.findOneAndUpdate({email},{
      forgot_password_otp : otp,
      // the password should be in the IST format
      forgot_password_expiry : new Date(expiretime).toISOString()
    })

    // 15. Now for sending the email we will call from sendEmail file

    await sendEmail({
      sendTo : email,
      subject : "Otp from Mudikhana",
      html : forgotpasswordemailtemplate({
        name : user.name,
        otp : otp
      })
    })

    return  res.json({
      message : "Otp Send check your email",
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message || message,
      error : true,
      success : false
    })
  }
}

// 15. Now verify the forgot password otp
export async function verifyforgotpasswordotp(req,res){
  try {
    const {email,otp}=req.body
    if(!email || !otp){
      return res.status(401).json({
        message : "Provide required email",
        error : true,
        success : false
      })
    }
    const user=await Usermodel.findOne({email})

    if(!user){
      return res.status(400).json({
        message : "User Not Registered",
        error : true,
        success : false
      })
    }
    // 15. Now check whether the otp provided by user still valid or expired
    const currentTime=new Date().toISOString()
    if(user.forgot_password_expiry< currentTime){
      return res.status(400).json({
        message : "Otp is expired",
        error : true,
        success : false
      })
    }
    // Now if not expire then match with the otp stored in DB
    if(otp!==user.forgot_password_otp){
      return res.status(400).json({
        message : "Invalid Otp",
        error : true,
        success : false
      })
    }
    // No need to add else cause when all if not work this will work
      return res.json({
        message : "Otp Verified Successfully",
        error : true,
        success : false
      })
    
  } catch (error) {
    return res.status(500).json({
      message : error.message || message,
      error : true,
      success : false
    })
  }
}

// 15. Now after verification reset password
export async function resetpasswordafterotpverification(req,res){
  try {
    const {email, newpassword, confirmpassword}=req.body
    if(!email || !newpassword || !confirmpassword){
      return res.status(400).json({
        message : "Provide email and password",
        error : true,
        success : false
      })
    }

    const user=await Usermodel.findOne({email})
    if(!user){
      return res.status(400).json({
        message : "Provide valid email",
        error : true,
        success : false
      })
    }

    if(newpassword!==confirmpassword){
      return res.status(400).json({
        message : "New password and confirm passwword not same",
        error : true,
        success : false
      })
    }

    const salt = await bcryptjs.genSalt(10)

    const hashpassword = await bcryptjs.hash(newpassword,salt)

    const updatepassword= await Usermodel.findByIdAndUpdate(user._id,{
      password : hashpassword
    })

    return res.json({
      message : "password Updated successfully",
      error : false,
      success : true
    })
    
    } catch (error) {
      return res.status(500).json({
      message : error.message || message,
      error : true,
      success : false
    })
  }
}

// 16 step increase the life span of access token using refresh token
export async function refreshtoken(req,res){
  try {

    // 16. First fetch refresh token from 
    // refreshToken is the name you find in login controller
    //  sometime when we use app on mobile cookies is not set so we use bearer token
    // at that time blank present in .split("") will be fill with token but we need only 1st one
    const refreshtoken = req.cookies.refreshToken || 
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  
    console.log("refreshtoken",refreshtoken)
    if(!refreshtoken){
      return res.status(401).json({
        message : "Invalid token",
        error : true,
        success : false
      })
    }
    
    // 16. Because here it has a refrnce token so neeed to pass the reference token
    const verifytoken= await jwt.verify(refreshtoken,process.env.SECRET_KEY_REFRESH_TOKEN)

    // Now check the expiration
    if(!verifytoken){
      return res.status(401).json({
        message : "Token expired",
        error : true,
        success : false
      })
    }
    
    // 16. Here in verifytoken we recieve id, iat and exp we need id from this
    console.log ("verifytoken",verifytoken)

    // Now we store the id
    const userId=verifytoken._id

    // 16. If not expire then we generate a new token and pass to client side
    const newaccesstoken= await generateaccesstoken(userId)

    // 16. cookieoption from login
    const cookieoption={
      httpOnly :true,
      // false for dev true for prod
      secure : false, //true
      // samesite : "None" because our front and backend in different domain that's why otherwise cookies will not set
        // Basically None for production Lax for dev
      sameSite : "Lax" //None
    }

    // Now pass to accessToken same name as login from login
    res.cookie('accessToken',newaccesstoken,cookieoption)

    return res.json({
      message : "New Access Token Generated",
      error : false,
      success : true,
      data : {
        accesstoken : newaccesstoken
      }
    })

  } catch (error) {
    return res.status(500).json({
    message : error.message || message,
    error : true,
    success : false
  })
}
}