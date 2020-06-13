autenticacion.onAuthStateChanged(function(user) {
    base.collection('carritos').doc(user.uid).onSnapshot(function(doc) {
        let cantidadProductos = doc.data().productos.length;

        $('#numero_carriro').text(cantidadProductos);
    });
});