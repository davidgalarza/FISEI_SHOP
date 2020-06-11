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

let correo = "micorreo@gamil.com";
let contra = "12345678";


autenticacion.signInWithEmailAndPassword(correo, contra).then((resultado) =>{
    console.log(resultado);

    // mandar a la pantalla de usuario

    console.log(autenticacion.currentUser);


}).catch((e) =>{
    console.log(e);

/// error

});







