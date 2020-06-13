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

    base.collection('productos').where('estado', '==', 1).get().then(function(quuerySnapshot) {
        quuerySnapshot.forEach(function(doc) {
            //console.log(doc.id, "=>", doc.data(), '=====> ', doc.get('foto'));
            contenedor.innerHTML += "<div class=\"col-lg-3 col-sm-4 col-6 border border-collapse\">" +
                "<div class=\"product-card\">" +
                "<div class=\"product-thumb-link\">" +
                "<a href=\"#\" class=\"product-link\">" +
                "<img src=\"" + doc.get('foto') + "\" alt=\"\">" +
                "<p class=\"nombre-producto\">" + doc.get('nombre') + "</p>" +
                "<p class=\"descripcion-producto\">" + ((doc.get('descripcion').toString().length > 50) ? doc.get('descripcion').toString().substring(0, 50) + '...' : doc.get('descripcion').toString()) + "</p>" +
                "</a>" +
                "<hr>" +
                "<div class=\"ordenar-bloque\">" +
                "<p class=\"precio-producto  text-success\">$" + doc.get('precio') + "</p>" +
                "<button type=\"button\" class=\"btn btn-primary btn-anadir\" id=\"" + doc.id + "\" onclick=\"anadir(this)\">Añadir a carrito</button>" + //Defino la id del producto que voy comprar al boton
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";
        });
    });





});

function anadir(elememto) {


    let productoSeleccionado = base.collection('productos').doc(elememto.id);
    //console.log('Id del boton ', elememto.id, ' cli ', idU, 'prod', productoSeleccionado);

    var id = elememto.id;
    var cantidad = 1;
    var foto;
    var nombre;
    var precio;
    var subtotal;
    var total;
    productoSeleccionado.get().then(function(doc) {
        foto = doc.get('foto');
        nombre = doc.get('nombre');
        precio = doc.get('precio');
        subtotal = cantidad * precio;

    });


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
            console.log(total);
            base.collection('carritos').doc(idU).update({
                productos: firebase.firestore.FieldValue.arrayUnion({
                    "cantidad": cantidad,
                    "foto": foto,
                    "id": id,
                    "nombre": nombre,
                    "precio": precio,
                    "subtotal": subtotal
                }),
                "total": total
            });
        } else {
            base.collection('carritos').doc(idU).set({
                "productos": [{
                    "cantidad": cantidad,
                    "foto": foto,
                    "id": id,
                    "nombre": nombre,
                    "precio": precio,
                    "subtotal": subtotal
                }],
                "total": subtotal
            });
        }
    });


}