import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';

// configurar el transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});

console.log(config.gmailAccount);
console.log(config.gmailAppPassword);

// verificar conexxion
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const mailOptions = {
  from: 'email test - ' + config.gmailAccount,
  to: 'mcampos@infocam.com.ar',
  subject: 'Correo de prueba utilizando nodemailer',
  html: `<div><h1> Es una prueba utilizando nodemailer </h1></div>`,
  attachments: [],
};

const fileaenviar = __dirname + '/public/images/demofondo1.jpg';
console.log(fileaenviar);
const mailOptionsWithAttachments = {
  from: 'email test - ' + config.gmailAccount,
  to: 'mcampos@infocam.com.ar',
  subject: 'Correo de prueba utilizando nodemailer',
  html: `
        <div>
            <h1> Es una prueba utilizando nodemailer </h1>
            <p>Ahora utilizando attachments</p>
            <img src="cid:fondo"/>
        </div>`,
  attachments: [
    {
      filename: 'demofondo1.jpg',
      path: __dirname + '/public/images/demofondo1.jpg',
      cid: 'fondo',
    },
  ],
};

const mailOptionsRegister = {
  from: 'email test - ' + config.gmailAccount,
  to: 'mcampos@infocam.com.ar',
  subject: 'Notificación de Registro en el sistema',
  html: `
        <div>
            <h1> Gracias por registrarte en nuestro sistema </h1>
            <p></p>
        </div>`,
  attachments: [],
};

//{sendEmail, sendEmailWithAttachments
export const sendEmail = (req, res) => {
  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: 'Error', payload: error });
      } else {
        console.log('Message sendt: %s', info.messageId);
        res.send({ message: 'Success', payload: info });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error,
      messages: 'No se pudo enviar el mail desde:' + config.gmailAccount,
    });
  }
};

export const sendEmailWithAttachments = (req, res) => {
  try {
    let result = transporter.sendMail(
      mailOptionsWithAttachments,
      (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send({ message: 'Error', payload: error });
        } else {
          console.log('Message sendt: %s', info.messageId);
          res.send({ message: 'Success', payload: info });
        }
      }
    );
  } catch (error) {}
};

export const sendRegistrationEmail = (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);
    mailOptionsRegister.to = email;
    mailOptionsRegister.html = `
        <div>
            <h1> Gracias por registrarte en nuestro sistema </h1>
            <p>${email}, es el nombre de tu usuario para el Ingreso</p>

        </div>`;
    let result = transporter.sendMail(mailOptionsRegister, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: 'Error', payload: error });
      } else {
        console.log('Message sendt: %s', info.messageId);
        console.log(info);
        res.send({ message: 'Success', payload: info });
      }
    });
  } catch (error) {
    console.log('Message sendt: %s', info.messageId);
    res.send({ message: 'Success', payload: info });
  }
};
