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
  where,
  getFirestore,
  onSnapshot,
  query,
  doc,
  deleteDoc,
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    document.querySelector(".user-name").innerHTML = email;
    register.style.display = "none";
    login.style.display = "none";
    ilangir.style.display = "block";

    onSnapshot(
      query(collection(db, "favorites"), where("uid", "==", user.uid)),
      (doc) => {
        getData(
          doc.docs.reduce(
            (favorites, fav) => [...favorites, { ...fav.data(), id: fav.id }],
            []
          )
        );
      }
    );
    getData();
  } else {
    window.location.href = "index.html";
  }
});

function getData(data) {
  if (data) {
    onSnapshot(collection(db, "ilanlar"), (doc) => {
      const ilanlar = doc.docs.reduce(
        (ilanlar, ilan) => [...ilanlar, { ...ilan.data(), id: ilan.ilanNo }],
        []
      );
      console.log(ilanlar);
      const filtered = ilanlar.filter((ilan) => {
        return data.find((fav) => fav.ilanNo === ilan.ilanNo);
      });
      filtered.forEach((item) => {
        const card = document.createElement("div");
        card.classList = "card-body";

        const content = `
<div class="card mb-3 w-100  border border-0 bg-transparent ">
<div class="row  d-flex justify-content-center ">
<div class="col-md-3">
<img id="photo" src="${item.pictures[0]}" class="img-thumbnail   " alt="..." />
</div>
<div class="col-md-5 border rounded-2 shadow-lg">
<div class="card-body">
    <div class="d-flex justify-content-between"> 
    <small class="text-secondary fw-bold text-sm text-uppercase"> # ${item.ilanNo}</small>  
        <a data-id="${item.ilanNo}" class="mb-1" id="favori">
            <i id="favori" data-id="${item.ilanNo}" class="fas fa-2x fa-heart text-danger"></i>
        </a>

    </div>
<div class="d-flex justify-content-between align-items-center">
<h5 id="title" class="card-brand fw-bold">${item.title}</h5>
<h5 id="price" class="card-price fw-bold text-end text-secondary ">${item.price} ₺</h5>
</div>
<div>
<p id="category" class="card-category">${item.category}</p>
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
    });
  }
}

function deleteFavorite(ilanNo) {
  const uid = auth.currentUser.uid;
  onSnapshot(
    query(collection(db, "favorites"), where("uid", "==", uid)),
    (docc) => {
      const favorites = docc.docs.reduce(
        (favorites, fav) => [...favorites, { ...fav.data(), id: fav.id }],
        []
      );
      const filtered = favorites.filter((fav) => fav.ilanNo === ilanNo);
      filtered.forEach((item) => {
        deleteDoc(doc(db, "favorites", item.id));

        toast();
      });
    }
  );
}

function toast() {
  const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

const parentElement = document.getElementById("contain");

parentElement.addEventListener("click", (event) => {
  if (event.target.id === "favori") {
    const id = event.target.dataset.id;
    console.log(id);
    deleteFavorite(id);
  }
});

logout.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("çıkış yapıldı");
      window.location.href = "index.html";
      toast();
    })
    .catch((error) => {
      console.log(error);
    });
});
