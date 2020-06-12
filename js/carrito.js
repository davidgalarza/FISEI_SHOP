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

autenticacion.onAuthStateChanged(function(user) {
    console.log(user);

    base.collection('carritos').doc(user.uid).get().then((inf) =>{
        if(inf.exist){
            base.collection('carritos').doc(user.uid).update({});
        } else{
            base.collection('carritos').doc(user.uid).set({});
        }
    });


    base.collection('carritos').doc(user.uid).get().then((inf) =>{
        inf.productos
    })

    base.collection('carritos').doc(user.uid).update({
        productos: [
           {
               cantida: 0,
               foto: 'gghj'
           } 
        ]
    });
});