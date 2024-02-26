import CustomRouter from '../custom/custom.router.js';
import { validateCart, checkUserCart } from "../../utils/validateCart.js";
import {getAll, save,  addProductToCart, deleteProductToCart, deleteCart, purchaseCart} from "../../controllers/carts.controller.js"

export default class CartsRouter extends CustomRouter {
    init(){
        // Recuperar todos los carritos
        this.get('/', ["ADMIN"], getAll);

        //Registra un carrito
        this.post('/', [ "USER"], validateCart , save);

        //Registrar un producto a uncarrito
        this.post('/:cid/product/:pid', ["USER"], validateCart, checkUserCart, addProductToCart);   

        //Quitar un  producto a uncarrito
        this.delete('/:cid/product/:pid', [ "USER"], validateCart, checkUserCart, deleteProductToCart);   

        // Delete Cart
        this.delete('/:cid', [ "USER"], deleteCart );   

        this.post('/:cid/purchase', [ "USER"], purchaseCart)

    }
}

//eliminar del carrito el producto seleccionado
    //DELETE api/carts/:cid/products/:pid 
    /* router.delete('/:cid/products/:pid', async(req, res) => {
        try{
            const {cid, pid } = req.params;
            console.log(`cid${cid}`);
            console.log(`pid${pid}`);
            const productoEliminado = await cartsDao.deleteProductToCart(cid, pid);
            res.json({
                productoEliminado
            });
        }
        catch(error){
            console.log(error);
            res.json({
                error:error
            });
        }
        
    }); */