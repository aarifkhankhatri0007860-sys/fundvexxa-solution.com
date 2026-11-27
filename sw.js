const CACHE="fundvexxa-shell-v4";
const CORE=["/","/index.html","/manifest.webmanifest","/assets/fundvexxa-icon.svg","/assets/fundvexxa-premium.css"];
const PRIVATE=/(^|\/)(admin|dashboard|leads|login|register|agent-dashboard|agent-payouts|agent-referrals|track)(\/|$)/i;
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener("fetch",event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=="GET"||url.origin!==self.location.origin||PRIVATE.test(url.pathname))return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(cached=>cached||caches.match("/index.html")));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>{
  const network=fetch(request).then(response=>{if(response.ok&&response.type==="basic"){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>cached);
  return cached||network;
 }));
});