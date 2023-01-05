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
    addDoc,
    collection,
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";



const db = getFirestore();
const storage = getStorage();

const auth = getAuth();
const title = document.getElementById("title");
const brand = document.getElementById("brand");
const model = document.getElementById("model");
const price = document.getElementById("price");
const km = document.getElementById("km");
const year = document.getElementById("year");
const fuel = document.getElementById("fuel");
const gear = document.getElementById("gear");
const status = document.getElementById("status");
const motohp = document.getElementById("motohp");
const motocc = document.getElementById("motocc");
const color = document.getElementById("color");
const file = document.getElementById("files");
const description = document.getElementById("description");
const location = document.getElementById("location");
const success = document.getElementById("success")
const number = document.getElementById("number");
const category = document.getElementById("category");
const favpage = document.getElementById("favpage");





let uid = "";

onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
        user = auth.currentUser;
        const email = user.email;

        document.querySelector(".user-name").innerHTML = email;
        register.style.display = "none";
        login.style.display = "none";
        document.querySelector(".user-name").innerHTML = email;

    } else {
        window.location.href = "index.html";
      
    }
});

const add = document.getElementById("add");
add.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(uid);
    photoUpload();
    ilanEkle();
});



var filesUpload = [];
let fileDownloadUrls = [];

file.addEventListener("change", function (e) {
    if (file.files.length === 5) {
        filesUpload = e.target.files;
        for (let i = 0; i < filesUpload.length; i++) {
            console.log(filesUpload[i])
        }
    } else {
        file.value = ""
        alert("5 Fotograf yükleyiniz");
    }
});


//ilan ekleme

function ilan() {
    const ilan = {
        uid: uid,
        id: Math.random().toString(16).slice(2),
        ilanNo: Math.random().toString(16).slice(2),
        title: title.value,
        brand: brand.value,
        model: model.value,
        price: price.value,
        km: km.value,
        year: year.value,
        fuel: fuel.value,
        gear: gear.value,
        status: status.value,
        motohp: motohp.value,
        motocc: motocc.value,
        color: color.value,
        description: description.value,
        location: location.value,
        number: number.value,
        category: category.value,
        pictures: fileDownloadUrls,
        selectedYearPrice: selectedYearPrice,

        date: new Date().toLocaleDateString(),
    };
    ilanEkle(ilan);
    success.innerHTML = "Başarılı"
    toast();
    reset();
}

// Resimler yüklendikten sonra veriler firebase e kaydediliyor
async function photoUpload() {
    for (let i = 0; i < filesUpload.length; i++) {
        const file = filesUpload[i];
        const storageR = await storageRef(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageR, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        success.innerHTML = "Resimler Yükleniyor..."
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case "storage/unauthorized":
                        console.log("User doesn't have permission to access the object");
                        break;

                    case "storage/canceled":
                        console.log("User canceled the upload");
                        break;

                    case "storage/unknown":
                        console.log("Unknown error occurred, inspect error.serverResponse");
                        break;
                }
            },
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    fileDownloadUrls.push(downloadURL);
                    if (fileDownloadUrls.length === 5) {
                        console.log(fileDownloadUrls);
                        ilan();
                    }
                });
            }
        );
    }
}

//ilan ekleme
function ilanEkle(ilan) {
    try {
        if (ilan) {
            const result = addDoc(collection(db, "ilanlar"), ilan);
            console.log("başarılı");
            return result.id;
        }
    } catch (error) {
        console.log(error);
    }
    addDoc(collection(db, "ilanlar"), ilan);
}

window.onload = populateSelect();

//JSON dan verileri çekiyoruz
function populateSelect() {
    var xhr = new XMLHttpRequest(),
        method = "GET",
        overrideMimeType = "application/json",
        url = "../KasCar.json";
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            document.querySelector(".loader").style.display = "none"
            document.getElementById("select-opt").innerHTML = "Marka ve Model Seç"
            let cars = JSON.parse(xhr.responseText);
            console.log(cars.cars);
            let ele = document.getElementById("sel");
            for (let i = 0; i < cars.cars.length; i++) {
                ele.innerHTML =
                    ele.innerHTML +
                    '<option value="' +
                    cars.cars[i].MarkaAdı +
                    '" data-2008="' +
                    cars.cars[i]["2008"] +
                    '" data-2009="' +
                    cars.cars[i]["2009"] +
                    '" data-2010="' +
                    cars.cars[i]["2010"] +
                    '" data-2011="' +
                    cars.cars[i]["2011"] +
                    '" data-2012="' +
                    cars.cars[i]["2012"] +
                    '" data-2013="' +
                    cars.cars[i]["2013"] +
                    '" data-2014="' +
                    cars.cars[i]["2014"] +
                    '" data-2015="' +
                    cars.cars[i]["2015"] +
                    '" data-2016="' +
                    cars.cars[i]["2016"] +
                    '" data-2017="' +
                    cars.cars[i]["2017"] +
                    '" data-2018="' +
                    cars.cars[i]["2018"] +
                    '" data-2019="' +
                    cars.cars[i]["2019"] +
                    '" data-2020="' +
                    cars.cars[i]["2020"] +
                    '" data-2021="' +
                    cars.cars[i]["2021"] +
                    '" data-2022="' +
                    cars.cars[i]["2022"] +
                    '">' +
                    cars.cars[i].TipAdı +
                    "</option>";
            }
            ele.addEventListener("change", function () {
                showData(this);
            });
        }
    };
    xhr.open(method, url, true);
    xhr.send();
}
let selectedYearPrice = year.value;
function showData(ele) {
    year.addEventListener("change", function () {
        let selectedYear = year.options[year.selectedIndex].value;
        selectedYearPrice = ele.options[ele.selectedIndex].getAttribute("data-" + selectedYear);
        if (selectedYearPrice !== 0) {
            let upperBound = selectedYearPrice * 1.1;
            document.getElementById("price").placeholder = `En Fazla ${upperBound} TL Olmalıdır`;
            price.addEventListener("change", function () {
                if (upperBound !== 0 && price.value > upperBound) {
                    alert("Fiyat aralığını aştınız");
                    price.value = "";
                }
            });
        }
    });
    model.value =
        ele.options[ele.selectedIndex].text;
    brand.value =
        ele.options[ele.selectedIndex].value;
}




logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log("çıkış yapıldı")
        })
        .catch((error) => {
            console.log(error);
        });
});


function reset() {
    title.value = ""
    model.value = "";
    price.value = "";
    km.value = "";
    year.value = "";
    fuel.value = "";
    gear.value = "";
    status.value = "";
    motohp.value = "";
    motocc.value = "";
    color.value = "";
    file.value = ""
    number.value = "",
     category.value = "",
    description.value = ""
    location.value = ""

}

function toast() {
    const toastElList = [].slice.call(document.querySelectorAll(".toast"));
    const toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
