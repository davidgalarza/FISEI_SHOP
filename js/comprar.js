var mapa;
var marcador;
var card;
let pasos = ['direccion', 'pago', 'resumen'];

var datosOrden = {};

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

var uid;
var infoUsuario;
var carrito;

function idUsuarioActual() {
  return new Promise(async (resolve, reject) => {
    autenticacion.onAuthStateChanged(function (user) {
      resolve(user.uid);
    });
  });
}

async function cargarInfoUsuario(uid) {
  let r = await base.collection('usuarios').doc(uid).get();
  return r.data();
}


async function cargarCarritoUsuario(uid) {
  let r = await base.collection('carritos').doc(uid).get();
  return r.data();
}


function ponerDatosUsuario(datos) {
  $('#nombre_usuario').text(datos['nombre']);
  $('#correo_usuario').text(datos['correo']);
  $('#telefono_usuario').text(datos['telefono']);

}
function ponerDatosCarrito(carriro) {
  $('#sub_total').text("$" + carriro['total'].toFixed(2));
  $('#total').text("$" + carriro['total'].toFixed(2));
}



async function iniciarMapa() {



  var options = {
    componentRestrictions: { country: "ec" }
  };
  let input = document.getElementById('direccion');


  new google.maps.places.Autocomplete(input, options);

  card = new Card({
    form: '#formulario',
    container: '.contenedor_tajeta',

    formSelectors: {
      numberInput: '#numero_tarjeta',
      expiryInput: '#fecha_tarjeta',
      cvcInput: '#cvc_tarjeta',
      nameInput: '#nombre_tarjeta'
    },
    placeholders: {
      name: 'Nombre completo',
    },
  });
}

function refinar() {
  let busqueda = document.getElementById('direccion').value;

  geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': busqueda
  }, (res) => {

    if (res[0] == undefined) {
      $('#contenerdor_error').html(`
            <div class="alert alert-danger" role="alert">
            No se pudo encontrar la direccion
          </div>
        `);
      $('#contenedor_mapa').hide();
    } else {
      $('#contenerdor_error').html(``);
      $('#contenedor_mapa').show();
      mostrarMapa(res[0]['geometry']['location']);
    }


  });



}

function ocultarSecciones() {
  $('.seccion').hide();
  $('.paso').removeClass('paso_activo');
  $('.paso').removeClass('paso_completado');
}

function mostrarMapa(location) {
  let contenedorMapa = document.getElementById('mapa');
  mapa = new google.maps.Map(contenedorMapa, {
    center: location,
    zoom: 16
  });
  marcador = new google.maps.Marker({
    position: location,
    title: "Marcador",
    draggable: true,
  });

  marcador.setMap(mapa);

  $('#contenedor_mapa').show();
}

function mostrarSeccion(seccion) {
  ocultarSecciones();
  $(`#${seccion}_seccion`).show();
  $(`#paso_${seccion}`).addClass('paso_activo');
  let actual = false;
  $('.paso').each(function () {
    if (!actual) {
      actual = ($(this).attr('id') == `paso_${seccion}`);
      if (!actual) $(this).addClass('paso_completado');
    }

  });
}

function obtenerDatos(i) {
  if (i == 1) {
    return {
      'direccion': $('#direccion').val(),
      'codigo_postal': $('#codigo_postal').val(),
      'coordenadas': marcador != undefined ? {
        'lat': marcador.position.lat(),
        'lng': marcador.position.lng()
      } : null
    };
  } else if (i == 2) {
    return {
      metodo_pago: {
        'numero_tarjeta': $('#numero_tarjeta').val(),
        'cvc_tarjeta': $('#cvc_tarjeta').val(),
        'fecha_expiracion': $('#fecha_tarjeta').val(),
        'nombre_tarjeta': $('#nombre_tarjeta').val()
      }
    }
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


async function crearOrden() {
  datosOrden['usuario'] = infoUsuario;
  datosOrden['usuiario']['uid'] = uid;
  datosOrden['estado'] = 'PENDIENTE';

  await base.collection('ordenes').add(datosOrden);
  /*await base.collection('carritos').doc(uid).update({
    'productos': [],
    'total': 0
  });*/
  //let promises = carrito.productos.map(p => restarStock(p.id, p['cantidad']));
  

 // await Promise.all(promises);

}


async function restarStock(id, cantidad){

  let infoActual = await (await base.collection('productos').doc(id).get()).data();
  infoActual['stock'] -= cantidad;

  return base.collection('productos').doc(id).update(infoActual);

}


async function irAlPaso(i) {
  let datosPaso = obtenerDatos(i);
  datosOrden = {...datosOrden, ...datosPaso};
  datosOrden['carrito'] = carrito;
  let errores = obtenerErrores(datosPaso);

  if (errores.length == 0) {

    if (i == 2) {
      await crearOrden();
    }
    mostrarSeccion(pasos[i]);
    $('#error_formulario').html('');
  } else {
    console.log(errores)
    mostrarErrores(errores);

  }

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



async function iniciarDatos(){
  mostrarSeccion('direccion');

  uid = await idUsuarioActual();
  uid = 'user_id';

  infoUsuario = await cargarInfoUsuario(uid);
  ponerDatosUsuario(infoUsuario);
  carrito = await cargarCarritoUsuario(uid);
  ponerDatosCarrito(carrito);
}


iniciarDatos();



google.maps.event.addDomListener(window, 'load', iniciarMapa);