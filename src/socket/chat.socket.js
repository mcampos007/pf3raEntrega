
// Contenido del archivo que maneja las conexiones de WebSocket (chatSocket.mjs)
import { createServer } from 'http';
import { Server as SocketIo } from 'socket.io';

function initChatSocket() {
  console.log("Inicio del Chat")
  const server = createServer();
  const io = new SocketIo(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Manejar eventos del chat
    socket.on('message', (data) => {
        
      console.log(`Mensaje recibido: ${data.message}`);

      // Emitir el mensaje a todos los clientes
      io.emit('message', data);
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  return server;
}

export default initChatSocket;
