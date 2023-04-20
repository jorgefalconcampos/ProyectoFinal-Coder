const socket = io();

socket.on("nuevo-producto", products => {
    console.log("cargando prod");
    const productList = document.getElementById("accordionPlaceholder");
    productList.innerHTML = "";
    products.forEach((element, index) => {
        const item = index+1;
        const product = document.createElement("div");
        product.innerHTML = `
        <div class="accordion-item my-3">
            <h2 class="accordion-header" id="heading-${item}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${item}" aria-expanded="true" aria-controls="collapse-${item}">
                    <strong>Producto #${item}</strong>: ${element.name}
                </button>
            </h2>
            <div id="collapse-${item}" class="accordion-collapse collapse" aria-labelledby="heading-${item}" data-bs-parent="#accordionPlaceholder">
                <div class="accordion-body">
                    ${element.description}
                    <br>
                    Precio: ${element.price}
                    <hr>
                    <button type="button" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
        `
        productList.appendChild(product)
    });
});

// const form = document.getElementById("submitForm");
// form.addEventListener("submit", event => {
//     event.preventDefault();
//     const formData = new FormData(form);
//     fetch("/realtimeproducts", {method: "POST", body: formData});
//     form.reset();
// })



const input = document.getElementById("textbox");

const log = document.getElementById("log");

input.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        socket.emit("message2", input.value);
        input.value = "";
    }
});

let user;

Swal.fire({
    title: "Registro",
    text: "Escribe un nombre de usuario",
    icon: "success",
    input: "text",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre de usuario"
    },
    allowOutsideClick: false
}).then(resp => {
    user = resp.value;
    socket.emit("authenticated", user);
});

let chatBox = document.getElementById("chatbox");

const handleKeyUp = (evt) => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0 && chatBox.value !== "undefined") {
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
}

chatBox.addEventListener("keyup", handleKeyUp);

socket.on("messageLogs", arrayMensajeServidor => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    arrayMensajeServidor.forEach(msj => {
        messages += `<li>Usuario: ${msj.user} dice ${msj.message}</li>`
    });

    log.innerHTML = messages;
})

socket.on("newUserConnected", data => {
    if (!user) return;
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se unió al chat`,
        icon: "success"
    })
})