import express from 'express';
import { JWTAuthMiddleware } from '../tools/middleware.js';
import OrderModel from '../models/Order.js';
import createError from 'http-errors'

const orderRouter = express.Router();


 //GET MONTHLY INCOME

 orderRouter.get('/income', JWTAuthMiddleware, async(req, res, next)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    if(req.user.isAdmin === true){
        try {
            const income = await OrderModel.aggregate([
                { $match: { createdAt: { $gte: previousMonth}}},
                {
                    $project: {
                      month: { $month: "$createdAt" },
                      sales: "$amount",
                    },
                  },
                  {
                    $group: {
                      _id: "$month",
                      total: { $sum: "$sales" },
                    },
                  },
            ]);
            res.status(200).json(income)
        } catch (error) {
            res.status(500).json(error)
        }
    }
  })


//CREATE USER ORDER

orderRouter.post("/", async (req, res) => {
  console.log('be?')
        const newOrder = new OrderModel(req.body)
        try {
            const savedOrder = await newOrder.save()
            res.status(200).json(savedOrder)
        } catch (error) {
            res.status(500).json(error)
        }
   
})

//GET USER ORDERS
orderRouter.get('/:userId', async(req, res, next) => {
   try {
    const orders = await OrderModel.findById({userId: req.params.userId});
    res.status(200).json(orders);

   } catch (error) {
   res.status(500).json(error)
   }
})

// //GET ALL ORDERS
orderRouter.get('/', JWTAuthMiddleware, async(req, res, next) => {
    if(req.user.isAdmin === true){
   try {
       const orders = await OrderModel.find()
       res.status(200).json(orders)
   } catch (error) {
       res.status(500).json(error)
   }
}
 })


//UPDATE ORDER
orderRouter.put('/:id', JWTAuthMiddleware, async (req, res, next) => {
    if(req.user.isAdmin === true){
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true
                }
            )
            res.status(200).json(updatedOrder);
           
        } catch (error) {
            res.status(500).json(error);
        }
    }
  
  });

  //DELETE ORDERS
  orderRouter.delete("/:id", JWTAuthMiddleware, async (req, res) => {
    if(req.user.isAdmin === true){
      try {
          const orders = await OrderModel.findByIdAndDelete(req.params.id);
          res.status(200).json(`Order with id ${orders} has been deleted`);
      } catch (error) {
        next(
            createError(
              500,
              `An error occurred while deleting order`
            )
          );
      }
    }
  })

 
  
export default orderRouter