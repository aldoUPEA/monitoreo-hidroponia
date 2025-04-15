
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);

const dbRef = firebase.database().ref("Nodo2/ÚltimoDato");

const ctx = document.getElementById("aireGauge").getContext("2d");
const chartAire = new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0, 100],
      backgroundColor: ["red", "#eee"],
      borderWidth: 0,
    }]
  },
  options: {
    rotation: -90,
    circumference: 180,
    cutout: '75%',
    plugins: { legend: { display: false } }
  }
});

dbRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const aire = data.Aire ?? 0;
  chartAire.data.datasets[0].data = [aire, 100 - aire];
  chartAire.update();
  document.getElementById("valorAire").innerHTML = aire + " °C";
});
