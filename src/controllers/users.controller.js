//import ProductService from "../services/db/products.service.js";
//import { productService } from "../services/factory.js";
import { userService } from "../services/service.js";
import UsertDTO from "../services/dto/user.dto.js";
import { createHash, isValidPassword, generateJWToken } from '../utils.js';
import config from '../config/config.js';


//const productService = new ProductService();


export const getAll = async(req, res) =>{
    try {
        const {limit, page, query, sort} = req.body;
        let users = await userService.getAll(limit, page, query, sort);
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuario." });
    }

}

export const current = async(req, res) =>{
    try {
        let result = await userService.findByUsername(req.user.email);
        let user = new UsertDTO(result);
        res.sendSuccess(user)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener usuario actual." });
        res.sendSuccess(user);
    }
}

export const premiumUser = async(req, res) =>{
    try {
        //res.sendSuccess(req.user)
        const id = "65d12fdfb5e365b718361a83";
        let user = await userService.premiumUserUser(id);
        res.sendSuccess(user)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener usuario actual." });
        res.sendSuccess(user);
    }
}

export const adminUser = async(req, res) =>{
    try {
        //res.sendSuccess(req.user)
        const id = "65d12fdfb5e365b718361a83";
        let user = await userService.adminUser(id);
        res.sendSuccess(user)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener usuario actual." });
        res.sendSuccess(user);
    }
}

export const login = async(req, res) =>{
    const { email, password } = req.body;
    
    try {
        //Validar si es admin
        const userAdmin = config.adminName;
        const passAdmin = config.adminPassword;

        let tokenUser = {}
        let userId = "";
        
        if (email === userAdmin && password === passAdmin)
        {
                //Es administrador
             tokenUser = {
                    name: `${userAdmin}`,
                    email: userAdmin,
                    age: 57,
                    role: "Admin",
            }
        } else {
            
            const user = await userService.findByUsername(email);
            if (!user) {
                //console.warn("User doesn't exists with username: " + email);
                return res.status(202).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
            }
        
            if (!isValidPassword(user, password)) {
                //console.warn("Invalid credentials for user: " + email);
                return res.status(401).send({ status: "error", error: "Credenciales inválidas!" });
            }
           // console.log(user)
             tokenUser = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role,
                userId : user._id.toString(),
            }
            
            
        }

        const access_token = generateJWToken(tokenUser);
        res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 10*60*1000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie
        }
    )
        //console.log(access_token);
       res.send({ message: "Login successful!", access_token: access_token, id: userId });

    } catch (error) {
        //console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }
}

export const register = async(req, res) => {
    try {
        let newUser = new UsertDTO(req.body);
        console.log(newUser)
        newUser.password = createHash(req.body.password);
        newUser.loggedBy = "form";
        const userExist = await userService.findByUsername(newUser.email);
        if (userExist){
            //el usuario ya existe
            res.status(400).send({  message: "El usuario ya existe en la base de datos." });    
        }else{
            const result = await userService.save(newUser);
            res.status(201).send(result); 
        } 
    }catch(error){
        console.log(error);
        res.status(500).send({ error: error, message: "Error al crear el usuario." });
    } 
}

export const save = async(req, res) =>{
    

}


export const findByTitle = async(req, res)=>{
    try {
        let {title} = req.params;
        const result = await userService.findById(title);
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
        const result = await userService.findById(pid);
        if (!result){
            return res.json({
                error:"El Usuario No Existe"
            });
        }
        res.json({
            result
        });    
    } catch (error) {
        return error;
    }

};







