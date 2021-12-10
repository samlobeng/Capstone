import express from 'express';
import { JWTAuthMiddleware } from '../tools/middleware.js';
import CartModel from '../models/Cart.js';
import createError from 'http-errors'

const cartRouter = express.Router();


//CREATE USER CART

cartRouter.post("/", JWTAuthMiddleware, async (req, res) => {
        const newCart = new CartModel(req.body)
        try {
            const savedCart = await newCart.save()
            res.status(200).json(savedCart)
        } catch (error) {
            res.status(500).json(error)
        }
   
})

//GET USER CART
cartRouter.get('/:userId', JWTAuthMiddleware, async(req, res, next) => {
   try {
    const cart = await this.CartModel.findById({userId: req.params.userId});
    res.status(200).json(cart);

   } catch (error) {
   res.status(500).json(error)
   }
})

// //GET ALL CART
cartRouter.get('/', JWTAuthMiddleware, async(req, res, next) => {
   try {
       const carts = await CartModel.find()
       res.status(200).json(carts)
   } catch (error) {
       res.status(500).json(error)
   }
 })


//UPDATE
cartRouter.put('/:id', JWTAuthMiddleware, async (req, res, next) => {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true
                }
            )
            res.status(200).json(updatedCart);
           
        } catch (error) {
            res.status(500).json(error);
        }
       
  
  });

  //DELETE PRODUCT
  cartRouter.delete("/:id", JWTAuthMiddleware, async (req, res) => {
      try {
          const cart = await CartModel.findByIdAndDelete(req.params.id);
          res.status(200).json(`Cart with id ${cart} has been deleted`);
      } catch (error) {
        next(
            createError(
              500,
              `An error occurred while deleting cart`
            )
          );
      }
  })


  
export default cartRouter