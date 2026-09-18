// GANTI TANGGAL TRIAL DI SINI AJA BEB - FIX ANTI MUTER BEB
export const TRIAL_END_DATE = '2056-12-31T23:59:59';
export const WA_ADMIN = '6281236801953';
export const USER = 'mid241195';
export const PASS = '19Maret2014*#';

// Firebase - DIBIKIN GAK NG-BLOCK BEB, KALAU GAGAL LANGSUNG PAKAI LOCALSTORAGE BEB
let db = null;
try {
  // Pakai dynamic import biar gak muter kalau internet lemot Beb
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
  const { getFirestore } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
  
  const firebaseConfig = {
    apiKey: "AIzaSyCqC7a7xFoTh-Op5FocJrb7e8dXj6-jxTE",
    authDomain: "eksodus2026.firebaseapp.com",
    projectId: "eksodus2026",
    storageBucket: "eksodus2026.appspot.com",
    messagingSenderId: "598683692936",
    appId: "1:598683692936:web:f9081d975f5df0a2ef78f8"
  };
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase konek Beb!");
} catch (err) {
  console.warn("⚠️ Firebase gagal Beb, pakai localStorage dulu Beb:", err.message);
  db = null;
}

export { db };