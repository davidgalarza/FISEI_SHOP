var firebaseConfig = {
    apiKey: "AIzaSyALb0ZENpjshU5PkHUaPxKErP2-lpIgirw",
    authDomain: "fisei-shop.firebaseapp.com",
    databaseURL: "https://fisei-shop.firebaseio.com",
    projectId: "fisei-shop",
    storageBucket: "fisei-shop.appspot.com",
    messagingSenderId: "102998810609",
    appId: "1:102998810609:web:ff6b4ba65e61632cafee50",
    measurementId: "G-JGGN1YY333"
};

firebase.initializeApp(firebaseConfig);

let autenticacion = firebase.auth();
var base = firebase.firestore();
var carrito;


var idUsuario;
function idUsuarioActual(){
    return new Promise(async (resolve, reject) =>{
      autenticacion.onAuthStateChanged(function(user) {
        resolve(user.uid);
      });
    });
  }

///////////////////////////////////////
var totalC;
async function actualizar(idProducto){
    totalC=0;
    let cant = parseInt(document.getElementById(idProducto).value);
    carrito.productos.forEach(function(e){
        if(e.id==idProducto){
            e.cantidad=cant;
            e.subtotal=cant*e.precio;
        }
        totalC=totalC+e.subtotal;      
    });
    carrito.total=totalC;
    await base.collection('carritos').doc(idUsuario).update(carrito);
    principal();
   

 }
 
 async function eliminar(idProducto){
    totalC=0;
    
     for (let i = 0; i < carrito.productos.length; i++) {
        if(carrito.productos[i].id==idProducto){
            carrito.productos.splice(i,1);
        }
     }
     console.log(carrito);
     for (let i = 0; i < carrito.productos.length; i++) {
        totalC+= carrito.productos[i].subtotal;  
     }
     console.log(totalC); 
     carrito.total=totalC; 
     await base.collection('carritos').doc(idUsuario).update(carrito);  
     principal(); 
 }

///////////////////////////////////////

async function principal(){
idUsuario= await idUsuarioActual();

console.log(idUsuario);
var respuesta = await base.collection('carritos').doc(idUsuario).get(); 
carrito = respuesta.data();
console.log(carrito);

var request =  new XMLHttpRequest();
var html="";
var html2="";
var cantP;
if(carrito != undefined) cantP=carrito.productos.length;
else cantP = 0;



if(cantP>0){
    let contB=0;
    carrito.productos.forEach(producto =>{
        html += `<div class="card mb-3 conteCar"  style="max-width: 100%;">
        <div class="row no-gutters">
          <div class="col-xl-3 col-md-3 col-12 imgCarta">
            <img src="${producto.foto} " class="card-imagen" >
          </div>
          <div class="col-xl-7 col-md-4 ">
            <div class="card-body">
              <h6 class="card-title">${producto.nombre} </h6>
              <p class="card-text"><span >Precio:</span> <span class="descripcion"> ${producto.precio}</span> </p>
              <p class="card-text"> <span class="estiloPrecio">$ ${producto.subtotal} </span> </p>
            </div>
          </div>
          <div  class="col-xl-2 col-md-5">
            <p>Cantidad</p>
            <input class="form-control ingreso" id="${producto.id}" type="number" min=1 value="${producto.cantidad}">
            <button type="button" id="botonAc${contB}" onclick="actualizar('${producto.id}')" class="btn btn-outline-dark"> <i class="fas fa-sync-alt"></i> Actualizar</button>
            <button type="button" id="botonElim${contB}" onclick="eliminar('${producto.id}')" class="btn btn-outline-danger"> <i class="far fa-trash-alt"> </i> Eliminar</button>
          </div>
        </div>
      </div>`
      contB++;
        
    });
}else{
    html =`<div id="sinPro">
            <div class="alert alert-primary" role="alert">
                No tiene productos registrados!
            </div>
        </div>`;
        document.getElementById('checkout').disabled=true;
        document.getElementById('refe').hidden=true;
}




html2 =`<p id="precio">$ ${carrito != undefined ?carrito.total : 0} </p> `
document.getElementById('coleccion').innerHTML=html;
document.getElementById('coleccionSubtotal').innerHTML=html2;







}
principal();