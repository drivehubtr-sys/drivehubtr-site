// DriveHub TR - Netlify build: Pages CMS içeriğini mod kartlarına dönüştür.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync, cpSync, rmSync } from 'node:fs';
import { join, extname } from 'node:path';
const out = 'dist';
if (existsSync(out)) rmSync(out,{recursive:true,force:true});
mkdirSync(out,{recursive:true});
for (const name of ['index.html','style.css','script.js','logo.jpg','favicon.jpg']) copyFileSync(name,join(out,name));
if (existsSync('media')) cpSync('media',join(out,'media'),{recursive:true});
const dir='content/mods';
const mods=[];
if (existsSync(dir)) for (const file of readdirSync(dir).filter(x=>extname(x)==='.json').sort()) {
 const obj=JSON.parse(readFileSync(join(dir,file),'utf8'));
 if (obj.yayinla===false) continue;
 mods.push({baslik:obj.baslik||'',oyun:obj.oyun||'ETS2',kategori:obj.kategori||'Diger-Modlar',surum:obj.surum||'',aciklama:obj.aciklama||'',gorsel:obj.gorsel||'',link:obj.link||'',tarih:obj.tarih||''});
}
mods.sort((a,b)=>String(b.tarih).localeCompare(String(a.tarih)));
writeFileSync(join(out,'mods.js'), 'window.DRIVEHUB_MODS = '+JSON.stringify(mods,null,2)+';\n', 'utf8');
console.log(`DriveHub TR: ${mods.length} mod başarıyla derlendi.`);
