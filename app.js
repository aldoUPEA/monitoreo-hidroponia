
// Firebase v8 (compatible local y hosting)
var firebaseConfig = {
  apiKey: "AIzaSyAADF1ri_yTyYL3YNiKncbx8AlkWcmy55Q",
  authDomain: "monitoreo-hidropro.firebaseapp.com",
  databaseURL: "https://monitoreo-hidropro-default-rtdb.firebaseio.com",
  projectId: "monitoreo-hidropro",
  storageBucket: "monitoreo-hidropro.appspot.com",
  messagingSenderId: "269017723506",
  appId: "1:269017723506:web:85ffb8994c2c12219288eb"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Rangos y colores
function getColor(variable, value) {
  if (variable === "aire") {
    if (value >= 18 && value <= 25) return "green";
    else if ((value >= 15 && value < 18) || (value > 25 && value <= 28)) return "orange";
    else return "red";
  }
  if (variable === "agua") {
    if (value >= 18 && value <= 24) return "green";
    else if ((value >= 15 && value < 18) || (value > 24 && value <= 28)) return "orange";
    else return "red";
  }
  if (variable === "humedad") {
    if (value >= 60 && value <= 80) return "green";
    else if ((value >= 50 && value < 60) || (value > 80 && value <= 85)) return "orange";
    else return "red";
  }
  if (variable === "ph") {
    if (value >= 5.5 && value <= 6.5) return "green";
    else if ((value >= 5.0 && value < 5.5) || (value > 6.5 && value <= 7.0)) return "orange";
    else return "red";
  }
  if (variable === "tds") {
    if (value >= 750 && value <= 900) return "green";
    else if ((value >= 600 && value < 750) || (value > 900 && value <= 1000)) return "orange";
    else return "red";
  }
  return "gray";
}

// Crear Gauge
function createGauge(ctx, label, max, id) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, max],
        backgroundColor: ['gray', '#e0e0e0'],
        borderWidth: 0
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '80%',
      plugins: {
        doughnutlabel: {
          labels: [
            { text: '0', font: { size: 18 } }
          ]
        },
        legend: { display: false }
      }
    }
  });
}

// Inicializar gauges
const aireGauge = createGauge(document.getElementById("aireGauge").getContext('2d'), "Aire", 50, "aireGauge");
const aguaGauge = createGauge(document.getElementById("aguaGauge").getContext('2d'), "Agua", 40, "aguaGauge");
const humedadGauge = createGauge(document.getElementById("humedadGauge").getContext('2d'), "Humedad", 100, "humedadGauge");
const phGauge = createGauge(document.getElementById("phGauge").getContext('2d'), "pH", 14, "phGauge");
const tdsGauge = createGauge(document.getElementById("tdsGauge").getContext('2d'), "TDS", 1500, "tdsGauge");

function updateGauge(gauge, value, max, variable) {
  gauge.data.datasets[0].data = [value, max - value];
  gauge.data.datasets[0].backgroundColor[0] = getColor(variable, value);
  gauge.options.plugins.doughnutlabel.labels[0].text = value.toString();
  gauge.update();
}

// Leer Firebase
firebase.database().ref("Nodo2").on("value", function(snapshot) {
  const data = snapshot.val();
  updateGauge(aireGauge, data.Aire, 50, "aire");
  updateGauge(aguaGauge, data.Agua, 40, "agua");
  updateGauge(humedadGauge, data.Humedad, 100, "humedad");
  updateGauge(phGauge, data.pH, 14, "ph");
  updateGauge(tdsGauge, data.TDS, 1500, "tds");

  const estadoEl = document.getElementById("estadoSistema");
  estadoEl.innerText = "Estado: " + data.Estado;
  estadoEl.className = "estado " + data.Estado.toUpperCase();
});
