// 7. Create user router
  // To understand why we use {} here in import and not use anywhere else check exportimport.txt file
import {registerusercontroller} from '../controllers/user_controller.js'
import express from 'express';

const userrouter = express.Router();

// 7. Here two thing comes from index.js "/api/user and router call"
    // Now we use .post because from here we are calling our controller
    // Which we create to push data into the database
userrouter.post('/register',registerusercontroller)

export default userrouter;