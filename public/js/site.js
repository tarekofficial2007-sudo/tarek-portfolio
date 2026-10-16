import {firebaseConfig as c} from './firebase-config.js';import {iconSvg} from './icons.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const val=v=>{if(!v)return;if('stringValue'in v)return v.stringValue;if('arrayValue'in v)return(v.arrayValue.values||[]).map(val);if('mapValue'in v){const o={};for(const k in v.mapValue.fields||{})o[k]=val(v.mapValue.fields[k]);return o}return null};
const https=u=>/^https:\/\//i.test(u||''),R=document.documentElement,done=n=>R.classList.remove(n),KEY='tc1';
let cache={};try{cache=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
(async()=>{if(!c.projectId||c.projectId.startsWith('PASTE')){done('pend');done('pendg');return}
try{const r=await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/site/content?key=${c.apiKey}`);if(!r.ok)return;
const f=(await r.json()).fields||{},d={};for(const k in f)d[k]=val(f[k]);
if(!Array.isArray(d.gallery))done('pendg');
if(d.aboutHeadline)$('#about h2').textContent=d.aboutHeadline;
const ps=$$('#about .two>div>p');if(d.aboutText)ps[0].textContent=d.aboutText;if(d.goals)ps[1].textContent=d.goals;
if(Array.isArray(d.skills))$('#skills .grid').replaceChildren(...d.skills.map(s=>{const a=document.createElement('div');a.className='card';const i=document.createElement('div');i.className='ic';i.innerHTML=iconSvg(s.icon);const h=document.createElement('h3');h.textContent=s.title||'';const p=document.createElement('p');p.textContent=s.text||'';a.append(i,h,p);return a}));
const rows=$$('#contact .crow'),txt=(a,t)=>{a.querySelector('span:last-child').lastChild.textContent=t};
if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email||'')){rows[0].href='mailto:'+d.email;txt(rows[0],d.email)}
if(https(d.instagram)){rows[1].href=d.instagram;try{txt(rows[1],'@'+new URL(d.instagram).pathname.split('/').filter(Boolean)[0])}catch(e){}}
if(https(d.facebook))rows[2].href=d.facebook;

const B=`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/site/`;
const get=async(id,keep=true)=>{if(keep&&cache[id])return cache[id];try{const j=await(await fetch(B+encodeURIComponent(id)+'?key='+c.apiKey)).json(),v=j.fields&&j.fields.data&&j.fields.data.stringValue,ok=v&&/^data:(image\/(jpeg|png|webp)|application\/pdf);base64,/.test(v);if(ok&&keep)cache[id]=v;return ok?v:null}catch(e){return null}};
const put=async(sel,id)=>{const e=$(sel);if(e&&id){const u=await get(id);if(u){e.src=u;try{await e.decode()}catch(x){}}}};
const gal=async()=>{if(Array.isArray(d.gallery)&&d.gallery.length){const it=await Promise.all(d.gallery.map(async g=>{const s=g.id?await get(g.id):(/^img\/[\w.-]+$/.test(g.src||'')?g.src:null);if(!s)return null;const i=document.createElement('img');i.src=s;i.width=i.height=640;i.alt=g.alt||'';i.loading='lazy';return i}));$('.gal').replaceChildren(...it.filter(Boolean))}done('pendg')};
const cv=async()=>{if(d.cv){const u=await get(d.cv,false);if(u){const url=URL.createObjectURL(await(await fetch(u)).blob());$$('a.btn[href$="TAREK-CV.pdf"]').forEach(a=>{a.href=url;a.download='TAREK-CV.pdf'})}}};
await Promise.all([Promise.all([put('.hero img.portrait',d.heroPhoto),put('#about img.portrait',d.aboutPhoto),put('.logo img',d.logo)]).then(()=>done('pend')),gal(),cv()]);
const used=new Set([d.heroPhoto,d.aboutPhoto,d.logo,...(d.gallery||[]).map(g=>g.id)].filter(Boolean));cache=Object.fromEntries(Object.entries(cache).filter(([k])=>used.has(k)));
try{localStorage.setItem(KEY,JSON.stringify(cache))}catch(e){try{localStorage.removeItem(KEY)}catch(x){}}
}catch(e){}finally{done('pend');done('pendg')}})();
