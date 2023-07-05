
const initSocket = (io) => {
    const messages = [];
    // socket.on("message", objetoMensajeCliente => {
    //     messages.push(objetoMensajeCliente);
    //     io.emit("messageLogs", messages);
    // });

    io.on("connection", socket => {
        // console.log(`\nNuevo cliente conectado. ID: ${socket.id}`);    
    
        socket.on("authenticated", nombreUsuario => {
            console.log(`\nEl socket con ID '${socket.id}' se identificó como '${nombreUsuario}'`);
            socket.broadcast.emit("newUserConnected", nombreUsuario);
        });
    
        socket.on("message", objetoMensajeCliente => {
            uploadChat(objetoMensajeCliente);
            messages.push(objetoMensajeCliente);
            io.emit("messageLogs", messages);
        });
    
    });
    
    
    async function uploadChat(data) {
        await chatManager.addChat(data).then((resp) => {
            console.log(`Se guardó el mensaje en la BDD con el ID ${resp.id}`);
        }).catch((error) => console.log(`Error: \n${error}`));
    }
    
}

module.exports = {
    initSocket
}