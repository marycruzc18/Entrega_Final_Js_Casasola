const stockProductos = [
    { 
        id: 1, 
        nombre: "Anillo", 
        cantidad:1,
        precio: 2000,
        img: "./assets/images/anillo_2.jpg"

  },
  {  
        id: 2, 
        nombre: "Lentes", 
        cantidad:1,
        precio: 2500,
        img: "./assets/images/lentes_2.jpg"

   },
   { 
        id: 3, 
        nombre: "Aros", 
        cantidad:1,
        precio: 3000,
        img: "./assets/images/zarcillos_3.jpg"

   },
    {
        id: 4, 
        nombre: "Pulsera", 
        cantidad:1,
        precio: 3500,
        img: "./assets/images/pulsera_2.jpg"

   },  
   { 
        id: 5, 
        nombre: "Anillo Reina", 
        cantidad:1,
        precio: 3800,
        img: "./assets/images/anillo_4.jpg"

   },
   { 
        id: 6, 
        nombre: "Cadena", 
        cantidad:1,
        precio: 4500,
        img: "./assets/images/cadena_3.jpg"

   },
]

let carrito = []


const contenedor = document.querySelector('#contenedor')
const contenedorDescuentos = document.querySelector('#contenedor_descuentos')
const carritoContenedor = document.querySelector('#carritoContenedor')
const vaciarCarrito = document.querySelector('#vaciarCarrito')
const precioTotal = document.querySelector('#precioTotal')
const procesarCompra = document.querySelector('#procesarCompra')
const activarFuncion = document.querySelector('#activarFuncion')
const totalProceso = document.querySelector('#totalProceso')
const formulario = document.querySelector('#procesar-pago')


fetch("productos.json")
    .then((res) => res.json()) 
    .then((data) => {

        data.forEach((tarjeta) => {
            const div = document.createElement("div")
            div.innerHTML +=`
        <div class="col-12 col-lg-4 col-md-6 ">
            <div class="card  mt-3" style="width: 18rem;">
                <img class="card-img-top mt-2" src="${tarjeta.img}" alt="">
                <div class="card-body card-p">
                  <h5 class="card-title">${tarjeta.nombre}</h5>
                  <p class="card-text">Precio: ${tarjeta.precio}</p>
              
              </div>
        </div> 
            
            `
            contenedorDescuentos.append(div)
        })
    })



if(activarFuncion){
    activarFuncion.addEventListener('click', procesarPedido)
}

if(formulario){
    formulario.addEventListener('submit', enviarPedido)
}

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || []

    mostrarCarrito()

 if(activarFuncion){
    document.querySelector('#activarFuncion').click(procesarPedido)
 } 

})

stockProductos.forEach((prod) => {
    const {id,nombre,cantidad,precio,img} = prod
    if(contenedor){
    contenedor.innerHTML += `

   
          
         <div class="col-12 col-lg-4 col-md-6">
            <div class="card mt-3" style="width: 18rem;">
                <img class="card-img-top mt-2" src="${img}" alt="">
                <div class="card-body card-p">
                  <h5 class="card-title">${nombre}</h5>
                  <p class="card-text">Precio: ${precio}</p>
                  <p class="card-text">Cantidad: ${cantidad}</p>

                  <button onclick="agregarProducto(${id})" class="btn btn_principal">Agregar al Carrito</button>
                </div>
              </div>
        </div>
    
    `
    }
})


if(procesarCompra){
procesarCompra.addEventListener('click', () =>{
    if(carrito.length === 0){
        Swal.fire({
            title: '¡El carrito está vacío!',
            text: 'Debes tener los artículos agregados para poder comprar',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    }else{
        location.href = "compra.html"
        
    }
})
}

if(vaciarCarrito){
    vaciarCarrito.addEventListener('click', () => {
        carrito.length = []
        mostrarCarrito()
    })
}

function agregarProducto(id){

    const existeProducto = carrito.some(prod => prod.id === id)

    if(existeProducto){
        const prod = carrito.map(prod => {
            if(prod.id === id){
                prod.cantidad++
            }
            
        })
    }else{
                const item = stockProductos.find((prod) => prod.id === id)
                carrito.push(item)
            }
       
   
    mostrarCarrito()

}

const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal .modal-body')  
    if(modalBody){

    modalBody.innerHTML= ''
    carrito.forEach((prod) => {
        const {id,nombre,img,cantidad,precio} = prod
        modalBody.innerHTML +=` 
        <div class= "modal-contenedor"> 
        <div>
        <img class="img-fluid img-carrito" src="${img}"/>
        </div>

        <div> 
        <p> Producto: ${nombre}</p>
        <p> Precio: ${precio}</p>
        <p> Cantidad: ${cantidad}</p>

        <button onclick= "eliminarProducto(${id})"  class="btn btn-danger">Eliminar</button>
        </div>
        
        </div>
        `
    })
}


    if(carrito.length === 0){
        modalBody.innerHTML = `
        <p class="text-center  parrafo"> ¡Aún no agregaste nada al carrito! </p>
        
        `
    }


    carritoContenedor.textContent = carrito.length

    if(precioTotal){
    precioTotal.textContent = carrito.reduce((acumulador, prod) => acumulador + prod.cantidad * prod.precio,0)
    }

    guardarStorage()
}



function eliminarProducto(id){
    const eliminoId = id
    carrito = carrito.filter((elimino) => elimino.id !== eliminoId)
    mostrarCarrito()
}

function guardarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function procesarPedido(){
    carrito.forEach((prod) => {
        const listaCompra = document.querySelector('#lista-compra tbody')
        const{id, nombre, precio, cantidad, img} = prod

        const row = document.createElement('tr')
        row.innerHTML += `
            <td>
            <img class="img-fluid img-carrito" src= "${img}" />
            </td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>${precio * cantidad}</td>

        `

        listaCompra.appendChild(row)
    })

    totalProceso.innerText = carrito.reduce((acumulador, prod) => acumulador + prod.cantidad * prod.precio,0)
}

function enviarPedido(e){
    e.preventDefault() // para que no se recargue la pagina 
    const cliente = document.querySelector('#cliente').value
    const correo = document.querySelector('#correo').value

    if(correo === '' || cliente === ''){
        Swal.fire({
            title: '¡Debes ingresar tu nombre y tu email!',
            text: 'Completa el formulario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    }else{
        const spinner = document.querySelector('#spinner')
        spinner.classList.add('d-flex')
        spinner.classList.remove('d-none')

        setTimeout(() => {
        spinner.classList.remove('d-flex')
        spinner.classList.add('d-none')
        formulario.reset()
        }, 3000)

        const alertExito = document.createElement('p')
        alertExito.classList.add('alert','alerta','d-block', 'text-center',  'col-12', 'mt-2', 'alert-success')
        alertExito.textContent = 'Compra realizada correctamente'
        formulario.appendChild(alertExito)

        setTimeout(() => {
            alertExito.remove()
            }, 3000)

            localStorage.clear()

    }
}