async function obtenerUsuario(uid) {
    let usu = (await base.collection('usuarios').doc(uid).get()).data();
    return usu;
}

function idUsuarioActual() {
    return new Promise(async (resolve, reject) => {
        autenticacion.onAuthStateChanged(function (user) {
            if(user == null) resolve(null);
            resolve(user.uid);
        });
    });
}

(async () => {

    let uid = await idUsuarioActual();
    if (uid == null) {
        window.location.replace("./loggin.html");
        return;
    }
    let usuario = await obtenerUsuario(uid);

    if (usuario.perfil != 'ADMINISTRADOR') {
        await autenticacion.signOut();
        window.location.replace("./loggin.html");
        return;
    }

})();

async function salir(){
    await autenticacion.signOut();
    window.location.replace("./loggin.html");
}