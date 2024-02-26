import config from '../config/config.js';
import MongoSingleton from '../config/mongodb-singleton.js';

let productService;
let cartService;

async function initializeMongoService() {
    console.log("Iniciando Servicio para Mongo!!");
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}


const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

switch (config.persistence) {
    case 'mongodb':

        initializeMongoService();
       
        const { default: ProductServiceMongo } = await import('./db/products.service.js')   
        productService = new ProductServiceMongo
        console.log("Servicio de productos cargado:");
        console.log(productService);

       /*  const { default: CartServiceMongo } = await import('./db/carts.service.js')
        cartService = new CartServiceMongo
        console.log("Servicio de carritos cargado:");
        console.log(cartService); */
        break;

    case 'file':
        // IMPORTARME le DAO
        /* const { default: StudentServiceFileSystem } = await import('./dao/filesystem/students.service.js')
        studentService = new StudentServiceFileSystem
        console.log("Servicio de estudiantes cargado:");
        console.log(studentService);

        const { default: CoursesServiceFileSystem } = await import('./dao/filesystem/courses.service.js')
        coursesService = new CoursesServiceFileSystem
        console.log("Servicio de estudiantes cargado:");
        console.log(coursesService); */
        break;

    default:
        console.error("Persistencia no válida en la configuración:", config.persistence);
        process.exit(1); // Salir con código de error
        break;
}

export { productService, cartService };
