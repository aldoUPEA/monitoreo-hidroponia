
const firebaseConfig = {
  apiKey: "AIzaSyAADF1ri_yyy",
  authDomain: "monitoreo-hidropro.firebaseapp.com",
  databaseURL: "https://monitoreo-hidropro-default-rtdb.firebaseio.com/",
  projectId: "monitoreo-hidropro",
};

firebase.initializeApp(firebaseConfig);

const dbRef = firebase.database().ref("Nodo2");

dbRef.limitToLast(1).on("value", snapshot => {
  snapshot.forEach(childSnapshot => {
    const data = childSnapshot.val();

    if(document.getElementById("aire").innerText != data.Aire) document.getElementById("aire").innerText = data.Aire ?? "--";
    if(document.getElementById("agua").innerText != data.Agua) document.getElementById("agua").innerText = data.Agua ?? "--";
    if(document.getElementById("humedad").innerText != data.Humedad) document.getElementById("humedad").innerText = data.Humedad ?? "--";
    if(document.getElementById("ph").innerText != data.pH) document.getElementById("ph").innerText = data.pH ?? "--";
    if(document.getElementById("tds").innerText != data.TDS) document.getElementById("tds").innerText = data.TDS ?? "--";

    const estadoValor = "Estado: " + (data.Estado ?? "--");
    if(document.getElementById("estado").innerText != estadoValor){
        document.getElementById("estado").innerText = estadoValor;
        document.getElementById("estado").style.background = data.Estado === "ALTO" ? "green" :
                                                            data.Estado === "BAJO" ? "red" :
                                                            data.Estado === "ESPERA" ? "orange" : "gray";
    }
  });
});
