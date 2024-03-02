//import ProductService from "../services/db/products.service.js";
//import { productService } from "../services/factory.js";
import { productService } from "../services/service.js";
import ProductDTO from "../services/dto/product.dto.js";
import { generateProduct } from '../utils.js'

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

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
    // try {
        const {title, description, code, price,stock,category} = req.body
        if (!title || !description || !code || !price || !stock || !category) {
            // Creamos un Custom Error
            CustomError.createError({
                name: "Product Create Error",
                cause: generateProductErrorInfo({ title, description, code, price, stock, category}),
                message: "Error tratando de crear al Producto",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        let newProduct = new ProductDTO(req.body);
        let result = await productService.save(newProduct);
        if (result.code === 11000) {
            // Violación de restricción única
            return res.status(409).json({ error: 'Valor duplicado en campo único' });
          } 
        res.status(201).send(result);    
    /* }catch (error) {
        res.status(500).send({ error: error, message: "No se pudo guardar el producto." });
    } */

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

export const getProducts = async(req, res) =>{
    try {
        let products = [];
        for (let i = 1; i <= 50; i++) {

            // Agregando a la colección
           /*  const prod = generateProduct(i);
            let newProduct = new ProductDTO(prod);
            let result = await productService.save(newProduct);
            products.push(result); */     
            
            //Sin agregar a la colección
             products.push(generateProduct(i));       
        }
        res.send({ status: "success", payload: products });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo Generar productos." });
    }
}