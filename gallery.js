import { db } from './config.js';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const galleryGrid = document.getElementById('sliderTrack');
const adminGaleri = document.getElementById('adminGaleri');
let carouselInterval, currentIndex = 0;

function startCarousel(totalOriginal, container){
  if(container.children.length===0) return;
  const itemWidth = container.children[0].getBoundingClientRect().width;
  const step = itemWidth + 16;
  container._listener && container.removeEventListener('transitionend', container._listener);
  container._listener = () => {
    if(currentIndex >= totalOriginal){
      container.style.transition='none'; currentIndex=0;
      container.style.transform='translateX(0px)'; void container.offsetWidth;
    }
  };
  container.addEventListener('transitionend', container._listener);
  carouselInterval = setInterval(() => {
    currentIndex++; container.style.transition='transform 0.5s ease-in-out';
    container.style.transform=`translateX(${-currentIndex*step}px)`;
  }, 3000);
}

onSnapshot(query(collection(db,"galleries"), orderBy("nama")), snap => {
  clearInterval(carouselInterval);
  let gridHTML='', tableHTML='<tr><th>Preview</th><th>Nama</th><th>Kategori</th><th>Aksi</th></tr>';
  snap.forEach(d => {
    const x=d.data();
    gridHTML+=`<div class="card" style="flex:0 0 20%; box-sizing:border-box; padding:5px;"><img src="${x.gambar}"><div class="card-content"><h3>${x.nama}</h3><div class="lokasi">📍 ${x.kategori||'-'}</div></div></div>`;
    tableHTML+=`<tr><td><img src="${x.gambar}" class="thumb"></td><td><b>${x.nama}</b></td><td>${x.kategori||'-'}</td><td><button class="btn-edit" onclick="editGaleri('${d.id}','${x.nama}','${x.kategori}','${x.gambar}','${x.desc||''}')">EDIT</button><button class="btn-hapus" onclick="delGaleri('${d.id}')">HAPUS</button></td></tr>`;
  });
  galleryGrid.innerHTML=gridHTML;
  adminGaleri.innerHTML=tableHTML;

  if(snap.docs.length >= 5){
    const ori = Array.from(galleryGrid.children);
    ori.slice(0,5).forEach(i => galleryGrid.appendChild(i.cloneNode(true)));
  }
  currentIndex=0; galleryGrid.style.transition='none'; galleryGrid.style.transform='translateX(0px)';
  startCarousel(snap.docs.length, galleryGrid);
});

window.saveGaleri = async () => {
  const id=editGaleriId.value;
  const kat=gKategori.options[gKategori.selectedIndex]?.dataset.nama||'';
  const data={nama:gNama.value, kategori:kat, gambar:gImg.value, desc:gDesc.value};
  if(!data.nama||!data.kategori||!data.gambar) return alert('Lengkapi Beb');
  if(id) await updateDoc(doc(db,"galleries",id), data); else await addDoc(collection(db,"galleries"), data);
  alert('Tersimpan Beb');
}
window.editGaleri = (id,n,k,g,d) => { editGaleriId.value=id; gNama.value=n; gKategori.value=[...gKategori.options].find(o=>o.dataset.nama===k)?.value||''; gImg.value=g; gDesc.value=d||''; }
window.delGaleri = async (id) => { if(confirm('Hapus Beb?')) await deleteDoc(doc(db,"galleries",id)) }
window.prosesHapusGaleri = window.delGaleri;