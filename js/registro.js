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
var formAutentificacion;
firebase.initializeApp(firebaseConfig);
let base = firebase.firestore();

formAutentificacion = document.getElementById("form-registro");
formAutentificacion.addEventListener("submit", registrar, false);

function registrar(event) {
    event.preventDefault();
    let apellido = event.target.apellido.value;
    let correo = event.target.email.value;
    let nombre = event.target.nombre.value;
    let perfil = "COMPRADOR";
    let telefono = event.target.telefono.value;
    let contrasena = event.target.contrasena.value;

    let autenticacion = firebase.auth();


    autenticacion.createUserWithEmailAndPassword(correo, contrasena).then(async (res) => {
        
        await base.collection('usuarios').doc(res.user.uid).set({
            apellido: apellido,
            correo: correo,
            nombre: nombre,
            perfil: perfil,
            telefono: telefono
        });
        $("#exitoRegistro").modal();
        salir();
        
    }).catch((e) => {

    });


}
async function salir(){
    let autenticacion = firebase.auth();
    await autenticacion.signOut();
}
var recargar = function(){
    window.location.href = "loggin.html";   
}
function facebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');

    firebase.auth().signInWithPopup(provider).then(async function(result) {
        var token = result.credential.accessToken;
        var nombre = result.user.displayName;
        var cadena = nombre.split(" ") 
        var mail = result.user.email;
        var perfil = "COMPRADOR";
        var telefono = "090000000";
        console.log(result);

        await base.collection('usuarios').doc(result.user.uid).set({
            apellido: cadena[1],
            correo: mail,
            nombre: cadena[0],
            perfil: perfil,
            telefono: telefono
        });
        $("#exitoRegistro").modal();
        salir();
      }).catch(function(error) {
       console.log(error);
      });
}



