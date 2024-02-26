//import ProductService from "../services/db/products.service.js";
//import { productService } from "../services/factory.js";
import { cartService, productService, ticketService } from "../services/service.js";

import CartDTO from "../services/dto/cart.dto.js";


//getAll, save, , addProductToCart, deleteProductToCart, deleteCart

function obtenerProductoDesdeProducts(productId) {
    // Aquí deberías implementar lógica para obtener el producto desde tu colección de productos
    // Retorna el producto si lo encuentras, de lo contrario retorna null
    return null;
  }


export const getAll = async(req, res) =>{
    try {
        const {limit, page, query, sort} = req.body;
        let carts = await cartService.getAll(limit, page, query, sort);
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los carritos." });
    }

}

export const save = async(req, res) =>{
    try {
        let newCart = new CartDTO(req.body);
        newCart.user = req.user.userId;
        let result = await cartService.save(newCart);
        res.status(201).send(result);    
    }catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el Cart." });
    }
}

export const addProductToCart = async(req, res) =>{
    
    try {
        const {cid, pid} = req.params;
        let cart = await cartService.findById(cid);
        if (!cart){
            return res.status(500).send({  message: "No existe el carrito a actualizar." });
        }
        if(cart.user.toString() !== req.user.userId){
            return res.status(500).send({  message: "You are not authorized to update the cart." });
        }
        let result = await cartService.addProductToCart(cart, pid);
        res.status(201).send(result);    
     }catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo actualizar la cantidad del item en el Cart." });
    }
};

export const deleteProductToCart = async(req, res)=>{
    try {
        const {cid, pid} =req.params;
        let cart = await cartService.findById(cid);
        if (!cart) {
            res.status(500).send({  message: "No existe el carrito a actualizar." });
        }
        if(cart.user.toString() !== req.user.userId){
            return res.status(500).send({  message: "You are not authorized to update the cart." });
        }
        let result = await cartService.deleteProductToCart(cart, pid);
        res.status(201).send(result);           
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo actualizar la cantidad del item en el Cart." });
    }
}



export const deleteCart = async(req, res) =>{
    try{
        let {cid} = req.params;
        //const cartEliminado = await cartsDao.deleteCart(cid);
        const result = await cartService.delete(cid);
        res.status(204).send(result);    
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo eliminar el carrito." });
    }

};

export const purchaseCart = async(req, res) =>{
    try {
        // 1- Recupear el Carrito preparar objeto -> tiketcompra, array -> noprocesados
        const {cid} = req.params;
        let cart = await cartService.findById(cid);
        let ticketObj = {code: cid, purchaser: req.user.email, products: [], amount : 0}
        let arrNoProcesados = []
        const updatedProducts = [];
        let ticketAmount = 0
        const arrayDeProductos = cart.products;
        console.log("Productos a comprar---->")
        console.log(arrayDeProductos);
        for (const producto of arrayDeProductos){                                    // 2- Recorrer los productos de carrito
            const productId = producto.product.toString();
            const productQuantity = producto.quantity;
            let productInProducts = await productService.findById(productId);
            
            console.log("Item a Comprar y cantidad y stock---->")
            console.log(productId);
            console.log(productQuantity)
            console.log(productInProducts)
            if (productInProducts && productInProducts.stock >= productQuantity) {  // 3-       Verificar si hay stock disponible
                // Agregar al ticketObj si el stock es suficiente
                ticketObj.products.push({                                           // 4-              Agregar producto al Ticketcompra (id, qty y price)
                    product: productInProducts._id,
                    price: productInProducts.price,
                    quantity: productQuantity
                });
                const productPrice = productInProducts.price
                productInProducts.stock = productInProducts.stock - productQuantity
                const result = await productService.update(productId, productInProducts);        // 4-              Descontar del stock del producto
                console.log("REsultado de la baja de Stock ---->")
                console.log(result)
                ticketAmount +=  (productQuantity * productPrice )
                console.log("Subtotal -------------->")
                console.log(productQuantity)
                console.log(productPrice)
                console.log(ticketAmount);
            } else {
                // Agregar al array de no procesados si el stock no es suficiente
                arrNoProcesados.push(productId);    
                updatedProducts.push(producto);                             // 5-               Agregar el prodcto a  norocesados
            }      
        }
        // 6    Finalizar Compra
        ticketObj.amount += ticketAmount            // 6        Agregar Total Compra
        console.log("Datos del Ticket para guardar")
        console.log(ticketObj)
        // 6        Agregar Fecha al ticker, se realiza en el modelo
        // 6        Agregar email comprador al tk  se agrega al defnir el objeto
        // 6        Generar codigo unico, se agrega al defnir el objeto al definir el objeto con el id del Cart
        const ticket = await ticketService.save(ticketObj)
        // 6        quitar productos comprados del carrito
        cart.products = updatedProducts;
        let result = await cartService.update(cid, cart)

        // 6        Retunr noprocesados (id)
        console.log("Resultado de la actualizacioin del cart")
        console.log(result);
        const resultemp = {status: "En desarrollo", ticket: ticketObj, noProcesados: arrNoProcesados, result:result};
        res.status(201).send(resultemp);  
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo actualizar Finalizar la compra." });
    }
}
/* export const findByTitle = async(req, res)=>{
    try {
        let {title} = req.params;
        const result = await productService.findById(title);
        if (!result){
            return res.json({
                error:"El Producto No Existe"
            });
        }
        res.json({
            result
        });    
    } catch (error) {
        return error;
    }

} */

/* export const findById = async(req, res) => {
    try {
        let {pid} = req.params;
        const result = await productService.findById(pid);
        if (!result){
            return res.json({
                error:"El Producto No Existe"
            });
        }
        res.json({
            result
        });    
    } catch (error) {
        return error;
    }

};
 */


/* export const update = async(req, res) =>{
    try {
        const pid = req.params.pid;
        let newProduct = new ProductDTO(req.body);
        let result = await productService.update(pid,newProduct);
        res.status(201).send(result); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo Actualizar el producto." });
    }
    
} */







