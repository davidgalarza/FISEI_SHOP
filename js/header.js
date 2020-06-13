autenticacion.onAuthStateChanged(function(user) {
    if(user == null){
        window.location.replace("./loggin.html");
        return;
    }
    let uid = user.uid;
    
    base.collection('carritos').doc(uid).onSnapshot(function(doc) {
        console.log('DOC', doc)
        let cantidadProductos = 0;
        doc.data().productos.forEach(p => {
            cantidadProductos += p.cantidad;
        });
    
        $('#numero_carriro').text(cantidadProductos);
    });
})
