const firebaseConfig = {
  apiKey: "AIzaSyADF1ri_yYyLY3NiKnxcb8AlLkWcmy55Q",
  authDomain: "monitoreo-hidropro.firebaseapp.com",
  databaseURL: "https://monitoreo-hidropro-default-rtdb.firebaseio.com",
  projectId: "monitoreo-hidropro",
  storageBucket: "monitoreo-hidropro.appspot.com",
  messagingSenderId: "260917723506",
  appId: "1:260917723506:web:85ffb8994c2c12219828eb"
};

firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("Nodo2");

function actualizarValores(data) {
    document.getElementById("aire").textContent = data.Aire ?? "--";
    document.getElementById("agua").textContent = data.Agua ?? "--";
    document.getElementById("humedad").textContent = data.Humedad ?? "--";
    document.getElementById("ph").textContent = data.pH ?? "--";
    document.getElementById("tds").textContent = data.TDS ?? "--";
    const estado = data.Estado ?? "--";
    const estadoDiv = document.getElementById("estadoDiv");
    estadoDiv.textContent = "Estado: " + estado;
    estadoDiv.style.backgroundColor = estado === "ALTO" ? "green" : (estado === "BAJO" ? "red" : "gray");
}

dbRef.limitToLast(1).on("value", snapshot => {
    snapshot.forEach(child => {
        actualizarValores(child.val());
    });
});

function descargarCSV() {
    const mes = document.getElementById("seleccionarMes").value;
    const anio = document.getElementById("seleccionarAnio").value;
    const fileName = `datos_hidroponia_${anio}_${mes}.csv`;
    let csvContent = "Fecha,Aire,Agua,Humedad,pH,TDS,Estado\n";
    firebase.database().ref("Nodo2").once("value", snapshot => {
        snapshot.forEach(child => {
            const data = child.val();
            const linea = [
                child.key,
                data.Aire ?? "",
                data.Agua ?? "",
                data.Humedad ?? "",
                data.pH ?? "",
                data.TDS ?? "",
                data.Estado ?? ""
            ].join(",");
            if (child.key.includes(`${anio}-${mes}`)) {
                csvContent += linea + "\n";
            }
        });
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function borrarDatosManualmente() {
    if (!confirm("¿Estás seguro de borrar todos los datos?")) return;
    firebase.database().ref("Nodo2").remove()
        .then(() => alert("Datos borrados correctamente"))
        .catch(err => alert("Error: " + err));
}

// Eliminación automática de datos mayores a 3 meses
firebase.database().ref("Nodo2").once("value", snapshot => {
    const ahora = new Date();
    snapshot.forEach(child => {
        const fecha = child.key.replace("_", "T").replace(/_/g, ":");
        const fechaDato = new Date(fecha);
        const diff = (ahora - fechaDato) / (1000 * 60 * 60 * 24);
        if (diff > 90) firebase.database().ref("Nodo2/" + child.key).remove();
    });
});