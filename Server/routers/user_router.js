// 7. Create user router
  // To understand why we use {} here in import and not use anywhere else check exportimport.txt file
// 9. Add the verifyemailcontroller once creating and pushing the value
import {registerusercontroller,updateUserdetails,uploadAvatar,logoutusercontroller,verifyemailcontroller,loginusercontroller,forgotpassword,verifyforgotpasswordotp,resetpasswordafterotpverification,refreshtoken} from '../controllers/user_controller.js'
import auth from '../middleware/auth.js'

import express from 'express';

// 13. For fileupload middleware
import upload from '../middleware/multer.js';

const userrouter = express.Router();

// 7. Here two thing comes from index.js "/api/user and router call"
    // Now we use .post because from here we are calling our controller
    // Which we create to push data into the database
userrouter.post('/register',registerusercontroller)

// 9. push the verify_email = true. Currently in step 9 we can't test it cause this is a verification page
  // run on different ip and port and this is different page it is for frontend.
userrouter.post('/verify-email',verifyemailcontroller)

// 11. Now here the user will be login after successfuly check the refreh and access token
userrouter.post('/login',loginusercontroller)

// 12. Now  call the logout we no need to save so get
  // here we first call the middle ware then the logout 
userrouter.get('/logout',auth,logoutusercontroller)

// 13. here used put cause there are some update command also
  // only login person can upload so auth middleware
  // and want that that user upload a single file so uplod.single(name of file) middleware
  // so if you want to test it in postman use in body->form-data->give avatar in key cause here avatar is name
  // and select file in dropdown and in value upload pic
userrouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)

// 14.Update the user details
  // Use of PUTover POSTbecause
  // PUT=Update/Replace an existing resource, Update profile, upload/change avatar, edit user details, etc.
  // POST=Create a new resource, Register a user, create a new post, etc.
userrouter.put('/update-user',auth,updateUserdetails)
userrouter.put('/forgotpassword',forgotpassword) 
userrouter.put('/verify-forgotpasswordotp',verifyforgotpasswordotp)
userrouter.put('/reset-password',resetpasswordafterotpverification)

// 16. increase the acess token
userrouter.post('/refreshtoken',refreshtoken)

export default userrouter;