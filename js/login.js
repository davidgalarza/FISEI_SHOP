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
let base = firebase.firestore();


async function obtenerUsuario(uid){
    let usu = (await base.collection('usuarios').doc(uid).get()).data();
    return usu;
}

async function autentificar(event) {

    event.preventDefault();
    let usuario = event.target.email.value;
    let contrasena = event.target.password.value;
    let autenticacion = firebase.auth();
    autenticacion.signInWithEmailAndPassword(usuario, contrasena).then(async (resultado) => {
        console.log(resultado);


       let usu = await obtenerUsuario(resultado.user.uid)
       console.log(usu);

        window.location.href = (usu.perfil == "ADMINISTRADOR") ? "inventario.html" : "index.html";
        console.log(autenticacion.currentUser);


    }).catch((e) => {
        console.log(e);
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

var recargarr = async function(){

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider).then(async function(result) {   
      
        window.location.href = './comprar.html';
        
      }).catch(function(error) {
       console.log(error);
      });
}











