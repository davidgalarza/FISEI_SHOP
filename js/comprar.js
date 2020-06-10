var mapa;
var marcador;
var card;

function initialize() {
  var options = {
    componentRestrictions: { country: "ec" }
  };
  let input = document.getElementById('direccion');


  new google.maps.places.Autocomplete(input, options);
  mostrarSeccion('direccion');

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
    mostrarMapa(res[0]['geometry']['location']);
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






google.maps.event.addDomListener(window, 'load', initialize);