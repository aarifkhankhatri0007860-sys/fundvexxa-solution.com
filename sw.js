const CACHE="fundvexxa-shell-v3";
const CORE=["/","/index.html","/manifest.webmanifest","/assets/fundvexxa-icon.svg","/assets/fundvexxa-192.png","/assets/fundvexxa-512.png","/assets/fundvexxa-premium.css"];
const PRIVATE=/(admin|dashboard|leads|login|register|agent|track|membership)/i;
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;if(PRIVATE.test(u.pathname))return;if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res}).catch(()=>caches.match(r).then(x=>x||caches.match("/index.html"))));return}e.respondWith(caches.match(r).then(cached=>{const net=fetch(r).then(res=>{if(res.ok&&res.type==="basic"){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res}).catch(()=>cached);return cached||net}))});
