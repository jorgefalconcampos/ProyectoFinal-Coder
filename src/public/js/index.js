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

const form = document.getElementById("submitForm");
form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(form);
    fetch("/realtimeproducts", {method: "POST", body: formData});
    form.reset();
})