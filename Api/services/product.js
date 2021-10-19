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

//GET one user
// userRouter.get('/:id', JWTAuthMiddleware, async(req, res, next) => {
//    try {
//     const users = await UserModel.findById(req.params.id);
//     if(req.user.isAdmin === true){
//     const {password, ...others} = users._doc
//     res.status(200).json(others);
//     }
//     else{
//         res.status(404).json("You are not allowed to perform this request");
//     }
//    } catch (error) {
   
//    }
// })

// //GET ALL users
// userRouter.get('/', JWTAuthMiddleware, async(req, res, next) => {
//     const query = req.query.new
//     try {
//         if(req.user.isAdmin === true){
//      const users = query ? await UserModel.find().sort({_id:-1}).limit(5) : await UserModel.find() ;
//      res.status(200).json(users)
//         } 
//         else{
//             res.status(404).json("You are not allowed to perform this request");
//         }
//     } catch (error) {
//      next(
//          createError(
//            500,
//            `An error occurred while fetching users`
//          )
//        );
//     }
//  })

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

//   userRouter.delete("/:id", JWTAuthMiddleware, async (req, res) => {
//       try {
//         if(req.user.isAdmin === true){
//           const user = await UserModel.findByIdAndDelete(req.params.id);
//           res.status(200).json(`User with id ${user} has been deleted`);
//         }
//         else{
//             res.status(404).json("You are not allowed to perform this request");
//         }
//       } catch (error) {
//         next(
//             createError(
//               500,
//               `An error occurred while deleting user`
//             )
//           );
//       }
//   })

//   userRouter.get("/stats", JWTAuthMiddleware, async (req, res) => {
//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
//     try {
//       const data = await UserModel.aggregate([
//         { $match: { createdAt: { $gte: lastYear } } },
//         {
//           $project: {
//             month: { $month: "$createdAt" },
//           },
//         },
//         {
//           $group: {
//             _id: "$month",
//             total: { $sum: 1 },
//           },
//         },
//       ]);
//       res.status(200).json(data)
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  
export default productRouter