// VARIABLES GLOBALES
const d = document;
let btnProducts = d.querySelectorAll(".btn-product");
let contadorCarrito = d.querySelector(".contar-pro");
let listadoCarrito = d.querySelector(".list-cart tbody");
let con = 0; // Contador de productos en el carrito

document.addEventListener("DOMContentLoaded", () => {
    cargarProLocalStorage();
});

// RECORRER LOS BOTONES DE LOS PRODUCTOS
btnProducts.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        con++; // Incrementa el contador
        contadorCarrito.textContent = con; // Actualiza el contador visual
        infoProducto(i); // Agrega el producto al carrito
    });
});

// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function agregarProducto(producto) {
    let fila = d.createElement("tr");
    fila.dataset.index = listadoCarrito.children.length; // Asigna un índice único a la fila
    fila.innerHTML = `
        <td> ${listadoCarrito.children.length + 1} </td>
        <td> <img src="${producto.imagen}" width="80px"> </td>
        <td> ${producto.nombre} </td>
        <td> $${producto.precio} </td>
        <td> <span class="btn btn-danger borrar-producto"> X </span> </td>
    `;
    listadoCarrito.appendChild(fila);

    // Agregar evento para eliminar producto
    fila.querySelector(".borrar-producto").addEventListener("click", () => {
        borrarProducto(fila);
    });
}

// FUNCIÓN PARA EXTRAER INFORMACIÓN DEL PRODUCTO
function infoProducto(pos) {
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        imagen: producto.querySelector("img").src,
        cantidad: 1,
    };
    agregarProducto(infoPro);
    guardarProLocalStorage(infoPro);
}

// FUNCIÓN PARA QUITAR UN PRODUCTO DEL CARRITO
function borrarProducto(fila) {
    const index = fila.dataset.index; // Obtén el índice del producto
    fila.remove();

    // Disminuye el contador global
    if (con > 0) {
        con--;
        contadorCarrito.textContent = con; // Actualiza el contador visual
    }

    // Actualiza los números de posición
    actualizarNumeros();

    // Elimina el producto del localStorage
    eliminarProLocalStorage(index);
}

// FUNCIÓN PARA ACTUALIZAR LOS NÚMEROS DE POSICIÓN
function actualizarNumeros() {
    const filas = listadoCarrito.querySelectorAll("tr");
    filas.forEach((fila, index) => {
        fila.querySelector("td").textContent = index + 1; // Actualiza las posiciones visibles
        fila.dataset.index = index; // Actualiza el índice del atributo personalizado
    });
}

// GUARDAR LOS PRODUCTOS EN LOCALSTORAGE
function guardarProLocalStorage(producto) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

// ELIMINAR PRODUCTOS DE LOCALSTORAGE
function eliminarProLocalStorage(index) {
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        productosPrevios.splice(index, 1); // Elimina el producto usando el índice
        localStorage.setItem("pro-carrito", JSON.stringify(productosPrevios));
    }
}

// CARGAR PRODUCTOS DE LOCALSTORAGE EN EL CARRITO
function cargarProLocalStorage() {
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    con = productosPrevios.length; // Sincroniza el contador con el número de productos
    contadorCarrito.textContent = con; // Actualiza el contador visual

    // Limpia el listado previo
    listadoCarrito.innerHTML = "";

    // Cargar productos en la tabla
    productosPrevios.forEach((producto) => {
        agregarProducto(producto);
    });
}

// Alternar visibilidad del carrito
contadorCarrito.parentElement.addEventListener("click", () => {
    listadoCarrito.parentElement.classList.toggle("ocultar");
});
