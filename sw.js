// Fast start: open instantly from the phone's cache, then quietly fetch updates for next time.
const CACHE='kalaam-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
// outside files that are safe to keep offline (icons library and fonts); never the voice model or login
const CDN=/^https:\/\/(cdn\.jsdelivr\.net\/npm\/lucide|fonts\.googleapis\.com|fonts\.gstatic\.com)/;
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kalaam-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin&&!CDN.test(r.url))return;
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r,{ignoreSearch:u.origin===location.origin});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net}))});
