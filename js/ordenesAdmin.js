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
let base = firebase.firestore();
//Componentes par llenear datos
var ordenesP = document.getElementById('ordenesP');
var carritoP = document.getElementById('carritoCli');
var totalP = document.getElementById('totalP');
var mapaP = document.getElementById('mapa');
var btnP = document.getElementById('btnP');
var idU = "";
//Boton desactivado
btnP.className = "btn btn-secondary btn-lg btn-block";
btnP.disabled = true;
autenticacion.onAuthStateChanged(function(user) {
    //console.log(user);
    idU = user['uid'].toString();

    base.collection("ordenes").where('estado', '==', 'PENDIENTE').get()
        .then(function(querySnapshot) {
            var i = 1;
            var datos;
            querySnapshot.forEach(function(doc) {
                datos = doc.data();
                console.log('asd======> ', datos);
                ordenesP.innerHTML += "<tr>" +
                    "<th scope=\"row\">" + i + "</th>" +
                    "<td><a href=\"#\" onclick=\"mostrarCarritoTabla(\'" + doc.id + "\')\">" + datos.usuario.nombre + " " + datos.usuario.apellido + "</a></td>" +
                    "<td>" + datos.direccion + "</td>" +
                    "<td>" + datos.estado + "</td>" +
                    "</tr>";
                i++;
            });
        });
});
//variable  para saber el documento
var idD = "";

function mostrarCarritoTabla(idDocumento) {
    idD = idDocumento;
    //console.log(idDocumento);
    carritoP.innerHTML = "";
    totalP.innerHTML = "";
    //Mostrar la tabla de los productos en el carrito
    base.collection("ordenes").doc(idDocumento).get().then(function(doc) {
        let ordenesP = doc.data();
        let j = 1;
        ordenesP.carrito.productos.forEach(function(dt) {


            carritoP.innerHTML += " <tr>" +
                "<th scope=\"row\">" + j + "</th>" +
                "<td>" + dt.cantidad + "</td>" +
                "<td>" + dt.nombre + "</td>" +
                "<td>" +
                "<center><img src=\"" + dt.foto + "\"></center>" +
                "</td>" +
                "<td>" + dt.subtotal + "</td>" +
                "</tr>";
            j++;
        });
        //Mostrar el total
        console.log(ordenesP.carrito.total);
        totalP.innerHTML = "<h1>Total <span class=\"badge badge-secondary md\">$ " + ordenesP.carrito.total + "</span></h1>";
        //Mostrar la ubicación donde entregar
        var lati = ordenesP.coordenadas.lat;
        var long = ordenesP.coordenadas.lng;
        console.log('lat y long ', lati, ' ', long)
        var mapa;
        mapa = new google.maps.Map(document.getElementById('mapas'), {
            center: { lat: lati, lng: long },
            zoom: 16
        });
        marcador = new google.maps.Marker({
            position: { lat: lati, lng: long },
            title: "Marcador",
            draggable: true,
        });

        marcador.setMap(mapa);


    });
    console.log(idD);
    //Habilitar el boton
    btnP.className = 'btn btn-primary btn-lg btn-block';
    btnP.disabled = false;
    if (idD == "") {
        btnP.className = "btn btn-secondary btn-lg btn-block";
        btnP.disabled = true;
    }
}

async function entregado() {
    console.log(idD);
    await base.collection('ordenes').doc(idD).update({
        estado: "ENTREGADO"
    });
    //Boton desactivado
    btnP.className = "btn btn-secondary btn-lg btn-block";
    btnP.disabled = true;
    location.reload();
    idU = "";
}