//import ProductService from "../services/db/products.service.js";
//import { productService } from "../services/factory.js";
import { productService } from "../services/service.js";
import ProductDTO from "../services/dto/product.dto.js";

//const productService = new ProductService();

export const getAll = async(req, res) =>{
    try {
        
        const {limit, page, query, sort} = req.body;
        let products = await productService.getAll(limit, page, query, sort);
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los productos." });
    }

}

export const save = async(req, res) =>{
    try {
        let newProduct = new ProductDTO(req.body);
        let result = await productService.save(newProduct);
        if (result.code === 11000) {
            // Violación de restricción única
            return res.status(409).json({ error: 'Valor duplicado en campo único' });
          } 
        res.status(201).send(result);    
    }catch (error) {
        res.status(500).send({ error: error, message: "No se pudo guardar el producto." });
    }

}

export const findByTitle = async(req, res)=>{
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

}

export const findById = async(req, res) => {
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

export const deleteProduct = async(req, res) =>{
    try{
        let {pid} = req.params;
        const result = await productService.deleteProduct(pid);
        if (!result){
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.status(200).json({ message: 'Producto eliminado correctamente' }); 
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo Eliminar el producto." });
    }
    
    

};

export const update = async(req, res) =>{
    try {
        const pid = req.params.pid;
        let newProduct = new ProductDTO(req.body);
        let result = await productService.update(pid,newProduct);
        res.status(201).send(result); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo Actualizar el producto." });
    }
    
}







