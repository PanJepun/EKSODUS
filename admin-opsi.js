import { db } from './config.js';
import { collection, onSnapshot, query, orderBy, addDoc, doc, deleteDoc, getDocs, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const aKategori=document.getElementById('aKategori'), gKategori=document.getElementById('gKategori'), bNegara=document.getElementById('bNegara'), bBahasa=document.getElementById('bBahasa');
const USER='mid241195', PASS='19Maret2014*#';

window.login = () => {
  const userEl = document.getElementById('u');
  const passEl = document.getElementById('p');
  const userInput = userEl ? userEl.value.trim() : '';
  const passInput = passEl ? passEl.value.trim() : '';
  
  const USER_BENER = 'mid241195';
  const PASS_BENER = '19Maret2014*#';

  console.log('YANG DIKETIK:', userInput, '|', passInput);
  console.log('YANG SEHARUSNYA:', USER_BENER, '|', PASS_BENER);
  console.log('COCOK USER?', userInput === USER_BENER);
  console.log('COCOK PASS?', passInput === PASS_BENER);

  if (userInput === USER_BENER && passInput === PASS_BENER) {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('adminBox').classList.remove('hidden');
  } else {
    alert('SALAH BEB! Cek console (F12) Beb. Kamu ketik: ' + userInput + ' / ' + passInput);
  }
}
window.lihatPass = () => {
  const input = document.getElementById('p');
  const icon = document.getElementById('togglePass');
  if(input.type === 'password'){
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁️';
  }
}


// Kategori
const loadKategori=(selectEl)=>{ onSnapshot(query(collection(db,"categories"), orderBy("nama")), snap=>{ let h='<option value="">- Pilih -</option>'; snap.forEach(d=>{ const x=d.data(); h+=`<option value="${d.id}" data-nama="${x.nama}">${x.nama}</option>` }); selectEl.innerHTML=h; }); }
loadKategori(aKategori); loadKategori(gKategori);

window.addCat=async()=>{ const nama=aKategoriBaru.value.trim(); if(!nama) return alert('Isi Beb'); const q=await getDocs(query(collection(db,"categories"), where("nama","==",nama))); if(!q.empty) return alert('Sudah ada Beb'); await addDoc(collection(db,"categories"),{nama,waktu:new Date()}); aKategoriBaru.value=''; alert('Ditambah Beb'); }
window.delCat=async()=>{ const id=aKategori.value; if(!id) return alert('Pilih Beb'); if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"categories",id)); }
window.addCatGaleri=async()=>{ const nama=gKategoriBaru.value.trim(); if(!nama) return alert('Isi Beb'); const q=await getDocs(query(collection(db,"categories"), where("nama","==",nama))); if(!q.empty) return alert('Sudah ada Beb'); await addDoc(collection(db,"categories"),{nama,waktu:new Date()}); gKategoriBaru.value=''; alert('Ditambah Beb'); }
window.delCatGaleri=async()=>{ const id=gKategori.value; if(!id) return alert('Pilih Beb'); if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"categories",id)); }

// Negara & Bahasa
onSnapshot(query(collection(db,"countries"), orderBy("nama")), snap=>{ let opt='<option value="">- Pilih Negara -</option>'; let tbl='<tr><th>Negara</th><th>Aksi</th></tr>'; snap.forEach(d=>{ const x=d.data(); opt+=`<option>${x.nama}</option>`; tbl+=`<tr><td>${x.nama}</td><td><button class="btn-hapus" onclick="delNegara('${d.id}')">Hapus</button></td></tr>` }); bNegara.innerHTML=opt; adminNegara.innerHTML=tbl; });
onSnapshot(query(collection(db,"languages"), orderBy("nama")), snap=>{ let opt='<option value="">- Pilih Bahasa -</option>'; let tbl='<tr><th>Bahasa</th><th>Aksi</th></tr>'; snap.forEach(d=>{ const x=d.data(); opt+=`<option>${x.nama}</option>`; tbl+=`<tr><td>${x.nama}</td><td><button class="btn-hapus" onclick="delBahasa('${d.id}')">Hapus</button></td></tr>` }); bBahasa.innerHTML=opt; adminBahasa.innerHTML=tbl; });

window.addNegara=async()=>{ const n=negaraBaru.value.trim(); if(!n) return; await addDoc(collection(db,"countries"),{nama:n}); negaraBaru.value=''; }
window.delNegara=async id=>{ if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"countries",id)) }
window.addBahasa=async()=>{ const n=bahasaBaru.value.trim(); if(!n) return; await addDoc(collection(db,"languages"),{nama:n}); bahasaBaru.value=''; }
window.delBahasa=async id=>{ if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"languages",id)) }