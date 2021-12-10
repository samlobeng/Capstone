import express from 'express';
import { JWTAuthMiddleware } from '../tools/middleware.js';
import createError from 'http-errors'
import Stripe from 'stripe'


const KEY = process.env.STRIPE_KEY
const stripe = new Stripe('sk_test_51JoErYG7BMWvJIE31lY86P4wt7nZ44l38j6jbMR2qE1Jo4ytM6pP55HHBvvqsPefJXvm3arPIkpnG9mGPHpOs2gF00DG0wZnAD')
const stripeRouter = express.Router();

stripeRouter.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "eur",
    }, (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).json(stripeErr);
        }else{
            res.status(200).json(stripeRes)
        }
    })
})


export default stripeRouter