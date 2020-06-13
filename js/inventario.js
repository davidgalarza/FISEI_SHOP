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
let almacenamiento = firebase.storage();

let linkFoto = '';

$('#foto_producto').change(async () => {
    let foto = $('#foto_producto').prop('files')[0];
    console.log(foto);
    $('#estado_carga').html(`<div class="center spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>`)
    let refFoto = almacenamiento.ref().child(`${Date.now()}.jpg`);
    await refFoto.put(foto);
    linkFoto = await refFoto.getDownloadURL();
    $('#estado_carga').html(`<div class="alert alert-success" role="alert">
    Foto ${foto.name} subida
  </div>`)

});


async function crearProducto() {

    let infoProducto = {
        categoria: $('#categoria_producto').val(),
        descripcion: $('#descripcion_producto').val(),
        estado: 1,
        foto: linkFoto,
        nombre: $('#nombre_producto').val(),
        precio: $('#precio_producto').val(),
        stock: $('#stock_producto').val()
    };

    let errores = obtenerErrores(infoProducto);
    if (errores.length > 0) {
        mostrarErrores(errores);
    } else {
        await base.collection('productos').add(infoProducto)

        $('#exampleModal').modal('toggle');

        mostrarMensaje(`<strong>Producto creado!</strong> ${infoProducto['nombre']}.`);
        limpiarCampos();
        listarProductos();
    }

}

function mostrarErrores(errores) {
    $('#error_formulario').html(`
              <div class="alert alert-danger" role="alert">
              <strong>Los siguientes campos tiene errores</strong>
            <br>
  
              ${errores.map((c) => `<strong>×</strong> ${c.replace('_', ' ')}<br>`).join('')}
  
            </div>
          `);
}

function limpiarCampos() {
    $('#categoria_producto').val('');
    $('#descripcion_producto').val('');
    $('#nombre_producto').val('');
    $('#precio_producto').val('');
    $('#stock_producto').val('')
    $('#estado_carga').html('');
}


function mostrarMensaje(mensaje) {
    $('#mensaje').html(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `)
}




async function listarProductos() {
    let res = await base.collection('productos').where("estado", "==", 1).get();
    let html = "";
    let i = 0;
    res.forEach(pro => {
        let proI = pro.data();
        proI.id = pro.id;
        i++;
        html += crearFila(proI, i);
    });
    console.log(html);
    $('#cuerpo_tabla').html(html);

    $('#total_productos').text(i);
}

function crearFila(producto, i) {
    return `<tr>
    <th scope="row">${i}</th>
    <td><img src="${producto['foto']}"
            class="rounded float-left" alt="..."></td>
    <td>${producto['nombre']}</td>
    <td>${producto['stock']}</td>
    <td>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button onclick="eliminar('${producto['id']}')" type="button" class="btn btn-danger"><i
                    class="far fa-trash-alt"></i></button>
            
        </div>
    </td>
</tr>`
}

async function eliminar(id) {
    await base.collection('productos').doc(id).update({
        estado: 0
    });

    mostrarMensaje('Producto Eliminado!');
    listarProductos();
}

function obtenerErrores(datos) {
    console.log(datos);
    let camposErroneos = [];
    for (const key in datos) {
        if (datos.hasOwnProperty(key)) {
            const elemento = datos[key];
            console.log(typeof elemento);
            if (typeof elemento == "object") {
                console.log('ENTRA');
                if (elemento == null) camposErroneos.push(key);
                else {
                    obtenerErrores(elemento).forEach((e) => camposErroneos.push(e));
                }
            }
            else if (typeof elemento == 'null') camposErroneos.push(key)
            else if (elemento == '') camposErroneos.push(key)
        }

    }
    console.log(camposErroneos);
    return camposErroneos;
}


listarProductos();




