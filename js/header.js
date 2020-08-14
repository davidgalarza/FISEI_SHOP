const INGRESAR_HTML = `
<a href="./loggin.html" class="no_link">
<div class="boton_menu">
    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-box-arrow-in-right"
        fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
            d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z" />
        <path fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z" />
        <path fill-rule="evenodd"
            d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z" />
    </svg>
    <br>
    <span>Ingresar</span>
</div>
</a>
`;

const PERFIL_HTML = `
<span class="dropdown">
<a class="no_link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
aria-expanded="false">
<div class="boton_menu">
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
        <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
    </svg>
    <br>
    <span>Perfil</span>
</div>
</a>

<div class="dropdown-menu pt-1" aria-labelledby="dropdownMenuButton">
    <a onclick="salir()" class="dropdown-item" >Cerrar Sesion</a>                      
</div>
</span>

`;





autenticacion.onAuthStateChanged(async function (user) {
    if (!user)
        await autenticacion.signInAnonymously();
    else {
        let uid = user.uid;
        base.collection('carritos').doc(uid).onSnapshot(function (doc) {
            console.log('DOC', doc)
            let cantidadProductos = 0;
            let total = 0;
            if (doc.data() != undefined) {
                doc.data().productos.forEach(p => {
                    console.log(p);
                    cantidadProductos += p.cantidad;
                    total += p.cantidad * p.precio;
                });
                $('#numero_carriro').text(cantidadProductos);
                $('#numero_carriro2').text(cantidadProductos);
                $('#total_carrito').text('$'+total)
                $('#total_carrito2').text('$'+total)
            }
        });
        if(user.isAnonymous){
            $('#boton_pricipal').html(INGRESAR_HTML);
            $('#salir_1').hide();
            $('#ingresar_1').show();
        } else{
            $('#boton_pricipal').html(PERFIL_HTML);
            $('#salir_1').show();
            $('#ingresar_1').hide();
        }
    }
})


async function salir() {
    await autenticacion.signOut();
    window.location.reload();
}


(async () =>{
    let base = firebase.firestore();

    let categorias = await base.collection('categorias').get();

   categorias.docs.forEach((doc) =>{
    let categoria = doc.data();

    $('#contenedor_cat').append(`<div class="col-4">
    <div style="background:  url(${categoria.imagen}) rgba(25, 21, 23, 0.3);background-blend-mode: multiply;"
        class="bg-position-center bg-no-repeat bg-size-cover text-center px-3 py-4 mb-3">
        <h3 class="h5 text-white text-shadow my-3">${categoria.nombre}</h3>
    </div>
    </div>`);

   })
})();




// $(document).ready(() => {
//     $('#dropdownMenuButton').hover(function(){
//         $('#dropdownMenuButton').trigger('click')
//     })
// });