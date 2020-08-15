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

let fsearch = false;
var carrito;
var userUid;
let searchClient = algoliasearch('EFBGZNWKVR', 'cd8353e5cda13dacf18e347fb9ac68ea');

let search = instantsearch({
    indexName: 'productos',
    searchClient,
    urlSync: true,
    numberLocale: 'es',
    facets: ['categoria', 'precio'],
    searchFunction(helper) {

        if (!helper.state.query && !fsearch) {
            if(getQueryStringValue('categoria')) {
                helper.setQuery(getQueryStringValue("q"))
                .addDisjunctiveFacetRefinement('categoria', getQueryStringValue('categoria'))
                .addNumericRefinement('estado', '=', 1)
                .search();
            } else {
                helper.setQuery(getQueryStringValue("q"))
                .addNumericRefinement('estado', '=', 1)
                .search();
            }
            
            fsearch = true;
        } else helper.addNumericRefinement('estado', '=', 1).search();



    },

    onStateChange({ uiState, setUiState }) {
        // Custom logic
        setUiState(uiState);


    },

});


setInterval(() => {
    if (carrito) {
        $('.acts').each(function () {
            let id = $(this).html().split('\'')[1];


            let producto = carrito.productos.filter((p) => p.id == id);
            console.log(producto);
            if (producto.length > 0) {
                producto = producto[0];

                console.log($(this).html())
                $(this).html(getEncarroAcciones(producto.cantidad, producto.id))
                console.log($(this).html())
            }


        });
    }
}, 500)




idUsuarioActual().then((uid) => {
    userUid = uid;
    base.collection('carritos').doc(uid).onSnapshot(function (doc) {
        if (doc.exists) {
            carrito = doc.data();
            console.log(carrito);
            carrito.productos.forEach((p) => {
                $(`#contenedor_acciones_${p.id}`).html(getEncarroAcciones(p.cantidad, p.id));
            })
        }


    });
});

async function actualizarCarrito(id, cantidad) {
    console.log('dsa')
    let productos = [];
    if (carrito) productos = carrito.productos;

    let enCarro = productos.some((p) => p.id == id);

    if (enCarro) {
        productos = productos.map((p) => {
            let proCarrito = p;
            if (p.id == id) proCarrito['cantidad'] = cantidad;
            return proCarrito;
        });
    } else {
        let proSnap = await base.collection('productos').doc(id).get();
        if (proSnap.exists) {
            let prodctData = proSnap.data();
            prodctData['id'] = proSnap.id;
            prodctData['cantidad'] = cantidad;
            prodctData['subtotal'] = cantidad * prodctData.precio;
            productos.push(prodctData);
        }
    }

    productos = productos.filter((p) => p.cantidad > 0);
    let total = 0;
    productos.forEach((p) => total += p.subtotal)
    if (carrito) base.collection('carritos').doc(userUid).update({ productos, total });
    else  base.collection('carritos').doc(userUid).set({ productos, total });

    // Logica inferfaz
    if (cantidad <= 0)
        $(`#contenedor_acciones_${id}`).html(`<button onclick="actualizarCarrito('${id}', 1)" href="#" class="btn btn-primary btn-block"  role="button">Agregar</button>`)
}


search.addWidgets([
    instantsearch.widgets.searchBox({
        container: '#searchbox',
    }),
    instantsearch.widgets.clearRefinements({
        container: '#clear-refinements',
        templates: {
            resetLabel: 'Borrar filtros',
        },
    }),
    instantsearch.widgets.refinementList({
        container: '#brand-list',
        attribute: 'categoria',
    }),
    instantsearch.widgets.configure({
        hitsPerPage: 10,
    }),
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            item: `
                <div >
                        <div>
                            <div class="square" style="background-image: url('{{foto}}')"  ></div>
                            <div class="hit-name">
                            {{#helpers.highlight}}{ "attribute": "nombre" }{{/helpers.highlight}}
                            </div>
                            <div style="border-bottom: 1px dashed #e2e2e2; padding-bottom:1em;height: 100px;
                            overflow: overlay;
                            padding-bottom: 0.5em;" class="hit-description">
                            {{#helpers.highlight}}{ "attribute": "descripcion" }{{/helpers.highlight}}
                            </div>
                            <div class="hit-price">\${{precio}}</div>
                        </div>
    
                        <div class="acts" id="contenedor_acciones_{{objectID}}" style="margin-top: 1em">

                            <button onclick="actualizarCarrito('{{objectID}}', 1)" href="#" class="btn btn-primary btn-block"  role="button">Agregar</button>
    
                        </div>
                </div>
            `,
            empty: `
            <div style="width: 100%;text-align: center;">
                <img src="https://image.flaticon.com/icons/svg/1283/1283305.svg" style="width: 6em">
                <p class="pt-4">Sin resultados para <strong><q>{{ query }}</q></strong></p>
                </div>
            `,
        },
    }),
    instantsearch.widgets.pagination({
        container: '#pagination',
    }),
    instantsearch.widgets.rangeSlider({
        container: '#price_se',
        attribute: 'precio',
        tooltips: 'dolares'
    }),
    instantsearch.widgets.stats({
        container: '#stats',
    }),
    instantsearch.widgets.voiceSearch({
        container: '#voz',
        templates: {
            status: ``,
        },

        searchAsYouSpeak: true,
        language: 'es',
    })
]);
search.start();




function getEncarroAcciones(cantidad, id) {
    return `
    <div style="width: 100%;" class="btn-group" role="group" aria-label="Basic example">
        <button onclick="actualizarCarrito('${id}', ${cantidad - 1})" type="button" class="btn btn-secondary btn-block"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
      </svg> Retirar</button>
        <button type="button" class="btn">${cantidad}</button>
        <button onclick="actualizarCarrito('${id}', ${cantidad + 1})" type="button" class="btn btn-primary btn-block">Anadir <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
        <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
      </svg></button>
    </div>
    `;
}



$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



function agregar(id) {

}







function idUsuarioActual() {
    return new Promise(async (resolve, reject) => {
        autenticacion.onAuthStateChanged(function (user) {
            resolve(user.uid);
        });
    });
}



function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}  