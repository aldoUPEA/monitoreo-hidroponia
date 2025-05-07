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

let ultimaActualizacion = new Date();
let ultimoEstado = null;
let tiempoUltimoCambioEstado = new Date();

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

  // Detectar cambio de estado
  if (estado !== ultimoEstado) {
    ultimoEstado = estado;
    tiempoUltimoCambioEstado = new Date();
  }

  ultimaActualizacion = new Date();

  // Ocultar alertas si todo está bien
  document.getElementById("alerta-tiempo").style.display = "none";
  document.getElementById("alerta-tiempo").classList.remove("alerta-activa");
  document.getElementById("alerta-estado").style.display = "none";
  document.getElementById("alerta-estado").classList.remove("alerta-activa");
}

dbRef.limitToLast(1).on("value", snapshot => {
  snapshot.forEach(child => {
    actualizarValores(child.val());
  });
});

// Verificaciones periódicas
setInterval(() => {
  const ahora = new Date();
  const segundosSinActualizar = (ahora - ultimaActualizacion) / 1000;
  const segundosSinCambioEstado = (ahora - tiempoUltimoCambioEstado) / 1000;

  if (segundosSinActualizar >= 120) {
    const alertaTiempo = document.getElementById("alerta-tiempo");
    alertaTiempo.style.display = "block";
    alertaTiempo.classList.add("alerta-activa");
    alertaTiempo.innerHTML = "⚠️ No se reciben datos desde hace más de 2 minutos.";
  }

  if (segundosSinCambioEstado >= 1800) {
    const alertaEstado = document.getElementById("alerta-estado");
    alertaEstado.style.display = "block";
    alertaEstado.classList.add("alerta-activa");
    alertaEstado.innerHTML = "⚠️ El estado 'Alto/Bajo' no ha cambiado en los últimos 30 minutos.";
  }
}, 30000);

// CSV y limpieza de datos
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

// Login simple
function verificarLogin() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("contrasena").value;

  if (user === "admin" && pass === "1234") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("contenido").style.display = "block";
  } else {
    document.getElementById("error-login").style.display = "block";
  }
}
