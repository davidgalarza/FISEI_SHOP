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

//Conectar a la base para añadir los campos de Ordenes
dataPrecios = {

    labels: [],
    datasets: [{
        label: "Precio de productos",
        lineTension: 0.1,
        backgroundColor: "rgb(18, 137, 167)",
        borderColor: "rgb(237, 76, 103)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(22, 160, 133,1.0)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(247, 159, 31)",
        pointHoverBorderColor: "rgba(52, 73, 94,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: [],
    }]
};
//Conectar a la base para añadir los campos de productos
datosProd = {

    labels: [],
    datasets: [{
        label: "Stock de productos",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: [],
    }]
};

//Conectar a la base para añadir los campos de Ordenes
dataOr = {

    labels: ["Entregdos", "No entregados"],
    datasets: [{
        label: "Stock de productos",
        lineTension: 0.1,
        backgroundColor: ["rgba(52, 73, 94,1)", "rgba(39, 174, 96,1.0)"],
        borderColor: "rgba(22, 160, 133,1.0)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(22, 160, 133,1.0)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(22, 160, 133,1.0)",
        pointHoverBorderColor: "rgba(52, 73, 94,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: [],
    }]
};
//Coleccion para productos
base.collection("productos").where('estado', '==', 1).get()
    .then(function(querySnapshot) {
        var i = 0;
        var datos;
        querySnapshot.forEach(function(doc) {
            datos = doc.data();
            console.log('asd======> ', datos.nombre, " ", datos.stock);
            mychart.data.datasets[0].data[i] = datos.stock;
            mychart.data.labels[i] = `${datos.nombre}`;
            mychart.update();
            i++;
        });
    });
//Coleccion para ordenes
base.collection('ordenes').where('estado', "==", "ENTREGADO").get().then(snap => {
    size = snap.size // will return the collection size
    ordenesGra.data.datasets[0].data[0] = size;
    ordenesGra.update();
});
base.collection('ordenes').where('estado', "==", "PENDIENTE").get().then(snap => {
    size = snap.size // will return the collection size
    ordenesGra.data.datasets[0].data[1] = size;
    ordenesGra.update();
});
base.collection('usuarios').where('perfil', "==", "COMPRADOR").get().then(snap => {
    size = snap.size;
    document.getElementById('spanNumUsuarios').innerHTML = "Clientes registrados <span class=\"badge badge-pill badge-success\">" + size;
})


var op = document.getElementById("categoriaPro");
//Coleccion para categoria
base.collection("categorias").get()
    .then(function(querySnapshot) {
        var i = 0;
        var datos;
        querySnapshot.forEach(function(doc) {
            datos = doc.data();
            console.log('asd======> ', datos.nombre);
            op.innerHTML += `<option value="${datos.nombre}">${datos.nombre}</option>`
        });
    });

function escogerCate() {
    var x = document.getElementById("categoriaPro").value;
    console.log("SELECIONADO: ", x);

    base.collection("productos").where('categoria', '==', x).get()
        .then(function(querySnapshot) {
            var i = 0;
            var datos;
            querySnapshot.forEach(function(doc) {
                datos = doc.data();
                console.log('asd======> ', datos.nombre, " ", datos.stock);

                ordenesPrec.data.labels[i] = `${datos.nombre}`;
                ordenesPrec.data.datasets[0].data[i] = datos.precio;

                ordenesPrec.update();
                i++;
            });
        });
}
//Crear el gráfio para productos
var ctx = document.getElementById('myChart').getContext('2d');
var mychart = new Chart(ctx, {
    type: "bar",
    data: datosProd,
    options: {
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Producto'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Stock'
                }
            }]
        }
    }
})

//Crear el gráfio para Ordenes
var ctx2 = document.getElementById('ordenesChart').getContext('2d');
var ordenesGra = new Chart(ctx2, {
    type: "pie",
    data: dataOr
})

//Crear el gráfico de los precios de los productos
var ctx3 = document.getElementById('charPrecios').getContext('2d');
var ordenesPrec = new Chart(ctx3, {
    type: "line",
    data: dataPrecios,
    options: {
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Producto'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Precio'
                }
            }]
        }
    }
})