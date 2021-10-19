import express from 'express';

const orderRouter = express.Router();


orderRouter.get('/', (req, res) => {
    res.send("test is successful")
})


export default orderRouter