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

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {

  collection,
  getFirestore,

  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


const db = getFirestore();
const auth = getAuth();

const contain = document.getElementById("contain");
const add = document.getElementById("add");

const register = document.getElementById("register");
const login = document.getElementById("login");
let user_name = document.getElementById("user-name");
const logout = document.getElementById("logout");
const ilangir = document.querySelector(".ilangir");
const favpage = document.querySelector("#favpage");

const Otomobil = document.getElementById("Otomobil");
const Suv = document.getElementById("Suv");
const Minivan = document.getElementById("Minivan&Panelvan");
const Ticari = document.getElementById("Ticari");




onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    document.querySelector(".user-name").innerHTML = email;
    register.style.display = "none";
    login.style.display = "none";
    ilangir.style.display = "block";

  } else {
    favpage.style.display = "none";
    document.querySelector(".user-name").innerHTML = "";
    logout.style.display = "none";
    register.style.display = "block";
    login.style.display = "block";
    ilangir.style.display = "none";

  }
});

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

let data = [];
onAuthStateChanged(auth, (user) => {
  onSnapshot(collection(db, "ilanlar"), (doc) => {
    getData(
      doc.docs.reduce(
        (ilanlar, ilan) => [
          ...ilanlar,
          { ...ilan.data(), id: ilan.id },
        ],
        []
      )
      , category);

  });
});

const parentElement = document.getElementById("buttons");

parentElement.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const id = event.target.dataset.id;
    category = id;
    console.log(category);

    onSnapshot(collection(db, "ilanlar"), (doc) => {
      getData(
        doc.docs.reduce(
          (ilanlar, ilan) => [
            ...ilanlar,
            { ...ilan.data(), id: ilan.id },
          ],
          []
        )
        , category);
  
    });
    

  }
});


let category = "Tümü";



function getData(data , category) {
  contain.innerHTML = "";



  if (category === "Otomobil") {

    data = data.filter(item => item.category === "Otomobil");

  }
  else if (category === "Suv") {
    data = data.filter(item => item.category === "Suv");
  }
  else if (category === "Ticari") {
    data = data.filter(item => item.category === "Ticari");
  }
  else if (category === "Minivan&Panelvan") {
    data = data.filter(item => item.category === "Minivan&Panelvan");
  }
  else if (category === "Tümü") {
    data = data.filter(item => item.category === "Otomobil" || item.category === "Suv" || item.category === "Ticari" || item.category === "Minivan&Panelvan");
  }





  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList = "card-body";
    console.log(item.ilanNo);
    const content = `
    <div class="card mb-3 w-100 bg-transparent border border-0  ">
    <div class="row  d-flex justify-content-center ">
      <div class="col-md-3 bg-transparent ">
        <img id="photo" src="${item.pictures[0]}" class="img-thumbnail   " alt="..." />
      </div>
      <div class="col-md-5 border rounded-2 shadow-lg">
        <div class="card-body">
            <div class="d-flex justify-content-between"> 
            <small class="text-secondary fw-bold text-sm text-uppercase"> # ${item.ilanNo}</small>  

            </div>
        <div class="d-flex justify-content-between align-items-center">
        <h5 id="title" class="card-brand fw-bold">${item.title}</h5>
        <h5 id="price" class="card-price fw-bold text-end text-secondary ">${(item.price)} ₺</h5>
        </div>
        <div>
        <p id="category" class="card-category text-secondary">${item.category}</p>
        </div>
         
          <h6 id="brand" class="card-brand text-secondary fw-bold">${item.brand}</h6>
         
          <div>
            <small id="location" class="text-muted fw-bold">Yer : </small>
            <small id="location" class="text-muted">${item.location}</small>
        </div>
          <div class="card-text d-flex">
            <div class="w-75">

            <small id="date" class="text-muted fw-bold">İlan Tarihi : </small>
            <small id="date" class="text-muted">${item.date}</small>
        </div>
            <div class=" d-flex justify-content-end ">
                  <a href="detaylar.html?id=${item.ilanNo}" class="d-flex btn btn-outline-warning ms-5 text-dark  text-center text-nowrap" id="details-btn" data-id="${item.id}">İlana Git</a>
        </div> 
          </div>
        </div>
        
     
      </div>
    </div>
  </div>
  `;
    contain.innerHTML += content;
  });
}

// function convertPrice(number) {
//   const language = "en";
//   return Intl.NumberFormat(language, { notation: "compact" }).format(
//     number
//   );
// }



function toast() {
  const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}


logout.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("object")
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