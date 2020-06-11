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

let correo = "fisei@uta.ec";
let contrasena = "12345678";
let nombre = 'PEPE';

autenticacion.createUserWithEmailAndPassword(correo, contrasena).then((res) => {
    console.log(res);

    base.collection('usuarios').doc(res.user.uid).set({
        correo: correo,
        nombre: nombre
    });



}).catch((e) => {

});
