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

import * as firebase from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const idParams = urlParams.get("id");
let uid = "";
const db = getFirestore();
const auth = getAuth();

const register = document.getElementById("register");
const login = document.getElementById("login");
let user_name = document.getElementById("user-name");
const logout = document.getElementById("logout");
const ilangir = document.querySelector(".ilangir");

const photo1 = document.getElementById("photo1");
const photo2 = document.getElementById("photo2");
const photo3 = document.getElementById("photo3");
const photo4 = document.getElementById("photo4");
const photo5 = document.getElementById("photo5");

const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const price2 = document.getElementById("price2");
const location = document.getElementById("location");
const date = document.getElementById("date");
const brand = document.getElementById("brand");
const model = document.getElementById("model");
const year = document.getElementById("year");
const km = document.getElementById("km");
const fuel = document.getElementById("fuel");
const gear = document.getElementById("gear");
const color = document.getElementById("color");
const motocc = document.getElementById("motocc");
const motohp = document.getElementById("motohp");
const category = document.getElementById("category");
const number = document.getElementById("number");
const favori = document.getElementById("favori");
const ilanNo = document.getElementById("ilanNo");

favori.addEventListener("click", () => {
  const favoriData = {
    uid: auth.currentUser.uid,
    ilanNo: idParams,
  };
  addFav(favoriData);
});
const qq = collection(db, "favorites");

const qquery = getDocs(qq);
qquery.then((qquerySnapshot) => {
  qquerySnapshot.forEach((doc) => {
    if (
      doc.data().uid == auth.currentUser.uid &&
      doc.data().ilanNo == idParams
    ) {
      favori.classList.add("text-danger");
    } else {
      favori.classList.remove("text-danger");
    }
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    document.querySelector(".user-name").innerHTML = email;
    register.style.display = "none";
    login.style.display = "none";
    ilangir.style.display = "block";
  } else {
    document.querySelector(".user-name").innerHTML = "";
    logout.style.display = "none";
    register.style.display = "block";
    login.style.display = "block";
    ilangir.style.display = "none";
    favori.style.display = "none";
  }
});

const q = collection(db, "ilanlar");
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc);
  const data = doc.data();
  if (data.ilanNo == idParams) {
    getData(data);
  }
});

async function addFav(favoriData) {
  // Check if the item already exists in the collection
  const q = query(collection(db, "favorites"), where("ilanNo", "==", idParams));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    // The item does not already exist in the list, so add it
    try {
      if (favoriData) {
        const result = await addDoc(collection(db, "favorites"), favoriData);
        favori.classList.add("text-danger");
        return result.id;
      }
    } catch (error) {
      console.log(error);
    }
    await addDoc(collection(db, "favorites"), favoriData);
  } else {
    // The item already exists in the list, so remove it
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      toast();
      favori.classList.remove("text-danger");
    });
  }
}

function getData(ilanlar) {
  console.log(ilanlar);
  photo1.src = ilanlar.pictures[0];
  photo2.src = ilanlar.pictures[1];
  photo3.src = ilanlar.pictures[2];
  photo4.src = ilanlar.pictures[3];
  photo5.src = ilanlar.pictures[4];

  title.innerHTML += ilanlar.title;
  description.innerHTML += ilanlar.description;
  price.innerHTML += ilanlar.price + " ₺";
  if (ilanlar.selectedYearPrice > 0) {
    price2.innerHTML += ilanlar.selectedYearPrice + " ₺";
  } else {
    price2.innerHTML += "Kasko Fiyatı Bulunamamıştır";
  }
  category.innerHTML += ilanlar.category;
  number.innerHTML += ilanlar.number;
  location.innerHTML += ilanlar.location;
  date.innerHTML += ilanlar.date;
  brand.innerHTML = ilanlar.brand;
  model.innerHTML += ilanlar.model;
  year.innerHTML += ilanlar.year;
  km.innerHTML += ilanlar.km;
  fuel.innerHTML += ilanlar.fuel;
  gear.innerHTML += ilanlar.gear;
  color.innerHTML += ilanlar.color;
  motocc.innerHTML += ilanlar.motocc;
  motohp.innerHTML += ilanlar.motohp;
  ilanNo.innerHTML += "# "+ ilanlar.ilanNo;
}

function toast() {
  const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

logout.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("çıkış yapıldı");
      toast();
    })
    .catch((error) => {
      console.log(error);
    });
});
