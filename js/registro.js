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


    var credential = firebase.auth.EmailAuthProvider.credential(correo, contrasena);

    var user = firebase.auth().currentUser;
    user.linkWithCredential(credential).then(async (res) => {
        await base.collection('usuarios').doc(res.user.uid).set({
            apellido: apellido,
            correo: correo,
            nombre: nombre,
            perfil: perfil,
            telefono: telefono
        });
        window.location.href = './comprar.html';
    }).catch((e) => {

    });


}
async function salir() {
    let autenticacion = firebase.auth();
    await autenticacion.signOut();
}
var recargar = function () {
    window.location.href = "loggin.html";
}
function facebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');

    var usew = firebase.auth().currentUser;  
    usew.linkWithPopup(provider).then(async (res) => {   
        console.log(res.user.providerData[0]);
        console.log(res.user);
        var nombre = res.user.providerData[0].displayName;
        var cadena = nombre.split(" ") 
        var perfil = "COMPRADOR";
        var mail = res.user.providerData[0].email;
        var telefono = "090000000";
        await base.collection('usuarios').doc(res.user.uid).set({
            apellido: cadena[1],
            correo: mail,
            nombre: cadena[0],
            perfil: perfil,
            telefono: telefono
        });
        $("#exitoRegistro").modal();
        window.location.href = './comprar.html';


      }).catch(function(error) {
        console.log(error);
      });

}



