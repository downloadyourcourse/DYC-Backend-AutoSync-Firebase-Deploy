// const express = require('express');
// const router = express.Router();
// const customer = require('../models/customerModel')


// router.get('/', async(req, res)=>{
//     try{
//         const result = await customer.find();
//         res.status(200).json(result)
//     } catch(err){
//         res.status(400).json({msg: `Db error: ${err}`})
//     }
// })

// router.post('/', async (req, res)=>{
//     // const { name, email, age } = req.body;
//     const { brand, author, title } = req.body;
//     try{
//         const createdCustomer = await customer.create({brand, author, title})
//         res.status(200).json(createdCustomer)
//     } catch(err){
//         res.status(400).json({msg: `Db error: ${err}`})
//     }
// })



// module.exports = router