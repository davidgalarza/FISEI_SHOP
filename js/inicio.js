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

//Definir los campos a los que voy a ingresar los datos
var slider = document.getElementById('sliderP');
var contenedor = document.getElementById('productosInicio');
var idU = "";

autenticacion.onAuthStateChanged(function(user) {
    console.log(user);
    if (!user) return;
    idU = user['uid'].toString();

    base.collection("productos").where('estado', '==', 1).get()
        .then(function(querySnapshot) {
            var i = 0;
            querySnapshot.forEach(function(doc) {
                if (i == 0) {
                    slider.innerHTML += "<div class=\"carousel-item active\">" +
                        "<img src=\"" + doc.get('foto') + "\" class=\"d-block w-100\" >" +
                        "<div class=\"carousel-caption d-none d-md-block\">" +
                        "<h5>" + doc.get('nombre') + "</h5>" +
                        "<p>" + doc.get('descripcion') + "</p>" +
                        "</div>" +
                        "</div>";
                }
                if (i != 0 && i < 3) {
                    console.log(doc.id, " => ", doc.data());
                    slider.innerHTML += "<div class=\"carousel-item \">" +
                        "<img src=\"" + doc.get('foto') + "\" class=\"d-block w-100\" >" +
                        "<div class=\"carousel-caption d-none d-md-block\">" +
                        "<h5>" + doc.get('nombre') + "</h5>" +
                        "<p>" + doc.get('descripcion') + "</p>" +
                        "</div>" +
                        "</div>";
                }
                i++;
            });
        });

    base.collection('productos').where('estado', '==', 1).limit(8).get().then(function(quuerySnapshot) {
        quuerySnapshot.forEach(function(doc) {


            contenedor.innerHTML +=
                "<div class=\"card\" style=\"width: 18rem;\">" +
                "<div class=\"product-thumb-link\">" +
                "<img src=\"" + doc.get('foto') + "\" class=\"card-img-top\" alt=\"\">" +
                "<div class=\"card-body\">" +
                "  <h5 class=\"card-title\">" + doc.get('nombre') + "</h5>" +
                "  <p class=\"card-text\">" + ((doc.get('descripcion').toString().length > 50) ? doc.get('descripcion').toString().substring(0, 50) + '...' : doc.get('descripcion').toString()) + "</p>" +
                "</div>" +
                "</div>" +
                "<div class=\"card-footer\">" +
                "<div class=\"d-flex justify-content-around\">" +
                "<p class=\"precio-producto  text-success\">$" + doc.get('precio') + "</p>" +
                " <input type=\"number\" class=\"form-control cant-anadir\" id=\"cant_" + doc.id + "\" placeholder=\"1\" value=\"1\" min=\"1\" max=\"" + doc.get('stock') + "\">" +
                "<button type=\"button\" class=\"btn btn-primary btn-sm btn-anadir\" id=\"" + doc.id + "\" onclick=\"anadir(this)\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Añadir al carrito\">Agregar</button>" +
                " </div>" +
                "</div>" +

                "</div>";
        });
    });





});

async function anadir(elememto) {


    let productoSeleccionado = base.collection('productos').doc(elememto.id);
    var cantidadSel = document.getElementById('cant_' + elememto.id).value;
    console.log("cantida de cant_" + elememto.id + " :" + cantidadSel);
    //console.log('Id del boton ', elememto.id, ' cli ', idU, 'prod', productoSeleccionado);

    var id = elememto.id;
    var cantidad = cantidadSel;
    var foto;
    var nombre;
    var precio;
    var subtotal;
    var total;
    let doc = await (await productoSeleccionado.get()).data();

    foto = doc['foto'];
    nombre = doc['nombre'];
    precio = doc['precio'];
    subtotal = cantidad * precio;

    base.collection('carritos').doc(idU).get().then((inf) => {
        console.log('Existe ', inf.data());
        if (inf.exists) {
            //Calcular el total obteniendo todos los subtotales de los documentos
            let carrito = inf.data();
            var total = 0;
            carrito.productos.forEach(function(dt) {
                total += dt.subtotal;
                console.log('====================>', dt);
            });
            total += subtotal;
            console.log({
                "cantidad": parseInt(cantidad),
                "foto": foto,
                "id": id,
                "nombre": nombre,
                "precio": parseFloat(precio),
                "subtotal": subtotal
            });
            base.collection('carritos').doc(idU).update({
                productos: firebase.firestore.FieldValue.arrayUnion({
                    "cantidad": parseInt(cantidad),
                    "foto": foto,
                    "id": id,
                    "nombre": nombre,
                    "precio": parseFloat(precio),
                    "subtotal": subtotal
                }),
                "total": total
            });
        } else {
            base.collection('carritos').doc(idU).set({
                "productos": [{
                    "cantidad": parseInt(cantidad),
                    "foto": foto,
                    "id": id,
                    "nombre": nombre,
                    "precio": parseFloat(precio),
                    "subtotal": subtotal
                }],
                "total": subtotal
            });
        }
    });


}

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})