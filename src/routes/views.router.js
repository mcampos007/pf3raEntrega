import { Router } from "express";
import cookieParser from 'cookie-parser'
import session from "express-session";
//import userModel from "../routes/users.routes.js"
//import Products from "../routes/products.routes.js"
//import usersDao from "../services/db/users.service.js";
//import ProductService from "../services/db/products.service.js";
import { authToken, passportCall, authorization } from "../utils.js";
import config from "..//config/config.js";
import passport from "passport";
import axios from "axios";
import { current } from "../controllers/users.controller.js";

const router = Router();
const PRIVATE_KEY = config.privatekey;

// Cabiado para el entregable    
router.get('/', (req, res) => {
    const data = {
        title: 'Signup-page',
        bodyClass: 'signup-page' // Puedes cambiar esto dinámicamente según tus necesidades
    }; 
    //console.log("voy a renderizar login");
    res.render('users/login', data);
});

//passport.authenticate('jwt', {session: false})
router.get('/profile', passportCall('current') , authorization('user'), (req, res) => {
    const data = {
        title: 'Signup-page',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
        user:req.user
    }; 
    res.render('users/profile', data)
});
 
router.get('/current', passportCall('current') , (req, res) => {
    console.log("***");
    console.log(req);
    const data = {
        title: 'Signup-page',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
        user:req.user
    }; 
    res.render('users/profile', data)
});
router.get('/logout', (req, res) => {
    req.session.destroy( err =>{
        if(!err){
            // res.send('Logoutok!');
             res.redirect('/');
        }
        else {
            res.send({ststus:'Logout error', body:err});       
        }
    })
})
 
router.get('/register', (req, res) => {
    const data = {
        title: 'Register-page',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
    };
    res.render(
        'users/register',
        data    
    )
}); 

//Ejmplo de llamado a la ruta get para productos con jwt
router.get('/products',  passport.authenticate('current', {session: false}), async (req, res) => {
    
    try {
        const parametros  = {};
        //const productService = getAll();//  new ProductService();
        const response = await axios.get(`http://localhost:${config.port}/api/products`);
        const products = response.data;
       // console.log(products);
        //await Products.getAll(); //await productService.getAll();// productsDao.getAllProducts(parametros);
        const data ={ 
            title: 'Signup-page',
            bodyClass: 'signup-page'
        };
        res.render('products/index', {
            title:"Product List",
            products,
            bodyClass: 'signup-page',
            user: req.user,
            
        })
    } catch (error) {
        console.log(error);
        //res.status(500).json({ error: 'Hubo un error al Recuperar Products.' });    
        return  res.render('errors', { message: 'Hubo un error al Recuperar Products.' });
    }

});

router.get('/passwordreset', (req, res) => {
    const data = {
        title: 'Password-reset',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
    };
    res.render('users/passwordreset', data)
    
})

function auth(req, res, next){
    if (req.session.user==="adminCoder@coder.com" && req.session.admin){
        return next;
    }else{
        return res.status(403).send("No estas autorizado a ver este recurso");
    }
}



router.post('/setcookie', (req, res) => {
    console.log(req.body);
    res.cookie('username', req.body.email, { maxAge: 100000, signed: true,  }).send('')
})

router.get('/getcookie', (req, res) => {
    // Sin firma
    // res.send(req.cookies)

    // Con firma
    console.log(req.signedCookies);
    res.send(req.signedCookies)

});

router.get('/session',  (req, res) => {
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se ha visitado ${req.session.counter} veces el sitio`);
    }
    else{
        req.session.counter = 1;
        res.send("Bienvenido");
    }
})

router.get('/chat', passportCall("current"), (req,res) =>{
        const data = req.user
        const rotulos = {
            title:"Nuestro canal de comunicación en línea......"
        }
        console.log("data")
        console.log(data)
        res.render('chats/index', {
            rotulos,
            title: rotulos.title,
            bodyClass: 'signup-page',
            data
        });
    
}
)

export default router;