
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyC3hwnH48XmsHfTO8yr_0PgAxKkVWOnlZc",
  authDomain: "mycars-48a83.firebaseapp.com",
  databaseURL:
    "https://mycars-48a83-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mycars-48a83",
  storageBucket: "mycars-48a83.appspot.com",
  messagingSenderId: "435762012035",
  appId: "1:435762012035:web:9b70d4a99f38bb3fa6a0b6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const register = document.getElementById("register");

register.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user
      )
      document.getElementById("email").value = ""
      document.getElementById("password").value = ""
      window.location = "../"
    })
    .catch((error) => {
      document.getElementById("email").value = ""
      document.getElementById("password").value = ""
      error.code === "auth/email-already-in-use" && alert("Bu Email Zaten Kullanılıyor")
      error.code === "auth/invalid-email" && alert("Geçersiz Email")
      error.code === "auth/weak-password" && alert("Şifre En Az 6 Karakter Olmalıdır")
      console.log(error)

    });
});

