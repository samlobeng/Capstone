import express from 'express';

const cartRouter = express.Router();


cartRouter.get('/', (req, res) => {
    res.send("test is successful")
})



export default cartRouter