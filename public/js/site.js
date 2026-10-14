import {firebaseConfig as c} from './firebase-config.js';import {iconSvg} from './icons.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const val=v=>{if(!v)return;if('stringValue'in v)return v.stringValue;if('arrayValue'in v)return(v.arrayValue.values||[]).map(val);if('mapValue'in v){const o={};for(const k in v.mapValue.fields||{})o[k]=val(v.mapValue.fields[k]);return o}return null};
const https=u=>/^https:\/\//i.test(u||'');
(async()=>{if(!c.projectId||c.projectId.startsWith('PASTE'))return;
try{const r=await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/site/content?key=${c.apiKey}`);if(!r.ok)return;
const f=(await r.json()).fields||{},d={};for(const k in f)d[k]=val(f[k]);
if(d.aboutHeadline)$('#about h2').textContent=d.aboutHeadline;
const ps=$$('#about .two>div>p');if(d.aboutText)ps[0].textContent=d.aboutText;if(d.goals)ps[1].textContent=d.goals;
if(Array.isArray(d.skills))$('#skills .grid').replaceChildren(...d.skills.map(s=>{const a=document.createElement('div');a.className='card';const i=document.createElement('div');i.className='ic';i.innerHTML=iconSvg(s.icon);const h=document.createElement('h3');h.textContent=s.title||'';const p=document.createElement('p');p.textContent=s.text||'';a.append(i,h,p);return a}));
const rows=$$('#contact .crow'),txt=(a,t)=>{a.querySelector('span:last-child').lastChild.textContent=t};
if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email||'')){rows[0].href='mailto:'+d.email;txt(rows[0],d.email)}
if(https(d.instagram)){rows[1].href=d.instagram;try{txt(rows[1],'@'+new URL(d.instagram).pathname.split('/').filter(Boolean)[0])}catch(e){}}
if(https(d.facebook))rows[2].href=d.facebook;
}catch(e){}})();
