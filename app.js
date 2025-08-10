
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
   import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyD3ccOPvEl2UzfwGdCLyEtzrMLDxGawvc4",
    authDomain: "fir-project-5b24a.firebaseapp.com",
    projectId: "fir-project-5b24a",
    storageBucket: "fir-project-5b24a.firebasestorage.app",
    messagingSenderId: "354805854050",
    appId: "1:354805854050:web:9de7feb6385829a657c63b",
    measurementId: "G-DF6W6Z9YZW"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let sBtn = document.getElementById("sbtn");
if(sBtn){
      sBtn.addEventListener("click",()=>{
    let email = document.getElementById("semail").value
    let password = document.getElementById("spass").value
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Swal.fire({
  title: "Sign Up!",
  text: "Successfully!",
  icon: "success"
});
window.location.href = "login.html";
 
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
     Swal.fire({
  title: "Sign Up!",
  text: "Failed!",
  icon: "error"
});
  });
  });
}

  let lBtn = document.getElementById("lbtn");
  if(lBtn){
  lBtn.addEventListener("click",()=>{
    let email = document.getElementById("lemail").value
    let password = document.getElementById("lpass").value
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
       Swal.fire({
  title: "Login!",
  text: "Successfully!",
  icon: "success"
});
window.location.href = "admin-dash.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
       Swal.fire({
  title: "Login!",
  text: "Failed!",
  icon: "error"
});
  });
  });
  }

  let ulogin = document.getElementById("lbtn");
  if(ulogin){
      ulogin.addEventListener("click",()=>{
    let email = document.getElementById("lemail").value
    let password = document.getElementById("lpass").value
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
       Swal.fire({
  title: "Login!",
  text: "Successfully!",
  icon: "success"
});
window.location.href = "user-dash.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
       Swal.fire({
  title: "Login!",
  text: "Failed!",
  icon: "error"
});
  });
  });
  }

  let logoutBtn = document.getElementById("logout");

 if(logoutBtn){
   logoutBtn.addEventListener("click", ()=>{
    signOut(auth)
         Swal.fire({
  title: "Logout!",
  text: "Successfully!",
  icon: "success"
});
console.log("User logged out")
window.location.href = "login.html";  
   })
  }
 

 onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user logged in', user.uid);
  } else {
    console.log('User is signed out');
  }
});

const getItemDiv = document.getElementById("items");
let currentEditId = null;

let addItemBtn = document.getElementById("addItem");
if (addItemBtn) {
  addItemBtn.addEventListener("click", async () => {
    let itemName = document.getElementById("item-name").value;
    let itemPrice = document.getElementById("item-price").value;
    let itemDes = document.getElementById("item-des").value;
    let itemURL = document.getElementById("item-url").value;

    try {
      await addDoc(collection(db, "menu"), {
        itemName,
        itemPrice,
        itemDes,
        itemURL,
      });
      document.getElementById("item-name").value = "";
      document.getElementById("item-price").value = "";
      document.getElementById("item-des").value = "";
      document.getElementById("item-url").value = "";
      bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
      fetchItems();
    } catch (e) {
      console.error("Error adding item:", e);
    }
  });
}

async function fetchItems() {
  if (!getItemDiv) return;
  getItemDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "menu"));
  querySnapshot.forEach((docSnap) => {
    let data = docSnap.data();
    getItemDiv.innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${data.itemURL}" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title">${data.itemName}</h5>
          <p class="card-text">${data.itemDes}</p>
          <p class="card-text">${data.itemPrice}</p>
          <button onclick='editItem("${docSnap.id}")' class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
          <button onclick='deleteItem("${docSnap.id}")' class="btn btn-danger mt-2">Delete</button>
        </div>
      </div>
    `;
  });
}

window.deleteItem = async (id) => {
  await deleteDoc(doc(db, "menu", id));
  fetchItems();
};

window.editItem = async (id) => {
  const docRef = doc(db, "menu", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    currentEditId = id;
    document.getElementById("edit-item-name").value = data.itemName;
    document.getElementById("edit-item-price").value = data.itemPrice;
    document.getElementById("edit-item-des").value = data.itemDes;
    document.getElementById("edit-item-url").value = data.itemURL;
  }
};

let saveChangesBtn = document.getElementById("saveChanges");
if (saveChangesBtn) {
  saveChangesBtn.addEventListener("click", async () => {
    if (!currentEditId) return;
    const updatedName = document.getElementById("edit-item-name").value;
    const updatedPrice = document.getElementById("edit-item-price").value;
    const updatedDes = document.getElementById("edit-item-des").value;
    const updatedURL = document.getElementById("edit-item-url").value;

    await updateDoc(doc(db, "menu", currentEditId), {
      itemName: updatedName,
      itemPrice: updatedPrice,
      itemDes: updatedDes,
      itemURL: updatedURL,
    });

    currentEditId = null;
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    fetchItems();
  });
}

const userItemDiv = document.getElementById("user-items");
const cartCountSpan = document.getElementById("cart-count");

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartCountSpan) {
    cartCountSpan.textContent = cart.length;
  }
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  const modalBody = document.getElementById("cart-item-details");
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="card">
        <img src="${item.itemURL}" class="card-img-top" alt="${item.itemName}">
        <div class="card-body text-center">
          <h5 class="card-title">${item.itemName}</h5>
          <p class="card-text">${item.itemDes}</p>
          <p class="card-text fw-bold">${item.itemPrice}</p>
        </div>
      </div>
    `;
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
  }
}


async function fetchItemsForUser() {
  if (!userItemDiv) return;
  userItemDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "menu"));
  querySnapshot.forEach((docSnap) => {
    let data = docSnap.data();
    let itemObj = {
      id: docSnap.id,
      ...data
    };
    userItemDiv.innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${data.itemURL}" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title">${data.itemName}</h5>
          <p class="card-text">${data.itemDes}</p>
          <p class="card-text">${data.itemPrice}</p>
          <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(itemObj)})'>Add to Cart</button>
        </div>
      </div>
    `;
  });
  updateCartCount(); 
}

if (getItemDiv) {
  fetchItems();
} else if (userItemDiv) {
  window.addToCart = addToCart;
  fetchItemsForUser();
}
