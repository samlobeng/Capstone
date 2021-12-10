import express from 'express';
import { JWTAuthMiddleware } from '../tools/middleware.js';
import ProductModel from '../models/Product.js';
import createError from 'http-errors'

const productRouter = express.Router();


//CREATE PRODUCT

productRouter.post("/", JWTAuthMiddleware, async (req, res) => {
    if(req.user.isAdmin === true){
        const newProduct = new ProductModel(req.body)
        try {
            const savedProduct = await newProduct.save()
            res.status(200).json(savedProduct)
        } catch (error) {
            res.status(500).json(error)
        }
    }
})

//GET Products
productRouter.get('/:id', /*JWTAuthMiddleware,*/ async(req, res, next) => {
   try {
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json(product);

   } catch (error) {
   res.status(500).json(error)
   }
})

//GET ALL Products
productRouter.get('/', /*JWTAuthMiddleware,*/ async(req, res, next) => {
    const queryNew = req.query.new
    const queryCategory = req.query.category
    try {
        let products
        if (queryNew) {
            products = await ProductModel.find().sort({createdAt: -1}).limit(5)
        }
        else if(queryCategory) {
            products = await ProductModel.find({
                categories: { 
                    $in: [queryCategory],
                }
            })
        }
        else {
            products = await ProductModel.find()

        }
     res.status(200).json(products)
    } catch (error) {
     next(
         createError(
           500,
           `An error occurred while fetching products`
         )
       );
    }
 })


//UPDATE
productRouter.put('/:id', JWTAuthMiddleware, async (req, res, next) => {
    if(req.user.isAdmin === true){
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true
                }
            )
            res.status(200).json(updatedProduct);
           
        } catch (error) {
            res.status(500).json(error);
        }
       
    }
  });

  //DELETE PRODUCT
  productRouter.delete("/:id", JWTAuthMiddleware, async (req, res) => {
      try {
        if(req.user.isAdmin === true){
          const product = await ProductModel.findByIdAndDelete(req.params.id);
          res.status(200).json(`Product with id ${product} has been deleted`);
        }
        else{
            res.status(404).json("You are not allowed to perform this request");
        }
      } catch (error) {
        next(
            createError(
              500,
              `An error occurred while deleting product`
            )
          );
      }
  })


  
export default productRouter