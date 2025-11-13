// Import Firebase SDKs
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  setDoc,
  doc ,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ✅ Firebase Config
import { firebaseConfig } from "./config.js";

// ✅ Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ Firebase connected successfully");

// ===============================
// Register User (Firestore-based)
// ===============================

const token = localStorage.getItem("p2_admin_users")
const main_cnt = document.getElementById("container")     
if(token == "" || token == undefined || !token.includes("@gmail.com") ){
  main_cnt.innerHTML = `
  <h1>Ebus Management System</h1>
    <div id="login-section">
      <h2>Login</h2>
      <input type="email" id="loginEmail" placeholder="Email" />
      <input type="password" id="loginPassword" placeholder="Password" />
      <button id="loginBtn">Login</button>
      <p>Don’t have an account? <a href="#" id="showRegister">Register</a></p>
    </div>

    <div id="register-section" style="display:none;">
      <h2>Register</h2>
      <input type="text" id="regName" placeholder="Full Name" />
      <input type="email" id="regEmail" placeholder="Email" />
      <input type="password" id="regPassword" placeholder="Password" />
      <button id="registerBtn">Register</button>
      <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
    </div>
  `
}else{
  const user = localStorage.getItem("p2_admin_users")

  main_cnt.innerHTML = `
  <h2>You are In</h2>
  <span>Email : ${user}</span><br/><br/>
  <button id="sub" >Logout </button>
  `
  const btn = document.getElementById("sub")
  btn.addEventListener("click", ()=>{

    localStorage.removeItem("p2_admin_users")
    window.location.reload()
  })
}


document.getElementById("registerBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Save user to Firestore
    await setDoc(doc(db, "p2_admin_users", email), {
      email: email,
      password: password
    });
    alert("Registration Successful! Please login.");
    window.location.reload();
  } catch (err) {
    console.error("Registration Error:", err);
    alert(err.message);
  }
});

// ===============================
// Login User (Firestore-based)
// ===============================
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Get all documents in the collection
    const usersRef = doc(db, "p2_admin_users", email);
    const snapshot = await getDoc(usersRef);

    console.log(snapshot.data())

    const data = snapshot.data()

    const q = query(collection(db, "p2_admin_users"), where("email", "==", email && "password" , "==", password));


    if (q) {
      alert(`Welcome ${email}`);
      localStorage.setItem("p2_admin_users", email)
      window.location.href = "admin.html";
    } else {
      alert("Invalid credentials!");
    }

  } catch (err) {
    console.error("Login Error:", err);
    alert(err.message);
  }
});

// ===============================
// Switch between Login & Register forms
// ===============================
document.getElementById("showRegister")?.addEventListener("click", () => {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("register-section").style.display = "block";
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  document.getElementById("register-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
});
