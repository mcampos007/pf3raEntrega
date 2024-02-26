import { Router } from "express";

const router = Router();

router.get('/', (req, res)=>{
    const rotulos = {
        title:"Nuestro canal de comunicación"
    }
    res.render('chats/index', {
        rotulos,
        bodyClass: 'signup-page',
    });
});
export default router;