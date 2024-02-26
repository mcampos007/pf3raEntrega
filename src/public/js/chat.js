const socket = io();
 // Se ejecuta cuando la página se ha cargado completamente
const chatBox = document.getElementById("chatBox");
//let user = {"correoDelUsuario": document.getElementById("usuarioid").innerHTML};
let user = document.getElementById("email").innerHTML;
socket.emit("inicio", user);


 /* Swal.fire({
    title: 'Identificate',
    input:"text",
    text:"Ingresa su email para identificarse en el chat",
    inputValidator:(value) => {
      return !value && "Necesitas ingresar un email  para continuar";
    },
    allowOutsideClick:false
  }).then((result) =>{
    user = result.value
    socket.emit("inicio", user);
    userName.innerHTML =user
  });
  */ 
  
 // socket.emit("message", user);
 
  
  chatBox.addEventListener('keyup', evt=>{
    if(evt.key === "Enter"){
      if(chatBox.value.trim().length>0){
        socket.emit("message", {correoDelUsuario:user,message:chatBox.value});
        chatBox.value="";
      }
    }
  });
/*
  socket.on("connection", (data) => {
    if (user !== undefined) {
      Swal.fire({
        text: `Nuevo usuario conectado: ${data}`,
        toast: true,
        position: "top-right",
      });
    }
  });
*/
  socket.on('messageLogs' ,data =>{
    const log = document.getElementById('messageLogs');
    let messages = "";
    console.log(data);
    data.forEach(message => {
      messages +=  `${message.correoDelUsuario} dice: ${message.message} </br>`  ;
    });
    log.innerHTML = messages;
  })

  socket.on("message_all", (data) =>{
    alert(data);
  }) 

/*   function sendMessageOnLoad() {
    const welcomeMessage = '¡Bienvenido al chat!';
    socket.emit('message', { message: welcomeMessage });
  } */