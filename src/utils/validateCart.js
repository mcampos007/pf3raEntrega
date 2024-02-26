import express from 'express';

const router = express.Router();

function validateCart(req, res, next) {
    
    const { quantity, products,  } = req.body;
   // console.log(req.body);
  
    /* if (!quantity) {
      return res.json({
        error: "Quantity is required",
      });
    } */

  
    if (!products) {
      return res.json({
        error: "Product is required",
      });
    }

    next();
  }

  function checkUserCart(req, res, next){
    /* console.log(req.user)
    console.log(req.params)
    if (req.params.pid != req.user.userId){
      return res.json({
        error: "El Carrito NO pertenece al usuario actual",
      });
    } */
   
    next();
  }
  
  export { validateCart, checkUserCart };