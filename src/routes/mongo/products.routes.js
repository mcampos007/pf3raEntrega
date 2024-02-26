//import { Router } from "express";
import CustomRouter from '../custom/custom.router.js';
import { validateProduct } from "../../utils/validateProduct.js";
import {getAll, save, findById, findByTitle, deleteProduct, update} from "../../controllers/products.controller.js"
//import __dirname from "../../utils.js";


///const router = Router();

export default class ProductsRouter extends CustomRouter {
    init() {

        //Recuperar todos los productos
        this.get('/', ["PUBLIC"], getAll );

        // Recuperar un producto por ID
        this.get('/:pid', ["PUBLIC"],findById);

        //REgistrar Producto
        this.post('/', ["ADMIN"],validateProduct ,save);

        //Updte Product
        this.put('/:pid', ["ADMIN"],validateProduct, update);

        //Delete Product
        this.delete('/:pid', ["ADMIN"], deleteProduct);
          

    }

}





/* router.param("word", async (req, res, next, name) => {
    console.log("Buscando título de producto, valor: " + name);
    try {
        let result = await ProductService.findByName(name);
        if (!result) {
            req.product = null;
            throw new Error('No products found');
        } else {
            req.product = result
        }
        next();
    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        res.status(500).send({ error: "Error:", message: error.message });
    }
}); */

///router.get("*", (req, res) => {
   /// res.status(400).send("Cannot get that URL!!")
///});
///export default router;
