import { db, WA_ADMIN } from './config.js';
import { collection, onSnapshot, query, orderBy, addDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const bNama=document.getElementById('bNama'), bWa=document.getElementById('bWa'), bPaket=document.getElementById('bPaket');
const fmt=n=>n?n.toLocaleString('id-ID'):'0';
const bintang=n=>'★'.repeat(n)+'☆'.repeat(5-n);

// Booking WA
window.kirimWa = () => {
  const txt=`Halo Admin EKSODUS%0A%0ANama: ${bNama.value}%0AWA: ${bWa.value}%0APaket: ${bPaket.value}%0ATanggal: ${bTgl.value}%0AJumlah: ${bJumlah.value}%0ANegara: ${bNegara.value}%0ABahasa: ${bBahasa.value}%0AEmail: ${bEmail.value}%0ACatatan: ${bCatatan.value}`;
  if(!bNama.value||!bWa.value||!bPaket.value||!bTgl.value) return alert('Isi data wajib * Beb');
  window.open(`https://wa.me/${WA_ADMIN}?text=${txt}`, '_blank');
}

// Rating bintang
document.addEventListener('click', e => {
  if(e.target.classList.contains('star-click')){
    const val=+e.target.dataset.val;
    document.getElementById('tBintang').value=val;
    document.querySelectorAll('#starRating.star-click').forEach(b => {
      const urut=+b.dataset.val;
      b.style.setProperty('color', urut<=val?'#16a34a':'#ccc','important');
      b.style.setProperty('opacity', urut<=val?'1':'0.5','important');
    });
  }
});

// Validasi real-time
const inputNama=document.getElementById("bNama"), inputWa=document.getElementById("bWa");
if(inputNama){
  const err=document.createElement("span"); err.className="pesan-error"; inputNama.parentNode.insertBefore(err,inputNama.nextSibling);
  inputNama.addEventListener("input", () => {
    if(inputNama.value.trim().length<3){ inputNama.classList.add("input-salah"); err.textContent="⚠ Nama minimal 3 karakter!"; }
    else{ inputNama.classList.add("input-benar"); inputNama.classList.remove("input-salah"); err.textContent=""; }
  });
}
if(inputWa){
  const err=document.createElement("span"); err.className="pesan-error"; inputWa.parentNode.insertBefore(err,inputWa.nextSibling);
  inputWa.addEventListener("input", () => {
    inputWa.value=inputWa.value.replace(/[^0-9]/g,"");
    if(inputWa.value.length<10){ inputWa.classList.add("input-salah"); err.textContent="⚠ Nomor minimal 10 angka!"; }
    else{ inputWa.classList.add("input-benar"); inputWa.classList.remove("input-salah"); err.textContent=""; }
  });
}

// Testimoni
let allTestiData=[];
onSnapshot(query(collection(db,"testimonials"), orderBy("waktu","desc")), snap => {
  allTestiData=snap.docs.map(d=>({id:d.id,...d.data()}));
  const approved=allTestiData.filter(x=>x.status==='approved');
  document.getElementById('jumlahTesti').textContent=`Sudah ${approved.length} orang berbagi pengalaman`;
  let grid=''; approved.slice(0,10).forEach(x => { grid+=`<div class="card"><div class="card-content"><b>${x.nama}</b><div class="bintang-display">${bintang(x.bintang||5)}</div><p>${x.pesan}</p></div></div>` });
  document.getElementById('testiGrid').innerHTML=grid;
  document.getElementById('moreBtnWrap').classList.toggle('hidden', approved.length<=10);

  let tbl='<tr><th>Nama</th><th>Rating</th><th>Pesan</th><th>Status</th><th>Aksi</th></tr>';
  allTestiData.forEach(x => {
    const badge=x.status==='approved'?'<span class="badge-status badge-approved">Approved</span>':'<span class="badge-status badge-pending">Pending</span>';
    const aksi=x.status==='approved'?`<button class="btn-hapus" onclick="delTesti('${x.id}')">Hapus</button>`:`<button class="btn-approve" onclick="approveTesti('${x.id}')">✅ Verifikasi</button> <button class="btn-cancel" onclick="delTesti('${x.id}')">❌ Cancel</button>`;
    tbl+=`<tr><td>${x.nama}</td><td>${bintang(x.bintang||5)}</td><td>${x.pesan}</td><td>${badge}</td><td>${aksi}</td></tr>`;
  });
  document.getElementById('adminTesti').innerHTML=tbl;
});
window.saveTesti = async () => {
  const data={nama:tNama.value, pesan:tPesan.value, bintang:+tBintang.value, status:'pending', waktu:new Date()};
  if(!data.nama||!data.pesan) return alert('Isi semua Beb'); await addDoc(collection(db,"testimonials"), data); alert('Makasih Beb, menunggu verifikasi admin');
}
window.approveTesti = async id => { await updateDoc(doc(db,"testimonials",id), {status:'approved'}) }
window.delTesti = async id => { if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"testimonials",id)) }
window.showAllTesti = () => {
  const approved=allTestiData.filter(x=>x.status==='approved'); let grid=''; approved.forEach(x => grid+=`<div class="card"><div class="card-content"><b>${x.nama}</b><div class="bintang-display">${bintang(x.bintang||5)}</div><p>${x.pesan}</p></div></div>`); document.getElementById('testiGrid').innerHTML=grid; document.getElementById('moreBtnWrap').classList.add('hidden');
}