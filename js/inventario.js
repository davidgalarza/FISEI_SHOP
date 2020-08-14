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
var idProducto;
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
let linkFoto2 = '';

$('#actualizarModal #foto_producto').change(async () => {
    let foto = $('#actualizarModal #foto_producto').prop('files')[0];
    console.log(foto);
    $('#actualizarModal #estado_carga').html(`<div class="center spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>`)
    let refFoto = almacenamiento.ref().child(`${Date.now()}.jpg`);
    await refFoto.put(foto);
    linkFoto2 = await refFoto.getDownloadURL();
    $('#actualizarModal #estado_carga').html(`<div class="alert alert-success" role="alert">
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
        precio: parseFloat($('#precio_producto').val()),
        stock: parseInt($('#stock_producto').val())
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
            class="far fa-trash-alt"></i></button><a>&nbsp&nbsp</a>
            <button onclick="abrirM('${producto['nombre']}', '${producto['precio']}', '${producto['descripcion']}', '${producto['stock']}', '${producto['categoria']}', '${producto['id']}')" type="button" class="btn btn-primary"><i
            class="far fa-edit"></i></button>
            
        </div>
    </td>
</tr>
`
}

async function eliminar(id) {
    await base.collection('productos').doc(id).update({
        estado: 0
    });

    mostrarMensaje('Producto Eliminado!');
    listarProductos();
}
function abrirM(nombre, precio, descripcion, stock, categoria, id) {
    console.log('hola');
    $('#actualizarModal').on('show.bs.modal', function (e) {
        $(e.currentTarget).find('input[id="nombre_producto"]').val(nombre);
        $(e.currentTarget).find('input[id="precio_producto"]').val(precio);
        $(e.currentTarget).find('input[id="descripcion_producto"]').val(descripcion);
        $(e.currentTarget).find('input[id="stock_producto"]').val(stock);
        $(e.currentTarget).find('select[id="categoria_producto"]').val(categoria);
        $('#actualizarModal #estado_carga').html('');
        idProducto = id;
        linkFoto2 = "";

    });

    $('#actualizarModal').modal('show');

}
async function actualizar() {
    console.log('das');
    let infoProducto;
    if (linkFoto2 === "") {
        infoProducto = {
            categoria: $(' #actualizarModal #categoria_producto').val(),
            descripcion: $('#actualizarModal #descripcion_producto').val(),
            nombre: $('#actualizarModal #nombre_producto').val(),
            precio: parseFloat($('#actualizarModal #precio_producto').val()),
            stock: parseInt($('#actualizarModal #stock_producto').val())
        };
    } else {
        infoProducto = {
            categoria: $(' #actualizarModal #categoria_producto').val(),
            descripcion: $('#actualizarModal #descripcion_producto').val(),
            foto: linkFoto2,
            nombre: $('#actualizarModal #nombre_producto').val(),
            precio: parseFloat($('#actualizarModal #precio_producto').val()),
            stock: parseInt($('#actualizarModal #stock_producto').val())
        };
    }

    await base.collection('productos').doc(idProducto).update(infoProducto);
    $('#actualizarModal').modal('hide');
    mostrarMensaje('Producto Actualizado!');
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




