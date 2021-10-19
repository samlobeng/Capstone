import express from 'express';
import createError from 'http-errors';
import UserModel from '../models/User.js'
import { JWTAuthenticate } from "../tools/token.js"

const authRouter = express.Router();

//Register
authRouter.post('/register', async (req, res, next) => {
    try {
        const newUser = new UserModel(req.body)
        const {_id} = await newUser.save()
    
        res.status(201).send({_id})
    } catch (error) {
        next(error);
    }
   
})

//LOGIN
authRouter.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 1. verify credentials
      const user = await UserModel.checkCredentials(email, password)
  
      if (user) {
        // 2. Generate token if credentials are ok
        const accessToken = await JWTAuthenticate(user)
        // 3. Send token back as a response
        const {password, ...others} = user._doc
        res.status(200).json({ ...others, accessToken })
      } else {
        next(createError(401, "Credentials not valid!"))
      }
    } catch (error) {
      next(error)
    }
  })


export default authRouter