// === paket.js FIX TOTAL BEB - Tempel ini semua Beb ===
console.log('paket.js loaded Beb!');

let paketData = JSON.parse(localStorage.getItem('eksodus_paket') || '[]');
let kategoriData = JSON.parse(localStorage.getItem('eksodus_kategori') || '["Bedugul","Nusa Dua","Uluwatu","Ubud"]');

if(paketData.length === 0){
  paketData = [
    {id:1, nama:'Bedugul (no contest)', kategori:'Bedugul', harga:1000, harga_coret:0, img:'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', desc:'Bedugul'},
    {id:2, nama:'KECAK ULUWATU', kategori:'Nusa Dua', harga:750000, harga_coret:500000, img:'https://i.ibb.co/placeholder.jpg', desc:'Kecak Uluwatu'}
  ];
}

function $(id){ return document.getElementById(id) }

function renderKategori(){
  const sel = $('aKategori');
  const filter = $('kategoriFilter');
  const bPaket = $('bPaket');
  if(!sel) return;
  sel.innerHTML = ''; if(filter) filter.innerHTML = '<option value="">Semua Kategori</option>';
  if(bPaket) bPaket.innerHTML = '<option value="">- Pilih Paket -</option>';
  
  kategoriData.forEach(kat => {
    sel.innerHTML += `<option value="${kat}">${kat}</option>`;
    if(filter) filter.innerHTML += `<option value="${kat}">${kat}</option>`;
  });
  
  paketData.forEach(p => {
    if(bPaket) bPaket.innerHTML += `<option value="${p.nama}">${p.nama} - Rp ${p.harga}</option>`;
  });
}

function renderPaket(){
  console.log('Render paket:', paketData.length);
  const grid = $('paketGrid');
  const adminTable = $('adminPaket');
  const filterVal = $('kategoriFilter')?.value || '';
  
  if(grid){
    grid.innerHTML = '';
    let filtered = filterVal ? paketData.filter(x=>x.kategori===filterVal) : paketData;
    filtered.forEach(it => {
      grid.innerHTML += `
        <div class="card">
          ${it.harga_coret ? `<div class="diskon-badge">DISKON</div>` : ''}
          <img src="${it.img}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
          <div class="card-content">
            <h3>${it.nama}</h3>
            <div class="lokasi">📍 ${it.kategori}</div>
            <div class="desc">${it.desc||''}</div>
            ${it.harga_coret ? `<div class="harga-coret">Rp ${Number(it.harga_coret).toLocaleString('id-ID')}</div>` : ''}
            <div class="harga-promo">Rp ${Number(it.harga).toLocaleString('id-ID')}</div>
            <button class="btn-pilih" onclick="pilihPaket('${it.nama}')">PILIH PAKET</button>
          </div>
        </div>`;
    });
  }

  if(adminTable){
    adminTable.innerHTML = `<tr><th>Preview</th><th>Nama Paket</th><th>Kategori</th><th>Harga</th><th>Aksi</th></tr>`;
    paketData.forEach(it => {
      adminTable.innerHTML += `
        <tr>
          <td><img src="${it.img}" class="thumb" onerror="this.src='https://via.placeholder.com/80'"></td>
          <td><b>${it.nama}</b></td>
          <td>${it.kategori}</td>
          <td style="color:#dc2626;font-weight:800">Rp ${Number(it.harga).toLocaleString('id-ID')}</td>
          <td>
            <button class="btn-edit" onclick="editPaket(${it.id})">EDIT</button>
            <button class="btn-hapus" onclick="hapusPaket(${it.id})">HAPUS</button>
          </td>
        </tr>`;
    });
  }
  
  localStorage.setItem('eksodus_paket', JSON.stringify(paketData));
  localStorage.setItem('eksodus_kategori', JSON.stringify(kategoriData));
}

function savePaket(){
  console.log('SAVE PAKET DIPENCET BEB!');
  const nama = $('aNama')?.value.trim();
  const kategoriSelect = $('aKategori')?.value;
  const kategoriBaru = $('aKategoriBaru')?.value.trim();
  const kategori = kategoriBaru || kategoriSelect || 'Bali';
  const harga = $('aHargaPromo')?.value;
  const hargaCoret = $('aHargaCoret')?.value;
  const img = $('aImg')?.value.trim() || 'https://via.placeholder.com/400?text=Bali';
  const desc = $('aDesc')?.value.trim();
  const editId = $('editId')?.value;

  if(!nama){ alert('Nama Paket wajib diisi Beb!'); return; }
  if(!harga){ alert('Harga Jual Normal wajib diisi Beb!'); return; }

  if(editId){
    let idx = paketData.findIndex(x=>x.id==editId);
    if(idx>=0) paketData[idx] = {id:parseInt(editId), nama, kategori, harga:parseInt(harga), harga_coret:parseInt(hargaCoret)||0, img, desc};
    $('editId').value = '';
  } else {
    paketData.push({id:Date.now(), nama, kategori, harga:parseInt(harga), harga_coret:parseInt(hargaCoret)||0, img, desc});
  }

  // Jika kategori baru, tambahkan ke list Beb
  if(kategoriBaru && !kategoriData.includes(kategoriBaru)){
    kategoriData.push(kategoriBaru);
  }

  renderKategori();
  renderPaket();

  $('aNama').value=''; $('aHargaPromo').value=''; $('aHargaCoret').value=''; $('aImg').value=''; $('aDesc').value=''; $('aKategoriBaru').value='';
  alert('✅ BERHASIL SIMPAN PAKET BEB: ' + nama);
}

function editPaket(id){
  let it = paketData.find(x=>x.id===id);
  if(!it) return;
  $('aNama').value = it.nama;
  $('aKategori').value = it.kategori;
  $('aHargaPromo').value = it.harga;
  $('aHargaCoret').value = it.harga_coret||'';
  $('aImg').value = it.img;
  $('aDesc').value = it.desc||'';
  $('editId').value = it.id;
  window.scrollTo(0,0);
}

function hapusPaket(id){
  if(confirm('Hapus paket ini Beb?')){
    paketData = paketData.filter(x=>x.id!==id);
    renderPaket(); renderKategori();
  }
}

function addCat(){
  let baru = $('aKategoriBaru').value.trim();
  if(!baru) return alert('Isi Nama Kategori dulu Beb!');
  if(!kategoriData.includes(baru)){
    kategoriData.push(baru);
    renderKategori();
    $('aKategori').value = baru;
    $('aKategoriBaru').value = '';
    alert('Kategori '+baru+' ditambah Beb!');
  }
}

function delCat(){
  let sel = $('aKategori').value;
  if(!sel) return alert('Pilih kategori dulu Beb!');
  if(confirm('Hapus kategori '+sel+' Beb?')){
    kategoriData = kategoriData.filter(x=>x!==sel);
    renderKategori();
  }
}

function pilihPaket(nama){
  const bPaket = $('bPaket');
  if(bPaket){ bPaket.value = nama; document.getElementById('booking').scrollIntoView({behavior:'smooth'}); }
}

// KUNCI FIX NYA BEB - BIAR BISA DIPANGGIL DARI HTML ONCLICK BEB
window.savePaket = savePaket;
window.editPaket = editPaket;
window.hapusPaket = hapusPaket;
window.addCat = addCat;
window.delCat = delCat;
window.pilihPaket = pilihPaket;
window.renderPaket = renderPaket;

// INIT
document.addEventListener('DOMContentLoaded', ()=>{
  renderKategori();
  renderPaket();
  const filter = $('kategoriFilter');
  if(filter) filter.addEventListener('change', renderPaket);
  console.log('Paket.js siap Beb!');
});

// Juga render langsung kalau DOM sudah ada Beb
renderKategori();
renderPaket();