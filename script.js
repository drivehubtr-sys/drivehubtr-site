(() => {
 'use strict';
 const CATS=[
  {id:'Otobus-Modlari', name:'Otobüs Modları', icon:'🚌'},
  {id:'Cekici-Modlari', name:'Çekici (Tır) Modları', icon:'🚛'},
  {id:'Kamyon-Modlari', name:'Kamyon (Kırkayak) Modları', icon:'🚚'},
  {id:'Dorse-Modlari', name:'Dorse Modları', icon:'🚛'},
  {id:'Harita-Modlari', name:'Harita Modları', icon:'🗺️'},
  {id:'Aksesuar-Modlari', name:'Aksesuar Modları', icon:'🛠️'},
  {id:'Ses-Modlari', name:'Ses Modları', icon:'🔊'},
  {id:'Hazir-Profil-Save', name:'Hazır Profil / Save', icon:'💾'},
  {id:'Diger-Modlar', name:'Diğer Modlar', icon:'📦'}
 ];
 const raw=Array.isArray(window.DRIVEHUB_MODS) ? window.DRIVEHUB_MODS : [];
 const mods=raw.filter(x=>x && typeof x==='object').map(x=>({
  baslik:String(x.baslik||'İsimsiz mod'), oyun:String(x.oyun||'ETS2'),
  kategori:String(x.kategori||'Diger-Modlar'), surum:String(x.surum||'Belirtilmemiş'),
  aciklama:String(x.aciklama||''), gorsel:String(x.gorsel||''), link:String(x.link||''),
  tarih:String(x.tarih||'')
 }));
 let selectedCategory='all', selectedGame='all';
 const byId=id=>document.getElementById(id);
 const anchor=byId('modlar');
 function cleanUrl(url){try{const v=new URL(url,window.location.href);return ['https:','http:'].includes(v.protocol)?v.href:''}catch{return ''}}
 function catName(id){return CATS.find(c=>c.id===id)?.name||id}
 function setCategory(id){selectedCategory=id;render();anchor.scrollIntoView({behavior:'smooth',block:'start'})}
 function setGame(id){selectedGame=id;document.querySelectorAll('[data-filter-game]').forEach(b=>b.classList.toggle('active',b.dataset.filterGame===id));render();anchor.scrollIntoView({behavior:'smooth',block:'start'})}
 CATS.forEach(c=>{
  const b=document.createElement('button');b.type='button';b.className='category-card';
  const ico=document.createElement('span');ico.className='cat-icon';ico.textContent=c.icon;
  const lower=document.createElement('div');lower.className='cat-bottom';const left=document.createElement('div');
  const name=document.createElement('strong');name.textContent=c.name;const num=document.createElement('small');num.textContent=mods.filter(m=>m.kategori===c.id).length+' mod';left.append(name,num);
  const arrow=document.createElement('span');arrow.className='cat-arrow';arrow.textContent='↗';lower.append(left,arrow);b.append(ico,lower);
  b.addEventListener('click',()=>setCategory(c.id));byId('categoryGrid').append(b);
 });
 function render(){
  const q=byId('searchBox').value.toLocaleLowerCase('tr-TR').trim();
  const filtered=mods.filter(m=> (selectedCategory==='all'||m.kategori===selectedCategory) && (selectedGame==='all'||m.oyun===selectedGame) && (!q||[m.baslik,m.aciklama,m.surum,m.kategori,m.oyun].some(v=>v.toLocaleLowerCase('tr-TR').includes(q))));
  const list=byId('modGrid');list.replaceChildren();
  filtered.forEach(m=>{
    const art=document.createElement('article');art.className='mod-card';
    const thumb=document.createElement('div');thumb.className='mod-thumb';const imageUrl=cleanUrl(m.gorsel);
    if(imageUrl){const im=document.createElement('img');im.src=imageUrl;im.alt=m.baslik+' tanıtım görseli';im.loading='lazy';thumb.append(im)}
    else{const t=document.createElement('span');t.className='placeholder';t.textContent='DRIVEHUB TR';thumb.append(t)}
    const body=document.createElement('div');body.className='mod-body';
    const tags=document.createElement('div');tags.className='mod-tags';[m.oyun,catName(m.kategori),m.surum].forEach(tag=>{let s=document.createElement('small');s.textContent=tag;tags.append(s)});
    const h=document.createElement('h3');h.textContent=m.baslik;const p=document.createElement('p');p.textContent=m.aciklama||'Detaylar indirme bağlantısında.';
    body.append(tags,h,p);
    const link=cleanUrl(m.link);if(link){let a=document.createElement('a');a.className='mod-button';a.href=link;a.target='_blank';a.rel='noopener noreferrer sponsored';a.textContent='MODU İNDİR ↗';body.append(a)}
    else{let b=document.createElement('span');b.className='mod-button disabled';b.textContent='BAĞLANTI YAKINDA';body.append(b)}
    art.append(thumb,body);list.append(art);
  });
  byId('activeFilter').textContent=selectedCategory==='all'?'Tüm kategoriler':selectedCategory==='ETS2-DLC'?'ETS2 TÜM DLC':selectedCategory==='ATS-DLC'?'ATS TÜM DLC':catName(selectedCategory);
  byId('resultCount').textContent=filtered.length+' mod';byId('emptyState').hidden=filtered.length>0;
 }
 document.querySelectorAll('[data-filter-game]').forEach(b=>b.addEventListener('click',()=>setGame(b.dataset.filterGame)));
 document.querySelectorAll('[data-game]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setGame(a.dataset.game);byId('mobileNav').hidden=true;byId('menuButton').setAttribute('aria-expanded','false')}));
 document.querySelectorAll('[data-dlc]').forEach(b=>b.addEventListener('click',()=>{selectedGame='all';document.querySelectorAll('[data-filter-game]').forEach(t=>t.classList.toggle('active',t.dataset.filterGame==='all'));setCategory(b.dataset.dlc)}));
 byId('searchBox').addEventListener('input',render);
 byId('menuButton').addEventListener('click',()=>{const menu=byId('mobileNav');menu.hidden=!menu.hidden;byId('menuButton').setAttribute('aria-expanded',String(!menu.hidden))});
 byId('mobileNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{byId('mobileNav').hidden=true;byId('menuButton').setAttribute('aria-expanded','false')}));
 byId('year').textContent=String(new Date().getFullYear());
 render();
})();