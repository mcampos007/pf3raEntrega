import CustomRouter from "../custom/custom.router.js"
import {getAllMessages, createMessage} from "../../controllers/messages.controller.js"


export default class MessageRouter extends CustomRouter {
    init() {
        //Recuperar todos los mensajes
        this.get("/", ["USER", "ADMIN"], getAllMessages);
        //Registrar un mensaje
        this.post("/", ["USER", "ADMIN"],createMessage);
    }
}


// Recuperar todos los mensajes
/* export const getAll = async(req, res) => {
    try {
        const messages = await messagesDao.getAllMessages();
        res.json(messages);
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            error: error
        });
    }
});

//Registrar un message
router.post('/',  async (req, res) => {
     let message = req.body;
     try {
         const messageAdded = await messagesDao.createMessage(message);
         res.json({
                 message: "Message created",
                 messageAdded,
               });
         console.log("Message creado:");
         console.log(messageAdded);
         }
     catch (e) {
       res.json({
         error: e.message,
       });
     }
 }); 

export default router; */