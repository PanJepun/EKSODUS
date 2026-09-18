import { db } from './config.js';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, getDocs, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let semuaDataPaket = [];
const bPaket = document.getElementById('bPaket');
const paketGrid = document.getElementById('paketGrid');
const adminPaket = document.getElementById('adminPaket');
const kategoriFilter = document.getElementById('kategoriFilter');
const fmt = n => n? n.toLocaleString('id-ID') : '0';

window.autoPilihPaket = (namaPaket) => {
  const target = document.getElementById('bPaket');
  if(target){
    let opsi = [...target.options].find(o => o.text.toLowerCase().includes(namaPaket.toLowerCase()));
    if(opsi) target.value = opsi.value;
    else { target.add(new Option(namaPaket, namaPaket)); target.value = namaPaket; }
    target.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

function renderGridPaket(data){
  let html = '';
  data.forEach(x => {
    html += `<div class="card" style="border:2px solid #dfa932; border-radius:15px; overflow:hidden; background:#244226; color:white;">
      <img src="${x.gambar}" style="width:100%; height:200px; object-fit:cover;">
      <div class="card-content" style="padding:15px;">
        <h3 style="color:#fff;">${x.nama}</h3><p style="font-size:14px; color:#e2e8f0;">${x.desc||''}</p>
        <div style="text-decoration:line-through; color:#94a3b8;">Rp ${fmt(x.hargaCoret)}</div>
        <div style="color:#ffc107; font-weight:800; font-size:20px;">Rp ${fmt(x.hargaPromo)}</div>
        <button onclick="autoPilihPaket('${x.nama}')" style="background:#ffc107; color:#000; width:100%; padding:12px; font-weight:bold; border-radius:50px; margin-top:15px; border:none; cursor:pointer;">PILIH PAKET INI</button>
      </div></div>`;
  });
  paketGrid.innerHTML = html;
}

onSnapshot(query(collection(db, "products"), orderBy("nama")), snap => {
  let selectHTML = '<option value="">-- Pilih Paket Tour --</option>';
  let tableHTML = '<tr><th>Preview</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Aksi</th></tr>';
  semuaDataPaket = [];
  const kategoriUnik = new Set();
  snap.forEach(d => {
    const x = d.data(); semuaDataPaket.push({id:d.id,...x});
    if(x.kategori) kategoriUnik.add(x.kategori.trim());
    selectHTML += `<option value="${x.nama}">${x.nama}</option>`;
    tableHTML += `<tr><td><img src="${x.gambar}" class="thumb" style="width:50px"></td><td><b>${x.nama}</b></td><td>${x.kategori||'-'}</td><td style="color:#dc2626;font-weight:700;">Rp ${fmt(x.hargaPromo)}</td><td><button class="btn-edit" onclick="editPaket('${d.id}','${x.nama}','${x.kategori}','${x.hargaCoret}','${x.hargaPromo}','${x.gambar}','${x.desc||''}')">EDIT</button><button class="btn-hapus" onclick="delPaket('${d.id}')">HAPUS</button></td></tr>`;
  });
  bPaket.innerHTML = selectHTML;
  adminPaket.innerHTML = tableHTML;

  // Isi filter kategori
  let drop = '<option value="">Semua Kategori</option>';
  Array.from(kategoriUnik).sort().forEach(k => drop += `<option value="${k.toLowerCase()}">${k}</option>`);
  kategoriFilter.innerHTML = drop;

  renderGridPaket(semuaDataPaket);
});

// Filter live
kategoriFilter.addEventListener('change', function(){
  const val = this.value.toLowerCase();
  if(!val) renderGridPaket(semuaDataPaket);
  else renderGridPaket(semuaDataPaket.filter(p => (p.kategori||'').toLowerCase() === val));
});

window.savePaket = async () => {
  const id = document.getElementById('editId').value;
  const kat = document.getElementById('aKategori').options[document.getElementById('aKategori').selectedIndex]?.dataset.nama || '';
  const data = { nama: aNama.value, kategori: kat, hargaCoret: +aHargaCoret.value||0, hargaPromo: +aHargaPromo.value, gambar: aImg.value, desc: aDesc.value };
  if(!data.nama||!data.kategori||!data.hargaPromo||!data.gambar) return alert('Lengkapi Beb');
  if(id) await updateDoc(doc(db,"products",id), data); else await addDoc(collection(db,"products"), data);
  alert('Tersimpan Beb');
}
window.editPaket = (id,n,k,hc,hp,g,d) => { editId.value=id; aNama.value=n; aKategori.value=[...aKategori.options].find(o=>o.dataset.nama===k)?.value||''; aHargaCoret.value=hc; aHargaPromo.value=hp; aImg.value=g; aDesc.value=d||''; }
window.delPaket = async (id) => { if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"products",id)) }