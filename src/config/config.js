import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();


//dotenv.config();

//let environment = "dev";

program
    .option('-d', 'Varaible para debug', false) //primero va la variable, luego la descripcion y al final puede ir un valor por defecto.
    .option('-p <port>', 'Puerto del servidor', 9090)
    .option('--persist <persist>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'develop')

    .requiredOption('-u <user>', 'Usuario que va a utilizar el aplicativo.', 'No se ha declarado un usuario.');//RequireOption usa un mensaje por defecto si no está presente la opción.
program.parse(); //Parsea los comandos y valida si son correctos.

const environment = program.opts().mode;
let filesetting = "";
console.log(`Env: ${environment}`);


switch (environment) {
  case "prod":
    filesetting = './src/config/.env.production';
    break;
  case "dev":
    filesetting = './src/config/.env.development';
    break;
  case "local":
    filesetting = './src/config/.env.local';
    break;
  default:
    filesetting = './src/config/.env.development';
}


/* dotenv.config({
     path: environment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
});*/

dotenv.config({
    path: filesetting
});

console.log( process.env.PORT);

export default {
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    privatekey:process.env.PRIVATE_KEY,
    adminName: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: program.opts().persist,
}