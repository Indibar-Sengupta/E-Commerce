// Step 5 creating or register new users

// make sure to write .js in every file which are imported cause we are using "type : module"  in this project
import Usermodel from "../models/user_model.js";
// Because it is a package so no need to use .js
  //  and we use bcrypt to make password into #
import bcryptjs from "bcryptjs"
import sendEmail from "../config/sendEmail.js";
import verifyemailtemplate from "../utils/verifyEmailTemplate.js";

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


// export default registerusercontroller;