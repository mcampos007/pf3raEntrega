import CustomRouter from './custom.router.js';
import { validateUser } from "../../utils/validateUser.js";
import {getAll, current, premiumUser, adminUser,  login, register} from "../../controllers/users.controller.js"


export default class UsersExtendRouter extends CustomRouter {
    init() {

        /*====================================================
                    EJEMPLO de como se conecta con el CustomRouter
                    --> this.verboHTTP(path, policies, ...callbacks);                   
        =====================================================*/

        this.get('/', ["ADMIN"], getAll );

        this.get('/current', ["USER", "USER_PREMIUM"],current );
        
        this.post('/login', ["PUBLIC"], login);

        this.post('/register', ["PUBLIC"], validateUser, register);
        
        this.get('/premiumUser', ["USER_PREMIUM"], premiumUser );

        this.get('/adminUser', ["ADMIN"], adminUser );

        

       

    }

}
