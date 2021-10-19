import express from "express";
import { JWTAuthMiddleware } from "../tools/middleware.js";
import UserModel from "../models/User.js";
import createError from "http-errors";

const userRouter = express.Router();


userRouter.get("/stats", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET one user
userRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.findById(req.params.id);
    if (req.user.isAdmin === true) {
      const { password, ...others } = users._doc;
      res.status(200).json(others);
    } else {
      res.status(404).json("You are not allowed to perform this request");
    }
  } catch (error) {}
});

//GET ALL users
userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  const query = req.query.new;
  try {
    if (req.user.isAdmin === true) {
      const users = query
        ? await UserModel.find().sort({ _id: -1 }).limit(5)
        : await UserModel.find();
      res.status(200).json(users);
    } else {
      res.status(404).json("You are not allowed to perform this request");
    }
  } catch (error) {
    next(createError(500, `An error occurred while fetching users`));
  }
});

userRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      next(createError(404, `User with _id ${userId} not found`));
    }
  } catch (error) {
    next(
      createError(
        500,
        `An error occurred while updating user ${req.params.userId}`
      )
    );
  }
});

userRouter.delete("/:id", JWTAuthMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin === true) {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json(`User with id ${user} has been deleted`);
    } else {
      res.status(404).json("You are not allowed to perform this request");
    }
  } catch (error) {
    next(createError(500, `An error occurred while deleting user`));
  }
});




export default userRouter;
