
const firebaseConfig = {
  apiKey: "AIzaSyAADF1ri_yYtYLY3NlKncxb8AlkWcmy55Q",
  authDomain: "monitoreo-hidropro.firebaseapp.com",
  databaseURL: "https://monitoreo-hidropro-default-rtdb.firebaseio.com",
  projectId: "monitoreo-hidropro",
  storageBucket: "monitoreo-hidropro.appspot.com",
  messagingSenderId: "269017723506",
  appId: "1:269017723506:web:85ffb8994c2c1221928eb"
};

firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("Nodo2");

dbRef.limitToLast(1).on("value", (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    document.getElementById("aire").innerText = (data.Aire ?? "--") + " °C";
  });
});
