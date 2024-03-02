import express from 'express';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { logger } from './utils/logger.js';
import methodOverride from 'method-override';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';
import MongoSingleton from './config/mongodb-singleton.js';
import cors from 'cors';
//Chat
//import {Server} from "socket.io";
import initSocket from './socketManager.js';
//import {getAllMessages, createMessage} from "./controllers/messages.controller.js"

//Routers a importar
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/sessions.routes.js';
//import jwtRouter from "./routes/jwt.routes.js";
import ProductsRouter from './routes/mongo/products.routes.js';
import CartsRouter from './routes/mongo/carts.routes.js';

import MessagesRouter from './routes/chat/messages.routes.js';
import { createMessage } from './controllers/messages.controller.js';
import UsersExtendRouter from './routes/custom/users.extend.router.js';
//simport  initChatSocket  from './socket/chat.socket.js';
//import usersRouter from "./routes/users.routes.js";
import axios from 'axios';
import emailRouter from './routes/mensajeria/email.router.js';
import smsRouter from './routes/mensajeria/sms.router.js';

//Routes for mocking
import MockingRouter from './routes/mocking.routes.js';

const PRIVATE_KEY = config.privatekey;
const PORT = config.port;

const app = express();

app.use(cookieParser(PRIVATE_KEY));
app.use(logger);

const MONGO_URL = config.urlMongo; //`mongodb+srv://mcamposinfocam:${password}@cluster0.alvwu9f.mongodb.net/${db_name}?retryWrites=true&w=majority`;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      //mongoOptions --> opciones de confi para el save de las sessions
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60,
    }),

    secret: PRIVATE_KEY,
    resave: false, // guarda en memoria
    saveUninitialized: true, //lo guarda a penas se crea
  })
);

// cualquier cliente los clientes
// app.use(cors());

// Configura el middleware cors con opciones personalizadas
const corsOptions = {
  // Permitir solo solicitudes desde un cliente específico
  origin: 'http://127.0.0.1:5501',

  // Configura los métodos HTTP permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

  // Configura las cabeceras permitidas
  allowedHeaders: 'Content-Type,Authorization',

  // Configura si se permiten cookies en las solicitudes
  credentials: true,
};
app.use(cors(corsOptions));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//Inicializndo el motor
app.engine(
  'hbs',
  handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//Declaración de Routers:
app.use('/', viewsRouter);

// Custom Router
const usersExtendRouter = new UsersExtendRouter();
app.use('/api/extend/users', usersExtendRouter.getRouter());

const productRouter = new ProductsRouter();
app.use('/api/products', productRouter.getRouter());

const cartRouter = new CartsRouter();
app.use('/api/carts', cartRouter.getRouter());

//app.use("/api/users",  usersRouter);
app.use('/api/sessions', sessionRouter);

const messageRouter = new MessagesRouter();
app.use('/api/chat', messageRouter.getRouter());
//app.use('/api/jwt', jwtRouter);

app.use('/api/email', emailRouter);
app.use('/api/sms', smsRouter);
const mockingRouter = new MockingRouter();
app.use('/mockingproducts', mockingRouter.getRouter());

//const PORT = 9090
const httpServer = app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
  //process.exit(5);
  //consolelog();
});
/*=============================================
=            connectMongoDB                   =
=============================================*/
/* const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Conectado con exito a la DB usando Mongoose!!");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
} 
connectMongoDB();*/

//TODO: MongoSingleton
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
mongoInstance();

initSocket(httpServer);
