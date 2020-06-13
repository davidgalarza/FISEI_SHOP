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

formAutentificacion = document.getElementById("formularioInicio");
formAutentificacion.addEventListener("submit", autentificar, false);

function autentificar(event) {

    event.preventDefault();
    let usuario = event.target.email.value;
    let contrasena = event.target.password.value;
    let autenticacion = firebase.auth();
    autenticacion.signInWithEmailAndPassword(usuario, contrasena).then((resultado) => {
        console.log(resultado);
        window.location.href = "inicio.html";
        console.log(autenticacion.currentUser);


    }).catch((e) => {
        if (e.message === "Too many unsuccessful login attempts. Please try again later.") {
            $("#errorModal2").modal();
        } else {
            $("#errorModal").modal();
            
        }
    });
}


var recuperarContra = function () {
    let autenticacion = firebase.auth();
    var email = $('#email').val();
    console.log(email);
    autenticacion.sendPasswordResetEmail(email)
        .then(function () {
            $("#exitoContrasena").modal();
        }, function (error) {
            $("#errorContrasena").modal();
            
        })
}
var recargar = function(){
    document.location.reload();
}

var recargarr = function(){

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    let base = firebase.firestore();
    firebase.auth().signInWithPopup(provider).then(function(result) {   
        console.log(result);
        var token = result.credential.accessToken;
        var nombre = result.user.displayName;
        var cadena = nombre.split(" ") 
        var mail = result.user.email;
        var perfil = "COMPRADOR";
        var telefono = "090000000";
        console.log(result);
        base.collection('usuarios').doc(result.user.uid).set({
            apellido: cadena[1],
            correo: mail,
            nombre: cadena[0],
            perfil: perfil,
            telefono: telefono
        });
        window.location.href = "inicio.html";
      }).catch(function(error) {
       console.log(error);
      });
}











