autenticacion.onAuthStateChanged(function(user) {
    if(user == null){
        window.location.replace("./loggin.html");
        return;
    }
    let uid = user.uid;
    
    base.collection('carritos').doc(uid).onSnapshot(function(doc) {
        console.log('DOC', doc)
        let cantidadProductos = 0;
        if(doc.data() != undefined){
            doc.data().productos.forEach(p => {
                cantidadProductos += p.cantidad;
            });
        
            $('#numero_carriro').text(cantidadProductos);
        }
        
    });
})


async function salir(){
    await autenticacion.signOut();
    window.location.replace("./loggin.html");
}