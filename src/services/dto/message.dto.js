export default class MessageDTO {
    constructor(message) {
        this.correoDelUsuario = message.correoDelUsuario;
        this.message = message.message;
    }
}