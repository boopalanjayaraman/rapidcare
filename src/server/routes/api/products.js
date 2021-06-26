const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");

//// import container
const Container = require("typedi").Container;

//// import services
const ProductService = require("../../services/productService");
const LogService = require("../../services/logService");

let productService = Container.get(ProductService);
let logService = Container.get(LogService);

// @route GET api/products/getproducts
// @desc gets the products according to a criteria
// @access Public
router.get("/getproducts", async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    if(currentUser){
        logService.info('getproducts operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    }
    else {
        logService.info('getproducts operation is invoked by a public user.');
    }
    

    try {
        //// call user service
        const { errors, result } = await productService.getProducts(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getproducts operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

module.exports = router;