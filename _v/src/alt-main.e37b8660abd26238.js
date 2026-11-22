import { renderDimensions as localRenderDimensions, backgroundFrameRate as localBackgroundFrameRate } from './local-render-quality.js?v=1';
function ji(e,t){if(t!=="disola"&&t!=="lakeside")return;let i=new Map;for(let s=0;s<e.length;s+=14){let c=e[s+6];if(i.has(c))continue;let l=Math.hypot(e[s],e[s+2]),u=[-e[s]/l,-e[s+2]/l],d=[e[s+3],e[s+5]],h=d[0]*u[0]+d[1]*u[1],m=Math.min(1,Math.abs(h)/.25),v=m*m*(3-2*m),f=h<0?-1:1,p=u[0]*(1-v)+d[0]*f*v,y=u[1]*(1-v)+d[1]*f*v,g=Math.hypot(p,y);i.set(c,[p/g,y/g])}let a=[...i].sort((s,c)=>s[0]-c[0]),r=new Map,o=.008,n=o*3;for(let s=0;s<a.length;s++){let c=a[s][0],l=0,u=0;for(let h=s;h>=0&&c-a[h][0]<=n;h--){let m=Math.exp(-.5*((c-a[h][0])/o)**2);l+=a[h][1][0]*m,u+=a[h][1][1]*m}for(let h=s+1;h<a.length&&a[h][0]-c<=n;h++){let m=Math.exp(-.5*((c-a[h][0])/o)**2);l+=a[h][1][0]*m,u+=a[h][1][1]*m}let d=Math.hypot(l,u);r.set(c,[l/d,u/d])}for(let s=0;s<e.length;s+=14){let c=r.get(e[s+6]);e[s+3]=c[0],e[s+4]=0,e[s+5]=c[1]}}var Wr=Math.PI*2,O0=256,X0=e=>Math.max(0,Math.min(O0-1,Math.floor((e+Math.PI)/Wr*O0))),$t=class{constructor(t,i,a=null){this.vertices=t,this.indices=i,this.alpha=a,this.eyeKey=""}prepare(t){let i=t.join(",");if(i===this.eyeKey)return;this.eyeKey=i,this.bins=Array.from({length:O0},()=>[]);let a=this.vertices,r=this.indices;for(let o=0;o<r.length;o+=3){let n=r[o]*14,s=r[o+1]*14,c=r[o+2]*14;if(Math.min(a[n+1],a[s+1],a[c+1])>t[1]||Math.max(a[n+1],a[s+1],a[c+1])<-.015)continue;let l=[n,s,c].map(h=>Math.atan2(a[h]-t[0],a[h+2]-t[2])),u=Math.min(...l),d=Math.max(...l);d-u>Math.PI&&(u=-Math.PI,d=Math.PI);for(let h=X0(u);h<=X0(d);h++)this.bins[h].push(o)}}contains(t,i){this.prepare(t);let a=i.x-t[0],r=-t[1],o=i.z-t[2],n=this.vertices,s=this.indices;for(let c of this.bins[X0(Math.atan2(a,o))]){let l=s[c]*14,u=s[c+1]*14,d=s[c+2]*14,h=n[u]-n[l],m=n[u+1]-n[l+1],v=n[u+2]-n[l+2],f=n[d]-n[l],p=n[d+1]-n[l+1],y=n[d+2]-n[l+2],g=r*y-o*p,x=o*f-a*y,w=a*p-r*f,k=h*g+m*x+v*w;if(Math.abs(k)<1e-9)continue;let F=t[0]-n[l],I=t[1]-n[l+1],U=t[2]-n[l+2],M=(F*g+I*x+U*w)/k;if(M<0||M>1)continue;let L=I*v-U*m,z=U*h-F*v,N=F*m-I*h,$=(a*L+r*z+o*N)/k;if($<0||M+$>1)continue;let ue=(f*L+p*z+y*N)/k;if(!(ue<=0||ue>1||t[1]+r*ue<-.015)){if(this.alpha){let ee=n[l+6]*(1-M-$)+n[u+6]*M+n[d+6]*$,Le=n[l+7]*(1-M-$)+n[u+7]*M+n[d+7]*$,{data:W,width:de,height:Ae}=this.alpha,he=Math.max(0,Math.min(de-1,Math.floor(ee*de))),Ie=Math.max(0,Math.min(Ae-1,Math.floor(Le*Ae)));if(W[Ie*de+he]<3)continue}return!1}}return!0}};var V0=class{constructor(t){this.options=t,this.session=null}begin(t){var a;let i=this.options;return t.pointerType==="mouse"&&t.button!==0||i.isBlocked(t)||i.isWater(t.clientX,t.clientY)?!1:(this.session||(this.session={id:t.pointerId,x:t.clientX,lastX:t.clientX,minutes:i.getMinutes(),width:Math.max(1,i.getWidth()),moved:!1},(a=i.onStart)==null||a.call(i,t)),!0)}move(t){let i=this.session;if(!i||i.id!==t.pointerId)return!1;if(t.pointerType==="mouse"&&!(t.buttons&1))return this.end(t),!0;let a=t.clientX-i.x;return Math.abs(a)>4&&(i.moved=!0),i.moved&&t.clientX!==i.lastX&&this.options.setMinutes(i.minutes+a/i.width*720,Math.sign(t.clientX-i.lastX)),i.lastX=t.clientX,!0}end(t){var i,a;return!this.session||this.session.id!==t.pointerId?!1:(this.session=null,(a=(i=this.options).onEnd)==null||a.call(i,t),!0)}};function Yi(e,t){let i=new V0({...t,getWidth:()=>e.getBoundingClientRect().width}),a=n=>{n.preventDefault(),n.stopImmediatePropagation()},r=n=>{var s;(s=e.hasPointerCapture)!=null&&s.call(e,n.pointerId)&&e.releasePointerCapture(n.pointerId)};e.addEventListener("pointerdown",n=>{var s,c;i.begin(n)&&(a(n),((s=i.session)==null?void 0:s.id)===n.pointerId&&((c=e.setPointerCapture)==null||c.call(e,n.pointerId)))},{capture:!0}),window.addEventListener("pointermove",n=>{i.move(n)&&(a(n),i.session||r(n))},{capture:!0,passive:!1});for(let n of["pointerup","pointercancel","lostpointercapture"])window.addEventListener(n,s=>{i.end(s)&&(a(s),r(s))},{capture:!0});let o=()=>{let n=i.session;if(!n)return;let s={pointerId:n.id,clientX:n.lastX,clientY:-100};i.end(s),r(s)};return window.addEventListener("blur",o),document.addEventListener("visibilitychange",()=>{document.hidden&&o()}),i}function Ki(e,{activate:t,isAudioReady:i,isSceneTarget:a,host:r=window,doc:o=document}){let n=new Set,s=new Set,c=[],l=-1/0,u=(f,p,y,g={capture:!0,passive:!1})=>{f.addEventListener(p,y,g),c.push(()=>f.removeEventListener(p,y,g))},d=f=>{f.cancelable&&f.preventDefault()},h=f=>{f.isTrusted===!1||o.hidden||i()||t()},m=f=>{let p=f.timeStamp??performance.now();p-l<250||(l=p,h(f))};u(r,"pointerdown",f=>{f.pointerType==="mouse"&&f.button!==0||(h(f),e.contains(f.target)&&a(f.target)&&n.add(f.pointerId))}),u(r,"pointermove",f=>{n.has(f.pointerId)&&(m(f),d(f))}),u(r,"pointerup",f=>{h(f),n.delete(f.pointerId)});for(let f of["pointercancel","lostpointercapture"])u(r,f,p=>n.delete(p.pointerId));u(r,"touchstart",f=>{h(f);for(let p of f.changedTouches){let y=p.target??f.target;e.contains(y)&&a(y)&&s.add(p.identifier)}s.size&&d(f)}),u(r,"touchmove",f=>{s.size&&(m(f),d(f))});for(let f of["touchend","touchcancel"])u(r,f,p=>{f==="touchend"&&h(p),s.size&&d(p);for(let y of p.changedTouches)s.delete(y.identifier)});for(let f of["gesturestart","gesturechange"])u(r,f,p=>{(s.size||n.size)&&d(p)});u(r,"keydown",f=>{!f.repeat&&f.key!=="Escape"&&!f.ctrlKey&&!f.metaKey&&!f.altKey&&h(f)},{capture:!0});let v=()=>{n.clear(),s.clear()};return u(r,"blur",v),u(o,"visibilitychange",()=>{o.hidden&&v()}),()=>{v();for(let f of c)f()}}function Zi(e,t=!1){let i=(e%24+24)%24,a=(r,o,n)=>{let s=Math.max(0,Math.min(1,(n-r)/(o-r)));return s*s*(3-2*s)};return .85*a(t?7:3.5,t?7.5:6,i)*(1-a(8.5,14,i))}function Ji(e){let t=(e%24+24)%24,i=Math.max(0,Math.min(1,(t<7?t-5:t-14)/2)),a=i*i*(3-2*i);return t<7?1-a:a}function G0(e,t,i){var c,l;if(!e||!Number.isFinite(i)||i<=0)return;e.unframedTanHalfFov??=e.tanHalfFov;let a=(t==="mountains"?38:52)*Math.PI/180,r=Math.tan(a),o=((c=e.forward)==null?void 0:c[2])??1,n=Math.abs(((l=e.up)==null?void 0:l[2])??0),s=r*o/(i+r*n);e.tanHalfFov=Math.min(e.unframedTanHalfFov,s)}var e0=class{constructor(t,i,{fetcher:a=globalThis.fetch,navigator:r=globalThis.navigator}={}){this.owner=t,this.buffer=null,this.voice=null,this.failed=!1,this.preparing=null,this.navigator=r,this.bytes=a(i,{cache:"force-cache"}).then(o=>{if(!o.ok)throw new Error("Ambience unavailable");return o.arrayBuffer()}).catch(()=>(this.failed=!0,null))}get playing(){var t;return!!this.voice&&((t=this.owner.context)==null?void 0:t.state)==="running"}activate(){var a;let t=this.owner;try{(a=this.navigator)!=null&&a.audioSession&&this.navigator.audioSession.type!=="playback"&&(this.navigator.audioSession.type="playback")}catch{}t.setupGraph();let i=t.context;if(!i||this.failed)return!1;if(i.state!=="running"){let r=i.createBufferSource();r.buffer=i.createBuffer(1,1,i.sampleRate),r.connect(i.destination),r.onended=()=>r.disconnect(),r.start(0),i.resume().catch(()=>{})}return this.preparing||(this.preparing=this.bytes.then(r=>r?i.decodeAudioData(r):null).then(r=>{r?(this.buffer=r,this.start()):this.fallback()}).catch(()=>this.fallback())),this.buffer&&this.start(),!0}start(){if(this.voice||!this.buffer)return;let t=this.owner,i=t.context,a=i.createBufferSource();a.buffer=this.buffer,a.loop=!0,a.connect(t.ambienceGainNode??i.destination),t.setAmbienceOutputLevel(t.ambienceTargetVolume),a.start(0),this.voice=a}fallback(){this.failed=!0,this.owner.startAmbience()}};var nt=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2];function Qi(e,t,i,a,r=80){if(!e||!(t.width>0&&t.height>0))return null;let o=t.width/t.height,n=e.tanHalfFov,s=(i-t.left)/t.width*2-1,c=1-(a-t.top)/t.height*2,l=e.forward.map((L,z)=>L+e.right[z]*s*n*o+e.up[z]*c*n);if(l[1]/Math.hypot(...l)>=-1e-4||e.position[1]<=0)return null;let u=-e.position[1]/l[1],d=e.position.map((L,z)=>L+l[z]*u);d[1]=0;let h=d.map((L,z)=>L-e.position[z]),m=nt(h,e.forward),v=nt(h,e.right),f=nt(h,e.up),p=t.height/(2*n),y=L=>{let z=L.map(($,ue)=>$-e.position[ue]),N=nt(z,e.forward);return N<=0?null:[t.left+t.width/2+p*nt(z,e.right)/N-i,t.top+t.height/2-p*nt(z,e.up)/N-a]},g=[0,2].map(L=>p*(e.right[L]*m-v*e.forward[L])/(m*m)),x=[0,2].map(L=>-p*(e.up[L]*m-f*e.forward[L])/(m*m)),w=g[0]**2+g[1]**2,k=g[0]*x[0]+g[1]*x[1],F=x[0]**2+x[1]**2,I=Math.sqrt((w+F+Math.hypot(w-F,2*k))/2);if(!(I>0&&Number.isFinite(I)))return null;let U=r/(2*I),M=[];for(let L=0;L<64;L++){let z=L*Math.PI*2/64,N=y([d[0]+U*Math.cos(z),0,d[2]+U*Math.sin(z)]);if(!N||!N.every(Number.isFinite))return null;M.push(N)}return{center:d,radius:U,points:M,path:M.map((L,z)=>(z?"L":"M")+L.map(N=>N.toFixed(3)).join(" ")).join("")+"Z"}}var $i={ea0d6aafe334993349a394c44296:{url:"/_p/matte-2a6b35efafb8c9bf0c8001cd63db",file:"src/mattes/2a6b35efafb8c9bf0c8001cd63db.bin",sha256:"2a6b35efafb8c9bf0c8001cd63dbd8b1d6ad40f1a44481e9656f91708f8c4d6d",width:6562,height:3662},"6aa08bf6b2938334966156bb637a":{url:"/_p/matte-bcd79d7b4e48f09d90668f4e76f6",file:"src/mattes/bcd79d7b4e48f09d90668f4e76f6.bin",sha256:"bcd79d7b4e48f09d90668f4e76f6fda9a32e428323b198660a7a5a283eccc4ac",width:4096,height:2286},"7fb51d350882bb22006e8327e329":{url:"/_p/matte-adca677378c70858a114475c02be",file:"src/mattes/adca677378c70858a114475c02be.bin",sha256:"adca677378c70858a114475c02bebae6491e2a6a1a30bb103d228e1068111dd3",width:8192,height:4096},b12555fe28126e4fb4ad489e0cc8:{url:"/_p/matte-e74d52e8c423828257fad89c86ad",file:"src/mattes/e74d52e8c423828257fad89c86ad.bin",sha256:"e74d52e8c423828257fad89c86ad55aeeec367afdc0c97e3673e0478c1e34093",width:4096,height:2048},"3f9bdf44879eb0a6470b02cb8279":{url:"/_p/matte-f2f2428f50609a9e56ed6ad801fc",file:"src/mattes/f2f2428f50609a9e56ed6ad801fc.bin",sha256:"f2f2428f50609a9e56ed6ad801fc056e7a999970cdd2ec08f607a9da333f7286",width:8192,height:4096},"049709836fae67eb9dd982e98da2":{url:"/_p/matte-3bc764fe86cf6829dccaca3eec76",file:"src/mattes/3bc764fe86cf6829dccaca3eec76.bin",sha256:"3bc764fe86cf6829dccaca3eec767bd3842964b36e22a997d3a7ecf0b5993486",width:4096,height:2048}};var t0=new Map;function Xr(e){let t=new DataView(e),i=t.getUint32(0,!0),a=t.getUint32(4,!0),r=t.getUint32(8,!0),o=t.getUint32(12,!0),n=[],s=16;for(let c=0;c<o;c++){let l=t.getUint32(s,!0),u=t.getUint32(s+4,!0);if(s+=8,l+u>i*a)throw new Error("Invalid landscape boundary");n.push([l,new Uint8Array(e,s,u)]),s+=u}if(s!==e.byteLength)throw new Error("Invalid landscape boundary length");return{width:i,height:a,reach:r,spans:n}}function ea(e){var i;let t=$i[(i=e.split("/").pop())==null?void 0:i.split("?")[0]];if(!t)return Promise.resolve(null);if(!t0.has(t.url)){let a=new AbortController,r=setTimeout(()=>a.abort(),1500);t0.set(t.url,fetch(t.url,{signal:a.signal}).then(o=>{if(!o.ok)throw new Error("Landscape boundary unavailable");return o.arrayBuffer()}).then(Xr).catch(()=>(t0.delete(t.url),null)).finally(()=>clearTimeout(r)))}return t0.get(t.url)}var wt=(e,t,i)=>{let a=Math.max(0,Math.min(1,(i-e)/(t-e)));return a*a*(3-2*a)};function Or(e,t,i,a=null){let r=t*i,o=new Uint8Array(r),n=new Uint8Array(r),s=Math.max(3,Math.min(48,Math.round(t*.0065))),c=[];if(a&&a.width===t&&a.height===i&&a.reach===s)for(let[p,y]of a.spans)o.set(y,p),c.push([p,p+y.length]);else{for(let p=0;p<r;p++)o[p]=e[p*4+3]<16?0:s+1;for(let p=0;p<i;p++)for(let y=0;y<t;y++){let g=p*t+y;y&&(o[g]=Math.min(o[g],o[g-1]+1)),p&&(o[g]=Math.min(o[g],o[g-t]+1))}for(let p=i-1;p>=0;p--)for(let y=t-1;y>=0;y--){let g=p*t+y;y<t-1&&(o[g]=Math.min(o[g],o[g+1]+1)),p<i-1&&(o[g]=Math.min(o[g],o[g+t]+1))}c.push([0,r])}let l=p=>{let y=p*4,g=e[y],x=e[y+1],w=e[y+2];return wt(18,34,w-g)*wt(10,24,x-g)*wt(2,10,w-x)*wt(160,205,w)*wt(80,130,g)},u=[],d=[],h=p=>{p<0||p>=r||n[p]||o[p]>s||o[p]===0||l(p)<.85||(n[p]=255,u.push(p))},m=Math.max(6,Math.round((t/2e3)**2*3));for(let[p,y]of c)for(let g=p;g<y;g++)if(o[g]===1&&!n[g]){let x=u.length;h(g);for(let w=x;w<u.length;w++){let k=u[w],F=k%t;F&&h(k-1),F<t-1&&h(k+1),h(k-t),h(k+t)}if(u.length-x>=m)for(let w=x;w<u.length;w++)d.push(u[w]);else for(let w=x;w<u.length;w++)n[u[w]]=1}let v=d.slice();for(let p of d){let y=p%t,g=[p-t,p+t];y&&g.push(p-1),y<t-1&&g.push(p+1);for(let x of g){if(x<0||x>=r||n[x]||o[x]>s)continue;let w=l(x);w>=.08&&(n[x]=Math.max(2,Math.round(w*255)),v.push(x))}}let f=0;for(let p of v)n[p]>1&&(e[p*4+3]=Math.round(e[p*4+3]*(1-n[p]/255)),f++);return{affected:f,reach:s}}function ta(e,t=null){let i=typeof OffscreenCanvas=="function"?new OffscreenCanvas(e.width,e.height):document.createElement("canvas");i.width=e.width,i.height=e.height;let a=i.getContext("2d",{willReadFrequently:!0});a.drawImage(e,0,0);let r=a.getImageData(0,0,e.width,e.height);return Or(r.data,e.width,e.height,t),a.putImageData(r,0,0),e.close(),i.close=()=>{},i}var Oa=new WeakMap;function Vr(e,t,i=16,a=8){let r=Array.from({length:i*a},()=>[]);for(let c=0;c<t.length;c+=3){let l=t[c]*14,u=t[c+1]*14,d=t[c+2]*14,h=(e[l+6]+e[u+6]+e[d+6])/3,m=(e[l+7]+e[u+7]+e[d+7])/3,v=Math.min(i-1,Math.max(0,Math.floor(h*i))),f=Math.min(a-1,Math.max(0,Math.floor(m*a)));r[f*i+v].push(t[c],t[c+1],t[c+2])}let o=new Uint32Array(t.length),n=[],s=0;for(let c of r){if(!c.length)continue;let l=[1/0,1/0,1/0],u=[-1/0,-1/0,-1/0];for(let d of c){let h=d*14,m=Math.max(0,e[h+1]-e[h+9]),v=4*Math.abs(e[h+11]),f=v>0,p=[f?m+v*.032:0,f?2*m+v*.01:0,v*(m*4e-4+.014)];for(let y=0;y<3;y++)l[y]=Math.min(l[y],e[h+y]-p[y]-.01),u[y]=Math.max(u[y],e[h+y]+p[y]+.01)}o.set(c,s),n.push({offset:s*4,count:c.length,centre:l.map((d,h)=>(d+u[h])*.5),extent:l.map((d,h)=>(u[h]-d)*.5)}),s+=c.length}return{indices:o,tiles:n}}function Gr(e,t){let i=e.centre,a=e.extent;for(let r=0;r<3;r++)for(let o=0;o<2;o++){let n=o?1:-1,s=t[3]+n*t[r],c=t[7]+n*t[4+r],l=t[11]+n*t[8+r],u=t[15]+n*t[12+r];if(s*i[0]+c*i[1]+l*i[2]+u+Math.abs(s)*a[0]+Math.abs(c)*a[1]+Math.abs(l)*a[2]<0)return!1}return!0}function Hr(e,t,i){if(!t.tiles){e.drawElements(e.TRIANGLES,t.meta.indices,e.UNSIGNED_INT,0);return}let a=!1,r=0,o=0,n=()=>{o&&(e.drawElements(e.TRIANGLES,o,e.UNSIGNED_INT,r),a=!0,o=0)};for(let s of t.tiles){if(!Gr(s,i)){n();continue}o&&r+o*4!==s.offset&&n(),o||(r=s.offset),o+=s.count}n(),a||e.drawElements(e.TRIANGLES,0,e.UNSIGNED_INT,0)}var oi=class{constructor({targetFps:t=60,sampleCount:i=12}={}){this.targetFps=t,this.sampleCount=i,this.reset()}reset(){this.lastCallbackAt=null,this.nextFrameAt=null,this.samples=[],this.estimatedRefreshRate=60,this.frameDivisor=1,this.measured=!1}shouldRender(t){if(this.lastCallbackAt!==null){let a=t-this.lastCallbackAt;if(a>=4&&a<=40&&(this.samples.push(a),this.samples.length>this.sampleCount&&this.samples.shift(),this.samples.length===this.sampleCount)){let r=[...this.samples].sort((s,c)=>s-c),o=Math.floor(r.length/2),n=r.length%2?r[o]:(r[o-1]+r[o])*.5;this.estimatedRefreshRate=Math.max(this.targetFps,this.estimatedRefreshRate,1e3/n),this.frameDivisor=Math.max(1,this.estimatedRefreshRate/this.targetFps),this.measured=!0}}this.lastCallbackAt=t;let i=1e3/this.targetFps;return this.nextFrameAt===null?(this.nextFrameAt=t+i,!0):t+1<this.nextFrameAt?!1:(this.nextFrameAt+=Math.max(1,Math.floor((t-this.nextFrameAt)/i)+1)*i,!0)}};var ni=class{constructor({sampleCount:t=48,settleFrames:i=12,minimumImprovement:a=.08}={}){Object.assign(this,{sampleCount:t,settleFrames:i,minimumImprovement:a}),this.reset()}reset(){this.frames=0,this.samples=[],this.slowFrames=0,this.trial=null,this.settling=0,this.blocked=!1}record(t,i,a,r){if(this.blocked)return null;if(!Number.isFinite(t)||t<=0||t>250)return this.frames=0,this.samples=[],this.slowFrames=0,this.settling=this.settleFrames,null;if(this.settling>0)return this.settling--,null;if(this.frames++,this.samples.push(t),t/Math.max(1,i)>1.42&&this.slowFrames++,this.frames<this.sampleCount)return null;let o=this.samples.sort((c,l)=>c-l).slice(0,Math.max(1,this.frames-2)),n=o.reduce((c,l)=>c+l,0)/o.length,s=this.slowFrames>=9||n/Math.max(1,i)>1.12;if(this.frames=0,this.samples=[],this.slowFrames=0,this.trial){let c=this.trial;if(this.trial=null,n>c.mean*(1-this.minimumImprovement))return this.blocked=!0,c.scale}return!s||a<=r?null:(this.trial={scale:a,mean:n},this.settling=this.settleFrames,Math.max(r,a*.86))}};function Y(e=(t=>(t=globalThis.location)==null?void 0:t.pathname)()??""){return globalThis.__lakeScene?globalThis.__lakeScene.view==="vast":/^\/vast(?:\.html)?\/?$/.test(e)}function ia(e="mountains"){let t=[0,3.2,-6],i=(e==="clouds"?.9:e==="disola"?4.5:6.3)*Math.PI/180,a=[0,-Math.sin(i),Math.cos(i)],r=[1,0,0],o=[0,Math.cos(i),Math.sin(i)];return{position:t,forward:a,right:r,up:o,tanHalfFov:Math.tan((e==="disola"?30:24)*Math.PI/180)}}var b0=Object.freeze(["lakeside","mountains","disola"]),Wa,qa,Je=Object.freeze(Y()?{clarity:60,depth:190,breeze:65,ripple:70,exposure:100,environment:b0.includes((Wa=globalThis.__lakeScene)==null?void 0:Wa.environment)?globalThis.__lakeScene.environment:"mountains"}:{clarity:68,depth:105,breeze:100,ripple:45,exposure:100,environment:b0.includes((qa=globalThis.__lakeScene)==null?void 0:qa.environment)?globalThis.__lakeScene.environment:"mountains"}),si=Object.freeze({clarity:[15,100],depth:[45,190],breeze:[0,160],ripple:[45,160],exposure:[55,155]}),Xa,_e=((Xa=globalThis.location)!=null&&Xa.pathname.startsWith("/staging")?"oscardumlao.staging.":"oscardumlao.")+(Y()?"vast":"alt")+".water.v1";function Va(e={}){return Object.fromEntries(Object.entries(Je).map(([t,i])=>{if(t==="environment")return[t,b0.includes(e[t])?e[t]:i];let a=Number(e[t]),[r,o]=si[t];return[t,Number.isFinite(a)?Math.min(o,Math.max(r,a)):i]}))}function m0(){let e={...Je};try{e=Va(JSON.parse(localStorage.getItem(_e))||Je)}catch{}let t=_e+".touch-extremes.v1",i=!1;try{i=localStorage.getItem(t)==="1"}catch{}if(!i){e.ripple=Je.ripple;try{localStorage.setItem(_e,JSON.stringify(e)),localStorage.setItem(t,"1")}catch{}}let a=_e+".vast-touch-70.v1",r=!1;try{r=localStorage.getItem(a)==="1"}catch{}if(Y()&&!r){e.ripple=70;try{localStorage.setItem(_e,JSON.stringify(e)),localStorage.setItem(a,"1")}catch{}}let o=_e+".depth-defaults.v1",n=!1;try{n=localStorage.getItem(o)==="1"}catch{}if(!n){e.depth=Je.depth;try{localStorage.setItem(_e,JSON.stringify(e)),localStorage.setItem(o,"1")}catch{}}return globalThis.__lakeScene&&b0.includes(globalThis.__lakeScene.environment)&&(e.environment=globalThis.__lakeScene.environment),e}var be=m0(),lt=document.querySelector("#water-tuning-button"),re=document.querySelector("#water-tuning-panel"),aa=document.querySelector("#water-tuning-reset");function ra(e=!1){window.dispatchEvent(new CustomEvent("altwaterchange",{detail:{...be,reset:e}}));try{localStorage.setItem(_e,JSON.stringify(be))}catch{}}function H0(){let e=re.querySelector(".water-photo-credit");e&&(e.hidden=be.environment==="clouds");let t=re.querySelector(".water-sky-credit");t&&(t.hidden=be.environment!=="clouds");for(let[i,a]of Object.entries(be)){let r=re.querySelector(`[name="${i}"]`);if(i==="environment"){r.value=a;continue}r.min=si[i][0],r.max=si[i][1],r.value=a,re.querySelector(`[data-value="${i}"]`).textContent=`${a}%`}}function j0(e){re.hidden=!e,lt.setAttribute("aria-expanded",String(e)),e&&re.querySelector("select,input").focus({preventScroll:!0})}if(lt&&re&&aa){lt.addEventListener("click",()=>j0(re.hidden)),re.addEventListener("input",e=>{let{name:t,value:i}=e.target;t in Je&&(be[t]=t==="environment"?i:Number(i),H0(),ra())}),aa.addEventListener("click",()=>{be={...Je},H0(),ra(!0)}),window.addEventListener("altbreezefollow",e=>{if(be.breeze===e.detail.breeze)return;be.breeze=e.detail.breeze;let t=re.querySelector('[name="breeze"]');t.value=be.breeze,re.querySelector('[data-value="breeze"]').textContent=`${be.breeze}%`}),document.addEventListener("pointerdown",e=>{!re.hidden&&!re.contains(e.target)&&!lt.contains(e.target)&&j0(!1)}),re.addEventListener("keydown",e=>{e.key==="Escape"&&(j0(!1),lt.focus(),e.stopPropagation())});for(let e of[lt,re])for(let t of["pointerdown","pointermove","pointerup","wheel","keydown","keyup"])e.addEventListener(t,i=>i.stopPropagation());H0()}function li({width:e,height:t,devicePixelRatio:i=1,cap:a=1.25,pixelBudget:r=145e4}){let o=Math.max(1,Number(e)||1),n=Math.max(1,Number(t)||1),s=Math.sqrt(r/(o*n)),c=1/Math.max(o,n);return Math.max(c,Math.min(Math.max(.01,i||1),a,s))}function jr({surfaceHeight:e,viewportHeight:t,viewportOffsetTop:i=0}){let a=Math.max(0,Number(e)||0),r=Math.max(0,Number(t)||0),o=Math.max(0,Number(i)||0);return Math.max(0,a-o-r)}function Yr({contentWidth:e,containerWidth:t,tolerance:i=2}){let a=Math.max(0,Number(e)||0),r=Math.max(0,Number(t)||0),o=Math.max(0,Number(i)||0);return r>0&&a>r+o}var Ga=oi,Kr=ni,Y0=`#version 300 es
layout(location = 0) in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ee=[{hour:0,near:"#06111f",far:"#00040d",horizon:"#807d77",sky:"#11172b",light:"#fff0c7",elevation:.3,intensity:1.45,exposure:.92,bloom:1.08,threshold:.55},{hour:5,near:"#081a27",far:"#020913",horizon:"#a47868",sky:"#243144",light:"#ffd3a1",elevation:.08,intensity:1.4,exposure:.9,bloom:1.25,threshold:.5},{hour:7.25,near:"#184a5f",far:"#052432",horizon:"#f3d7a8",sky:"#457f92",light:"#ffe4b6",elevation:.35,intensity:1.25,exposure:1.02,bloom:1.05,threshold:.57},{hour:12.5,near:"#163e6a",far:"#04162f",horizon:"#d8e1e8",sky:"#326894",light:"#f8fbff",elevation:.86,intensity:1.46,exposure:1.12,bloom:1.18,threshold:.72},{hour:16.25,near:"#396da0",far:"#153d80",horizon:"#e7eee5",sky:"#3d75a9",light:"#fffaf0",elevation:.86,intensity:1.46,exposure:1.12,bloom:1.18,threshold:.72},{hour:18,near:"#2f484d",far:"#102b34",horizon:"#e68b45",sky:"#50666b",light:"#ffb24d",elevation:.13,intensity:2.15,exposure:.98,bloom:1.14,threshold:.54},{hour:19.25,near:"#172c35",far:"#07131b",horizon:"#bd6531",sky:"#35434b",light:"#ff971e",elevation:.055,intensity:2.65,exposure:.88,bloom:1.32,threshold:.46},{hour:20.25,near:"#091724",far:"#01060e",horizon:"#46515b",sky:"#14243a",light:"#efc681",elevation:.045,intensity:1.75,exposure:.79,bloom:1.18,threshold:.48},{hour:21.25,near:"#071525",far:"#00030c",horizon:"#777773",sky:"#10172b",light:"#fff1cc",elevation:.27,intensity:1.55,exposure:.88,bloom:1.12,threshold:.53},{hour:24,near:"#06111f",far:"#00040d",horizon:"#807d77",sky:"#11172b",light:"#fff0c7",elevation:.3,intensity:1.45,exposure:.92,bloom:1.08,threshold:.55}],Zr={near:"#18384d",far:"#061728",horizon:"#d7b9a6",sky:"#4d6275",light:"#ffe2bf",elevation:.18,intensity:1.36,exposure:.98,bloom:1.14,threshold:.55},Be={near:"#29495f",far:"#0b2338",horizon:"#aab0ad",sky:"#526577",exposure:.94,bloom:1.02,threshold:.7,broadReflectionGain:.72},i0={near:.69,far:.94,horizon:.06,sky:.73},ci={latitude:38.102544,longitude:-122.856913,timeZone:"America/Los_Angeles"},T=Math.PI/180,Jr=864e5,Qr=2440588,$r=2451545,w0=T*23.4397,eo=19+14/60,to=.02,io=.18,ao=.18,ro=.18,Ue=Object.freeze({longSwell:Object.freeze({calm:.86,rough:.16}),crossSwell:Object.freeze({calm:.64,rough:.44}),medium:Object.freeze({calm:.28,rough:1.08}),short:Object.freeze({calm:.52,rough:1.14})}),oo=new Intl.DateTimeFormat("en-CA",{timeZone:ci.timeZone,year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23"}),T0="",oa=null,Ct=null,f0=null,p0=new Map,v0=new Map;function Ha(e){let t={};for(let i of oo.formatToParts(e))i.type!=="literal"&&(t[i.type]=Number(i.value));return t}function no(){let e=Ha(new Date),t=`${e.year}-${e.month}-${e.day}`;return t!==T0&&(T0=t,oa=e,Ct=null,f0=null,p0.clear(),v0.clear()),oa}function so(e){let t=Ha(e),i=Date.UTC(t.year,t.month-1,t.day,t.hour,t.minute,t.second);return Math.round((i-e.getTime())/6e4)*6e4}function S0(e,t=0){let i=(e%24+24)%24,a=Math.round(i*60)%1440,r=no(),o=`${T0}:${t}:${a}`;if(p0.has(o))return new Date(p0.get(o));let n=Date.UTC(r.year,r.month-1,r.day+t)+a*6e4,s=new Date(n);for(let c=0;c<2;c+=1)s=new Date(n-so(s));return p0.set(o,s.getTime()),s}function It(e){return e.valueOf()/Jr-.5+Qr-$r}function ja(e,t){return Math.atan2(Math.sin(e)*Math.cos(w0)-Math.tan(t)*Math.sin(w0),Math.cos(e))}function Ya(e,t){return Math.asin(Math.sin(t)*Math.cos(w0)+Math.cos(t)*Math.sin(w0)*Math.sin(e))}function lo(e,t){return T*(280.16+360.9856235*e)-t}function co(e,t,i){return Math.atan2(Math.sin(e),Math.cos(e)*Math.sin(t)-Math.tan(i)*Math.cos(t))}function uo(e,t,i){return Math.asin(Math.sin(t)*Math.sin(i)+Math.cos(t)*Math.cos(i)*Math.cos(e))}function Ai(e){let t=T*(357.5291+.98560028*e),i=T*(1.9148*Math.sin(t)+.02*Math.sin(2*t)+3e-4*Math.sin(3*t)),a=t+i+T*102.9372+Math.PI;return{rightAscension:ja(a,0),declination:Ya(a,0)}}function Ka(e){let t=T*(218.316+13.176396*e),i=T*(134.963+13.064993*e),a=T*(93.272+13.22935*e),r=t+T*6.289*Math.sin(i),o=T*5.128*Math.sin(a);return{rightAscension:ja(r,o),declination:Ya(r,o),distance:385001-20905*Math.cos(i)}}function ui(e,t){let i=It(e),a=-ci.longitude*T,r=ci.latitude*T,o=lo(i,a)-t.rightAscension;return{azimuth:co(o,r,t.declination),altitude:uo(o,r,t.declination)}}function Za(e){let t=It(e),i=Ai(t),a=Ka(t),r=Math.acos(Math.sin(i.declination)*Math.sin(a.declination)+Math.cos(i.declination)*Math.cos(a.declination)*Math.cos(i.rightAscension-a.rightAscension)),o=Math.atan2(149598e3*Math.sin(r),a.distance-149598e3*Math.cos(r));return(1+Math.cos(o))*.5}function B(e,t,i){let a=C((i-e)/(t-e),0,1);return a*a*(3-2*a)}function na(){return 1}function Ja(e){return Math.atan2(Math.sin(e),Math.cos(e))}function ho(){if(Ct!==null)return Ct;let e=S0(eo);return Ct=ui(e,Ai(It(e))).azimuth,Ct}function mo(e){if(f0===null){let t=-1,i=0;for(let a=-15;a<=15;a+=1){let r=S0(12,a),o=Za(r);o>t&&(t=o,i=a)}f0=i}return S0(e,f0)}function sa(e,t,i=0){let a=Math.max(e.altitude,i),r=Math.cos(a),o=Ja(e.azimuth-t);return[Math.sin(o)*r,Math.sin(a),Math.cos(o)*r]}function la(e,t,{unwrap:i=!1}={}){let a=e.azimuth-t,r=i?a:Ja(a),o=r/Math.PI,n=1-B(4*T,48*T,Math.max(e.altitude,0)),s=Math.tanh(r/(75*T))*R(.1,.36,n);return{pathX:o,pathSlope:s}}function fo(e,t,i){let a=B(-12*T,12*T,t),r=B(-28*T,70*T,i),o=1-B(88*T,124*T,i),n=r*o,s=(e%24+24)%24,c=a*R(.32,1,n)*(Math.sin(s*Math.PI*2/3.7+1.13)*.018+Math.sin(s*Math.PI*2/1.43-.47)*.008);return C(.34+a*(.35+n*.29)+c,.34,1)}function po(e){let t=B(.34,1,e),i=B(.08,.92,t);return R(.72,1.42,i)}function vo(e,t,i,a=.48){let r=C(Number.isFinite(e)?e:t,.34,1),o=C(Number.isFinite(t)?t:r,.34,1),n=C(Number.isFinite(i)?i:0,0,.1),s=Math.max(Number.isFinite(a)?a:.48,.001);return R(r,o,1-Math.exp(-n/s))}function $e(e){let t=S0(e),i=`${T0}:${t.getTime()}`;if(v0.has(i))return v0.get(i);let a=It(t),r=ui(t,Ai(a)),o=mo(e),n=It(o),s=ui(o,Ka(n)),c=Za(o),l=ho(),u=B(-8*T,-1*T,r.altitude),d=B(-1.5*T,40*T,s.altitude),h=B(-18*T,0*T,r.altitude),m=1-B(-10*T,-3*T,r.altitude),v=1-B(-24*T,-10*T,r.altitude),f=B(.18,.82,c),p=v*d*R(.12,.86,Math.sqrt(c)),y=v*d*f,g=sa(r,l,0),x=sa(s,l,0),w=B(-7*T,0*T,r.altitude),k=la(r,l,{unwrap:!0}),F=la(s,l),I=h*R(.18,1,w),U=p*R(.18,1,y),M=I>=U,L=Math.abs(I-U)/Math.max(I+U,1e-4),z=B(.12,.62,L),N=r.azimuth<0?u:1,$=z*(M?N:1),ue=M?g:x,ee=C((M?h:p)*$,0,1),Le=r.azimuth<0?B(-18*T,-14*T,r.altitude)*R(.86,.96,B(-14*T,-1*T,r.altitude)):0,W=Math.max(h,p)*(1-$),de=r.azimuth<0?Math.max(W,Le-ee):0,Ae=r.azimuth<0?Math.pow(B(-24*T,-10*T,r.altitude),.72)*Math.pow(1-B(-7*T,7*T,r.altitude),.72):0,he=(M?w:y)*z,Ie=M?k:F,ze=C(u+m*(.17+y*.58),.14,1),gt=r.azimuth<0?R(R(.75,.82,B(-18*T,-8*T,r.altitude)),1,B(-8*T,-1*T,r.altitude)):0,yt={hour:(e%24+24)%24,direction:ue,pathX:Ie.pathX,pathSlope:Ie.pathSlope,intensity:C(Math.max(ze,gt),.14,1),directionalStrength:ee,reflectionStrength:he,dawnHandoffFill:de,dawnHighlightStrength:Ae,sunPresence:u,magicHour:r.azimuth<0?0:B(12*T,5*T,r.altitude)*B(-8.5*T,-2*T,r.altitude),sunAzimuth:r.azimuth,sunAltitude:r.altitude,sunPathX:k.pathX,moonAzimuth:s.azimuth,moonAltitude:s.altitude,moonPathX:F.pathX,moonIllumination:c,source:M?"sun":"moon",waterClarity:R(74,100,B(-6*T,0*T,r.altitude)),waveEnergy:fo(e,r.altitude,r.azimuth)};return v0.set(i,yt),yt}function C(e,t,i){return Math.max(t,Math.min(i,e))}function R(e,t,i){return e+(t-e)*i}function dt(e){let t=C(e,0,1);return t*t*(3-2*t)}function Qa(e){return dt((700-e)/270)}function go(e){return R(1,1.25,Qa(e))}function yo(e,t=1){return Qa(e)}function zt(e,t=1){let i=yo(e,t);return{influence:i,tapRadius:.2*R(1,.04,i),tapEnergy:.3*R(1,.36,i),punctureDepth:.42*R(1,.58,i),punctureVelocity:.34*R(1,.38,i),dragRadius:.2*R(1,.035,i),dragEnergy:.26*R(1,.28,i),dragCarry:.3*R(1,.3,i)}}function $a(e=!1){return e?1.55:1}function Ei(e=140){let t=C(Number.isFinite(e)?e:140,0,1800);return{durationMs:t,depthScale:C(1+(t-140)*.00155,.78,3.25),energyScale:C(1+(t-140)*9e-4,.86,2.25),velocityScale:C(1+(t-140)*45e-5,.9,1.65)}}var A0=78,ca=.72,er=Math.sqrt(.135);function xo(e,t,i=A0){let a=Math.max(0,e)/(er*Math.max(1,t));return Math.max(0,i)/1e3+a}function ua(e,t,i){let a=dt(C((t-.3333333333333333)/.6666666666666666,0,1)),r=a*a,o=zt(e,a),n=Ei(i);return{foreground:a,gentleness:r,interactionProfile:o,pressProfile:n,radius:.92*R(1,.5,a)*o.tapRadius}}function bo(e,t){return C(e/Math.max(t*.8,.001),0,1)}function wo(e){return Math.pow(.48,1/Math.max(1,e))}function To(e={}){var t;return(((t=e.userAgentData)==null?void 0:t.platform)??"").toLowerCase()==="android"||/\bAndroid\b/i.test(e.userAgent??"")}function di(e){let t=Number.parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function Tt(e,t,i){let a=di(e),r=di(t);return a.map((o,n)=>R(o,r[n],i))}function a0(e,t,i){return{near:Tt(e.near,t.near,i),far:Tt(e.far,t.far,i),horizon:Tt(e.horizon,t.horizon,i),sky:Tt(e.sky,t.sky,i),light:Tt(e.light,t.light,i),elevation:R(e.elevation,t.elevation,i),intensity:R(e.intensity,t.intensity,i),exposure:R(e.exposure,t.exposure,i),bloom:R(e.bloom,t.bloom,i),threshold:R(e.threshold,t.threshold,i),broadReflectionGain:R(e.broadReflectionGain??1,t.broadReflectionGain??1,i)}}function r0(e,t,i){let a=di(t);return e.map((r,o)=>R(r,a[o],i))}function o0(e,t,i){let a=Math.max(...e),r=Math.min(...e),o=a-r;if(a<=1e-6||o<=1e-6)return e;let n=o/a,s=R(n,Math.max(n,t),C(i,0,1)),c=a*s/o;return e.map(l=>C(a-(a-l)*c,0,1))}function n0(e,t){if(t.sunAzimuth<0)return e;let i=B(62*T,76*T,t.sunAzimuth),a=1-B(98*T,106*T,t.sunAzimuth),r=Number.isFinite(t.hour)?(t.hour%24+24)%24:-1,o=r<0?0:B(16.25,16+40/60,r)*(1-B(17+40/60,18.15,r)),n=R(.9,.34,o),s=i*a*n;if(s<=0)return e;let c=i*a,l=r0(e.near,Be.near,s),u=r0(e.far,Be.far,s),d=r0(e.horizon,Be.horizon,s),h=r0(e.sky,Be.sky,s);return{...e,near:o0(l,i0.near,c),far:o0(u,i0.far,c),horizon:o0(d,i0.horizon,c),sky:o0(h,i0.sky,c),exposure:R(e.exposure,Be.exposure,s),bloom:R(e.bloom,Be.bloom,s),threshold:R(e.threshold,Be.threshold,s),broadReflectionGain:R(e.broadReflectionGain,Be.broadReflectionGain,s)}}function da(e){let t=e.sunAltitude/T,i=e.sunAzimuth<0,a=i?[{altitude:-18,palette:Ee[0]},{altitude:-8,palette:Ee[1]},{altitude:0,palette:Zr},{altitude:6,palette:Ee[2]},{altitude:45,palette:Ee[3]}]:[{altitude:-18,palette:Ee[8]},{altitude:-8,palette:Ee[7]},{altitude:0,palette:Ee[6]},{altitude:6,palette:Ee[5]},{altitude:12,palette:Ee[4]}];if(t<=a[0].altitude)return n0(a0(a[0].palette,a[0].palette,0),e);for(let o=0;o<a.length-1;o+=1){let n=a[o],s=a[o+1];if(t<=s.altitude){let c=dt((t-n.altitude)/(s.altitude-n.altitude));return n0(a0(n.palette,s.palette,c),e)}}let r=a[a.length-1].palette;if(!i){let o=B(8*T,82*T,e.sunAzimuth);return n0(a0(Ee[3],r,o),e)}return n0(a0(r,r,0),e)}function s0(e){let t=Math.hypot(...e)||1;return e.map(i=>i/t)}function ha(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}function ma(e,t,i,a=!1){let r=e.createShader(t);if(e.shaderSource(r,i),e.compileShader(r),!a&&!e.getShaderParameter(r,e.COMPILE_STATUS)){let o=e.getShaderInfoLog(r);throw e.deleteShader(r),new Error(`Water shader failed to compile: ${o}`)}return r}var E0=new WeakMap;function fa(e,t){let i=E0.get(t);if(i){for(let a of i)e.detachShader(t,a),e.deleteShader(a);E0.delete(t)}}function K0(e,t,i,a=null){let r=e.createProgram(),o=!!a,n=ma(e,e.VERTEX_SHADER,t,o),s=ma(e,e.FRAGMENT_SHADER,i,o);if(e.attachShader(r,n),e.attachShader(r,s),e.linkProgram(r),o&&E0.set(r,[n,s]),!o&&!e.getProgramParameter(r,e.LINK_STATUS)){let c=e.getProgramInfoLog(r);throw e.deleteShader(n),e.deleteShader(s),e.deleteProgram(r),new Error(`Water program failed to link: ${c}`)}return o||(e.deleteShader(n),e.deleteShader(s)),r}function Ke(e,t,i,a={}){let r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,a.filter??e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,a.filter??e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texStorage2D(e.TEXTURE_2D,1,a.internalFormat??e.RGBA8,t,i);let o=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw e.deleteFramebuffer(o),e.deleteTexture(r),new Error("The water render target is incomplete.");return{texture:r,framebuffer:o,width:t,height:i}}function l0(e,t){t&&(e.deleteTexture(t.texture),e.deleteFramebuffer(t.framebuffer))}var pa=new WeakMap;function b(e,t,i){let a=pa.get(t);return a||(a=new Map,pa.set(t,a)),a.has(i)||a.set(i,e.getUniformLocation(t,i)),a.get(i)}function So(e,t){let i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.MIRRORED_REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.MIRRORED_REPEAT),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,t),e.generateMipmap(e.TEXTURE_2D),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(e.TEXTURE_2D,null),i}function Ao(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([32,45,45,255])),e.bindTexture(e.TEXTURE_2D,null),t}var hi=class{constructor(e,{reducedMotion:t=!1}={}){this.canvas=e,this.reducedMotion=t;let i=matchMedia("(pointer:coarse)").matches,a=To(navigator);if(this.gl=e.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:a,powerPreference:"default",desynchronized:!i}),!this.gl)throw new Error("WebGL 2 is not available in this browser.");let r=this.gl;this.isMobile=i,this.isAndroid=a,this.floatTargets=!!r.getExtension("EXT_color_buffer_float"),this.parallelCompile=r.getExtension("KHR_parallel_shader_compile"),this.programsReady=!1,this.programCompilationFailed=!1;let o=navigator.deviceMemory||4,n=navigator.hardwareConcurrency||4;this.lowPower=this.isMobile&&(navigator.deviceMemory>0&&o<=4||n<=4),this.pixelRatio=1,this.running=!1,this.brushQueue=[],this.delayedBrushQueue=[],this.rippleArrivalQueue=[],this.sweepQueue=[],this.timeHours=12,this.physicalLightingBlend=na(12),this.celestial=$e(12),this.palette=da(this.celestial),this.waveEnergy=this.celestial.waveEnergy,this.targetWaveEnergy=this.celestial.waveEnergy,this.lastFrame=performance.now(),this.ambientWaveTime=this.lastFrame/1e3,this.lastPresentedAt=0,this.simAccumulator=0,this.simulationActiveUntil=0,this.frameHandle=0,this.frameGovernor=new Ga,this.frameTimePressure=new Kr,this.dynamicResolutionScale=1,this.minimumDynamicResolutionScale=this.isMobile?.62:.66,this.hasPresented=!1,this.canvasBounds=null,this.sweepSegments=new Float32Array(32),this.sweepParams=new Float32Array(32),this.brushValues=new Float32Array(32),this.brushPunctureDepths=new Float32Array(8),this.brushPunctureVelocities=new Float32Array(8),this.lastSweepForPointer=new Map,this.lakeBedTexture=Ao(r),this.lakeBedReady=!1,this.lakeBedLoading=!1,this.waterClarityPercent=100,this.waterClarityScale=1,this.waterClarity=28,this.waterSurfaceEnabled=1,this.bedTextureScale=1,this.waterDetailScale=1,this.causticDensity=1,this.causticIrregularity=1,this.causticSoftness=1,this.causticOpacity=1,this.causticChromatic=1,this.glintIntensity=1,this.middayRayBrightness=1,this.middayRayDiffusion=1,this.world={minX:-50,maxX:50,minZ:-2,maxZ:90},this.camera=this.createCamera(),this.createGeometry(),this.createPrograms(),this.programsReady=!this.parallelCompile,this.createSimulation(),this.resize(),e.addEventListener("webglcontextlost",s=>{s.preventDefault(),this.stop(),window.dispatchEvent(new CustomEvent("watercontextlost"))}),e.addEventListener("webglcontextrestored",()=>{window.location.reload()})}createCamera(){let e=[0,1.65,-3.5],t=[0,-3.72,12],i=s0(t.map((n,s)=>n-e[s])),a=s0(ha([0,1,0],i)),r=s0(ha(i,a)),o=36*Math.PI/180;return{position:e,target:t,forward:i,right:a,up:r,tanHalfFov:Math.tan(o/2)}}createGeometry(){let e=this.gl;this.screenVao=e.createVertexArray(),this.screenBuffer=e.createBuffer(),e.bindVertexArray(this.screenVao),e.bindBuffer(e.ARRAY_BUFFER,this.screenBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null)}loadLakeBedTexture(){if(this.lakeBedReady||this.lakeBedLoading)return;this.lakeBedLoading=!0;let e=new Image;e.decoding="async",e.fetchPriority="low",e.onload=()=>{if(this.gl.isContextLost())return;let t=So(this.gl,e);this.gl.deleteTexture(this.lakeBedTexture),this.lakeBedTexture=t,this.lakeBedReady=!0,this.lakeBedLoading=!1},e.onerror=()=>{this.lakeBedLoading=!1},e.src="/_p/c17762064f74f2110db27091e947"}createPrograms(){let e=this.gl,t=this.floatTargets?`vec2 readState(vec4 value) { return value.rg; }
         vec4 writeState(vec2 value) { return vec4(value, 0.0, 1.0); }`:`vec2 readState(vec4 value) { return value.rg * 2.0 - 1.0; }
         vec4 writeState(vec2 value) { return vec4(value * 0.5 + 0.5, 0.0, 1.0); }`,i=this.floatTargets?28e-5:.006,a=this.floatTargets?.0012:.018,r=this.reducedMotion?48:90,o=wo(r),n=$a(this.isMobile),s=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uState;
uniform vec2 uTexel;
out vec4 outColor;
${t}

void main() {
  vec2 state = readState(texture(uState, vUv));
  float height = state.x;
  float velocity = state.y;
  vec2 left = readState(texture(uState, vUv - vec2(uTexel.x, 0.0)));
  vec2 right = readState(texture(uState, vUv + vec2(uTexel.x, 0.0)));
  vec2 down = readState(texture(uState, vUv - vec2(0.0, uTexel.y)));
  vec2 up = readState(texture(uState, vUv + vec2(0.0, uTexel.y)));
  vec2 downLeft = readState(texture(uState, vUv - uTexel));
  vec2 upRight = readState(texture(uState, vUv + uTexel));
  vec2 downRight = readState(texture(
    uState,
    vUv + vec2(uTexel.x, -uTexel.y)
  ));
  vec2 upLeft = readState(texture(
    uState,
    vUv + vec2(-uTexel.x, uTexel.y)
  ));
  vec2 cardinal = left + right + down + up;
  vec2 diagonal = downLeft + downRight + upLeft + upRight;
  vec2 laplacian = (cardinal * 4.0 + diagonal - state * 20.0) / 6.0;
  velocity += laplacian.x * 0.135;
  velocity += laplacian.y * 0.028;
  velocity *= 0.9946;
  height += velocity;
  height *= 0.9995;

  float edgeDistance = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edge = smoothstep(0.0, 0.055, edgeDistance);
  velocity *= mix(0.86, 1.0, edge);
  height *= mix(0.94, 1.0, edge);

  float residual = max(abs(height), abs(velocity));
  float quiet = smoothstep(
    ${i},
    ${a},
    residual
  );
  float quietDamping = mix(${o}, 1.0, quiet);
  height *= quietDamping;
  velocity *= quietDamping;

  outColor = writeState(clamp(vec2(height, velocity), vec2(-0.98), vec2(0.98)));
}`,c=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uState;
uniform vec4 uBrushes[8];
uniform float uPunctureDepths[8];
uniform float uPunctureVelocities[8];
uniform int uBrushCount;
uniform vec4 uWorldBounds;
out vec4 outColor;
${t}

vec2 stateToWorld(vec2 uv) {
  return mix(uWorldBounds.xy, uWorldBounds.zw, uv);
}

void main() {
  vec2 state = readState(texture(uState, vUv));
  vec2 world = stateToWorld(vUv);

  for (int index = 0; index < 8; index++) {
    if (index >= uBrushCount) break;
    vec4 brush = uBrushes[index];
    vec2 delta = (world - brush.xy) / max(brush.z, 0.001);
    float distanceSquared = dot(delta, delta);
    float brushFootprint = max(
      max(length(dFdx(delta)), length(dFdy(delta))),
      0.001
    );
    float coreWidth = max(inversesqrt(3.7), brushFootprint * 1.35);
    float core = exp(-distanceSquared / (coreWidth * coreWidth));
    float skirt = exp(-distanceSquared * 0.82);
    float impulse = core - skirt * 0.235;
    float crossedWake = sin(dot(delta, vec2(0.82, 0.57)) * 3.8) *
      sin(dot(delta, vec2(-0.54, 0.84)) * 3.4) *
      exp(-distanceSquared * 1.4);
    state.y += brush.w * (impulse + crossedWake * 0.09);
    state.x += brush.w * core * 0.055;

    // An object entering the lake first opens a compact cavity, then the
    // broader impulse above radiates away from it. Keep this much narrower
    // than the ripple radius so added depth does not enlarge the emanation.
    float punctureWidth = max(inversesqrt(52.0), brushFootprint * 1.6);
    float puncture = exp(
      -distanceSquared / (punctureWidth * punctureWidth)
    );
    float punctureDepth = uPunctureDepths[index];
    state.y -= punctureDepth * puncture * uPunctureVelocities[index];
    state.x -= punctureDepth * puncture;
  }

  outColor = writeState(clamp(state, vec2(-0.98), vec2(0.98)));
}`,l=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uState;
uniform vec4 uSweeps[8];
uniform vec4 uSweepParams[8];
uniform int uSweepCount;
uniform vec4 uWorldBounds;
out vec4 outColor;
${t}

vec2 stateToWorld(vec2 uv) {
  return mix(uWorldBounds.xy, uWorldBounds.zw, uv);
}

void main() {
  vec2 state = readState(texture(uState, vUv));
  vec2 world = stateToWorld(vUv);
  vec2 worldSize = max(uWorldBounds.zw - uWorldBounds.xy, vec2(0.001));

  for (int index = 0; index < 8; index++) {
    if (index >= uSweepCount) break;
    vec4 sweep = uSweeps[index];
    vec4 params = uSweepParams[index];
    vec2 segment = sweep.zw - sweep.xy;
    float segmentLengthSquared = max(dot(segment, segment), 0.00001);
    float segmentLength = sqrt(segmentLengthSquared);
    vec2 direction = segment / segmentLength;
    vec2 normal = vec2(-direction.y, direction.x);
    float radius = max(params.x, 0.001);

    // The closest-point field is a true swept capsule, so the entire distance
    // traversed by the hand is displaced in one connected operation. It does
    // not deposit a row of circular click impulses along the pointer samples.
    float along = clamp(dot(world - sweep.xy, segment) / segmentLengthSquared, 0.0, 1.0);
    vec2 closest = sweep.xy + segment * along;
    float capsuleDistance = length(world - closest) / radius;
    float capsuleFootprint = max(
      max(abs(dFdx(capsuleDistance)), abs(dFdy(capsuleDistance))),
      0.001
    );
    float troughWidth = max(inversesqrt(3.35), capsuleFootprint * 1.15);
    float shoulderWidth = max(inversesqrt(10.4), capsuleFootprint * 0.8);
    float trough = exp(-pow(capsuleDistance / troughWidth, 2.0));
    float shoulder = exp(-pow((capsuleDistance - 0.9) / shoulderWidth, 2.0));
    // A submerged forearm presents a narrow blade to the surface. This inner
    // field creates a deep incision without expanding the overall swept area;
    // the paired wall field lifts the water displaced from that cut onto its
    // immediate edges, like a karate chop travelling through the lake.
    float incisionWidth = max(inversesqrt(15.5), capsuleFootprint * 0.92);
    float wallWidth = max(inversesqrt(42.0), capsuleFootprint * 0.56);
    float incision = exp(-pow(capsuleDistance / incisionWidth, 2.0));
    float incisionWalls = exp(-pow((capsuleDistance - 0.46) / wallWidth, 2.0));
    float displacement = -trough * 1.16 + shoulder * 0.245;

    // Transport some of the existing height field in the direction of the
    // gesture. This makes the hand push the surface forward instead of merely
    // adding a visual ring on top of it.
    vec2 carriedUv = clamp(
      vUv - (direction * radius * 0.46) / worldSize,
      vec2(0.001),
      vec2(0.999)
    );
    float carriedHeight = readState(texture(uState, carriedUv)).x;
    float carryMix = clamp(params.z * trough, 0.0, 0.52);
    state.x = mix(state.x, carriedHeight, carryMix);

    // Only the leading segment for each active pointer receives a bow wave.
    // The rest remains one continuous trough with connected lateral shoulders.
    vec2 tipDelta = world - sweep.zw;
    float tipForward = dot(tipDelta, direction) / radius;
    float tipSide = dot(tipDelta, normal) / radius;
    float bow = params.w * exp(
      -pow(tipForward - 0.62, 2.0) * 3.4 - tipSide * tipSide * 1.65
    );
    bow *= smoothstep(-0.18, 0.18, tipForward);

    float energy = params.y;
    state.y += energy * (
      displacement - incision * 1.05 + incisionWalls * 0.36 + bow * 0.92
    );
    // Depth is carried primarily in the height field rather than achieved by
    // enlarging the brush. The channel therefore reads as more submerged while
    // retaining the screen footprint of a hand moving through the surface.
    state.x += energy * (
      displacement * 0.13 - incision * 0.72 + incisionWalls * 0.28 + bow * 0.13
    );
  }

  outColor = writeState(clamp(state, vec2(-0.98), vec2(0.98)));
}`,u=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uState;
uniform sampler2D uLakeBed;
uniform float uLakeBedReady;
uniform float uWaterClarity;
uniform vec2 uStateTexel;
uniform float uTime;
uniform vec3 uCameraPosition;
uniform vec3 uCameraForward;
uniform vec3 uCameraRight;
uniform vec3 uCameraUp;
uniform float uTanHalfFov;
uniform float uAspect;
uniform vec4 uWorldBounds;
uniform vec3 uNearColor;
uniform vec3 uFarColor;
uniform vec3 uHorizonColor;
uniform vec3 uSkyColor;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;
uniform float uLightIntensity;
uniform float uSunPresence;
uniform float uWaveEnergy;
uniform float uDirectionalStrength;
uniform float uReflectionStrength;
uniform float uDawnHandoffFill;
uniform float uDawnHighlightStrength;
uniform float uMagicHour;
uniform float uWaterSurfaceEnabled;
uniform float uBedTextureScale;
uniform float uSurfaceDetailScale;
uniform float uCausticDensity;
uniform float uCausticIrregularity;
uniform float uCausticSoftness;
uniform float uCausticOpacity;
uniform float uCausticChromatic;
uniform float uGlintIntensity;
uniform float uMiddayRayBrightness;
uniform float uMiddayRayDiffusion;
uniform float uPhysicalLightingBlend;
uniform float uBroadReflectionGain;
out vec4 outColor;
${t}

const float IOR_AIR=1.;
const float IOR_WATER=1.333;

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 blend = local * local * (3.0 - 2.0 * local);
  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}

vec3 samplePhysicalEnvironment(vec3 direction) {
  direction = normalize(direction);
  float skyHeight = max(direction.y, 0.0);
  vec3 sky = mix(uHorizonColor, uSkyColor, pow(skyHeight, 0.58));
  float sourceAlignment = max(dot(direction, normalize(uLightDirection)), 0.0);
  float sourceDisk = pow(sourceAlignment, mix(2600.0, 6200.0, uSunPresence));
  float sourceHalo = pow(sourceAlignment, mix(42.0, 130.0, uSunPresence));
  sky += uLightColor * mix(0.22, 1.0, uSunPresence) * max(
    uDirectionalStrength, uReflectionStrength) *
    (sourceDisk * uLightIntensity * 2.2 + sourceHalo * 0.055) *
    uBroadReflectionGain;
  return sky;
}

vec2 worldToState(vec2 world) {
  return (world - uWorldBounds.xy) /
    max(uWorldBounds.zw - uWorldBounds.xy, vec2(0.001));
}

vec2 stateToWorld(vec2 uv) {
  return mix(uWorldBounds.xy, uWorldBounds.zw, uv);
}

void wave(
  inout vec2 gradient,
  vec2 point,
  vec2 direction,
  float amplitude,
  float wavelength,
  float speed,
  float phase,
  float envelope,
  float bend
) {
  float detailScale = max(uSurfaceDetailScale, 1.0);
  amplitude /= detailScale;
  wavelength /= detailScale;
  float frequency = 6.28318530718 / wavelength;
  vec2 lateral = vec2(-direction.y, direction.x);
  float lateralPhase = dot(point, lateral) * frequency * 0.34 - uTime * speed * 0.21 + phase * 1.37;
  float theta = dot(point, direction) * frequency + uTime * speed + phase + sin(lateralPhase) * bend;
  float shaped = sin(theta) + 0.23 * sin(theta * 2.0 + 0.7) + 0.06 * sin(theta * 3.0 + 1.9);
  float derivative = cos(theta) + 0.46 * cos(theta * 2.0 + 0.7) + 0.18 * cos(theta * 3.0 + 1.9);
  vec2 curvedDirection = direction + lateral * cos(lateralPhase) * bend * 0.34;
  float pixelFootprint = fwidth(theta);
  float resolved = 1.0 - smoothstep(0.62, 1.65, pixelFootprint);
  float crestShape = mix(0.82, 1.2, smoothstep(-0.35, 0.96, shaped));
  gradient += curvedDirection * amplitude * frequency * derivative *
    crestShape * envelope * resolved;
}

void spectralWave(
  inout vec2 gradient,
  vec2 point,
  vec2 direction,
  float amplitude,
  float wavelength,
  float speed,
  float phase,
  float envelope
) {
  float detailScale = max(uSurfaceDetailScale, 1.0);
  amplitude /= detailScale;
  wavelength /= detailScale;
  float frequency = 6.28318530718 / wavelength;
  float theta = dot(point, direction) * frequency + uTime * speed + phase;
  float primary = cos(theta);
  float stokes = cos(theta * 2.0 + phase * 0.37);
  float derivative = primary + stokes * 0.34;
  float footprint = fwidth(theta);
  float resolved = 1.0 - smoothstep(0.66, 1.58, footprint);
  float crestBias = mix(0.78, 1.26, smoothstep(-0.72, 0.94, sin(theta)));
  gradient += direction * amplitude * frequency * derivative *
    envelope * crestBias * resolved;
}

vec2 coherentWaveDirection(vec2 direction) {
  float forward = sqrt(
    direction.y * direction.y +
    ${(ro**2).toFixed(4)}
  );
  return normalize(vec2(direction.x, forward));
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 ray = normalize(
    uCameraForward +
    uCameraRight * ndc.x * uTanHalfFov * uAspect +
    uCameraUp * ndc.y * uTanHalfFov
  );
  float distanceToPlane = -uCameraPosition.y / min(ray.y, -0.0001);
  vec3 point = uCameraPosition + ray * distanceToPlane;

  vec2 stateUv = worldToState(point.xz);
  vec2 safeUv = clamp(stateUv, uStateTexel * 1.5, 1.0 - uStateTexel * 1.5);
  float left = readState(texture(uState, safeUv - vec2(uStateTexel.x, 0.0))).x;
  float right = readState(texture(uState, safeUv + vec2(uStateTexel.x, 0.0))).x;
  float down = readState(texture(uState, safeUv - vec2(0.0, uStateTexel.y))).x;
  float up = readState(texture(uState, safeUv + vec2(0.0, uStateTexel.y))).x;
  float downLeft = readState(texture(uState, safeUv - uStateTexel)).x;
  float upRight = readState(texture(uState, safeUv + uStateTexel)).x;
  float downRight = readState(texture(
    uState,
    safeUv + vec2(uStateTexel.x, -uStateTexel.y)
  )).x;
  float upLeft = readState(texture(
    uState,
    safeUv + vec2(-uStateTexel.x, uStateTexel.y)
  )).x;
  float horizontalDistance =
    (uWorldBounds.z - uWorldBounds.x) * uStateTexel.x * 2.0;
  float verticalDistance =
    (uWorldBounds.w - uWorldBounds.y) * uStateTexel.y * 2.0;
  float sobelX = 2.0 * (right - left) +
    upRight + downRight - upLeft - downLeft;
  float sobelY = 2.0 * (up - down) +
    upRight + upLeft - downRight - downLeft;
  vec2 simulationGradient = vec2(
    sobelX / max(horizontalDistance * 4.0, 0.001),
    sobelY / max(verticalDistance * 4.0, 0.001)
  ) * 15.0 * ${n.toFixed(4)};

  vec2 gradient = vec2(0.0);
  vec2 surfacePoint = point.xz;

  vec2 cellCoord = surfacePoint * vec2(0.031, 0.044);
  float cellA = valueNoise(cellCoord + vec2(uTime * 0.0047, -uTime * 0.0031));
  float cellB = valueNoise(
    cellCoord.yx * vec2(1.73, 1.29) + vec2(23.7 - uTime * 0.0063, 7.1 + uTime * 0.0042)
  );
  float cellC = valueNoise(
    surfacePoint * vec2(0.093, 0.071) + vec2(-11.4 + uTime * 0.009, 29.6 - uTime * 0.006)
  );
  float cellD = valueNoise(
    surfacePoint * vec2(0.18, 0.14) + vec2(41.3 - uTime * 0.015, -13.8 + uTime * 0.011)
  );
  vec2 localTurn = vec2(cellB - 0.5, cellA - 0.5);
  float energyField = smoothstep(0.08, 0.92, cellA * 0.47 + cellB * 0.31 + cellC * 0.22);
  float swellEnvelope = mix(0.48, 1.42, energyField);
  float crossEnvelope = mix(0.46, 1.42, smoothstep(0.1, 0.9, cellB * 0.66 + (1.0 - cellC) * 0.34));
  float gustCore = smoothstep(0.48, 0.8, cellC + (cellA - 0.5) * 0.24);
  float gustEnvelope = mix(0.16, 1.66, gustCore);
  vec2 flowWarp = vec2(
    valueNoise(surfacePoint * vec2(0.15, 0.11) + vec2(uTime * 0.012, 17.0)),
    valueNoise(surfacePoint * vec2(0.12, 0.17) + vec2(-31.0, -uTime * 0.009))
  ) - 0.5;
  float warpNoiseA = valueNoise(
    surfacePoint * vec2(0.31, 0.23) + vec2(uTime * 0.021, -uTime * 0.017)
  ) - 0.5;
  float warpNoiseB = valueNoise(
    surfacePoint * vec2(0.21, 0.36) + vec2(-uTime * 0.018, uTime * 0.014)
  ) - 0.5;
  vec2 swellPoint = surfacePoint + flowWarp * 8.7 + localTurn * 3.8 +
    vec2(warpNoiseA, warpNoiseB) * 3.1;
  vec2 windPoint = surfacePoint + flowWarp.yx * 4.2 + localTurn.yx * 2.4 +
    vec2(warpNoiseB, warpNoiseA) * 2.2;
  float farDetail = mix(1.0, 0.55, smoothstep(42.0, 84.0, point.z));
  float waveActivity = smoothstep(0.34, 1.0, uWaveEnergy);
  float turbulence = smoothstep(0.08, 0.92, waveActivity);
  float structuralTurbulence = 0.66;
  float nearWaveContinuity = 1.0 - smoothstep(12.0, 40.0, point.z);
  float quietChopFloor = mix(0.16, 0.38, nearWaveContinuity);
  float chopEnergy = mix(quietChopFloor, 1.0, waveActivity) *
    mix(1.0, 1.13, nearWaveContinuity) + nearWaveContinuity * 0.06;

  vec2 localA = localTurn * mix(0.38, 1.46, structuralTurbulence) +
    vec2(cellD - 0.5, warpNoiseA) * mix(0.2, 0.72, structuralTurbulence);
  vec2 localB = localTurn.yx * mix(0.32, 1.34, structuralTurbulence) +
    vec2(warpNoiseB, cellC - 0.5) * mix(0.22, 0.78, structuralTurbulence);
  float windTurn = mix(-0.06, 0.38, structuralTurbulence) +
    (cellA - 0.5) * mix(0.08, 0.46, structuralTurbulence);
  float crossTurn = mix(0.06, -0.56, structuralTurbulence) +
    (cellB - 0.5) * mix(0.06, 0.4, structuralTurbulence);
  mat2 windRotation = mat2(cos(windTurn), -sin(windTurn), sin(windTurn), cos(windTurn));
  mat2 crossRotation = mat2(cos(crossTurn), -sin(crossTurn), sin(crossTurn), cos(crossTurn));
  float longSwellEnergy = mix(
    ${Ue.longSwell.calm.toFixed(2)},
    ${Ue.longSwell.rough.toFixed(2)},
    turbulence
  );
  float crossSwellEnergy = mix(
    ${Ue.crossSwell.calm.toFixed(2)},
    ${Ue.crossSwell.rough.toFixed(2)},
    turbulence
  );
  float mediumEnergy = mix(
    ${Ue.medium.calm.toFixed(2)},
    ${Ue.medium.rough.toFixed(2)},
    turbulence
  ) * mix(0.74, 1.0, chopEnergy);
  float shortEnergy = chopEnergy * mix(
    ${Ue.short.calm.toFixed(2)},
    ${Ue.short.rough.toFixed(2)},
    turbulence
  );
  float longScale = mix(1.12, 0.76, structuralTurbulence);
  float mediumScale = mix(1.08, 0.78, structuralTurbulence);

  spectralWave(gradient, swellPoint, coherentWaveDirection(vec2(0.12, 0.99) + localA), 0.116, 5.37 * longScale, 0.47, 0.19, swellEnvelope * longSwellEnergy);
  spectralWave(gradient, swellPoint, coherentWaveDirection(crossRotation * vec2(-0.46, 0.89) - localB), 0.098, 4.13 * longScale, 0.61, 2.73, crossEnvelope * crossSwellEnergy);
  spectralWave(gradient, swellPoint + flowWarp * 1.7, coherentWaveDirection(windRotation * vec2(0.62, 0.78) - localA), 0.078, 3.29 * mediumScale, 0.74, 4.91, mix(0.46, 1.32, cellC) * mix(0.42, 0.66, turbulence));
  spectralWave(gradient, windPoint, coherentWaveDirection(windRotation * vec2(-0.73, 0.68) + localB), 0.064, 2.57 * mediumScale, 0.89, 1.37, mix(0.38, 1.36, energyField) * mediumEnergy);
  spectralWave(gradient, windPoint - flowWarp * 1.1, coherentWaveDirection(crossRotation * vec2(0.88, 0.47) + localA), 0.052, 2.03 * mediumScale, 1.07, 5.62, gustEnvelope * mediumEnergy);
  spectralWave(gradient, windPoint, coherentWaveDirection(windRotation * vec2(-0.92, 0.39) - localB), 0.042, 1.61 * mediumScale, 1.28, 3.86, mix(0.3, 1.42, 1.0 - cellB) * mediumEnergy);
  vec2 causticWaveGradient = gradient;
  spectralWave(gradient, windPoint + flowWarp.yx * 1.4, coherentWaveDirection(crossRotation * vec2(0.53, -0.85) + localB), 0.034, 1.27, 1.51, 0.74, gustEnvelope * shortEnergy);
  spectralWave(gradient, windPoint - flowWarp * 1.8, coherentWaveDirection(windRotation * vec2(-0.24, -0.97) - localA), 0.026, 1.01, 1.76, 4.28, mix(0.28, 1.37, cellA) * farDetail * shortEnergy);
  spectralWave(gradient, windPoint, coherentWaveDirection(crossRotation * vec2(0.96, 0.28) - localB), 0.019, 0.79, 2.02, 2.12, gustEnvelope * farDetail * shortEnergy);
  spectralWave(gradient, windPoint + flowWarp * 0.9, coherentWaveDirection(windRotation * vec2(-0.67, -0.74) + localA), 0.0142, 0.63, 2.29, 5.17, mix(0.2, 1.46, 1.0 - cellC) * farDetail * shortEnergy);
  spectralWave(gradient, windPoint - flowWarp.yx * 1.2, coherentWaveDirection(crossRotation * vec2(0.35, -0.94) - localB), 0.0104, 0.51, 2.55, 1.93, gustEnvelope * farDetail * shortEnergy);
  spectralWave(gradient, windPoint, coherentWaveDirection(windRotation * vec2(-0.98, -0.17) + localA), 0.0076, 0.43, 2.83, 3.31, mix(0.24, 1.28, cellB) * farDetail * shortEnergy);

  // Two derivative-noise bands add non-repeating capillary facets. Their
  // anisotropy differs, and a separate stochastic mask prevents the familiar
  // uniform screen-wide grain or pinstripe failure mode.
  vec2 detailSurfacePoint = surfacePoint * uSurfaceDetailScale;
  vec2 microCoordA =
    detailSurfacePoint * vec2(0.96, 1.47) + flowWarp * 4.8 +
    vec2(uTime * 0.056, -uTime * 0.041);
  vec2 microCoordB =
    mat2(0.78, -0.63, 0.63, 0.78) * detailSurfacePoint * vec2(1.52, 0.89) -
    flowWarp.yx * 3.1 + vec2(-uTime * 0.034, uTime * 0.049);
  float microStep = 0.075;
  vec2 microSlopeA = vec2(
    valueNoise(microCoordA + vec2(microStep, 0.0)) - valueNoise(microCoordA - vec2(microStep, 0.0)),
    valueNoise(microCoordA + vec2(0.0, microStep)) - valueNoise(microCoordA - vec2(0.0, microStep))
  ) / (2.0 * microStep);
  vec2 microSlopeB = vec2(
    valueNoise(microCoordB + vec2(microStep, 0.0)) - valueNoise(microCoordB - vec2(microStep, 0.0)),
    valueNoise(microCoordB + vec2(0.0, microStep)) - valueNoise(microCoordB - vec2(0.0, microStep))
  ) / (2.0 * microStep);
  float microFootprintA = max(length(dFdx(microCoordA)), length(dFdy(microCoordA)));
  float microFootprintB = max(length(dFdx(microCoordB)), length(dFdy(microCoordB)));
  float microResolvedA = 1.0 - smoothstep(0.68, 1.42, microFootprintA);
  float microResolvedB = 1.0 - smoothstep(0.68, 1.42, microFootprintB);
  float microMask = mix(0.12, 1.34, smoothstep(0.16, 0.87,
    valueNoise(detailSurfacePoint * vec2(0.24, 0.19) + flowWarp * 1.9)
  ));
  vec2 facetCoord =
    detailSurfacePoint * vec2(0.58, 0.83) + flowWarp * 6.4 +
    vec2(uTime * 0.028, -uTime * 0.022);
  float facetStep = 0.095;
  vec2 facetSlope = vec2(
    valueNoise(facetCoord + vec2(facetStep, 0.0)) - valueNoise(facetCoord - vec2(facetStep, 0.0)),
    valueNoise(facetCoord + vec2(0.0, facetStep)) - valueNoise(facetCoord - vec2(0.0, facetStep))
  ) / (2.0 * facetStep);
  float facetResolved = 1.0 - smoothstep(
    0.72,
    1.56,
    max(length(dFdx(facetCoord)), length(dFdy(facetCoord)))
  );
  gradient += (
    microSlopeA * 0.12 * microResolvedA +
    microSlopeB * 0.074 * microResolvedB
  ) * microMask * farDetail * chopEnergy;
  gradient += facetSlope * 0.31 * facetResolved *
    mix(0.36, 1.18, energyField) * mix(0.38, 1.0, chopEnergy);
  gradient += simulationGradient;

  vec3 normal = normalize(vec3(-gradient.x, 1.0, -gradient.y));
  vec3 viewDirection = normalize(uCameraPosition - point);
  float facing = max(dot(normal, viewDirection), 0.0);
  float fresnel = 0.021 + 0.979 * pow(1.0 - facing, 5.0);
  float physicalF0 = pow((IOR_WATER - IOR_AIR) / (IOR_WATER + IOR_AIR), 2.0);
  float physicalFresnel = physicalF0 + (1.0 - physicalF0) *
    pow(1.0 - facing, 5.0);
  float farAmount = smoothstep(1.0, 65.0, point.z);
  float lightElevation = smoothstep(0.08, 0.68, uLightDirection.y);
  float daylight = uSunPresence;
  float midday = daylight * smoothstep(0.74, 0.88, uLightDirection.y) *
    (1.0 - smoothstep(0.08, 0.5, uLightDirection.z));
  float sunBrightnessEnvelope = daylight * smoothstep(0.24, 0.68, uLightDirection.y);
  float middayBrightnessControl = mix(
    1.0,
    uMiddayRayBrightness,
    sunBrightnessEnvelope
  );
  float brightnessCut = min(middayBrightnessControl, 1.0);
  float brightnessBoost = max(middayBrightnessControl - 1.0, 0.0);
  float softSunControl = brightnessCut * (1.0 + brightnessBoost * 0.08);
  float causticSunControl = brightnessCut * (1.0 + brightnessBoost * 0.22);
  float pointSunControl = brightnessCut * (1.0 + brightnessBoost * 1.28);
  // Turbidity attenuates the focused light before the authored opacity is
  // applied. This keeps the opacity control independent while ensuring it can
  // never reveal crisp caustics through water whose clarity has fallen away.
  float causticClarityTransmission = clamp(uWaterClarity / 28.0, 0.0, 1.0);
  float causticVisibilityControl = uCausticOpacity * causticSunControl *
    causticClarityTransmission;
  float lowSun = daylight * (1.0 - smoothstep(0.2, 0.58, uLightDirection.y));
  float magicHour = uMagicHour;
  float planarLightMagnitude = length(uLightDirection.xz);
  vec2 planarLightDirection = normalize(uLightDirection.xz + vec2(0.00001));
  float planarDirectionalWeight = smoothstep(0.08, 0.72, planarLightMagnitude);
  float grazingLight = smoothstep(0.48, 0.94, planarLightMagnitude);

  vec3 reflection = reflect(-viewDirection, normal);
  vec3 physicalReflectedSky = vec3(0.0);
  if (uPhysicalLightingBlend > 0.0001) {
    physicalReflectedSky = samplePhysicalEnvironment(reflection);
  }
  float litFace = max(dot(normal, uLightDirection), 0.0);
  float reflectedSourceAlignment = max(dot(reflection, uLightDirection), 0.0);
  float reflectedSourceLobe = smoothstep(0.025, 0.76, reflectedSourceAlignment);
  float lightFacingSlope = -dot(gradient, planarLightDirection);
  float slopeSourceLobe = smoothstep(-0.34, 0.7, lightFacingSlope) *
    planarDirectionalWeight;
  float celestialSurfaceLobe = max(
    reflectedSourceLobe,
    slopeSourceLobe * mix(0.42, 0.68, grazingLight)
  );
  float sourceOpticalStrength = clamp(
    max(uDirectionalStrength, uReflectionStrength),
    0.0,
    1.0
  );
  float visibleCelestialSurfaceLobe =
    celestialSurfaceLobe * sourceOpticalStrength;
  float skyAmount = smoothstep(0.12, 0.88, reflection.y);
  vec3 reflectedSky = mix(uHorizonColor, uSkyColor, skyAmount);
  vec3 sourceColoredSky = mix(
    reflectedSky,
    uLightColor,
    visibleCelestialSurfaceLobe * mix(0.12, 0.3, daylight) *
      uBroadReflectionGain
  );
  reflectedSky = mix(
    reflectedSky * mix(0.68, 0.77, daylight),
    sourceColoredSky * mix(0.98, 1.055, daylight),
    visibleCelestialSurfaceLobe
  );
  // Dawn belongs to the existing reflected sky, not to a second procedural
  // pattern drawn over the water. Broadening this normal-driven reflection
  // makes the morning grow continuously while preserving the water's own
  // evolving facets.
  float dawnSkyFacing = smoothstep(0.18, 0.86, skyAmount);
  float dawnReflectionStrength = uDawnHighlightStrength * uDawnHighlightStrength;
  vec3 dawnSkyColor = mix(uHorizonColor, uLightColor, 0.2);
  vec3 waterBase = mix(uNearColor, uFarColor, farAmount * 0.82);
  vec3 physicalWaterBody = mix(uNearColor, uFarColor, farAmount * 0.72);

  float colorField = valueNoise(
    surfacePoint * vec2(0.067, 0.098) + vec2(uTime * 0.009, -uTime * 0.006)
  );
  float facetField = valueNoise(
    surfacePoint * vec2(0.62, 0.48) + vec2(-uTime * 0.035, uTime * 0.024) + gradient * 1.7
  );
  float deepField = valueNoise(
    surfacePoint * vec2(0.025, 0.039) + vec2(31.7 + uTime * 0.002, -19.3 - uTime * 0.003)
  );
  float colorBreakup = smoothstep(
    0.14,
    0.88,
    colorField * 0.46 + facetField * 0.29 + deepField * 0.25
  );
  float openDaylight = daylight * smoothstep(0.24, 0.58, uLightDirection.y);
  float materialDaylight = max(openDaylight, daylight * 0.66);
  vec3 dramaticCoolPool = waterBase * vec3(0.3, 0.55, 0.83);
  vec3 daylightCoolPool = mix(
    waterBase * vec3(0.7, 0.8, 0.9),
    uSkyColor * vec3(0.42, 0.56, 0.64),
    0.16
  );
  vec3 dramaticClearPool = waterBase * vec3(1.14, 1.08, 0.98);
  vec3 daylightClearPool = mix(
    waterBase * vec3(1.04, 1.025, 0.99),
    uHorizonColor * vec3(0.5, 0.61, 0.66),
    0.075
  );
  vec3 coolPool = mix(dramaticCoolPool, daylightCoolPool, materialDaylight);
  vec3 clearPool = mix(dramaticClearPool, daylightClearPool, materialDaylight);
  float continuousColorBreakup = mix(
    colorBreakup,
    smoothstep(0.04, 0.96, colorBreakup),
    materialDaylight
  );
  float orientedClearResponse = mix(
    1.0,
    mix(0.56, 1.0, celestialSurfaceLobe),
    uDirectionalStrength * mix(0.68, 0.9, daylight)
  );
  float orientedColorBreakup = continuousColorBreakup * orientedClearResponse;
  waterBase = mix(coolPool, clearPool, orientedColorBreakup);
  float poolDepth = smoothstep(0.16, 0.87, deepField * 0.62 + (1.0 - facetField) * 0.38);
  vec3 dramaticDepthTone = mix(
    vec3(0.52, 0.68, 0.91),
    vec3(1.06, 1.03, 0.97),
    poolDepth
  );
  vec3 daylightDepthTone = mix(
    vec3(0.78, 0.86, 0.94),
    vec3(1.035, 1.02, 0.985),
    poolDepth
  );
  waterBase *= mix(dramaticDepthTone, daylightDepthTone, materialDaylight);

  float darkFace = smoothstep(0.42, 0.92, litFace);
  // The normal is (-gradient.x, 1, -gradient.y), so the negative projected
  // slope is the face that actually looks toward the source. The old positive
  // sign warmed the opposite side and weakened the sense of lateral light.
  float slopeRelief = smoothstep(-0.48, 0.72, lightFacingSlope);
  float warmFace = smoothstep(-0.16, 0.82, lightFacingSlope) * daylight *
    mix(0.18, 1.0, grazingLight);
  // Full solar relief by day; a gentler but still clearly oriented lunar/sky
  // relief at night. This preserves direction without making a thin crescent
  // illuminate the surface as strongly as the sun.
  float azimuthalFace = mix(
    darkFace,
    slopeRelief,
    planarDirectionalWeight * mix(0.34, 0.86, grazingLight)
  );
  float directionalFace = mix(0.5, azimuthalFace, uDirectionalStrength);
  // Preserve relief without letting daylight-facing normals quantize the
  // surface into black troughs and white crests.
  float directionalShadowFloor = mix(0.48, 0.76, daylight);
  float directionalCrestCeiling = mix(1.16, 1.08, openDaylight);
  waterBase *= mix(directionalShadowFloor, directionalCrestCeiling, directionalFace);
  waterBase = mix(
    waterBase,
    waterBase * mix(0.7, 0.58, magicHour) + uLightColor * mix(0.3, 0.42, magicHour),
    warmFace * mix(0.66, 0.9, magicHour)
  );
  float overheadColorGrade = daylight * smoothstep(
    0.64,
    0.88,
    uLightDirection.y
  );
  float waterLuminance = dot(waterBase, vec3(0.2126, 0.7152, 0.0722));
  vec3 overheadSlate = mix(
    waterBase * vec3(0.42, 0.65, 0.95),
    vec3(waterLuminance) * vec3(0.16, 0.38, 0.72),
    0.44
  ) * 1.02;
  waterBase = mix(waterBase, overheadSlate, overheadColorGrade);
  reflectedSky *= mix(
    vec3(1.0),
    vec3(0.9, 0.985, 1.08),
    overheadColorGrade * 0.76
  );
  float skyReflectionMix = mix(
    0.13 + fresnel * 0.66,
    0.1 + fresnel * 0.5,
    openDaylight
  );
  skyReflectionMix += dawnReflectionStrength * mix(0.008, 0.07, pow(dawnSkyFacing, 2.0));
  skyReflectionMix += overheadColorGrade * 0.08;
  skyReflectionMix *= mix(
    0.76,
    1.08,
    mix(celestialSurfaceLobe, reflectedSourceLobe, 0.72) * uDirectionalStrength
  );
  vec3 color = mix(waterBase, reflectedSky, clamp(skyReflectionMix, 0.0, 0.92));
  float physicalReflectionWeight = clamp(physicalFresnel * mix(
    0.84, 1.22, uReflectionStrength), 0.0, 0.96);
  // At open daylight, a bright environment map can otherwise become a set of
  // enormous white plates at grazing angles. Retain the Fresnel response, but
  // temper only the broad high-luminance sky component away from the actual
  // celestial lobe. The later sharp microfacet/specular passes remain intact.
  float physicalSkyLuminance = dot(
    physicalReflectedSky,
    vec3(0.2126, 0.7152, 0.0722)
  );
  float narrowSourceReflection = smoothstep(
    0.82,
    0.985,
    reflectedSourceAlignment
  ) * sourceOpticalStrength;
  float broadWhiteSky = smoothstep(0.46, 0.82, physicalSkyLuminance) *
    (1.0 - narrowSourceReflection);
  float daylightBroadRestraint = openDaylight *
    (1.0 - lowSun * 0.82) * broadWhiteSky;
  vec3 restrainedPhysicalSky = mix(
    physicalReflectedSky,
    mix(physicalReflectedSky, physicalWaterBody, 0.58),
    daylightBroadRestraint
  );
  vec3 physicalSurfaceColor = mix(physicalWaterBody, restrainedPhysicalSky,
    physicalReflectionWeight);
  float physicalSurfaceTransfer = uPhysicalLightingBlend * mix(0.7, 0.9, daylight);
  color = mix(color, physicalSurfaceColor, physicalSurfaceTransfer);
  // Contrast now comes from both sides of a crest: light-facing facets may
  // carry the narrow highlight, while opposing facets settle toward the
  // lake's deep navy body instead of every ridge being lifted toward white.
  float daylightBackside = openDaylight * planarDirectionalWeight *
    smoothstep(0.02, 0.68, -lightFacingSlope) * (1.0 - lowSun * 0.62);
  vec3 navyBackside = mix(
    physicalWaterBody,
    uFarColor * vec3(0.68, 0.82, 1.08),
    0.64
  );
  color = mix(
    color,
    navyBackside,
    daylightBackside * mix(0.16, 0.26, facetField)
  );
  float dv = mix(
    0.74,
    1.26,
    clamp(facetField * 0.64 + colorField * 0.36, 0.0, 1.0)
  );
  color += dawnSkyColor * dawnReflectionStrength *
    mix(0.02, 0.66, pow(dawnSkyFacing, 2.0)) * mix(0.8, 1.0, farAmount) *
    dv;
  // At the real moon-to-sun source switch, replace the disappearing narrow
  // beam with diffuse sky illumination. This is deliberately directionless:
  // it bridges perceived brightness without creating a second reflection.
  vec3 dawnHandoffColor = mix(uSkyColor, uLightColor, 0.18);
  float dawnHandoffDepth = mix(0.4, 0.84, farAmount);
  // This is only the diffuse remainder needed while the real moon and sun
  // exchange responsibility. Treating it as another full light layer made
  // pre-sunrise brighter than the morning that followed.
  float dawnHandoffLift = uDawnHandoffFill * ${ao};
  color += dawnHandoffColor * dawnHandoffLift * dawnHandoffDepth *
    mix(0.45, 1.24, pow(facetField, 1.6));

  float visualSlope = length(gradient);
  vec2 transmissionSlope = gradient * (0.32 / (1.0 + visualSlope * 0.32));
  vec3 transmissionNormal = normalize(vec3(
    -transmissionSlope.x,
    1.0,
    -transmissionSlope.y
  ));
  transmissionNormal = faceforward(transmissionNormal, ray, transmissionNormal);
  vec3 transmittedRay = refract(ray, transmissionNormal, 1.0 / 1.333);
  float bedDepth = mix(4.6, 7.8, smoothstep(0.0, 68.0, max(point.z, 0.0)));
  float bedTravel = bedDepth / max(-transmittedRay.y, 0.08);
  vec2 bedProjection = (point + transmittedRay * bedTravel).xz;
  mat2 bedRotation = mat2(0.961, -0.276, 0.276, 0.961);
  vec2 bedUv = bedRotation * bedProjection *
    (0.064 * uBedTextureScale * uSurfaceDetailScale) +
    vec2(0.31, 0.17);
  bool sampleLakeBed = uLakeBedReady > 0.5 &&
    (uWaterClarity > 1.1 || uWaterSurfaceEnabled < 0.5);
  float lakeBedSampleWeight = sampleLakeBed ? 1.0 : 0.0;
  vec3 bedSample = vec3(0.34);
  if (sampleLakeBed) bedSample = texture(uLakeBed, bedUv).rgb;
  float bedLuminance = dot(bedSample, vec3(0.2126, 0.7152, 0.0722));
  vec3 waterMidtone = mix(uNearColor, uFarColor, 0.48);
  float midtonePeak = max(
    max(waterMidtone.r, waterMidtone.g),
    max(waterMidtone.b, 0.001)
  );
  vec3 waterTint = waterMidtone / midtonePeak;
  vec3 bedMaterial = mix(
    vec3(bedLuminance),
    bedSample,
    mix(0.16, 0.28, daylight)
  );
  vec3 submergedBed = bedMaterial * mix(vec3(0.72), waterTint, 0.58) +
    waterMidtone * bedLuminance * mix(0.2, 0.34, daylight);
  float transmissionAngle = pow(clamp(1.0 - fresnel, 0.0, 1.0), 1.8);
  float depthAttenuation = exp(-max(point.z, 0.0) * 0.044) *
    mix(1.0, 0.84, smoothstep(4.6, 7.8, bedDepth));
  float surfaceTransmission = mix(1.02, 0.64, waveActivity) *
    mix(1.0, 0.48, smoothstep(0.08, 0.5, visualSlope));
  float interactionTurbidity = smoothstep(
    0.012,
    0.2,
    length(simulationGradient)
  );
  float illuminationTransmission = mix(
    0.68,
    1.0,
    daylight * mix(0.34, 1.0, lightElevation) *
      mix(0.72, 1.0, uDirectionalStrength)
  );
  float localClarity = mix(0.46, 1.0, colorBreakup) *
    surfaceTransmission * mix(1.0, 0.74, interactionTurbidity) *
    illuminationTransmission;
  float rawBedVisibility = lakeBedSampleWeight * uWaterClarity * transmissionAngle *
    depthAttenuation * localClarity * 0.043;
  float bedVisibility = clamp(rawBedVisibility * 0.56, 0.0, 0.7);
  float bedLight = mix(0.014, 0.035, daylight) +
    uDirectionalStrength * mix(0.018, 0.008, daylight) +
    overheadColorGrade * 0.012;
  color = mix(color, submergedBed + uLightColor * bedLuminance * bedLight, bedVisibility);

  // Refract the same long- and medium-wave slopes that shape the visible
  // surface. Caustic intensity is the compression of neighbouring light rays
  // on the bed, so the bright arcs inherit the actual wave curvature instead
  // of coming from an unrelated cellular texture.
  float causticDensity = clamp(uCausticDensity, 0.25, 5.0);
  float causticDetail = smoothstep(0.25, 4.0, causticDensity);
  vec2 physicalCausticSlope = causticWaveGradient +
    facetSlope * mix(0.025, 0.095, causticDetail) * facetResolved +
    microSlopeA * 0.012 * microResolvedA + simulationGradient * 0.28;
  vec3 causticNormal = normalize(vec3(
    -physicalCausticSlope.x,
    1.0,
    -physicalCausticSlope.y
  ));
  vec3 transmittedLight = refract(-uLightDirection, causticNormal, 1.0 / 1.333);
  float causticTravel = bedDepth / max(-transmittedLight.y, 0.12);
  vec2 lightBedProjection = surfacePoint + transmittedLight.xz * causticTravel;
  vec2 surfaceDx = dFdx(surfacePoint);
  vec2 surfaceDy = dFdy(surfacePoint);
  vec2 bedDx = dFdx(lightBedProjection);
  vec2 bedDy = dFdy(lightBedProjection);
  float surfaceArea = abs(surfaceDx.x * surfaceDy.y - surfaceDx.y * surfaceDy.x);
  float focusedArea = abs(bedDx.x * bedDy.y - bedDx.y * bedDy.x);
  float rayCompression = clamp(
    surfaceArea / max(max(focusedArea, surfaceArea * 0.055), 0.00000001),
    0.0,
    12.0
  );
  float focusingRatio = 1.0 + max(rayCompression - 1.0, 0.0) *
    mix(0.78, 1.24, causticDetail);

  float causticIrregularity = clamp(uCausticIrregularity, 0.0, 2.0);
  float focusBreakup = mix(1.0, mix(0.68, 1.24, valueNoise(
    lightBedProjection * vec2(0.17, 0.12) + physicalCausticSlope * 1.8
  )), causticIrregularity * 0.5);
  focusingRatio = 1.0 + (focusingRatio - 1.0) * focusBreakup;
  float causticSoftness = clamp(uCausticSoftness, 0.0, 2.0);
  float coreStart = mix(1.48, 1.1, causticSoftness * 0.5);
  float coreEnd = coreStart + mix(1.7, 0.72, causticSoftness * 0.5);
  float filamentCore = smoothstep(coreStart, coreEnd, focusingRatio);
  float filamentHalo = smoothstep(1.025, coreStart + 0.28, focusingRatio);
  float focusResolved = 1.0 - smoothstep(0.9, 2.4, fwidth(focusingRatio));
  filamentCore *= focusResolved;
  filamentHalo *= mix(0.72, 1.0, focusResolved);

  // Bed-anchored noise only feathers the ray-compression halo. It cannot make
  // a second line, so these smoky whiskers remain attached to the real wave
  // focus rather than becoming doubled coachlines.
  float whiskerNoise = valueNoise(
    lightBedProjection * vec2(0.31, 0.19) +
      vec2(physicalCausticSlope.y, -physicalCausticSlope.x) * 2.7
  );
  float whiskerGrain = valueNoise(
    lightBedProjection * vec2(0.68, 0.43) + physicalCausticSlope * 4.1
  );
  float filamentWhiskers = smoothstep(1.0, coreStart + 0.12, focusingRatio) *
    (1.0 - filamentCore * 0.72) *
    smoothstep(0.3, 0.82, whiskerNoise * 0.72 + whiskerGrain * 0.28) *
    causticIrregularity;

  float chromaticAmount = clamp(uCausticChromatic, 0.0, 3.0);
  float spectralShift = clamp(
    (dFdx(focusingRatio) - dFdy(focusingRatio)) * 0.075 * chromaticAmount,
    -0.46,
    0.46
  );
  vec3 spectralCore = vec3(
    smoothstep(coreStart, coreEnd, focusingRatio + spectralShift),
    filamentCore,
    smoothstep(coreStart, coreEnd, focusingRatio - spectralShift)
  );
  vec3 bedCausticSpectrum = mix(
    vec3(filamentCore),
    spectralCore,
    min(chromaticAmount * 0.18, 0.58)
  ) * 0.64 + vec3(filamentHalo) * 0.27 +
    vec3(0.88, 0.97, 1.04) * filamentWhiskers * 0.18;

  float causticViewDistance = length(bedProjection - uCameraPosition.xz);
  float causticDistanceFade = exp(
    -max(causticViewDistance - 6.0, 0.0) *
      mix(0.06, 0.034, causticClarityTransmission)
  ) * (1.0 - smoothstep(58.0, 82.0, point.z));
  float directCausticLight = daylight *
    smoothstep(0.28, 0.66, uLightDirection.y) * uDirectionalStrength;
  float depthCoherence = exp(-bedDepth * mix(0.038, 0.074, turbulence));
  float turbulenceCoherence = mix(1.0, 0.46, turbulence);
  float daylightCausticVisibility = directCausticLight *
    clamp(rawBedVisibility, 0.0, 1.0) * causticDistanceFade *
    depthCoherence * turbulenceCoherence;
  vec3 daylightCausticColor = mix(
    uLightColor,
    vec3(0.62, 0.88, 0.84),
    0.22
  );
  color += daylightCausticColor * bedCausticSpectrum *
    mix(0.62, 1.04, bedLuminance) * daylightCausticVisibility *
    causticVisibilityControl * uLightIntensity * 0.18;

  vec2 causticPoint = surfacePoint + flowWarp * 0.52;

  // Crest illumination stays separate from the material caustic frame. It is
  // recomputed from the actual surface normal and light vector, so side and
  // rear sources rake across different faces without rotating the pattern.
  float rakingBreakup = mix(0.28, 1.0, smoothstep(
    0.16,
    0.9,
    valueNoise(causticPoint * vec2(0.41, 0.27) +
      vec2(-uTime * 0.024, uTime * 0.017))
  ));
  float rakingFacet = pow(smoothstep(-0.06, 0.82, lightFacingSlope), 1.65) *
    planarDirectionalWeight * uDirectionalStrength *
    mix(0.42, 1.0, facetField) * rakingBreakup;
  float rakingShadow = pow(smoothstep(0.02, 0.78, -lightFacingSlope), 1.5) *
    grazingLight * uDirectionalStrength * mix(0.35, 1.0, 1.0 - facetField);
  color *= 1.0 - rakingShadow * 0.075;
  color += uLightColor * rakingFacet * uLightIntensity *
    mix(0.012, 0.062, grazingLight);

  vec3 halfDirection = normalize(viewDirection + uLightDirection);
  float specularAlignment = max(dot(normal, halfDirection), 0.0);
  float broadExponent = mix(
    mix(62.0, 82.0, daylight),
    mix(24.0, 45.0, daylight),
    waveActivity
  );
  float broadSpecular = pow(specularAlignment, broadExponent);
  float sparkleBrightness = clamp(midday * 0.72 + brightnessBoost * 0.5, 0.0, 1.0);
  float sharpExponent = mix(110.0, 220.0, daylight) *
    mix(1.12, 0.88, waveActivity) * mix(1.0, 1.12, sparkleBrightness) *
    mix(1.0, 0.66, midday);
  float sharpSpecular = pow(specularAlignment, sharpExponent);
  float pathPerspective = pow(farAmount, 0.68);
  float pathSpan = mix(0.245, 0.052, pathPerspective) *
    mix(0.86, 1.12, midday) * mix(1.0, 0.82, lowSun) *
    mix(1.12, 1.0, daylight) * mix(0.72, 1.12, waveActivity);
  // Portrait framing should reveal more of the light path, not inflate it
  // until it replaces the water. Cap the phone-only widening at 18%.
  float portraitDiffusionScale = mix(
    1.18,
    1.0,
    smoothstep(0.48, 0.82, uAspect)
  );
  pathSpan *= portraitDiffusionScale;
  float pathWidthVariation = valueNoise(vec2(
    surfacePoint.y * 0.054 - uTime * 0.009,
    17.4 + uTime * 0.003
  ));
  pathSpan *= mix(0.58, 1.5, smoothstep(0.12, 0.9, pathWidthVariation));
  float pathProjectionDepth = clamp(ndc.y * 0.5 + 0.5, 0.0, 1.0);
  float pathCenterDrift = (
    valueNoise(vec2(surfacePoint.y * 0.031 + uTime * 0.004, 41.8)) - 0.5
  ) * mix(0.018, 0.006, pathProjectionDepth);
  float edgeVariation = mix(0.68, 1.34, valueNoise(
    surfacePoint * vec2(0.082, 0.047) + vec2(-uTime * 0.014, uTime * 0.006)
  ));
  // The diffuse ray and the specular glints must occupy the same directed ray
  // from the camera toward the celestial source. A plane alone is ambiguous:
  // its opposite half mirrors a source behind the camera onto the visible
  // lake, making the morning sun and newly risen full moon repeat the sunset
  // pass. Preserve the physical plane for lateral placement, but reject its
  // backwards half before it can feed any broad beam or bed illumination.
  vec2 surfaceFromCamera = surfacePoint - uCameraPosition.xz;
  vec2 surfaceBearing = normalize(surfaceFromCamera + vec2(0.00001));
  vec2 lightPlaneAcross = vec2(
    -planarLightDirection.y,
    planarLightDirection.x
  );
  float pathForwardAlignment = dot(surfaceBearing, planarLightDirection);
  float directedPathVisibility = smoothstep(
    ${to.toFixed(2)},
    ${io.toFixed(2)},
    pathForwardAlignment
  );
  float pathCoordinate = dot(surfaceBearing, lightPlaneAcross) - pathCenterDrift;
  float pathDistance = abs(pathCoordinate) / max(pathSpan * edgeVariation, 0.001);
  float centerPath = exp(-pow(pathDistance, 2.15)) * directedPathVisibility;
  // Only the setting-sun composition cools the water outside its amber path.
  // Applying this to every low sun erased the directional relief at sunrise,
  // precisely when the west-facing camera puts the solar column offscreen.
  float sunsetOutsidePath = magicHour * (1.0 - centerPath);
  vec3 coolOutsidePath = mix(
    waterBase,
    uSkyColor * vec3(0.46, 0.67, 0.9),
    0.34
  );
  color = mix(color, coolOutsidePath, sunsetOutsidePath * 0.64);
  float farLight = mix(
    mix(0.42, 1.7, farAmount),
    mix(0.88, 1.34, farAmount),
    midday
  );
  vec2 pathNoiseScale = mix(vec2(0.11, 0.075), vec2(0.24, 0.13), daylight);
  float pathBreakup = mix(0.22, 1.48, smoothstep(0.18, 0.88,
    valueNoise(surfacePoint * pathNoiseScale + vec2(-uTime * 0.04, uTime * 0.025))
  ));

  float centerBeamDiffusion = exp(-pow(pathDistance / 2.15, 1.58)) *
    directedPathVisibility;
  float visibleBeamCore = centerPath;
  float visibleBeamDiffusion = centerBeamDiffusion;
  float sourceBehindViewer = 1.0 - smoothstep(-0.82, -0.08, uLightDirection.z);
  float directionalDepth = mix(
    mix(0.58, 1.18, farAmount),
    mix(1.3, 0.48, farAmount),
    sourceBehindViewer
  );
  float orientedRidge = pow(max(
    max(litFace - max(uLightDirection.y, 0.0) * 0.42, 0.0),
    slopeRelief * planarDirectionalWeight * 0.62
  ), 2.25) * mix(0.48, 1.2, facetField);
  float sideSource = smoothstep(
    0.2,
    0.82,
    abs(planarLightDirection.x)
  ) * planarDirectionalWeight;
  float obliqueEdgeLight = sideSource * directionalDepth * pathBreakup *
    (0.035 + orientedRidge * 0.62) * uDirectionalStrength;
  color += uLightColor * obliqueEdgeLight * uLightIntensity *
    mix(0.18, 0.1, daylight);

  float lunarAmount = (1.0 - daylight) * uReflectionStrength;
  float lunarDepth = mix(0.42, 1.16, farAmount);
  float lunarColumn = visibleBeamCore * pathBreakup * lunarDepth * lunarAmount;
  float lunarRidges = visibleBeamCore * orientedRidge *
    mix(0.4, 1.0, pathBreakup) * lunarAmount;
  float lunarDiffusion = visibleBeamDiffusion * lunarDepth * lunarAmount *
    mix(0.48, 1.0, pathBreakup);
  color += uLightColor *
    (lunarColumn * 0.255 + lunarRidges * 0.145 + lunarDiffusion * 0.052) *
    uLightIntensity;

  vec2 sparkleScale = mix(vec2(7.2, 5.9), vec2(18.4, 14.8), daylight);
  float sparkleNoise = valueNoise(surfacePoint * sparkleScale + uTime * vec2(1.7, -1.26));
  float sparkleGateExponent = mix(
    mix(5.2, 2.8, sparkleBrightness),
    mix(3.4, 0.92, sparkleBrightness),
    waveActivity
  );
  float glintAmount = clamp(uGlintIntensity, 0.0, 3.0);
  sparkleGateExponent *= exp2(-(glintAmount - 1.0) * 0.42);
  float sparkleGate = pow(sparkleNoise, sparkleGateExponent);
  float sparkleSignal = sharpSpecular * sparkleGate;
  float sparkleCore = smoothstep(
    mix(0.28, 0.025, sparkleBrightness),
    mix(0.68, 0.16, sparkleBrightness),
    sparkleSignal
  );
  float sparkle = (sharpSpecular * 0.08 +
    sparkleCore * mix(1.5, 2.8, sparkleBrightness)) * glintAmount;
  float specular = (
    broadSpecular * mix(0.075, 0.19, daylight) * softSunControl *
      mix(1.0, 0.44, sparkleBrightness) +
    sparkle * 1.68 * pointSunControl
  ) *
    uLightIntensity * uReflectionStrength *
    (0.015 + centerPath * pathBreakup * mix(1.0, 1.46, magicHour)) * farLight *
    mix(1.0, 1.2, sparkleBrightness);

  // The setting sun warms optically before the broad water palette enters
  // golden hour. Keep that warmth confined to the directional ray: an amber
  // body and a slightly paler glint preserve tonal separation instead of
  // clipping the entire column to monochrome white from roughly 6:40\u20137:15 p.m.
  float rayWarmth = pow(lowSun, 0.82) * daylight;
  vec3 sunRayColor = mix(
    uLightColor,
    vec3(1.0, 0.43, 0.075),
    rayWarmth * mix(0.66, 0.9, pathBreakup)
  );
  vec3 sunGlintColor = mix(
    uLightColor,
    vec3(1.0, 0.67, 0.24),
    rayWarmth * 0.78
  );

  // Low sun still reads as a distinct, geographically moving path rather than
  // tinting the entire surface orange. It narrows toward the source, fans
  // toward the viewer, and breaks across individual facets.
  float lowSunDepth = mix(0.18, 1.42, farAmount);
  float lowSunColumn = centerPath * pathBreakup * lowSunDepth * lowSun;
  color += sunRayColor * lowSunColumn * uLightIntensity * mix(0.31, 0.53, magicHour);

  // At magic hour, isolated light-facing ridges take the gold while adjacent
  // troughs stay cool and deep. A stochastic mask prevents a uniform orange
  // wash and makes the brilliance travel across actual wave topology.
  float magicCrestMask = smoothstep(
    0.28,
    0.93,
    lightFacingSlope * 0.52 + litFace * 0.34 + facetField * 0.22
  );
  float magicBreakup = mix(0.24, 1.0, smoothstep(
    0.18,
    0.9,
    valueNoise(surfacePoint * vec2(0.19, 0.27) + gradient * 3.2 +
      vec2(-uTime * 0.025, uTime * 0.016))
  ));
  float magicPathFalloff = mix(0.22, 1.0, centerPath);
  color += vec3(1.0, 0.53, 0.12) * magicCrestMask * magicBreakup *
    magicPathFalloff * magicHour * uLightIntensity * 0.42;

  float rayBreakup = mix(0.18, 1.0, smoothstep(0.28, 0.86,
    valueNoise(surfacePoint * vec2(0.11, 0.18) + vec2(uTime * 0.018, -uTime * 0.012))
  ));
  float sunlightDepth = mix(
    mix(0.22, 1.0, farAmount),
    mix(0.78, 1.08, farAmount),
    midday
  );
  float solarBeamEnvelope = daylight * uReflectionStrength * uDirectionalStrength *
    mix(0.68, 1.0, max(midday, lowSun));
  float sunlightRay = visibleBeamCore * sunlightDepth * rayBreakup * solarBeamEnvelope;
  float sunlightDiffusion = visibleBeamDiffusion * sunlightDepth *
    mix(0.54, 1.0, rayBreakup) * solarBeamEnvelope;
  float middayDiffusionControl = mix(1.0, uMiddayRayDiffusion, midday);
  float middayGlint = (sharpSpecular * 0.055 + sparkleCore * 2.35) *
    (0.12 + centerPath * 2.72) * pathBreakup * farLight * midday * glintAmount;
  color += sunRayColor *
    (sunlightRay * mix(0.17, 0.07, midday) * softSunControl +
      sunlightDiffusion * mix(0.032, 0.018, midday) * middayDiffusionControl) *
    uLightIntensity;
  color += sunGlintColor * middayGlint * pointSunControl *
    uLightIntensity * 0.42;

  float baselineLight = pow(max(uLightDirection.y, 0.0), 7.0);
  float crestLight = max(pow(litFace, 7.0) - baselineLight * 0.55, 0.0);
  float directionalCrestSheen = pow(smoothstep(
    0.08,
    0.82,
    litFace * 0.62 + slopeSourceLobe * 0.52
  ), mix(2.2, 1.48, grazingLight)) * uDirectionalStrength;
  float crestSheenBreakup = mix(0.28, 1.0, smoothstep(
    0.16,
    0.88,
    valueNoise(causticPoint * vec2(0.36, 0.49) + gradient * 2.4 +
      vec2(uTime * 0.019, -uTime * 0.014))
  ));
  color += sunGlintColor * directionalCrestSheen * crestSheenBreakup *
    uLightIntensity * mix(0.026, 0.075, daylight) *
    mix(0.78, 1.0, celestialSurfaceLobe);
  color += sunGlintColor * crestLight * sourceOpticalStrength *
    uLightIntensity * 0.085 * mix(1.0, 0.58, midday);
  color += sunGlintColor * specular;
  float physicalRoughness = mix(0.11, 0.072, smoothstep(0.22, 1.0, uWaveEnergy));
  float physicalExponent = max(2.0 / max(physicalRoughness *
    physicalRoughness, 0.001) - 2.0, 8.0);
  float physicalSpecular = pow(max(dot(normal, halfDirection), 0.0),
    physicalExponent) * litFace;
  color += uLightColor * physicalSpecular * uLightIntensity *
    mix(0.065, 0.17, daylight) * uGlintIntensity *
    uPhysicalLightingBlend;

  float directBedTravel = (-bedDepth - uCameraPosition.y) / min(ray.y, -0.08);
  vec2 directBedProjection = (uCameraPosition + ray * directBedTravel).xz;
  vec2 directBedUv = bedRotation * directBedProjection *
    (0.064 * uBedTextureScale * uSurfaceDetailScale) + vec2(0.31, 0.17);
  vec3 exposedBedSample = vec3(0.34);
  if (sampleLakeBed) exposedBedSample = texture(uLakeBed, directBedUv).rgb;
  float exposedBedLuminance = dot(
    exposedBedSample,
    vec3(0.2126, 0.7152, 0.0722)
  );
  vec3 exposedBedMaterial = mix(
    vec3(exposedBedLuminance),
    exposedBedSample,
    mix(0.2, 0.42, daylight)
  );
  vec3 exposedBedTint = exposedBedMaterial * mix(
    vec3(0.58),
    waterTint,
    0.72
  );
  exposedBedTint += waterMidtone * exposedBedLuminance *
    mix(0.18, 0.31, daylight);
  float exposedBedDirectLight = max(uLightDirection.y, 0.0) *
    uDirectionalStrength;
  float exposedBedBeam = visibleBeamDiffusion * uReflectionStrength;
  float exposedBedIllumination = mix(0.42, 0.76, daylight) +
    exposedBedDirectLight * 0.24 + exposedBedBeam * 0.13;
  vec3 exposedBed = exposedBedTint * exposedBedIllumination *
    mix(1.0, 0.8, farAmount);
  exposedBed += uLightColor * exposedBedLuminance *
    (exposedBedDirectLight * 0.075 +
      visibleBeamCore * uReflectionStrength * 0.11) *
    uLightIntensity * softSunControl;

  float simulationEdgeDistance = min(min(
    stateUv.x, 1.0 - stateUv.x
  ), min(stateUv.y, 1.0 - stateUv.y));
  float outside = 1.0 - smoothstep(
    -0.035, 0.035, simulationEdgeDistance
  );
  color = mix(color, mix(waterBase, reflectedSky, 0.48), clamp(outside, 0.0, 1.0) * 0.2);

  float horizonVeil = exp(-abs(point.z - 64.0) * 0.035) * centerPath *
    uReflectionStrength;
  color += uLightColor * horizonVeil * uLightIntensity * 0.015;
  color = mix(exposedBed, color, uWaterSurfaceEnabled);
  outColor = vec4(max(color, vec3(0.0)), 1.0);
}`,d=`#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uScene;
uniform float uThreshold;
out vec4 outColor;

void main() {
  vec3 color = texture(uScene, vUv).rgb;
  float peak = max(max(color.r, color.g), color.b);
  float brightness = smoothstep(uThreshold, uThreshold + 0.24, peak);
  vec3 highlight = max(color - vec3(uThreshold * 0.72), vec3(0.0));
  outColor = vec4(highlight * brightness, 1.0);
}`,h=`#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uDirection;
out vec4 outColor;

void main() {
  vec3 color = texture(uTexture, vUv).rgb * 0.227027;
  color += texture(uTexture, vUv + uDirection * 1.384615).rgb * 0.316216;
  color += texture(uTexture, vUv - uDirection * 1.384615).rgb * 0.316216;
  color += texture(uTexture, vUv + uDirection * 3.230769).rgb * 0.070270;
  color += texture(uTexture, vUv - uDirection * 3.230769).rgb * 0.070270;
  outColor = vec4(color, 1.0);
}`,m=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec2 uSceneTexel;
uniform vec3 uLightColor;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uTime;
out vec4 outColor;

void main() {
  vec2 uv = vUv;
  vec3 sceneCenter = texture(uScene, uv).rgb;
  vec3 sceneNeighbors =
    texture(uScene, uv + vec2(uSceneTexel.x, 0.0)).rgb +
    texture(uScene, uv - vec2(uSceneTexel.x, 0.0)).rgb +
    texture(uScene, uv + vec2(0.0, uSceneTexel.y)).rgb +
    texture(uScene, uv - vec2(0.0, uSceneTexel.y)).rgb;
  vec3 scene = max(sceneCenter + (sceneCenter - sceneNeighbors * 0.25) * 0.22, vec3(0.0));
  vec3 bloom = texture(uBloom, uv).rgb;
  vec3 color = scene + bloom * uBloomStrength;
  float vignetteDistance = length((uv - 0.5) * vec2(0.86, 1.0));
  float vignette = 1.0 - smoothstep(0.38, 0.78, vignetteDistance) * 0.23;
  color *= vignette;
  color = vec3(1.0) - exp(-color * uExposure);
  vec3 contrastCurve = color * color * (3.0 - 2.0 * color);
  color = mix(color, contrastCurve, 0.36);
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luminance), color, 1.03);
  outColor = vec4(color, 1.0);
}`;this.programs={simulation:K0(e,Y0,s,this.parallelCompile),brush:K0(e,Y0,c,this.parallelCompile),sweep:K0(e,Y0,l,this.parallelCompile)}}finishProgramCompilation(){var e;if(this.programsReady)return!0;if(this.programCompilationFailed)return!1;let t=(e=this.parallelCompile)==null?void 0:e.COMPLETION_STATUS_KHR;if(!t)return this.programsReady=!0,!0;let i=Object.values(this.programs);if(!i.every(a=>this.gl.getProgramParameter(a,t)))return!1;for(let a of i){if(!this.gl.getProgramParameter(a,this.gl.LINK_STATUS)){let r=(E0.get(a)??[]).map(s=>this.gl.getShaderInfoLog(s)).filter(Boolean).join(`
`),o=this.gl.getProgramInfoLog(a);fa(this.gl,a);let n=new Error(`Water program failed to link: ${o}${r?`
${r}`:""}`);return this.programCompilationFailed=!0,this.stop(),this.canvas.dispatchEvent(new CustomEvent("waterfatal",{detail:n})),!1}fa(this.gl,a)}return this.programsReady=!0,!0}createSimulation(){let e=this.gl;this.simulationSize=this.lowPower?272:this.isMobile?352:448;let t=this.floatTargets?{internalFormat:e.RG16F,format:e.RG,type:e.HALF_FLOAT,filter:e.LINEAR}:{internalFormat:e.RGBA8,format:e.RGBA,type:e.UNSIGNED_BYTE,filter:e.LINEAR};this.simulationTargets=[Ke(e,this.simulationSize,this.simulationSize,t),Ke(e,this.simulationSize,this.simulationSize,t)],this.simulationIndex=0;for(let i of this.simulationTargets){e.bindFramebuffer(e.FRAMEBUFFER,i.framebuffer),e.viewport(0,0,i.width,i.height);let a=this.floatTargets?0:.5;e.clearColor(a,a,0,1),e.clear(e.COLOR_BUFFER_BIT)}}resize(){var e,t;let i=this.gl,s=this.canvas.getBoundingClientRect(),q=localRenderDimensions({width:s.width,height:s.height,dpr:window.devicePixelRatio||1,scale:this.dynamicResolutionScale,mobile:this.isMobile,lowPower:this.lowPower});this.canvasBounds={left:s.left,top:s.top,width:Math.max(s.width,1),height:Math.max(s.height,1)},this.waterDetailScale=go(s.width),this.pixelRatio=q.sceneRatio;let c=q.sceneWidth,l=q.sceneHeight,d=q.outputWidth,h=q.outputHeight;if(this.canvas.width===d&&this.canvas.height===h&&((e=this.sceneTarget)==null?void 0:e.width)===c&&((t=this.sceneTarget)==null?void 0:t.height)===l)return;this.canvas.width!==d&&(this.canvas.width=d),this.canvas.height!==h&&(this.canvas.height=h),this.aspect=s.width/Math.max(s.height,1),l0(i,this.sceneTarget),this.presentTarget&&(this.presentTarget.width!==d||this.presentTarget.height!==h)&&(l0(i,this.presentTarget),this.presentTarget=null),l0(i,this.bloomTargetA),l0(i,this.bloomTargetB),this.sceneTarget=Ke(i,c,l,this.floatTargets?{internalFormat:i.RGBA16F}:{}),this.presentTarget=this.isAndroid?this.presentTarget??Ke(i,d,h):null;let m=this.isMobile||this.lowPower?4:3,v=Math.max(1,Math.ceil(c/m)),f=Math.max(1,Math.ceil(l/m));this.bloomTargetA=Ke(i,v,f),this.bloomTargetB=Ke(i,v,f)}setTimeHours(e,{immediateWaveEnergy:t=!1}={}){let i=(e%24+24)%24;this.timeHours=i,this.physicalLightingBlend=na(i),this.celestial=$e(i),this.palette=da(this.celestial),this.targetWaveEnergy=this.celestial.waveEnergy,t&&(this.waveEnergy=this.targetWaveEnergy)}setWaterClarity(e){let t=C(e,0,100);this.waterClarityPercent=t;let i=t<=20?t/20:1+Math.pow((t-20)/80,1.35)*27;this.waterClarity=i*this.waterClarityScale,this.waterClarity>1.1&&this.loadLakeBedTexture()}setDebugWaterEnabled(e){this.waterSurfaceEnabled=e?1:0}setDebugWaterClarity(e){this.waterClarityScale=C(e,0,100)/100,this.setWaterClarity(this.waterClarityPercent)}setDebugBedTextureScale(e){this.bedTextureScale=C(e,25,300)/100}setDebugCausticDensity(e){this.causticDensity=C(e,25,500)/100}setDebugCausticIrregularity(e){this.causticIrregularity=C(e,0,200)/100}setDebugCausticSoftness(e){this.causticSoftness=C(e,0,200)/100}setDebugCausticOpacity(e){this.causticOpacity=C(e,0,200)/100}setDebugCausticChromatic(e){this.causticChromatic=C(e,0,300)/100}setDebugGlintIntensity(e){this.glintIntensity=C(e,0,300)/100}setDebugMiddayRayBrightness(e){this.middayRayBrightness=C(e,0,300)/100}setDebugMiddayRayDiffusion(e){this.middayRayDiffusion=C(e,0,300)/100}queueImpulse(e,t,i=.7,a=-.04,r=0,o=.82){e<this.world.minX||e>this.world.maxX||t<this.world.minZ||t>this.world.maxZ||(this.brushQueue.push({x:e,z:t,radius:i,strength:a,punctureDepth:r,punctureVelocity:o}),this.wakeSimulation(),this.brushQueue.length>48&&this.brushQueue.splice(0,this.brushQueue.length-48))}queueDelayedImpulse(e,t,i,a,r){let o=performance.now()+r;return this.delayedBrushQueue.push({x:e,z:t,radius:i,strength:a,punctureDepth:0,punctureVelocity:0,readyAt:o}),this.wakeSimulation(),this.delayedBrushQueue.length>48&&this.delayedBrushQueue.splice(0,this.delayedBrushQueue.length-48),o}queueSweep(e,t,i,a,{radius:r=.62,energy:o=.025,carry:n=.24,pointerId:s=0}={}){if(e<this.world.minX&&i<this.world.minX||e>this.world.maxX&&i>this.world.maxX||t<this.world.minZ&&a<this.world.minZ||t>this.world.maxZ&&a>this.world.maxZ)return;let c=C(e,this.world.minX,this.world.maxX),l=C(t,this.world.minZ,this.world.maxZ),u=C(i,this.world.minX,this.world.maxX),d=C(a,this.world.minZ,this.world.maxZ);Math.hypot(u-c,d-l)<1e-4||(this.sweepQueue.push({startX:c,startZ:l,endX:u,endZ:d,radius:r,energy:o,carry:n,pointerId:s}),this.wakeSimulation(),this.sweepQueue.length>64&&this.sweepQueue.splice(0,this.sweepQueue.length-64))}wakeSimulation(e=1e4){this.simulationActiveUntil=Math.max(this.simulationActiveUntil,performance.now()+e)}screenToWorld(e,t){let i=this.canvasBounds??this.canvas.getBoundingClientRect(),a=(e-i.left)/i.width*2-1,r=1-(t-i.top)/i.height*2,o=this.camera,n=s0([o.forward[0]+o.right[0]*a*o.tanHalfFov*this.aspect+o.up[0]*r*o.tanHalfFov,o.forward[1]+o.right[1]*a*o.tanHalfFov*this.aspect+o.up[1]*r*o.tanHalfFov,o.forward[2]+o.right[2]*a*o.tanHalfFov*this.aspect+o.up[2]*r*o.tanHalfFov]);if(n[1]>=-1e-4)return null;let s=-o.position[1]/n[1];return{x:o.position[0]+n[0]*s,y:0,z:o.position[2]+n[2]*s}}rippleArrivalAtBottom(e,t,{holdDurationMs:i=140,leadingRadius:a=null,onsetDelayMs:r=A0}={}){let o=this.screenToWorld(e,t);if(!o||o.x<this.world.minX||o.x>this.world.maxX||o.z<this.world.minZ||o.z>this.world.maxZ)return null;let n=this.canvasBounds??this.canvas.getBoundingClientRect(),s=n.top+n.height,c=this.screenToWorld(n.left,s),l=this.screenToWorld(n.left+n.width,s);if(!c||!l)return null;let u=l.x-c.x,d=l.z-c.z,h=u*u+d*d,m=h>1e-6?C(((o.x-c.x)*u+(o.z-c.z)*d)/h,0,1):0,v={x:c.x+u*m,z:c.z+d*m},f=v.x-o.x,p=v.z-o.z,y=Math.hypot(f,p),g=Math.hypot(f/(this.world.maxX-this.world.minX)*this.simulationSize,p/(this.world.maxZ-this.world.minZ)*this.simulationSize),x=C((t-n.top)/Math.max(n.height,1),0,1),w=Number.isFinite(a)?Math.max(0,a):ua(n.width,x,i).radius,k=g>0?y/g:1/0,F=Number.isFinite(k)?w/Math.max(k,1e-6):0,I=Math.max(0,g-F),U=this.reducedMotion?48:90,M=xo(I,U,r);return this.wakeSimulation(Math.ceil((M+1.25)*1e3)),{delaySeconds:M,clientX:n.left+m*n.width,clientY:s,distanceTexels:I,simulationSteps:Math.ceil(I/er)}}queueRippleArrival(e,t,i,a=null){if(!(!e||typeof i!="function")){if(a!==null){let r=this.rippleArrivalQueue.find(o=>o.key===a);if(r){r.remainingSteps=Math.min(r.remainingSteps,e.simulationSteps),r.readyAt=Math.min(r.readyAt,t);return}}this.rippleArrivalQueue.push({readyAt:t,remainingSteps:e.simulationSteps,callback:i,key:a}),this.rippleArrivalQueue.length>48&&this.rippleArrivalQueue.splice(0,this.rippleArrivalQueue.length-48)}}queueDragArrival(e,t,i,a){let r=this.canvasBounds??this.canvas.getBoundingClientRect(),o=C((i-r.top)/Math.max(r.height,1),0,1),n=dt(o),s=zt(r.width,n),c=R(.46,.23,n)*s.dragRadius*ca,l=this.rippleArrivalAtBottom(t,i,{leadingRadius:c,onsetDelayMs:0});return this.queueRippleArrival(l,performance.now(),a,`drag:${e}`),l}advanceRippleArrivals(e,t=!1){if(!this.rippleArrivalQueue.length)return;let i=0;for(let a of this.rippleArrivalQueue){if(a.readyAt>e){this.rippleArrivalQueue[i++]=a;continue}t&&a.remainingSteps>0&&(a.remainingSteps-=1),a.remainingSteps<=0?a.callback():this.rippleArrivalQueue[i++]=a}this.rippleArrivalQueue.length=i}splashAt(e,t,{strength:i=-.078,holdDurationMs:a=140,onViewerArrival:r=null}={}){let o=this.screenToWorld(e,t);if(!o)return null;let n=this.canvasBounds??this.canvas.getBoundingClientRect(),s=C((t-n.top)/Math.max(n.height,1),0,1),{gentleness:c,interactionProfile:l,pressProfile:u,radius:d}=ua(n.width,s,a),h=i*R(1,.44,c)*l.tapEnergy*u.energyScale,m=.31*R(1,.62,c)*l.punctureDepth*u.depthScale,v=R(.76,.12,c)*l.punctureVelocity*u.velocityScale,f=A0,p=typeof r=="function"?this.rippleArrivalAtBottom(e,t,{holdDurationMs:a}):null;this.queueImpulse(o.x,o.z,d,0,m,v);let y=this.queueDelayedImpulse(o.x,o.z,d,h,f);return this.queueRippleArrival(p,y,r),o}dragThrough(e,t,{deltaMs:i=16,screenDepth:a=.5,pointerId:r=0,strength:o=1}={}){if(!e||!t)return;let n=t.x-e.x,s=t.z-e.z,c=Math.hypot(n,s);if(c<1e-4)return;let l=n/c,u=s/c,d=C(c/Math.max(i/1e3,1/240),0,42),h=dt(C((d-.35)/8.5,0,1)),m=dt(C(a,0,1)),v=this.canvasBounds??this.canvas.getBoundingClientRect(),f=zt(v.width,m),p=R(.46,.23,m)*f.dragRadius,y=p*ca,g=bo(c,p),x=C(o,.5,1.6),w=R(.021,.059,h)*R(1,.74,m)*x*f.dragEnergy*g,k=R(.18,.38,h)*R(1,.82,m)*R(.82,1,x)*f.dragCarry*g;this.queueSweep(e.x,e.z,t.x,t.z,{radius:y,energy:w,carry:k,pointerId:r})}applySweeps(){if(this.sweepQueue.length===0)return;let e=this.gl,t=this.programs.sweep;e.useProgram(t),e.bindVertexArray(this.screenVao),e.uniform1i(b(e,t,"uState"),0),e.uniform4f(b(e,t,"uWorldBounds"),this.world.minX,this.world.minZ,this.world.maxX,this.world.maxZ);let i=this.lastSweepForPointer;i.clear(),this.sweepQueue.forEach((r,o)=>{i.set(r.pointerId,o)});let a=0;for(;a<this.sweepQueue.length;){let r=Math.min(8,this.sweepQueue.length-a),o=this.sweepSegments,n=this.sweepParams;o.fill(0),n.fill(0);for(let l=0;l<r;l+=1){let u=this.sweepQueue[a+l],d=a+l,h=l*4;o[h]=u.startX,o[h+1]=u.startZ,o[h+2]=u.endX,o[h+3]=u.endZ,n[h]=u.radius,n[h+1]=u.energy,n[h+2]=u.carry,n[h+3]=i.get(u.pointerId)===d?1:0}let s=this.simulationTargets[this.simulationIndex],c=this.simulationTargets[1-this.simulationIndex];e.bindFramebuffer(e.FRAMEBUFFER,c.framebuffer),e.viewport(0,0,c.width,c.height),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,s.texture),e.uniform1i(b(e,t,"uSweepCount"),r),e.uniform4fv(b(e,t,"uSweeps[0]"),o),e.uniform4fv(b(e,t,"uSweepParams[0]"),n),e.drawArrays(e.TRIANGLES,0,3),this.simulationIndex=1-this.simulationIndex,a+=r}this.sweepQueue.length=0}applyBrushes(){if(this.delayedBrushQueue.length>0){let a=performance.now(),r=0;for(let o=0;o<this.delayedBrushQueue.length;o+=1){let n=this.delayedBrushQueue[o];n.readyAt<=a?this.brushQueue.push(n):(this.delayedBrushQueue[r]=n,r+=1)}this.delayedBrushQueue.length=r}if(this.brushQueue.length===0)return;let e=this.gl,t=this.programs.brush;e.useProgram(t),e.bindVertexArray(this.screenVao),e.uniform1i(b(e,t,"uState"),0),e.uniform4f(b(e,t,"uWorldBounds"),this.world.minX,this.world.minZ,this.world.maxX,this.world.maxZ);let i=0;for(;i<this.brushQueue.length;){let a=Math.min(8,this.brushQueue.length-i),r=this.brushValues,o=this.brushPunctureDepths,n=this.brushPunctureVelocities;r.fill(0),o.fill(0),n.fill(0);for(let l=0;l<a;l+=1){let u=this.brushQueue[i+l],d=l*4;r[d]=u.x,r[d+1]=u.z,r[d+2]=u.radius,r[d+3]=u.strength,o[l]=u.punctureDepth,n[l]=u.punctureVelocity??0}let s=this.simulationTargets[this.simulationIndex],c=this.simulationTargets[1-this.simulationIndex];e.bindFramebuffer(e.FRAMEBUFFER,c.framebuffer),e.viewport(0,0,c.width,c.height),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,s.texture),e.uniform1i(b(e,t,"uBrushCount"),a),e.uniform4fv(b(e,t,"uBrushes[0]"),r),e.uniform1fv(b(e,t,"uPunctureDepths[0]"),o),e.uniform1fv(b(e,t,"uPunctureVelocities[0]"),n),e.drawArrays(e.TRIANGLES,0,3),this.simulationIndex=1-this.simulationIndex,i+=a}this.brushQueue.length=0}stepSimulation(){let e=this.gl,t=this.programs.simulation,i=this.simulationTargets[this.simulationIndex],a=this.simulationTargets[1-this.simulationIndex];e.bindFramebuffer(e.FRAMEBUFFER,a.framebuffer),e.viewport(0,0,a.width,a.height),e.useProgram(t),e.bindVertexArray(this.screenVao),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,i.texture),e.uniform1i(b(e,t,"uState"),0),e.uniform2f(b(e,t,"uTexel"),1/i.width,1/i.height),e.drawArrays(e.TRIANGLES,0,3),this.simulationIndex=1-this.simulationIndex}setCameraUniforms(e){let t=this.gl,i=this.camera;t.uniform3fv(b(t,e,"uCameraPosition"),i.position),t.uniform3fv(b(t,e,"uCameraForward"),i.forward),t.uniform3fv(b(t,e,"uCameraRight"),i.right),t.uniform3fv(b(t,e,"uCameraUp"),i.up),t.uniform1f(b(t,e,"uTanHalfFov"),i.tanHalfFov),t.uniform1f(b(t,e,"uAspect"),this.aspect)}renderWater(e){let t=this.gl,i=this.programs.water,a=this.palette,r=this.celestial,o=this.simulationTargets[this.simulationIndex],n=r.direction;t.bindFramebuffer(t.FRAMEBUFFER,this.sceneTarget.framebuffer),t.viewport(0,0,this.sceneTarget.width,this.sceneTarget.height),t.disable(t.BLEND),t.useProgram(i),t.bindVertexArray(this.screenVao),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.texture),t.uniform1i(b(t,i,"uState"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.lakeBedTexture),t.uniform1i(b(t,i,"uLakeBed"),1),t.uniform1f(b(t,i,"uLakeBedReady"),this.lakeBedReady?1:0),t.uniform1f(b(t,i,"uWaterClarity"),this.waterClarity),t.uniform2f(b(t,i,"uStateTexel"),1/o.width,1/o.height),t.uniform1f(b(t,i,"uTime"),e*(this.reducedMotion?.28:1)),t.uniform4f(b(t,i,"uWorldBounds"),this.world.minX,this.world.minZ,this.world.maxX,this.world.maxZ),t.uniform3fv(b(t,i,"uNearColor"),a.near),t.uniform3fv(b(t,i,"uFarColor"),a.far),t.uniform3fv(b(t,i,"uHorizonColor"),a.horizon),t.uniform3fv(b(t,i,"uSkyColor"),a.sky),t.uniform3fv(b(t,i,"uLightColor"),a.light),t.uniform3fv(b(t,i,"uLightDirection"),n),t.uniform1f(b(t,i,"uLightIntensity"),a.intensity*r.intensity),t.uniform1f(b(t,i,"uSunPresence"),r.sunPresence),t.uniform1f(b(t,i,"uWaveEnergy"),this.waveEnergy),t.uniform1f(b(t,i,"uDirectionalStrength"),r.directionalStrength),t.uniform1f(b(t,i,"uReflectionStrength"),r.reflectionStrength),t.uniform1f(b(t,i,"uDawnHandoffFill"),r.dawnHandoffFill),t.uniform1f(b(t,i,"uDawnHighlightStrength"),r.dawnHighlightStrength),t.uniform1f(b(t,i,"uMagicHour"),r.magicHour),t.uniform1f(b(t,i,"uWaterSurfaceEnabled"),this.waterSurfaceEnabled),t.uniform1f(b(t,i,"uBedTextureScale"),this.bedTextureScale),t.uniform1f(b(t,i,"uSurfaceDetailScale"),this.waterDetailScale),t.uniform1f(b(t,i,"uCausticDensity"),this.causticDensity),t.uniform1f(b(t,i,"uCausticIrregularity"),this.causticIrregularity),t.uniform1f(b(t,i,"uCausticSoftness"),this.causticSoftness),t.uniform1f(b(t,i,"uCausticOpacity"),this.causticOpacity),t.uniform1f(b(t,i,"uCausticChromatic"),this.causticChromatic),t.uniform1f(b(t,i,"uGlintIntensity"),this.glintIntensity),t.uniform1f(b(t,i,"uMiddayRayBrightness"),this.middayRayBrightness),t.uniform1f(b(t,i,"uMiddayRayDiffusion"),this.middayRayDiffusion),t.uniform1f(b(t,i,"uPhysicalLightingBlend"),this.physicalLightingBlend),t.uniform1f(b(t,i,"uBroadReflectionGain"),a.broadReflectionGain),this.setCameraUniforms(i),t.drawArrays(t.TRIANGLES,0,3)}renderPostProcessing(e){var t;let i=this.gl,a=this.programs.bright,r=this.programs.blur,o=this.programs.composite;i.bindVertexArray(this.screenVao),i.bindFramebuffer(i.FRAMEBUFFER,this.bloomTargetA.framebuffer),i.viewport(0,0,this.bloomTargetA.width,this.bloomTargetA.height),i.useProgram(a),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.sceneTarget.texture),i.uniform1i(b(i,a,"uScene"),0),i.uniform1f(b(i,a,"uThreshold"),this.palette.threshold),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.bloomTargetB.framebuffer),i.viewport(0,0,this.bloomTargetB.width,this.bloomTargetB.height),i.useProgram(r),i.bindTexture(i.TEXTURE_2D,this.bloomTargetA.texture),i.uniform1i(b(i,r,"uTexture"),0),i.uniform2f(b(i,r,"uDirection"),1/this.bloomTargetA.width,0),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.bloomTargetA.framebuffer),i.bindTexture(i.TEXTURE_2D,this.bloomTargetB.texture),i.uniform2f(b(i,r,"uDirection"),0,1/this.bloomTargetA.height),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,((t=this.presentTarget)==null?void 0:t.framebuffer)??null),i.viewport(0,0,this.canvas.width,this.canvas.height),i.useProgram(o),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.sceneTarget.texture),i.uniform1i(b(i,o,"uScene"),0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,this.bloomTargetA.texture),i.uniform1i(b(i,o,"uBloom"),1),i.uniform2f(b(i,o,"uSceneTexel"),1/this.sceneTarget.width,1/this.sceneTarget.height),i.uniform3fv(b(i,o,"uLightColor"),this.palette.light),i.uniform1f(b(i,o,"uBloomStrength"),this.waterSurfaceEnabled?this.palette.bloom*.4:0),i.uniform1f(b(i,o,"uExposure"),this.waterSurfaceEnabled?this.palette.exposure:1),i.uniform1f(b(i,o,"uTime"),e),i.drawArrays(i.TRIANGLES,0,3),this.presentTarget&&(i.bindFramebuffer(i.READ_FRAMEBUFFER,this.presentTarget.framebuffer),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.blitFramebuffer(0,0,this.presentTarget.width,this.presentTarget.height,0,0,this.canvas.width,this.canvas.height,i.COLOR_BUFFER_BIT,i.NEAREST)),i.bindFramebuffer(i.FRAMEBUFFER,null),this.isAndroid&&i.flush()}render=e=>{if(!this.running||(this.frameHandle=requestAnimationFrame(this.render),!this.finishProgramCompilation())||!this.frameGovernor.shouldRender(e))return;if(this.lastPresentedAt>0){let a=e-this.lastPresentedAt,r=this.frameGovernor.estimatedRefreshRate/Math.max(this.frameGovernor.frameDivisor,1),o=1e3/Math.max(r,1),n=this.frameTimePressure.record(a,o,this.dynamicResolutionScale,this.minimumDynamicResolutionScale);n!==null&&n!==this.dynamicResolutionScale&&(this.dynamicResolutionScale=n,this.resize())}this.lastPresentedAt=e;let t=e-this.lastFrame,i=Math.min(t/1e3,.05);if(this.lastFrame=e,this.waveEnergy=vo(this.waveEnergy,this.targetWaveEnergy,i),this.ambientWaveTime+=i*po(this.waveEnergy),e<this.simulationActiveUntil||this.brushQueue.length>0||this.delayedBrushQueue.length>0||this.sweepQueue.length>0||this.rippleArrivalQueue.length>0){this.simAccumulator+=i,this.applyBrushes(),this.applySweeps(),this.advanceRippleArrivals(e,!1);let a=this.reducedMotion?1/48:1/90,r=0;for(;this.simAccumulator>=a&&r<4;)this.stepSimulation(),this.advanceRippleArrivals(e,!0),this.simAccumulator-=a,r+=1}else this.simAccumulator=0;this.renderWater(this.ambientWaveTime),this.renderPostProcessing(e/1e3),this.hasPresented||(this.hasPresented=!0,this.canvas.dispatchEvent(new CustomEvent("waterready")))};start(){this.running||(this.running=!0,this.lastFrame=performance.now(),this.lastPresentedAt=0,this.frameGovernor.reset(),this.frameTimePressure.reset(),this.frameHandle=requestAnimationFrame(this.render))}stop(){this.running=!1,cancelAnimationFrame(this.frameHandle)}setVisible(e){e?this.start():this.stop()}},ki=`
uniform sampler2D uSkyMap,uCloudShadow,uShadowMap;
uniform mat4 uShadowMatrix;
uniform float uShadowTexel,uWorldReady;
vec3 unpackLight(vec3 x){x*=x;return x/max(1.-x,vec3(.0001));}
// Concentrate angular resolution in the visible hemisphere instead of wasting
// half the atlas on below-ground rays and most columns behind the camera.
vec2 skyUV(vec3 d){float a=atan(d.x,d.z);return vec2(.5+atan(3.*tan(a*.5))/3.14159265359,pow(asin(clamp(d.y,0.,1.))/1.57079632679,.70));}
vec4 sampleSky(vec3 d,float lod){vec4 s=textureLod(uSkyMap,skyUV(normalize(d)),lod+step(.5,lod)*(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.));return vec4(unpackLight(s.rgb),s.a);}
uniform vec3 uShadowLightDirection;
float cloudShadow(vec3 p){
 vec2 ground=p.xz-uShadowLightDirection.xz*p.y/max(uShadowLightDirection.y,.01);
 return textureLod(uCloudShadow,ground/6400.+.5,0.).r;
}
float objectShadow(vec3 p,vec3 n){return 1.;}
float worldVisibility(vec3 p,vec3 n){return cloudShadow(p)*objectShadow(p,n);}
`,$7=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec3 vWorld,vNormal;in vec2 vUV;in float vAO,vVariation;
out vec4 outColor;
uniform sampler2D uRockColor,uRockNormal,uGroundColor,uGroundNormal,uBarkColor,uBarkNormal;
uniform sampler2D uDetailColor,uDetailNormal;
uniform highp int uMaterial,uEnvironmentKind;
uniform vec3 uEye,uSourceDirection,uSourceColor;
uniform float uSourcePower,uDaylight,uNight,uClipWater;
${ki}
vec3 linearColor(vec3 c){return pow(c,vec3(2.2));}
vec4 triplanar(sampler2D map,vec3 p,vec3 n,float size){
 vec3 w=pow(abs(n),vec3(5.));w/=max(dot(w,vec3(1)),.0001);
 return texture(map,p.yz/size)*w.x+texture(map,p.xz/size)*w.y+texture(map,p.xy/size)*w.z;
}
vec3 detailNormal(sampler2D map,vec3 p,vec3 n,float size,float strength){
 vec3 w=pow(abs(n),vec3(5.));w/=max(dot(w,vec3(1)),.0001);
 vec3 a=texture(map,p.yz/size).xyz*2.-1.,b=texture(map,p.xz/size).xyz*2.-1.,c=texture(map,p.xy/size).xyz*2.-1.;
 // Project tangent slopes into each plane; keep the geometric normal as the
 // common reference so the three normal maps never flatten opposing faces.
 vec3 perturb=vec3(0,a.x,a.y)*w.x+vec3(b.x,0,b.y)*w.y+vec3(c.x,c.y,0)*w.z;
 return normalize(n+perturb*strength);
}
vec3 scannedLayers(sampler2D map,vec3 p,vec3 n,float fineScale,float broadScale){
 vec3 fine=linearColor(triplanar(map,p,n,fineScale).rgb);
 vec3 broad=linearColor(triplanar(map,p+vec3(73,19,-41),n,broadScale).rgb);
 vec3 middle=linearColor(triplanar(map,p+vec3(-17,53,29),n,sqrt(fineScale*broadScale)).rgb);
 // The same photographic surface spans three real scales. At long viewing
 // distances, weathering and erosion remain visible after grain is filtered.
 return fine*.44+middle*.22+broad*.34;
}
vec3 mappedNormal(vec3 n,vec3 map){
 vec3 q1=dFdx(vWorld),q2=dFdy(vWorld);vec2 st1=dFdx(vUV),st2=dFdy(vUV);
 vec3 p1=cross(q2,n),p2=cross(n,q1);vec3 T=p1*st1.x+p2*st2.x,B=p1*st1.y+p2*st2.y;
 float scale=inversesqrt(max(max(dot(T,T),dot(B,B)),.000001));
 return normalize(mat3(T*scale,B*scale,n)*(map*2.-1.));
}
void main(){
 if(uClipWater>.5&&vWorld.y<-.015)discard;
 vec3 n=normalize(vNormal);if(dot(n,uEye-vWorld)<0.)n=-n;
 vec3 base;float roughness=.86,leaf=0.,coverage=1.;
 if(uMaterial>=5){
   vec4 detail=texture(uDetailColor,vUV),normal=texture(uDetailNormal,vUV);
   if(uMaterial==7||uMaterial==9){
     coverage=clamp((detail.a-.35)/max(fwidth(detail.a),.025)+.5,0.,1.);
     if(coverage<.01)discard;leaf=1.;
   }
   base=linearColor(detail.rgb);roughness=normal.a;n=mappedNormal(n,normal.rgb);
   if(uMaterial==5){float wet=1.-smoothstep(.05,1.,vWorld.y);base*=1.-wet*.35;roughness=mix(roughness,.38,wet);}
 }else if(uMaterial==2){
   vec4 bark=texture(uBarkColor,vUV),bn=texture(uBarkNormal,vUV);
   vec3 weathering=linearColor(texture(uBarkColor,vUV*.173+vec2(vVariation*7.1,.37)).rgb);
   base=mix(linearColor(bark.rgb),weathering,.24)*vec3(1.05,.96,.88);
   n=mappedNormal(n,bn.rgb);roughness=bn.a;
 }else if(uMaterial==3){
   float midrib=1.-abs(vUV.x*2.-1.);
   base=mix(vec3(.018,.041,.007),vec3(.055,.10,.015),midrib)*mix(.72,1.24,vVariation);
   roughness=.52;leaf=1.;
 }else if(uMaterial==4){
   base=vec3(.032,.091,.016)*mix(.72,1.3,vVariation);leaf=1.;
 }else{
   vec3 geometric=n;
   bool fjord=uEnvironmentKind==2;
   float rockScale=2.05,groundScale=fjord?15.:2.;
   vec3 cliffPoint=vWorld*vec3(1.,.48,1.);
   vec3 rock=scannedLayers(uRockColor,cliffPoint,n,rockScale,fjord?76.:11.);
   vec3 ground=scannedLayers(uGroundColor,vWorld,n,groundScale,fjord?170.:9.);
   float soil=triplanar(uGroundColor,vWorld+vec3(51,0,-29),n,fjord?42.:3.7).g;
   float turf=smoothstep(.34+soil*.16,.72+soil*.12,n.y);
   if(fjord)turf*=smoothstep(.2,4.,vWorld.y);
   base=mix(rock,ground,turf);
   vec4 rockN=triplanar(uRockNormal,cliffPoint,geometric,rockScale);
   vec4 groundN=triplanar(uGroundNormal,vWorld,geometric,groundScale);
   roughness=mix(rockN.a,groundN.a,turf);
   n=detailNormal(uRockNormal,cliffPoint,n,fjord?27.:5.5,.95*(1.-turf));
   n=detailNormal(uRockNormal,cliffPoint,n,rockScale,.72*(1.-turf));
   n=detailNormal(uGroundNormal,vWorld,n,groundScale,.68*turf);
   float wet=1.-smoothstep(.03,.95,vWorld.y);
   base*=1.-wet*.38;roughness=mix(roughness,.27,wet);
 }
 roughness=clamp(roughness,.19,.97);

 vec3 v=normalize(uEye-vWorld),l=normalize(uSourceDirection),h=normalize(v+l);
 float nl=max(dot(n,l),0.),nv=max(dot(n,v),.02);
 float visibility=worldVisibility(vWorld,n);
 vec3 ambient=sampleSky(normalize(vec3(n.x*.55,abs(n.y)*.45+.55,n.z*.55)),5.).rgb;
 ambient*=.48*mix(.5,1.,max(n.y,0.))*vAO;
 if(uEnvironmentKind==0&&uMaterial==0)ambient*=.60;
 if(uEnvironmentKind==2)ambient*=1.18;
 // Leaf transmission scatters warm sunlight through the thin needle tissue.
 float through=pow(max(dot(-v,l),0.),3.)*.9+max(dot(-n,l),0.)*.32;
 vec3 light=uSourceColor*uSourcePower*visibility;
 float a=roughness*roughness,a2=a*a,nh=max(dot(n,h),0.);
 float d=a2/(3.14159*pow(nh*nh*(a2-1.)+1.,2.));
 float f=.035+.965*pow(1.-max(dot(v,h),0.),5.);
 float k=pow(roughness+1.,2.)/8.;float g=nv/(nv*(1.-k)+k)*nl/(nl*(1.-k)+k);
 vec3 color=base*(ambient+light*(nl/3.14159+leaf*through*.4))+light*d*f*g/max(4.*nv,.01);
 float distance=length(vWorld-uEye);
 float extinction=uEnvironmentKind==2?.000028:.00019;
 vec3 air=sampleSky(normalize(vWorld-uEye),4.).rgb;
 color=mix(air,color,exp(-distance*extinction));
 outColor=vec4(sqrt(max(color,vec3(0.))/(1.+max(color,vec3(0.)))),coverage);
}`,tr=`
uniform sampler2D uMilkyWay,uMoonAlbedo;
uniform sampler2D uWorldColor,uWorldDepth,uReflectionColor,uReflectionDepth;
uniform mat4 uReflectionMatrix;
uniform float uReflectionAlphaFloor;
uniform sampler2D uTerrainHorizon;
uniform float uTerrainHorizonReady;
uniform float uNightSkyReady,uSkyPixelAngle,uAltStellarPhase;
uniform float uAltEnvironmentKind,uAltEnvironmentTime,uAltSunset,uAltMoonPhase,uAltSourceIsSun,uAltSunRadius;
uniform vec3 uAltSunDirection,uAltMoonDirection;
uniform vec2 uTerrainSourceVisibility;
${ki}
#define VALLEY_CACHED_SKY
// Shared eye-to-surface transport, in the renderer's metre coordinates.
// Terrain, reflected terrain and the non-reflected water component use this
// exact function. No screen-side masks or separate twilight color curves.
uniform sampler2D uValleyAtmosphere;
precision highp sampler3D;
uniform sampler3D uValleyNoise;
uniform float uMistTime,uMistSolar,uMistStrength;
uniform vec2 uMistWind;
float mistErf(float x){
 float a=abs(x),t=1./(1.+.3275911*a);
 return sign(x)*(1.-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*exp(-a*a));
}
float mistBand(vec2 heights,float centre,float width){
 vec2 h=(heights-centre)/width;
 float delta=h.y-h.x;
 if(abs(delta)<.02)return exp(-pow((h.x+h.y)*.5,2.));
 return max(0.,.886226925*(mistErf(h.y)-mistErf(h.x))/delta);
}
float valleyMistDensity(vec3 point,vec2 heights){
 // Fold the mirrored camera path at the water plane: reflected banks and
 // sky see the same moving volume as the direct view, never a flat overlay.
 vec3 p=vec3(point.x,abs(point.y),point.z);
 // The right shore begins only ~140 m away. Starting fog at 80\u2013320 m
 // left it outside most of the volume while the kilometre-distant left
 // shore received the full layer. Bring the same volume across both banks.
 float range=smoothstep(60.,110.,p.z)*(1.-smoothstep(6200.,9000.,p.z));
 if(range<.001||p.y>650.)return 0.;
 vec3 drift=vec3(uMistWind.x*.12+uMistTime*.60,0.,uMistWind.y*.12+uMistTime*.32);
 vec3 q=p-drift;
 float broad=textureLod(uValleyNoise,q/vec3(1100.,210.,850.),1.).r;
 float fine=textureLod(uValleyNoise,q/vec3(380.,105.,280.)+vec3(.31,.19,.73),1.).g;
 float filament=smoothstep(.24,.69,broad*.62+fine*.38);
 float lowCentre=42.+23.*sin(p.z*.003+p.x*.0016+uMistTime*.007);
 // Integrate the thin height profile analytically within each ray segment.
 // A point-sampled layer otherwise becomes disconnected stripes on slopes.
 float low=mistBand(heights,lowCentre,55.);
 float highCentre=190.+60.*sin(p.z*.0017-p.x*.002+uMistTime*.005);
 float high=mistBand(heights,highCentre,105.);
 // Pockets dissolve as they advect. The scene-hour envelope supplies the
 // morning build-up and complete afternoon dissipation independently.
 float life=.38+.62*pow(.5+.5*sin(uMistTime*.038+p.z*.0021+p.x*.0013),2.);
 float warmth=mix(1.,.50,smoothstep(10.,55.,uMistSolar));
 // A thin continuous carrier joins the advected wisps. A shallow foreground
 // bank has enough local density to be visible on near faces, tapering into
 // the distant valley instead of making its long paths uniformly opaque.
 float foreground=1.-smoothstep(180.,650.,p.z);
 float structure=.05+life*filament;
 return range*warmth*structure*(low*mix(.00065,.0044,foreground)
   +high*mix(.0004,.0008,foreground))*uMistStrength;
}
float valleyMistDepth(vec3 eye,vec3 point,float kind){
 if(kind<1.5||kind>2.5||uMistStrength<=0.)return 0.;
 vec3 delta=point-eye;
 float distance=min(length(delta),8500.);
 vec3 direction=normalize(delta+vec3(0.,0.,.000001));
 // Intersect the occupied valley first. Near water and sky rays that miss
 // it need no marching; mirrored paths use the same symmetric height slab.
 float start=0.;
 vec2 origin=eye.zy,ray=direction.zy,lower=vec2(60.,-650.),upper=vec2(9000.,650.);
 for(int axis=0;axis<2;axis++){
   if(abs(ray[axis])<.000001){
     if(origin[axis]<lower[axis]||origin[axis]>upper[axis])return 0.;
   }else{
     float a=(lower[axis]-origin[axis])/ray[axis],b=(upper[axis]-origin[axis])/ray[axis];
     start=max(start,min(a,b));distance=min(distance,max(a,b));
   }
 }
 if(distance-start<.01)return 0.;
 eye+=direction*start;distance-=start;
 float optical=0.;
 for(int i=0;i<16;i++){
   float a=pow(float(i)/16.,1.5),b=pow(float(i+1)/16.,1.5);
   vec2 heights=abs(eye.y+direction.y*vec2(a,b)*distance);
   optical+=valleyMistDensity(eye+direction*(a+b)*.5*distance,heights)*(b-a)*distance;
 }
 return optical;
}
vec2 valleyAirUV(vec3 direction){
  vec3 d=normalize(vec3(direction.x,max(direction.y,length(direction)*.028),direction.z));
  float a=atan(d.x,d.z);
  return vec2(.5+atan(3.*tan(a*.5))/3.14159265359,
    pow(asin(clamp(d.y,0.,1.))/1.57079632679,.70));
}
vec3 valleyDecode(vec3 value){
  value*=value;
  return value/max(vec3(.0001),1.-value);
}
float valleyTransmission(vec3 eye,vec3 point,float kind){
  float lake=1.-step(.5,kind),disola=step(2.5,kind);
  float scaleHeight=mix(1500.,950.,lake);
  float startHeight=abs(eye.y),endHeight=max(0.,point.y);
  float delta=(endHeight-startHeight)/scaleHeight;
  float density=exp(-startHeight/scaleHeight)*(abs(delta)<.001
    ?1.-delta*.5:(1.-exp(-delta))/delta);
  // Reference photographs already contain some atmospheric attenuation.
  // Keep the additional local-valley transport clear and continuous.
  float extinction=mix(mix(.000065,.000085,lake),.000014,disola);
  return exp(-length(point-eye)*density*extinction-valleyMistDepth(eye,point,kind));
}
vec3 valleyAirlight(vec3 direction,float night,float moon,float kind){
  vec2 uv=valleyAirUV(direction);
  vec3 clear=valleyDecode(textureLod(uValleyAtmosphere,uv,0.).rgb);
  float mist=(kind>1.5&&kind<2.5)?clamp(uMistStrength/.85,0.,1.):0.;
  // Clear Fjords uses the same bounded sky radiance as Disola and Lakeside.
  // Its brighter, cooler upper-hemisphere fill belongs only to actual mist;
  // retaining that fill all evening made distant rock look independently lit.
  // Interpolate the existing lookup as the mist evaporates, with no branch at
  // 2 p.m., extra texture fetch, or separate water/reflection treatment.
  vec2 diffuseUV=uv;
  if(mist>0.){
    vec3 upper=vec3(direction.x,max(abs(direction.y),length(direction.xz)*.65),direction.z);
    diffuseUV=mix(uv,valleyAirUV(upper),mist);
  }
  vec4 sky=textureLod(uSkyMap,diffuseUV,mix(8.,5.,mist)+(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.));
  vec3 air=mix(clear,valleyDecode(sky.rgb),mix(.60,1.-.08*sky.a,mist))*mix(.40,.72,mist);
  float luminance=dot(air,vec3(.2126,.7152,.0722));
  air=mix(air,mix(air,vec3(luminance),.35)*vec3(.82,.98,1.15),mist*.70);
  // Bound radiance without changing hue or flattening terrain contrast.
  float energyLimit=mix(.24,.70,mist);
  air*=energyLimit/(energyLimit+dot(air,vec3(.2126,.7152,.0722)));
  return air+vec3(.0015,.0023,.0038)*night*moon;
}
#ifdef VALLEY_CACHED_SKY
uniform sampler2D uValleyMistCache;
uniform float uValleyMistReady;
#endif
vec3 valleyMistSky(vec3 sky,vec3 eye,vec3 direction,float kind,float night,float moon){
#ifdef VALLEY_CACHED_SKY
 if(kind<1.5||kind>2.5||uValleyMistReady<.5)return sky;
 vec3 d=normalize(direction);
 float phi=atan(d.x,d.z),elevation=asin(clamp(d.y,-1.,1.));
 vec2 uv=vec2(.5+atan(3.*tan(phi*.5))/3.14159265359,
   .5+.5*sign(elevation)*sqrt(abs(elevation)/1.57079632679));
 vec2 cached=textureLod(uValleyMistCache,uv,0.).rg;
 float transmission=eye.y<0.?cached.g:cached.r;
#else
 float transmission=exp(-valleyMistDepth(eye,eye+direction*8500.,kind));
#endif
 return sky*transmission+valleyAirlight(direction,night,moon,kind)*(1.-transmission);
}

float linearDepth(float depth){return 2.*.12*14000./(14000.+.12-(depth*2.-1.)*(14000.-.12));}
float terrainSkyVisibility(vec3 d,float footprint){
 if(uTerrainHorizonReady<.5)return 1.;
 float coordinate=(atan(d.x,d.z)/TAU+.5)*2047.;
 int i=int(clamp(floor(coordinate),0.,2046.));
 float edge=mix(texelFetch(uTerrainHorizon,ivec2(i,0),0).r,texelFetch(uTerrainHorizon,ivec2(i+1,0),0).r,fract(coordinate));
 return smoothstep(edge-footprint,edge+footprint,asin(clamp(d.y,-1.,1.)));
}
float sourceVisibility(vec3 d){return sampleSky(d,0.).a*smoothstep(-.004,.009,d.y);}
float sunScreenVisibility(vec3 source){
 float front=dot(source,uCameraForward);if(front<=0.)return 0.;
 vec2 uv=vec2(dot(source,uCameraRight)/(uTanHalfFov*uAspect),dot(source,uCameraUp)/uTanHalfFov)/front*.5+.5;
 if(any(lessThan(uv,vec2(0)))||any(greaterThan(uv,vec2(1))))return 0.;
 float sum=0.;for(int i=0;i<7;i++){float a=float(i)*2.39996;vec2 offset=vec2(cos(a),sin(a))*.0035;sum+=step(.9999999,texture(uWorldDepth,uv+offset).r);}
 return sum/7.;
}
vec3 celestialRadiance(vec3 d,float footprint){
 // Derivatives in a terrain/sky branch are undefined across silhouette quads.
 // The caller supplies a finite angular footprint computed before branching.
 float aa=clamp(footprint,.00018,.035);
 float angle=length(d-uAltSunDirection);
 float low=1.-smoothstep(0.,.22,uAltSunDirection.y);
 float sunRadius=uAltSunRadius;
 float sunDisk=(1.-smoothstep(sunRadius-aa,sunRadius+aa,angle))*min(1.,sunRadius*sunRadius/(aa*aa));
 float limb=.55+.45*sqrt(max(0.,1.-pow(angle/sunRadius,2.)));
 float warmth=clamp(1.-pow(1.-low,2.4)+(1.-uTerrainSourceVisibility.x)*low*.10,0.,1.);
 vec3 sunColor=mix(vec3(1.,.96,.88),vec3(1.,.88,.56),warmth);
 vec3 haloColor=vec3(1.,.88,.66)*exp(-vec3(0.,2.2,4.5)*warmth);
 float sunVisibility=sourceVisibility(d)*smoothstep(-.004,.009,uAltSunDirection.y)*uTerrainSourceVisibility.x;
 float aureole=mix(2.2,1.6,low)*exp(-angle/(sunRadius*1.6))+.13/(1.+pow(angle/(sunRadius*5.),2.));
 // Local ray coverage clips the disc at terrain and cloud boundaries.
 // The visible fraction of the entire disc belongs only to the halo/flare.
 float localSunVisibility=sourceVisibility(d)*smoothstep(-.004,.009,d.y);
 // Atmospheric reddening changes the spectrum, not the exposed disc's
 // luminance. The shoulder and halo show warmth around a brilliant core.
 vec3 coreTint=mix(vec3(1.,.97,.90),vec3(1.,.65,.055),warmth);
 coreTint/=dot(coreTint,vec3(.2126,.7152,.0722));
 vec3 color=coreTint*48.*sunDisk*limb*localSunVisibility
   +haloColor*aureole*sunVisibility;
 float moonAngle=length(d-uAltMoonDirection);
 float moonRadius=.012;
 float moonDisk=(1.-smoothstep(moonRadius-aa,moonRadius+aa,moonAngle))*min(1.,moonRadius*moonRadius/(aa*aa));
 vec3 right=normalize(cross(vec3(0,1,0),uAltMoonDirection));
 vec3 up=normalize(cross(uAltMoonDirection,right));
 vec2 moonPoint=vec2(dot(d,right),dot(d,up))/moonRadius;
 float z=sqrt(max(0.,1.-dot(moonPoint,moonPoint)));
 vec3 lunarNormal=vec3(moonPoint,z);
 vec2 lunarUV=vec2(.5+atan(moonPoint.x,max(z,.0001))/TAU,.5+asin(clamp(moonPoint.y,-1.,1.))/PI);
 vec3 albedo=linearColor(textureLod(uMoonAlbedo,lunarUV,0.).rgb);
 float phase=2.*uAltMoonPhase-1.;
 float lambert=dot(lunarNormal,vec3(sqrt(max(0.,1.-phase*phase)),0.,phase));
 float illuminated=smoothstep(-.025,.035,lambert)*(.23+.77*max(lambert,0.));
 float moonVisibility=sourceVisibility(d)*smoothstep(-.004,.009,uAltMoonDirection.y)*uTerrainSourceVisibility.y;
 color+=vec3(.85,.91,1.)*moonDisk*albedo*(.035+illuminated*6.)*moonVisibility*(.12+.88*uAltNight);
 float halo=.19*exp(-moonAngle/.021)+.009/(1.+pow(moonAngle/.075,2.));
 color+=vec3(.55,.67,1.)*halo*moonVisibility*uAltNight;
 return color;
}
vec3 photographicNight(vec3 d,float lod){
 float field=mix(.055,1.,uAltSalt);
 if(field<.001||uNightSkyReady<.5||uAltSolarAltitude>-7.)return vec3(0.);
 vec3 centre=normalize(vec3(.18,.23,.956));
 vec3 tangent=normalize(vec3(.72,.68,-.30));
 tangent=normalize(tangent-centre*dot(tangent,centre));
 vec3 north=normalize(cross(centre,tangent));
 float drift=uAltStellarPhase;
 float x=dot(d,tangent),z=dot(d,centre),y=dot(d,north);
 vec2 uv=vec2(.5-atan(x,z)/TAU+drift,.5+asin(clamp(y,-1.,1.))/PI);
 float level=max(0.,lod-1.);
 vec3 stars=linearColor(textureLod(uMilkyWay,uv,max(0.,level)).rgb);
 float dark=1.-smoothstep(-15.,-7.,uAltSolarAltitude);
 float air=exp(-.10/max(d.y,.035))*smoothstep(0.,.025,d.y);
 float moonWash=mix(1.,.65,smoothstep(0.,.3,uAltMoonDirection.y)*uAltMoonPhase);
 return stars*.42*dark*uNightSkyReady*field*air*moonWash;
}
vec3 opticalFlare(vec3 ray){
 vec3 result=vec3(0.);
 vec2 view=vec2(dot(ray,uCameraRight),dot(ray,uCameraUp))/max(dot(ray,uCameraForward),.001);
 for(int i=0;i<2;i++){
   vec3 source=i==0?uAltSunDirection:uAltMoonDirection;
   float facing=dot(source,uCameraForward);
   vec2 at=vec2(dot(source,uCameraRight),dot(source,uCameraUp))/max(facing,.001);
   vec2 viewport=at/vec2(uTanHalfFov*uAspect,uTanHalfFov);
   float terrain=uTerrainHorizonReady>.5?1.:sunScreenVisibility(source);
   float visibility=sourceVisibility(source)*terrain*(i==0?uTerrainSourceVisibility.x:uTerrainSourceVisibility.y)*smoothstep(0.,.08,facing)*(1.-smoothstep(1.,1.35,max(abs(viewport.x),abs(viewport.y))));
   vec2 p=view-at;
   float veil=.012/(1.+dot(p,p)/.00065);
   float streak=.012*exp(-abs(p.x)*13.-abs(p.y)*390.);
   vec2 ghost=view+at*.32;
   float reflection=.002*exp(-dot(ghost,ghost)/.0035);
   vec3 tint=i==0?mix(vec3(1.,.67,.32),vec3(1.,.25,.045),1.-smoothstep(0.,.22,source.y)):vec3(.50,.65,1.);
   result+=tint*(veil+streak+reflection)*visibility*(i==0?1.:uAltNight*.18);
 }
 return result;
}
vec3 skyRadiance(vec3 d,float lod){
 d=normalize(d);vec4 sky=sampleSky(d,lod);
 // The long, low solar path reddens the forward-scattered aureole too.
 // Keep the atmospheric halo warm independently of the exposed white core.
 float lowSun=(1.-smoothstep(.01,.20,uAltSunDirection.y))*smoothstep(-.08,0.,uAltSunDirection.y);
 float forwardGlow=exp(-pow(length(d-uAltSunDirection)/.34,2.));
 sky.rgb*=exp(-vec3(.38,1.25,2.5)*lowSun*forwardGlow);
 // Separate the solid solar image from the broad scattering lobe: otherwise
 // the unresolved atmospheric hotspot changes the core's intended radiance.
 float diskAA=clamp(max(uSkyPixelAngle,exp2(lod)/1800.),.00018,.035);
 float disk=1.-smoothstep(uAltSunRadius-diskAA,uAltSunRadius+diskAA,length(d-uAltSunDirection));
 sky.rgb*=1.-disk*.9*lowSun*sourceVisibility(d);
 float moonHemisphere=.55+.45*max(dot(d,uAltMoonDirection),0.);
 float landscape=1.-step(.5,uAltEnvironmentKind)+step(1.5,uAltEnvironmentKind);
 vec3 moonAir=vec3(.010,.015,.026)*uAltNight*landscape*moonHemisphere;
 return sky.rgb+moonAir+photographicNight(d,lod)*sky.a+celestialRadiance(d,max(uSkyPixelAngle,exp2(lod)/1800.));
}
vec3 worldReflection(vec3 p,vec3 direction,float lod,out float skyOpening){
 // Footprint is passed from the uninterrupted water path. No dFdx/dFdy or
 // implicit-LOD texture operations may run after the sky/terrain split.
 skyOpening=1.;
 if(uAltEnvironmentKind>.5&&uAltEnvironmentKind<1.5)return skyRadiance(direction,lod);
 // Fjords covers 78 degrees, while wave normals can reflect beyond the
 // photograph. Continue only the outer reflected banks with a smooth,
 // bounded azimuth lookup.
 // Below-horizon rays hit another wave before reaching the environment.
 // Approximate that secondary reflection with a folded elevation, filtered
 // across a pixel-sized grazing lobe. Looking into the empty underwater
 // part of the terrain capture was producing solid black streaks.
 // This reuses the existing environment sample; no ray march or new pass.
 float grazingWidth=max(.002,uSkyPixelAngle);
 direction.y=sqrt(direction.y*direction.y+grazingWidth*grazingWidth);
 vec3 photoDirection=direction;
 float edgeParallax=1.;
 if(uAltEnvironmentKind<.5||uAltEnvironmentKind>1.5){
   float azimuth=atan(direction.x,direction.z),angle=abs(azimuth);
   float halfAngle=uAltEnvironmentKind>1.5&&uAltEnvironmentKind<2.5?39.:53.;
   float start=radians(halfAngle-3.5),width=radians(2.);
   float continued=min(angle,start)+width*(1.-exp(-max(angle-start,0.)/width));
   float horizontal=length(direction.xz);
   photoDirection=vec3(sin(sign(azimuth)*continued)*horizontal,direction.y,cos(continued)*horizontal);
   edgeParallax=1.-smoothstep(start,start+width,angle);
 }
 vec3 mirrorEye=uCameraPosition*METRES;mirrorEye.y=-mirrorEye.y;
 vec4 projected=uReflectionMatrix*vec4(mirrorEye+photoDirection*1000.,1.);
 vec2 uv=projected.xy/max(projected.w,.0001)*.5+.5;
 // A filtered reflection can have incomplete coverage near the waterline.
 // Missing terrain coverage is not an opening onto the luminous sky: the
 // actual mountain skyline still occludes those directions.
 skyOpening=terrainSkyVisibility(photoDirection,max(.0008,exp2(lod)/1800.));
 vec3 sky=vec3(0.);
 // Do not march mist behind an opaque mountain. Skyline antialiasing still
 // uses its continuous fractional visibility at the silhouette.
 if(skyOpening>0.)sky=valleyMistSky(skyRadiance(direction,lod),mirrorEye,direction,uAltEnvironmentKind,uAltNight,clamp((uAltNightRadiance-.075)/.045,0.,1.))*skyOpening;
 if(projected.w<=0.)return sky;
 // Reproject from the displaced water point using the captured terrain
 // depth. A tilted wave's reflected ray does not originate at the mirror
 // camera; nearby headlands must shift with its actual intersection.
 if(all(greaterThan(uv,vec2(.001)))&&all(lessThan(uv,vec2(.999)))){
   float terrainDepth=textureLod(uReflectionDepth,uv,0.).r;
   if(terrainDepth<.9999999){
     float originDepth=(uReflectionMatrix*vec4(p,1.)).w;
     float along=(uReflectionMatrix*vec4(photoDirection,0.)).w;
     float distance=max(0.,(linearDepth(terrainDepth)-originDepth)/max(along,.001));
     vec4 hit=uReflectionMatrix*vec4(p+photoDirection*distance,1.);
     vec2 corrected=hit.xy/max(hit.w,.0001)*.5+.5;
     // A depth hit behind the water point is not a valid reflected-ray hit.
     // Keep the angular environment fallback in that case; projecting p at
     // distance zero moves the lookup into empty water and leaks bright sky.
     if(distance>0.&&hit.w>0.)uv+=clamp(corrected-uv,vec2(-.025),vec2(.025))*edgeParallax;
   }
 }
 vec2 edge=min(uv,1.-uv);
 float border=smoothstep(0.,.025,min(edge.x,edge.y));
 if(border<=0.)return sky;
 // Premultiplied terrain radiance and its matched filtered coverage are
 // reconstructed together. Never switch color with a nearest depth test.
 float level=clamp(lod-.3,0.,6.);
 vec4 sampleColor=textureLod(uReflectionColor,uv,level);
 if(${Y()?"true":"false"}&&skyOpening<.5&&sampleColor.a<.015){
   vec4 support=textureLod(uReflectionColor,uv,6.);
   sampleColor=mix(support,sampleColor,smoothstep(.001,.015,sampleColor.a));
 }
 float bankSupport=(1.-skyOpening)*smoothstep(.00001,.015,sampleColor.a);
 float coverage=mix(sampleColor.a,1.,bankSupport)*border;
 skyOpening*=1.-coverage;
 vec3 terrain=unpackLight(clamp(sampleColor.rgb/max(sampleColor.a,mix(max(uReflectionAlphaFloor,.00001),.00001,bankSupport)),vec3(0.),vec3(.995)))*coverage;
 return terrain+sky*(1.-coverage);
}
`,ct=`#version 300 es
layout(location=0) in vec2 aPosition;
out vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;function Eo(e,t=1,i=!1,a=!1){return`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uState;
uniform sampler2D uLakeBed;
uniform sampler2D uBedGeometry;
uniform sampler2D uEnvironment;
uniform sampler2D uAerial;
uniform float uLakeBedReady;
uniform float uEnvironmentReady;
uniform vec2 uStateTexel;
uniform vec4 uWorldBounds;
uniform float uTime;
uniform vec3 uCameraPosition,uCameraForward,uCameraRight,uCameraUp;
uniform float uTanHalfFov,uAspect;
uniform vec3 uLightDirection,uLightColor,uSkyColor,uHorizonColor;
uniform float uSunPresence,uWaveEnergy,uDirectionalStrength,uReflectionStrength;
uniform float uWaterSurfaceEnabled;
uniform float uAltClarity,uAltDepth,uAltBreeze,uAltRipple,uAltExposure;
uniform float uAltDaylight,uAltNight,uAltNightRadiance,uAltSourcePower,uAltSolarAltitude;
uniform float uAltEnvironmentRotation,uAltFog;
uniform float uAltTideEnabled;
uniform float uWaterPixelAngle,uAmbientWaveDepth;
uniform float uAltSand,uAltSalt;
const float PI=3.141592653589793;
const float TAU=6.283185307179586;
// Pull the optical viewpoint back 38% while retaining the inherited world
// coordinates used by pointer positions, sound distances, and arrival timing.
const float METRES=.44;
const float IOR=1.333;
// Some GL drivers lower tanh(x) through positive exponentials. Deep-water
// dispersion reaches x > 10000, and click spectra reach x > 80: that lowering
// can produce infinity / infinity, poisoning the complete inverse FFT.
// This equivalent form only evaluates a non-positive exponential. Preserve
// tiny signed heights without subtractive cancellation around zero.
float waterTanh(float x){
  if(abs(x)<.0001)return x;
  float e=exp(-2.*abs(x));
  return sign(x)*(1.-e)/(1.+e);
}

float stateHeight(vec2 uv){float h=${e?"texture(uState,uv).r":"(texture(uState,uv).r*2.-1.)"};return (.032/METRES)*waterTanh(h*110.);}
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
vec3 linearColor(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}

// Exact unpolarized dielectric Fresnel, including the critical grazing angle.
float fresnel(float c){
 c=clamp(c,.0001,1.);float t=sqrt(1.-(1.-c*c)/(IOR*IOR));
 float rs=(c-IOR*t)/(c+IOR*t),rp=(IOR*c-t)/(IOR*c+t);
 return .5*(rs*rs+rp*rp);
}

// Filter each wave against the actual projected footprint, which is long
// down the lake but narrow across it. An isotropic distance cutoff incorrectly
// erased visible crosswind waves near the horizon.
void mode(inout vec4 result,vec2 p,vec2 d,float wavelength,float slope,float phase,float energy,mat2 footprint){
 float k=TAU/wavelength;

 // Retain the breeze-driven slope spectrum, with a quieter visual phase
 // speed across the lake. Contact waves keep their own solver clock.
 float phaseRate=mix(.38,.58,abs(d.y));

 vec2 phaseStep=k*vec2(dot(d,footprint[0]),dot(d,footprint[1]));
 // A Gaussian alone retained 60% of a wave at the pixel Nyquist limit.
 // Taper before that limit, separately for the second harmonic, and carry
 // unresolved slope energy into the reflection's microfacet roughness.
 float frequency=max(abs(phaseStep.x),abs(phaseStep.y));
 float gaussian=exp(-.125*dot(phaseStep,phaseStep));
 float aa=gaussian*(1.-smoothstep(1.9,3.14159265,frequency));
 float harmonicAA=gaussian*gaussian*gaussian*gaussian*(1.-smoothstep(1.9,3.14159265,frequency*2.));
 result.w+=.5*pow(slope*energy,2.)*((1.-aa*aa)+.01*(1.-harmonicAA*harmonicAA));
 if(frequency>=3.14159265)return; // only unresolved variance survives
 float omega=sqrt((9.80665*k+.0728/998.2*k*k*k)*waterTanh(k*max(uAmbientWaveDepth,.85)));
 float theta=dot(p,d)*k-omega*uTime*phaseRate+phase;
 float amplitude=slope/k*energy;
 // Derive the harmonic from the fundamental: phase is a compile-time
 // constant for each mode, so this removes two transcendental evaluations.
 float s=sin(theta),c=cos(theta),s2=2.*s*c,c2=c*c-s*s;
 float harmonicSin=s2*cos(phase)+c2*sin(phase);
 float harmonicCos=c2*cos(phase)-s2*sin(phase);
 result.xy+=d*(c*aa+.10*harmonicCos*harmonicAA)*(slope*energy);
 result.z+=(s*aa+.05*harmonicSin*harmonicAA)*amplitude;
}
mat2 waterFootprint(vec3 ray,float distance){
 float size=uWaterPixelAngle*distance*max(dot(ray,uCameraForward),.01);
 float y=min(ray.y,-.00001);
 return mat2((uCameraRight.xz-ray.xz*uCameraRight.y/y)*size,
             (uCameraUp.xz-ray.xz*uCameraUp.y/y)*size);
}
vec4 surface(vec2 p,mat2 footprint){
 vec4 w=vec4(0);
 float energy=.62*uAltBreeze*mix(1.,.10,uAltSalt);
 float windPatch=mix(.78,1.18,noise(p*.007+vec2(uTime*.0035,7.3+uTime*.002)));
 float e=energy*windPatch;
 // Broad swell remains continuous; shorter wind waves have a distributed
 // spectrum, without a handful of dominant, screen-wide parallel crests.
${a?` mode(w,p,normalize(vec2(.18,1.)),239.,.0085,1.08,energy,footprint);
 mode(w,p,normalize(vec2(-.39,.92)),109.,.0075,3.17,energy,footprint);
 mode(w,p,vec2(1.,0.),17.3,.026,5.32,energy,footprint);
 mode(w,p,normalize(vec2(-.21,.98)),21.7,.013,2.67,energy,footprint);
 mode(w,p,normalize(vec2(.53,.85)),9.3,.023,4.53,energy,footprint);
 mode(w,p,normalize(vec2(.999,.035)),5.81,.031,.78,energy,footprint);
 mode(w,p,vec2(0.7944915,0.6072753),3.5912099,0.0418758,2.0402631,e,footprint);
 mode(w,p,vec2(0.2535413,0.9673246),2.6255710,0.0315025,4.0805262,e,footprint);
 mode(w,p,vec2(-0.3944699,0.9189089),1.9195824,0.0452442,6.1207893,e,footprint);
 mode(w,p,vec2(-0.8759112,0.4824723),1.4034268,0.0348709,1.8778671,e,footprint);
 mode(w,p,vec2(-0.2408694,0.9705575),0.9330317,0.0461214,4.6428437,e,footprint);
 mode(w,p,vec2(-0.7864819,0.6176134),0.7807084,0.0637438,0.3999215,e,footprint);
 mode(w,p,vec2(0.9057211,0.4238741),0.6532529,0.0504410,2.4401845,e,footprint);
 mode(w,p,vec2(0.4539982,0.8910026),0.5466052,0.0371382,4.4804476,e,footprint);
 mode(w,p,vec2(0.9622923,0.2720176),0.4481754,0.0343891,0.9622389,e,footprint);
 mode(w,p,vec2(0.5919507,0.8059742),0.3749314,0.0501132,3.0025020,e,footprint);
 mode(w,p,vec2(-0.0283495,0.9995981),0.3136574,0.0382435,5.0427651,e,footprint);
 mode(w,p,vec2(-0.6366788,0.7711291),0.2623973,0.0539675,0.7998429,e,footprint);
 mode(w,p,vec2(0.1334765,0.9910520),0.2045466,0.0274141,3.5648195,e,footprint);
 mode(w,p,vec2(-0.5037672,0.8638395),0.1617785,0.0215213,5.6050826,e,footprint);
 mode(w,p,vec2(0.9981655,0.0605438),0.1279527,0.0293277,1.3621604,e,footprint);
 mode(w,p,vec2(0.7502137,0.6611955),0.1011995,0.0234348,3.4024235,e,footprint);
 mode(w,p,vec2(-0.8560378,0.5169133),0.0752290,0.0118754,6.1674001,e,footprint);
 mode(w,p,vec2(0.8471585,0.5313402),0.0589275,0.0089664,1.9244778,e,footprint);
 mode(w,p,vec2(0.3417555,0.9397889),0.0461584,0.0128200,3.9647409,e,footprint);
 mode(w,p,vec2(-0.3079581,0.9513999),0.0361563,0.0099110,6.0050040,e,footprint);
`:` mode(w,p,normalize(vec2(.18,1.)),239.,.0085,1.08,energy,footprint);
 mode(w,p,normalize(vec2(-.39,.92)),109.,.0075,3.17,energy,footprint);
 mode(w,p,vec2(1.,0.),17.3,.026,5.32,energy,footprint);
 mode(w,p,normalize(vec2(-.21,.98)),21.7,.013,2.67,energy,footprint);
 mode(w,p,normalize(vec2(.53,.85)),9.3,.023,4.53,energy,footprint);
 mode(w,p,normalize(vec2(.999,.035)),5.81,.031,.78,energy,footprint);
 mode(w,p,vec2(0.7944915,0.6072753),3.7836442,0.0327333,2.0402631,e,footprint);
 mode(w,p,vec2(0.2535413,0.9673246),3.0706639,0.0246247,4.0805262,e,footprint);
 mode(w,p,vec2(-0.3944699,0.9189089),2.4920358,0.0353663,6.1207893,e,footprint);
 mode(w,p,vec2(-0.8759112,0.4824723),2.0224429,0.0272577,1.8778671,e,footprint);
 mode(w,p,vec2(0.8253651,0.5645994),1.6413389,0.0379993,3.9181302,e,footprint);
 mode(w,p,vec2(0.3041235,0.9526326),1.3320491,0.0298907,5.9583933,e,footprint);
 mode(w,p,vec2(-0.2408694,0.9705575),0.9611644,0.0380865,4.6428437,e,footprint);
 mode(w,p,vec2(-0.7864819,0.6176134),0.8534786,0.0526389,0.3999215,e,footprint);
 mode(w,p,vec2(0.9057211,0.4238741),0.7578576,0.0416536,2.4401845,e,footprint);
 mode(w,p,vec2(0.4539982,0.8910026),0.6729497,0.0306684,4.4804476,e,footprint);
 mode(w,p,vec2(-0.1894311,0.9818940),0.5975545,0.0452208,0.2375254,e,footprint);
 mode(w,p,vec2(-0.7528708,0.6581684),0.5306064,0.0342355,2.2777885,e,footprint);
 mode(w,p,vec2(0.9622923,0.2720176),0.4617044,0.0269028,0.9622389,e,footprint);
 mode(w,p,vec2(0.5919507,0.8059742),0.4099207,0.0392038,3.0025020,e,footprint);
 mode(w,p,vec2(-0.0283495,0.9995981),0.3639450,0.0299181,5.0427651,e,footprint);
 mode(w,p,vec2(-0.6366788,0.7711291),0.3231258,0.0422191,0.7998429,e,footprint);
 mode(w,p,vec2(0.9752803,0.2209713),0.2868847,0.0329333,2.8401060,e,footprint);
 mode(w,p,vec2(0.6335676,0.7736873),0.2547084,0.0452344,4.8803691,e,footprint);
 mode(w,p,vec2(0.1334765,0.9910520),0.2127016,0.0234890,3.5648195,e,footprint);
 mode(w,p,vec2(-0.5037672,0.8638395),0.1819100,0.0184398,5.6050826,e,footprint);
 mode(w,p,vec2(0.9981655,0.0605438),0.1555759,0.0251285,1.3621604,e,footprint);
 mode(w,p,vec2(0.7502137,0.6611955),0.1330540,0.0200794,3.4024235,e,footprint);
 mode(w,p,vec2(0.1854746,0.9826491),0.1137926,0.0150302,5.4426866,e,footprint);
 mode(w,p,vec2(-0.4575834,0.8891667),0.0973194,0.0217189,1.1997644,e,footprint);
 mode(w,p,vec2(-0.8560378,0.5169133),0.0783544,0.0092875,6.1674001,e,footprint);
 mode(w,p,vec2(0.8471585,0.5313402),0.0665812,0.0070124,1.9244778,e,footprint);
 mode(w,p,vec2(0.3417555,0.9397889),0.0565770,0.0100262,3.9647409,e,footprint);
 mode(w,p,vec2(-0.3079581,0.9513999),0.0480760,0.0077511,6.0050040,e,footprint);
 mode(w,p,vec2(-0.8276325,0.5612704),0.0408524,0.0107650,1.7620818,e,footprint);
 mode(w,p,vec2(0.8739608,0.4859965),0.0347141,0.0084899,3.8023449,e,footprint);
`}
 return w;
}

vec3 nearInteraction(vec2 world){
 if(uAltTideEnabled>.5){
   vec2 uv=(world*METRES-vec2(-12.,-2.))/24.;
   if(any(lessThan(uv,vec2(0)))||any(greaterThan(uv,vec2(1))))return vec3(0);
   vec4 field=textureLod(uState,uv,0.);
   float edge=min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y));
   float fade=smoothstep(0.,.104166667,edge);
   vec2 boundary=min(uv,1.-uv);
   vec2 edgeDirection=boundary.x<boundary.y?vec2(uv.x<.5?1.:-1.,0.):vec2(0.,uv.y<.5?1.:-1.);
   float t=clamp(edge/.104166667,0.,1.);
   vec2 fadeGradient=edgeDirection*(6.*t*(1.-t)/(.104166667*24.));
   return vec3(field.gb*fade+field.r*fadeGradient,field.r*fade)*uAltRipple*mix(1.,.55,uAltSalt);
 }
 vec2 uv=(world-uWorldBounds.xy)/(uWorldBounds.zw-uWorldBounds.xy);
 vec2 q=clamp(uv,uStateTexel*1.5,1.-uStateTexel*1.5);
 float l=stateHeight(q-vec2(uStateTexel.x,0)),r=stateHeight(q+vec2(uStateTexel.x,0));
 float b=stateHeight(q-vec2(0,uStateTexel.y)),t=stateHeight(q+vec2(0,uStateTexel.y));
 float bl=stateHeight(q-uStateTexel),tr=stateHeight(q+uStateTexel);
 float br=stateHeight(q+vec2(uStateTexel.x,-uStateTexel.y));
 float tl=stateHeight(q+vec2(-uStateTexel.x,uStateTexel.y));
 vec2 d=(uWorldBounds.zw-uWorldBounds.xy)*uStateTexel*8.;
 vec2 slope=vec2(2.*(r-l)+tr+br-tl-bl,2.*(t-b)+tr+tl-br-bl)/d;
 float fade=smoothstep(0.,.015,min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y)));
 return vec3(slope*${t.toFixed(5)},stateHeight(q)*METRES*${t.toFixed(5)})*fade*uAltRipple;
}

uniform int uFarRippleCount;
uniform vec4 uFarRipples[8]; // x metres, z metres, age seconds, amplitude multiplier
vec3 farRipplePacket(vec2 q,float age,float strength,float k,float omega,float groupSpeed,mat2 pixel){
 // Smooth r at origin; no arbitrary giant screen-sized ring. A finite radial
 // packet approximates a narrow band of the same gravity/capillary spectrum.
 float r=sqrt(dot(q,q)+.025*.025);
 vec2 direction=q/r;
 float width=.36+age*.085;
 float radial=r-groupSpeed*age;
 if(abs(radial)>width*6.)return vec3(0.); // less than 4e-10 m remains
 float envelope=exp(-.5*radial*radial/(width*width));
 float amplitude=.026*strength*sqrt(.45/(r+.45))*exp(-age*.22)
   *smoothstep(0.,.055,age)*(1.-smoothstep(8.,10.,age));
 vec2 phaseStep=k*vec2(dot(direction,pixel[0]),dot(direction,pixel[1]));
 float frequency=max(abs(phaseStep.x),abs(phaseStep.y));
 float aa=exp(-.125*dot(phaseStep,phaseStep))*(1.-smoothstep(1.9,3.14159265,frequency));
 float phase=k*r-omega*age;
 float wave=sin(phase),slope=k*cos(phase)
   -wave*(radial/(width*width)+.5/(r+.45));
 float energy=amplitude*envelope*aa;
 return vec3(direction*(slope*energy),wave*energy);
}
vec3 farInteraction(vec2 point){
 if(uFarRippleCount==0)return vec3(0.);
 vec3 farEye=uCameraPosition*METRES;
 vec3 delta=vec3(point.x,0.,point.y)-farEye;
 mat2 pixel=waterFootprint(normalize(delta),length(delta));
 vec3 result=vec3(0.);
 for(int i=0;i<8;i++){
   if(i>=uFarRippleCount)break;
   vec4 impulse=uFarRipples[i];
   vec2 q=point-impulse.xy;float age=impulse.z;
   // Frequencies, group velocities and tempo match H's existing solver.
   // Longer gravity waves lead; shorter waves lag, rather than one rigid ring.
   result+=farRipplePacket(q,age,impulse.w,5.0507627,13.018792,1.2934144,pixel);

 }
 return result*uAltRipple*mix(1.,.55,uAltSalt);
}
vec3 interaction(vec2 world){
 return nearInteraction(world)+farInteraction(world*METRES);
}

${tr}

// Baked normal and height are linear data; albedo is sRGB with AO in alpha.
vec2 bedCoordinates(vec2 p){
 vec2 drift=vec2(sin(uTime*.42+p.y*.78),sin(uTime*.31+p.x*.66));
 p+=drift*.014*uAltSand*uAltBreeze;
 return p/mix(mix(2.2,3.6,uAltSand),5.6,uAltSalt)+vec2(.35,.41);
}
float bedRelief(){return mix(mix(.12,.026,uAltSand),.008,uAltSalt);}
vec4 bedGeometry(vec2 p){return texture(uBedGeometry,bedCoordinates(p),.35);}
vec4 bedMaterial(vec2 p){return texture(uLakeBed,bedCoordinates(p),.0);}
float depthAt(vec2 p){float z=max(p.y+.35,0.);return uAltDepth*mix(.38+.20*z+.055*pow(z,1.6)+.02*sin(p.x*.72+p.y*.51),.18+.007*sin(p.x*.3)*sin(p.y*.2),uAltSalt);}
vec2 bedProjection(vec2 surfacePoint,vec3 transmitted,float baseDepth,float surfaceHeight){
 // Once the bottom is optically extinguished, avoid marching an invisible bed.
 if(baseDepth>12.)return surfacePoint+transmitted.xz*baseDepth/max(-transmitted.y,.24);
 float maxTravel=(baseDepth+.42)/max(-transmitted.y-.32*max(transmitted.z,0.),.24);
 float stepTravel=maxTravel/28.;
 float t=0.,previous=0.;
 float lod=max(0.,log2(max(length(dFdx(surfacePoint)),length(dFdy(surfacePoint)))*930.));
 for(int i=0;i<28;i++){
   vec2 b=surfacePoint+transmitted.xz*t;
   float h=textureLod(uBedGeometry,bedCoordinates(b),lod).a*bedRelief();
   if(surfaceHeight+transmitted.y*t<=-depthAt(b)+h)break;
   previous=t;t+=stepTravel;
 }
 for(int i=0;i<5;i++){
   float middle=(t+previous)*.5;
   vec2 b=surfacePoint+transmitted.xz*middle;
   float h=textureLod(uBedGeometry,bedCoordinates(b),lod).a*bedRelief();
   if(surfaceHeight+transmitted.y*middle<=-depthAt(b)+h)t=middle;else previous=middle;
 }
 return surfacePoint+transmitted.xz*t;
}

float smithG(float nv,float nl,float roughness){
 float a2=roughness*roughness;
 float v=2.*nv/(nv+sqrt(a2+(1.-a2)*nv*nv));
 float l=2.*nl/(nl+sqrt(a2+(1.-a2)*nl*nl));
 return v*l;
}
vec3 applyAir(vec3 color){return color;}
vec4 encodeScene(vec3 color){
 color=max(color,vec3(0));
 vec3 encoded=sqrt(color/(1.+color));
 // Dither before the 8-bit scene target so smooth fog keeps its gradients.
 float grain=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))-.5;
 return vec4(encoded+grain*${e?"0.":"(1./255.)"},1.);
}
void main(){
 float adaptedExposure=uAltExposure*(1.+(1.-step(.5,uAltEnvironmentKind)+step(1.5,uAltEnvironmentKind))*uAltNight*5.);
 vec2 ndc=vUv*2.-1.;
 vec3 ray=normalize(uCameraForward+uCameraRight*ndc.x*uTanHalfFov*uAspect+uCameraUp*ndc.y*uTanHalfFov);
 // Rasterized landscape depth and the ray-intersected water share one camera.
 float sceneDepth=texture(uWorldDepth,vUv).r;
 float solidTravel=linearDepth(sceneDepth)/max(dot(ray,uCameraForward),.0001);
 vec3 shorelinePoint=uCameraPosition*METRES+ray*solidTravel;
 // Downward rays see water through partial shoreline coverage, never sky.
 // The bank is composited over that water after its displaced intersection.
 if(ray.y>=0.){
   vec4 layer=textureLod(uWorldColor,vUv,0.);
   vec3 scene=unpackLight(clamp(layer.rgb/max(layer.a,.00001),vec3(0.),vec3(.995)))*layer.a;
   // A filtered cutout at the water horizon is still backed by the bank.
   // Fill only this subpixel contact with terrain radiance. Sky above the
   // skyline, canopy openings and the open-water environment stay unchanged.
   float contact=(1.-smoothstep(0.,uSkyPixelAngle*2.,abs(ray.y)))
     *(1.-terrainSkyVisibility(ray,uSkyPixelAngle*.5))*step(.01,layer.a);
   vec3 background=mix(valleyMistSky(skyRadiance(ray,0.),uCameraPosition*METRES,ray,uAltEnvironmentKind,uAltNight,clamp((uAltNightRadiance-.075)/.045,0.,1.)),scene/max(layer.a,.00001),contact);
   vec3 environment=scene+background*(1.-layer.a)+opticalFlare(ray);
   outColor=encodeScene(applyAir(environment)*adaptedExposure);return;
 }
 vec3 camera=uCameraPosition*METRES;
 float travel=-camera.y/min(ray.y,-.0001);
 vec3 point=camera+ray*travel;
 mat2 waveFootprint=waterFootprint(ray,travel);
 vec4 wave=surface(point.xz,waveFootprint);vec3 touch=interaction(point.xz/METRES);
 if(uAltTideEnabled>.5&&abs(nearInteraction(point.xz/METRES).z)>.002){
   // Bracket the first surface intersection through steep contact bowls.
   // March only the texture field; the short ambient waves are refined below.
   float nearT=max(0.,(camera.y-wave.z-.45)/max(-ray.y,.0001));
   float farT=(camera.y-wave.z+.65)/max(-ray.y,.0001);
   float lo=nearT,hi=farT;
   for(int j=1;j<=24;j++){
     float candidate=mix(nearT,farT,float(j)/24.);
     vec3 q=camera+ray*candidate;
     float residual=q.y-wave.z-interaction(q.xz/METRES).z;
     if(residual<=0.){hi=candidate;break;}
     lo=candidate;
   }
   for(int j=0;j<7;j++){
     float middle=(lo+hi)*.5;vec3 q=camera+ray*middle;
     if(q.y-wave.z-interaction(q.xz/METRES).z>0.)lo=middle;else hi=middle;
   }
   travel=(lo+hi)*.5;point=camera+ray*travel;
   wave=surface(point.xz,waveFootprint);touch=interaction(point.xz/METRES);
 }
 // Intersect the displaced height field itself. Deep bowls must change
 // parallax and the submerged light path, not only the reflection normal.
 for(int i=0;i<6;i++){
   float residual=point.y-wave.z-touch.z;
   float derivative=ray.y-dot(wave.xy+touch.xy,ray.xz);
   float safeDerivative=abs(derivative)<.06?(derivative<0.?-.06:.06):derivative;
   float stepLimit=.22/max(-ray.y,.025);
   float correction=clamp(residual/safeDerivative,-stepLimit,stepLimit);
   if(uAltTideEnabled<.5)correction=travel-(wave.z+touch.z-camera.y)/min(ray.y,${i?"-.0001":"-.008"});
   travel=max(.001,travel-correction*.8);
   point=camera+ray*travel;
   wave=surface(point.xz,waveFootprint);touch=interaction(point.xz/METRES);
   if(i>=1&&(uAltTideEnabled<.5||abs(touch.z)<.00015||abs(point.y-wave.z-touch.z)<min(.00015,uWaterPixelAngle*travel*.02)))break;
 }
 vec2 gradient=wave.xy+touch.xy;
 vec3 n=normalize(vec3(-gradient.x,1.,-gradient.y));
 vec3 v=-ray;
 // A large facing-angle floor forces every grazing wave onto one normal.
 // Retain the true far-surface slope; only guard numerical backfacing hits.
 if(dot(n,v)<.0003)n=normalize(n+v*(.0003-dot(n,v)));
 float nv=max(dot(n,v),.0003);
 float F=fresnel(nv);
 vec3 reflected=reflect(ray,n);
 float angularFootprint=max(length(dFdx(reflected)),length(dFdy(reflected)));
 float unresolvedRoughness=sqrt(max(wave.w,0.));
 float lod=max(clamp(log2(max(angularFootprint*1300.,1.)),0.,7.),min(3.,log2(max(unresolvedRoughness*120.,1.))));
 float reflectedSkyOpening;
 vec3 reflectedLight=worldReflection(point,reflected,lod,reflectedSkyOpening);

 vec3 transmitted=refract(ray,n,1./IOR);
 float depth=depthAt(point.xz)+point.y;
 vec2 bedPoint=bedProjection(point.xz,transmitted,depth,point.y);
 vec4 geometry=bedGeometry(bedPoint);
 depth=max(.035,depthAt(bedPoint)+point.y-geometry.a*bedRelief());
 vec3 bedN=normalize(vec3(geometry.r*2.-1.,geometry.b*2.-1.,geometry.g*2.-1.));
 vec4 material=bedMaterial(bedPoint);
 vec3 albedo=linearColor(material.rgb);
 albedo*=mix(vec3(1.),vec3(1.10,1.04,.87),uAltSand);
 albedo=mix(vec3(.19,.175,.14),albedo,uLakeBedReady);
 float ao=mix(1.,material.a,uLakeBedReady);
 float silt=pow(1.-uAltClarity,2.)*2.6;
 vec3 extinction=vec3(.46,.105,.052)+silt*vec3(.75,.89,1.);
 float distanceUnderwater=depth/max(-transmitted.y,.12);
 vec3 transmission=exp(-extinction*distanceUnderwater);
 vec3 l=normalize(uAltSourceIsSun>.5?uAltSunDirection:uAltMoonDirection);
 float sun=max(uSunPresence,0.);
 float terrainVisibility=uAltSourceIsSun>.5?uTerrainSourceVisibility.x:uTerrainSourceVisibility.y;
 float lightVisibility=worldVisibility(point,n)*terrainVisibility;
 float sunPower=uAltSourcePower*lightVisibility;
 vec3 refractedSun=-refract(-l,vec3(0,1,0),1./IOR);
 float nl=max(dot(bedN,refractedSun),0.);
 float incomingDistance=depth/max(refractedSun.y,.12);
 vec3 lightAttenuation=exp(-extinction*incomingDistance);

 // Conserve flux through the refracted light footprint. Its Jacobian comes
 // from the very same displaced normals as the visible water, including touch.
 vec3 lightRay=refract(-l,n,1./IOR);
 vec2 footprint=point.xz+lightRay.xz*depth/max(-lightRay.y,.12);
 vec2 dx=dFdx(point.xz),dy=dFdy(point.xz);
 vec2 lx=dFdx(footprint),ly=dFdy(footprint);
 float area=abs(dx.x*dy.y-dx.y*dy.x);
 float focusedArea=abs(lx.x*ly.y-lx.y*ly.x);
 float flux=clamp(area/max(focusedArea,area*.20),.22,4.2);
 float caustic=1.+(flux-1.)*.35*exp(-silt*depth*2.);
 float skyVisibility=.80*ao+.20;
 vec3 skyFill=skyRadiance(vec3(.12,.98,.08),6.5)*.65;
 vec3 illumination=skyFill*skyVisibility+uLightColor*sunPower*nl*lightAttenuation*caustic;
 vec3 bottom=albedo*illumination*(1.-fresnel(max(refractedSun.y,.001)));
 vec3 waterScatter=mix(vec3(.007,.028,.034),vec3(.027,.050,.036),silt/2.6);
 waterScatter=mix(waterScatter,vec3(.012,.056,.059),uAltSand*.70);
 waterScatter*=uAltDaylight+uAltNight*.014;
 vec3 transmittedLight=bottom*transmission+waterScatter*(1.-transmission);
 float reflectionWeight=F*${i?"1.":"mix(.82,1.,pow(1.-nv,8.))"};
 vec3 color=reflectionWeight*reflectedLight+(1.-reflectionWeight)*transmittedLight;

 // Finite-source microfacet reflection, filtered in slope space. No painted
 // highlight stripes or screen-space glitter; the wave normal determines it.
 vec3 h=normalize(v+l);
 float nh=max(dot(n,h),0.),nls=max(dot(n,l),.0001);
 float slopeVariance=max(dot(dFdx(n),dFdx(n)),dot(dFdy(n),dFdy(n)))*.35;
 float alpha=sqrt(.00012+slopeVariance+wave.w+.00008*uAltBreeze);
 float a2=alpha*alpha;
 float denominator=nh*nh*(a2-1.)+1.;
 float D=a2/(PI*denominator*denominator);
 float direct= D*smithG(nv,nls,alpha)*fresnel(max(dot(v,h),.001))/(4.*nv);
 color+=uLightColor*direct*sunPower*.23*reflectedSkyOpening;
 // Integrate the unresolved slope distribution beneath the sharp glints.
 // At sunset this produces a broad golden path broken by the same displaced
 // normals as the contact bowls and wakes, with cool troughs between crests.
 float broadAlpha=.11+.045*uAltBreeze;
 float broadA2=broadAlpha*broadAlpha;
 float broadDenominator=nh*nh*(broadA2-1.)+1.;
 float broadD=broadA2/(PI*broadDenominator*broadDenominator);
 float broadSpec=broadD*smithG(nv,nls,broadAlpha)*fresnel(max(dot(v,h),.001))/(4.*nv);
 vec3 golden=mix(uLightColor,vec3(1.,.40,.065),uAltSunset*.9);
 color+=golden*broadSpec*sunPower*(.055+uAltSunset*.82)*reflectedSkyOpening;
 color=mix(bottom,color,uWaterSurfaceEnabled);
 // The reflection already includes its complete mirrored atmospheric path.
 // Transport the remaining water radiance over the eye-to-water segment,
 // rather than adding the same haze a second time to reflected mountains.
 float airTransmission=valleyTransmission(camera,point,uAltEnvironmentKind);
 float moonVisibility=clamp((uAltNightRadiance-.075)/.045,0.,1.);
 vec3 waterAir=valleyAirlight(point-camera,uAltNight,moonVisibility,uAltEnvironmentKind);
 float transportedReflection=clamp(reflectionWeight*uWaterSurfaceEnabled,0.,1.);
 vec3 reflectionContribution=transportedReflection*reflectedLight;
 color=reflectionContribution+(color-reflectionContribution)*airTransmission
   +(1.-transportedReflection)*waterAir*(1.-airTransmission);
 float shoreCoverage=0.;
 if(sceneDepth<.9999999){
   float height=shorelinePoint.y;
   float shorePixel=max(.005,uWaterPixelAngle*solidTravel*.35);
   if(abs(height)<max(.40,shorePixel*2.)){
     mat2 shoreFootprint=waterFootprint(ray,solidTravel);
     height-=surface(shorelinePoint.xz,shoreFootprint).z+interaction(shorelinePoint.xz/METRES).z;
   }
   shoreCoverage=smoothstep(-shorePixel,shorePixel,height);
   vec4 shore=textureLod(uWorldColor,vUv,0.);
   vec3 shoreLight=unpackLight(clamp(shore.rgb/max(shore.a,.00001),vec3(0.),vec3(.995)));
   color=mix(color,shoreLight,shoreCoverage*shore.a);
 }
 color+=opticalFlare(ray);
 color=applyAir(color)*adaptedExposure;
 // Reversible HDR companding shared by floating lighting and its 8-bit fallback.
 outColor=encodeScene(color);
 outColor.a=shoreCoverage; // Preserve antialiased wave/bank coverage for native detail.
}`}var ko=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uScene,uBloom;
uniform sampler2D uNativeScene,uNativeDepth;
uniform float uDetailReady,uDetailExposure,uTanHalfFov,uAspect;
uniform vec3 uCameraPosition,uCameraForward,uCameraRight,uCameraUp;
uniform float uTime;
uniform vec2 uSceneTexel;
uniform sampler2D uFlareSky;
uniform vec4 uSunAperture,uSunContact;
uniform vec3 uFlareSun;
// A restrained, circular lens-scatter approximation in the existing composite.
// No synthetic aperture blades or radial spokes. Visible source area controls
// total scattered energy; a partly hidden sun must never amplify the glare.
vec3 sunLensScatter(vec2 uv){
 float visible=uSunAperture.w;
 if(visible<=.0001||uFlareSun.y<-.02)return vec3(0.);
 vec3 source=uSunAperture.xyz;
 float facing=dot(source,uCameraForward);
 if(facing<=.05)return vec3(0.);
 vec2 at=vec2(dot(source,uCameraRight),dot(source,uCameraUp))/facing;
 vec2 viewport=at/vec2(uTanHalfFov*uAspect,uTanHalfFov);
 float frame=1.-smoothstep(1.,1.18,max(abs(viewport.x),abs(viewport.y)));
 if(frame<=0.)return vec3(0.);
 vec2 p=(uv*2.-1.)*vec2(uTanHalfFov*uAspect,uTanHalfFov)-at;
 float radius2=dot(p,p);
 if(radius2>.04)return vec3(0.);
 float longitude=atan(uFlareSun.x,uFlareSun.z);
 vec2 skyUV=vec2(.5+atan(3.*tan(longitude*.5))/3.14159265359,
   pow(asin(clamp(uFlareSun.y,0.,1.))/1.57079632679,.70));
 float transmission=textureLod(uFlareSky,skyUV,0.).a;
 // Smooth point-spread tails, fading to zero with no visible circular edge.
 // The brilliant core and atmospheric halo remain in the sky's light model.
 // Low-contrast angular variation inside a compact scattering shoulder.
 // No line axes, star vertices or long bright tails over the landscape.
 // Keep the approved compact ridge/sunset response as the base.
 vec2 optical=vec2(p.x*.98+p.y*.16,-p.x*.16+p.y*.98);
 optical.y*=1.09;
 float angle=atan(optical.y+1e-7,optical.x+1e-7);
 float variation=.10*sin(angle*5.+.7)+.055*sin(angle*11.-1.2)
   +.025*sin(angle*23.+2.1);
 float irregular=1.+variation*smoothstep(.003,.018,length(optical));
 float shoulder=1.+dot(optical,optical)/(.00025*irregular);
 float veil=1.+radius2/.002;
 float daylight=smoothstep(.025,.25,uFlareSun.y);
 float solarShoulder=(14./(shoulder*shoulder)+.16/(veil*veil))*mix(.3,1.,daylight);
 // Extra daylight radiance belongs to the sky close to the source only.
 // Exclude water and native terrain, taper smoothly, and remove it at dusk.
 vec2 screen=uv*2.-1.;
 vec3 ray=uCameraForward+uCameraRight*screen.x*uTanHalfFov*uAspect+uCameraUp*screen.y*uTanHalfFov;
 float skyOnly=step(.9999999,textureLod(uNativeDepth,uv,0.).r)*step(0.,ray.y);
 float localGlow=1.-smoothstep(.0004,.0036,radius2);
 float exposed=smoothstep(.16,.38,uFlareSun.y)*(1.-smoothstep(0.,.25,uSunContact.w));
 float lightShoulder=1.+dot(optical,optical)/(.00045*irregular);
 // Preserve the production baseline outside the immediate solar sky.
 // Extra lens radiance must not wash over opaque terrain or the water.
 float baseGlow=.035/(1.+radius2/.00025)+.006/(1.+radius2/.0025);
 float extraGlow=max(0.,solarShoulder-baseGlow)+exposed*10./(lightShoulder*lightShoulder);
 float glow=baseGlow+skyOnly*localGlow*extraGlow;
 glow*=1.-smoothstep(.008,.04,radius2);
 float retainedGlow=baseGlow*(1.-smoothstep(.008,.04,radius2));
 vec3 scatter=vec3(1.,.88,.69)*retainedGlow+mix(vec3(1.,.91,.76),vec3(1.,.98,.94),smoothstep(.04,.35,uFlareSun.y))*max(0.,glow-retainedGlow);
 if(uSunContact.w>0.){
   float contactFacing=max(dot(uSunContact.xyz,uCameraForward),.05);
   vec2 contact=vec2(dot(uSunContact.xyz,uCameraRight),dot(uSunContact.xyz,uCameraUp))/contactFacing;
   vec2 q=p+at-contact;
   // A continuous point-spread lobe straddles the real ridge edge. Its lower
   // tail rolls into the dark foreground; no spokes, aperture-star polygons,
   // fixed angular wedges, extra samples or post-processing passes.
   vec2 core=q/vec2(.017,.010),tail=q/vec2(.034,.026);
   float base=1.+dot(core,core);
   float contactGlow=1.05/(base*base)+.16*exp(-dot(tail,tail)*1.5);
   float lower=.65+.35*(1.-smoothstep(-.008,.014,q.y));
   scatter+=vec3(1.,.77,.43)*contactGlow*lower*uSunContact.w;
 }
 return scatter*visible*frame*transmission*uDetailExposure;
}

vec3 linearToSrgb(vec3 c){return mix(12.92*c,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 filmic(vec3 c){return clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);}
void main(){
 vec3 encoded=texture(uScene,vUv).rgb;
 encoded*=encoded;
 vec3 hdr=encoded/max(1.-encoded,vec3(.004));
 // The photographed landscape bypasses the water's adaptive resolution.
 // All its geometry, relief and shadows were shaded in a cached native-size
 // pass; this is one inexpensive texture resolve, not full-resolution water.
 if(uDetailReady>.5){
   vec2 p=vUv*2.-1.;vec3 ray=normalize(uCameraForward+uCameraRight*p.x*uTanHalfFov*uAspect+uCameraUp*p.y*uTanHalfFov);
   float depth=texture(uNativeDepth,vUv).r;
   float solid=2.*.12*14000./(14000.+.12-(depth*2.-1.)*(14000.-.12))/max(dot(ray,uCameraForward),.0001);
   float water=-uCameraPosition.y*.44/min(ray.y,-.000001);
   if(depth<.9999999&&(ray.y>=0.||solid<water)){
     vec4 terrain=texture(uNativeScene,vUv);
     vec3 radiance=terrain.rgb/max(terrain.a,.00001);radiance*=radiance;
     radiance=radiance/max(1.-radiance,vec3(.004));
     float shoreCoverage=ray.y>=0.?1.:smoothstep(.97,1.,texture(uScene,vUv).a);
     hdr=mix(hdr,radiance*uDetailExposure,terrain.a*shoreCoverage);
   }
   // Wave/bank coverage is already antialiased in the water pass.
   // Preserve the native terrain detail instead of blurring across contact.
 }
 hdr+=sunLensScatter(vUv);
 vec3 c=linearToSrgb(filmic(hdr*.95));
 float dither=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))-.5;
 c+=dither/255.;
 outColor=vec4(c,1.);
}`,c0=(e,t,i)=>{let a=Math.max(0,Math.min(1,(i-e)/(t-e)));return a*a*(3-2*a)};function va(e){let t=e.sunAltitude*180/Math.PI,i=Math.pow(c0(-12,12,t),.72),a=1-c0(-12,-3,t),r=c0(-1,25,e.moonAltitude*180/Math.PI)*e.moonIllumination,o=e.source==="sun"?c0(-.6,4,t)*e.reflectionStrength:.05*e.reflectionStrength*e.moonIllumination;return{daylight:i,night:a,nightRadiance:.075+.045*r,sourcePower:o,altitude:t,moonVisible:r}}var ne=Object.freeze({length:24,depth:.85,gravity:9.80665,capillary:729312762973352e-19,tempo:1.85,dt:.008333333333333333,spacing:.035,origin:[-12,-2]}),me=Object.freeze({depth:.075,sigma:.115,dropHeight:-.09,dropVelocity:-.62,dropCore:.11,dropBroad:.28,wakeCore:.08,wakeBroad:.19,pressRamp:24});function Mo(e){let{gravity:t,capillary:i,depth:a}=ne,r=Math.tanh(e*a),o=Math.sqrt((t*e+i*e**3)*r);return ne.tempo*((t+3*i*e*e)*r+(t*e+i*e**3)*a*(1-r*r))/(2*o)}var Ro=class{constructor(e,t,i){this.x=e,this.z=t,this.time=i,this.carry=0}move(e,t,i,a){let r=e-this.x,o=t-this.z,n=Math.hypot(r,o),s=n/Math.max((i-this.time)/1e3,.001),c=Math.min(2.8,.25+s*.32);if(n>0){let l=ne.spacing-this.carry;for(;l<=n+1e-8;){let u=Math.min(1,l/n);a(this.x+r*u,this.z+o*u,ne.spacing,c,r/n,o/n),l+=ne.spacing}this.carry=(this.carry+n)%ne.spacing,(this.carry<ne.spacing*1e-6||ne.spacing-this.carry<1e-8)&&(this.carry=0)}this.x=e,this.z=t,this.time=i,this.energy=c,this.dx=n>0?r/n:this.dx??1,this.dz=n>0?o/n:this.dz??0}finish(e){this.carry>1e-6&&e(this.x,this.z,this.carry,this.energy??.25,this.dx??1,this.dz??0),this.carry=0}},Mi=`#version 300 es
precision highp float;
precision highp sampler2D;
precision highp int;
out vec4 outColor;
const float PI=3.141592653589793;
const float TAU=6.283185307179586;
`,Co=Mi+`
uniform sampler2D uSpectrum;
uniform int uSize,uImpulseCount,uContactCount;
uniform float uDt;
uniform vec4 uImpulses[32];
uniform vec2 uWidths[32];
uniform vec2 uWakeDirections[32];
uniform vec4 uContacts[4];
// Some GL drivers lower tanh(x) through positive exponentials. Deep-water
// dispersion reaches x > 10000, and click spectra reach x > 80: that lowering
// can produce infinity / infinity, poisoning the complete inverse FFT.
// This equivalent form only evaluates a non-positive exponential. Preserve
// tiny signed heights without subtractive cancellation around zero.
float waterTanh(float x){
  if(abs(x)<.0001)return x;
  float e=exp(-2.*abs(x));
  return sign(x)*(1.-e)/(1.+e);
}

float kernel(float k2,float sigma){
 return PI*pow(sigma,4.)*k2*exp(-.5*sigma*sigma*k2)*pow(float(uSize)/24.,2.);
}
vec2 phaseAt(vec2 k,vec2 p){
 float phase=-dot(k,p-vec2(-12.,-2.)-vec2(12./float(uSize)));
 return vec2(cos(phase),sin(phase));
}
void main(){
 ivec2 cell=ivec2(gl_FragCoord.xy);
 ivec2 frequency=ivec2(cell.x<uSize/2?cell.x:cell.x-uSize,cell.y<uSize/2?cell.y:cell.y-uSize);
 if(all(equal(frequency,ivec2(0)))){outColor=vec4(0);return;}
 vec2 k=vec2(frequency)*(TAU/24.);
 float k2=dot(k,k),m=sqrt(k2);
 vec4 state=texelFetch(uSpectrum,cell,0);
 for(int i=0;i<32;i++){
   if(i>=uImpulseCount)break;
   vec4 p=uImpulses[i];
   float shape=.55*kernel(k2,uWidths[i].x)+.45*kernel(k2,uWidths[i].y);
   vec2 direction=uWakeDirections[i];
   vec2 phase=phaseAt(k,p.xy);
   if(dot(direction,direction)>.5){
     float along=dot(k,direction),across=dot(k,vec2(-direction.y,direction.x));
     float narrow=uWidths[i].x,broad=uWidths[i].y;
     float a=narrow*1.85;
     float envelope=2.*PI*a*narrow*exp(-.5*(a*a*along*along+narrow*narrow*across*across))*pow(float(uSize)/24.,2.);
     float ribbon=envelope*narrow*narrow*across*across;
     float banks=kernel(k2,broad);
     shape=.84*ribbon+.16*banks;
     // The odd term transports momentum forward through the leading lip;
     // its zero-frequency coefficient is zero, like the transverse banks.
     vec2 forwardPhase=vec2(phase.y,-phase.x)*along*a*envelope*.24;
     state.xy+=phase*shape*p.z;
     state.zw+=(phase*shape+forwardPhase)*p.w;
   }else{state.xy+=phase*shape*p.z;state.zw+=phase*shape*p.w;}
 }
 vec2 equilibrium=vec2(0);
 for(int i=0;i<4;i++){
   if(i>=uContactCount)break;
   vec4 p=uContacts[i];
   float shape=.58*kernel(k2,p.w)+.42*kernel(k2,p.w*2.25);
   equilibrium+=phaseAt(k,p.xy)*shape*p.z;
 }
 float omega2=(9.80665*m+.00007293128*m*k2)*waterTanh(m*.85)*${(ne.tempo**2).toFixed(6)};
 float gamma=(.15+.0012*k2)*${ne.tempo.toFixed(6)};
 // Exact damped oscillator about the sustained pressure equilibrium.
 float w=sqrt(max(omega2-gamma*gamma,.000001));
 float c=cos(w*uDt),s=sin(w*uDt)/w,e=exp(-gamma*uDt);
 vec2 x=state.xy-equilibrium;
 outColor=vec4(equilibrium+e*((c+gamma*s)*x+s*state.zw),
               e*(-omega2*s*x+(c-gamma*s)*state.zw));
}
`,Do=Mi+`
uniform sampler2D uInput;
uniform int uSize,uStage,uAxis;
vec2 multiply(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}
void main(){
 ivec2 cell=ivec2(gl_FragCoord.xy);
 int index=uAxis==0?cell.x:cell.y;
 int halfStage=uStage/2;
 int even=(index/uStage)*halfStage+index%halfStage;
 ivec2 a=uAxis==0?ivec2(even,cell.y):ivec2(cell.x,even);
 ivec2 b=uAxis==0?ivec2(even+uSize/2,cell.y):ivec2(cell.x,even+uSize/2);
 vec4 av=texelFetch(uInput,a,0),bv=texelFetch(uInput,b,0);
 float angle=TAU*float(index)/float(uStage);
 vec2 twiddle=vec2(cos(angle),sin(angle));
 outColor=.5*(av+vec4(multiply(twiddle,bv.xy),multiply(twiddle,bv.zw)));
}
`,Po=Mi+`
uniform sampler2D uInput;
uniform int uSize;
float h(ivec2 p){return texelFetch(uInput,(p+uSize)%uSize,0).r;}
void main(){
 ivec2 p=ivec2(gl_FragCoord.xy);
 vec4 value=texelFetch(uInput,p,0);
 float step=24./float(uSize);
 vec2 gradient=vec2(h(p+ivec2(1,0))-h(p-ivec2(1,0)),h(p+ivec2(0,1))-h(p-ivec2(0,1)))/(2.*step);
 outColor=vec4(value.x,gradient,value.z);
}
`;function Z0(e,t){let i=e.createProgram();for(let[a,r]of[[e.VERTEX_SHADER,ct],[e.FRAGMENT_SHADER,t]]){let o=e.createShader(a);e.shaderSource(o,r),e.compileShader(o),e.attachShader(i,o)}if(e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(i));for(let a of e.getAttachedShaders(i))e.detachShader(i,a),e.deleteShader(a);return{program:i,locations:new Map}}function St(e,t,i=!1,a=!1){let r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,i||a?e.RGBA16F:e.RGBA32F,t,t,0,e.RGBA,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,i?e.LINEAR:e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,i?e.LINEAR:e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let o=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("Floating point tide target unavailable");return e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{texture:r,framebuffer:o,width:t,height:t}}var Fo=class{constructor(e,t,{mobile:i=!1}={}){this.gl=e,this.vao=t,this.size=i?256:512,this.evolution=Z0(e,Co),this.fft=Z0(e,Do),this.resolve=Z0(e,Po),this.spectra=[St(e,this.size),St(e,this.size)],this.scratch=[St(e,this.size,!1,!0),St(e,this.size,!1,!0)],this.output=St(e,this.size,!0),this.index=0,this.contacts=new Map,this.impulses=[],this.values=new Float32Array(128),this.widths=new Float32Array(64),this.wakeDirections=new Float32Array(64),this.pressures=new Float32Array(16),this.accumulator=0,this.lastTime=performance.now(),this.until=0,this.wasActive=!1,e.bindFramebuffer(e.FRAMEBUFFER,null)}contains(e,t){return e>-11.5&&e<11.5&&t>-1.5&&t<21.5}impulse(e,t,i,a,r=.18,o=.46,n=0,s=0){this.contains(e,t)&&(this.impulses.push({x:e,z:t,height:i,velocity:a,core:r,broad:o,dx:n,dz:s}),this.until=performance.now()+26e3)}begin(e,t,i,a,r=.5){!this.contains(t,i)||this.contacts.size>=4||(this.contacts.set(e,{x:t,z:i,started:a,moved:a,speed:0,depth:-me.depth*(.8+.4*r),sigma:me.sigma,sampler:new Ro(t,i,a)}),this.impulse(t,i,-.02,-.14,me.dropCore,me.dropBroad))}depositWake=(e,t,i,a,r=1,o=0)=>{var n;this.impulse(e,t,-.14*i*a,-2.2*i*a,me.wakeCore,me.wakeBroad,r,o),(n=this.onWake)==null||n.call(this,e,t,i,a)};move(e,t,i,a){let r=this.contacts.get(e);if(r){if(!this.contains(t,i)){this.end(e);return}r.speed=Math.hypot(t-r.x,i-r.z)/Math.max(.001,(a-r.moved)/1e3),r.moved=a,r.sampler.move(t,i,a,this.depositWake),r.x=t,r.z=i}}end(e){let t=this.contacts.get(e);t&&(t.sampler.finish(this.depositWake),this.contacts.delete(e),this.until=performance.now()+26e3)}endAll(){for(let e of this.contacts.keys())this.end(e)}location(e,t){return e.locations.has(t)||e.locations.set(t,this.gl.getUniformLocation(e.program,t)),e.locations.get(t)}pass(e,t,i){let a=this.gl;a.useProgram(e.program),a.bindVertexArray(this.vao),a.disable(a.BLEND),a.bindFramebuffer(a.FRAMEBUFFER,i.framebuffer),a.viewport(0,0,this.size,this.size),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,t.texture),a.uniform1i(this.location(e,"uSize"),this.size)}evolve(e,t,i){let a=this.gl,r=this.evolution;this.pass(r,this.spectra[this.index],this.spectra[1-this.index]),a.uniform1i(this.location(r,"uSpectrum"),0),a.uniform1f(this.location(r,"uDt"),e),this.values.fill(0),this.widths.fill(0),this.wakeDirections.fill(0),this.pressures.fill(0),t.forEach((n,s)=>{this.values.set([n.x,n.z,n.height,n.velocity],s*4),this.widths.set([n.core,n.broad],s*2),this.wakeDirections.set([n.dx,n.dz],s*2)});let o=0;for(let n of this.contacts.values()){let s=Math.min(1,Math.max(0,(i-n.started)/me.pressRamp)),c=n.speed*Math.exp(-Math.max(0,i-n.moved)/85),l=n.depth*(1-.72*Math.min(1,c/1.2));this.pressures.set([n.x,n.z,l*s*s*(3-2*s),n.sigma],o++*4)}a.uniform1i(this.location(r,"uImpulseCount"),t.length),a.uniform4fv(this.location(r,"uImpulses[0]"),this.values),a.uniform2fv(this.location(r,"uWidths[0]"),this.widths),a.uniform2fv(this.location(r,"uWakeDirections[0]"),this.wakeDirections),a.uniform1i(this.location(r,"uContactCount"),o),a.uniform4fv(this.location(r,"uContacts[0]"),this.pressures),a.drawArrays(a.TRIANGLES,0,3),this.index=1-this.index}reconstruct(){let e=this.gl,t=this.fft,i=this.spectra[this.index],a=0;for(let r=0;r<2;r++)for(let o=2;o<=this.size;o*=2){let n=this.scratch[a];this.pass(t,i,n),e.uniform1i(this.location(t,"uInput"),0),e.uniform1i(this.location(t,"uAxis"),r),e.uniform1i(this.location(t,"uStage"),o),e.drawArrays(e.TRIANGLES,0,3),i=n,a=1-a}this.pass(this.resolve,i,this.output),e.uniform1i(this.location(this.resolve,"uInput"),0),e.drawArrays(e.TRIANGLES,0,3)}update(e,t){let i=Math.min(Math.max((e-this.lastTime)/1e3,0),.1);if(this.lastTime=e,!(this.contacts.size>0||this.impulses.length>0||e<this.until)){if(this.wasActive)for(let o of[...this.spectra,this.output])this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,o.framebuffer),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT);this.wasActive=!1,this.accumulator=0;return}this.wasActive=!0,this.accumulator+=i;let a=Math.floor((this.accumulator+1e-9)/ne.dt);this.accumulator-=a*ne.dt;let r=!1;for(;this.impulses.length>32;)this.evolve(0,this.impulses.splice(0,32),e),r=!0;(a||this.impulses.length)&&(this.evolve(a*ne.dt,this.impulses.splice(0,32),e),r=!0);for(let o=0;o<a;o++)t==null||t();r&&this.reconstruct()}},Bt={azimuthMin:-3.141592653589793,azimuthMax:3.141592653589793,profile:[-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,.37691599130630493,.3794249892234802,.3801051378250122,.38220492005348206,.3842880427837372,.3852940499782562,.38696521520614624,.3906090557575226,.3937535285949707,.3962140381336212,.39765241742134094,.40122973918914795,.40399977564811707,.4053255319595337,.40598413348197937,.4081474244594574,.4091338515281677,.41146838665008545,.41194114089012146,.4142563045024872,.4144699275493622,.4143880605697632,.41348302364349365,.4114665389060974,.4091029465198517,.40587329864501953,.4030645489692688,.3998855948448181,.39451971650123596,.390166699886322,.3852575421333313,.380714476108551,.3772532343864441,.3740992546081543,.3714557886123657,.3705354928970337,.37153273820877075,.3709295094013214,.37104323506355286,.3718701899051666,.3734365701675415,.37186288833618164,.3747284412384033,.37492042779922485,.3756408095359802,.3735264539718628,.3761703670024872,.37606093287467957,.37631359696388245,.376510351896286,.3767339885234833,.37796786427497864,.37811750173568726,.37824946641921997,.37847575545310974,.37851160764694214,.376252681016922,.37670087814331055,.3765309751033783,.3765428066253662,.3759860396385193,.37506404519081116,.3761708736419678,.3763822913169861,.376389741897583,.37638089060783386,.378757119178772,.3737926483154297,.37318259477615356,.3722977936267853,.37443068623542786,.36891478300094604,.3695220947265625,.3700266182422638,.368072509765625,.36785757541656494,.365824431180954,.36099064350128174,.3602489233016968,.35784009099006653,.3566274046897888,.3546052873134613,.35120442509651184,.34687405824661255,.3463432490825653,.3436715006828308,.33667922019958496,.33547478914260864,.33327850699424744,.3288230299949646,.32779112458229065,.3257462680339813,.3197598457336426,.316189169883728,.3092455267906189,.30804893374443054,.3040773868560791,.2992576062679291,.2965073883533478,.29760757088661194,.29329973459243774,.29037046432495117,.2899937033653259,.29179757833480835,.29042261838912964,.29150503873825073,.29444846510887146,.2937012016773224,.2931613028049469,.2930426001548767,.292868435382843,.29172709584236145,.29116886854171753,.2908201813697815,.2885367274284363,.28862184286117554,.28570806980133057,.2849006950855255,.28280097246170044,.2717163860797882,.25312182307243347,.25064870715141296,.24640187621116638,.23632995784282684,.23319987952709198,.23001445829868317,.2233072966337204,.22125577926635742,.216008260846138,.21464136242866516,.20707933604717255,.20182998478412628,.1996132880449295,.19204121828079224,.19076842069625854,.18769526481628418,.17991648614406586,.17412298917770386,.16540414094924927,.15828478336334229,.14686612784862518,.14285250008106232,.13316217064857483,.1230490580201149,.11722846329212189,.1115385890007019,.10921325534582138,.10412189364433289,.10068442672491074,.09741634130477905,.09482581913471222,.09539904445409775,.0904393345117569,.09075015038251877,.093192458152771,.09253278374671936,.09307046234607697,.09408767521381378,.09456436336040497,.09019800275564194,.09040959924459457,.09022124856710434,.09508641064167023,.09562095254659653,.09591427445411682,.09572506695985794,.08887074887752533,.08944930881261826,.08858101069927216,.08771395683288574,.08273326605558395,.08380400389432907,.08269679546356201,.08037769049406052,.08154433965682983,.07808546721935272,.07609310746192932,.07011862099170685,.07466408610343933,.0669339969754219,.06460685282945633,.06405942142009735,.05870690569281578,.0544513575732708,.052611082792282104,.05070413649082184,.04592837765812874,.04603296518325806,.050133608281612396,.05419987440109253,.05807468667626381,.06332741677761078,.06739475578069687,.07145977765321732,.07667991518974304,.08111096918582916,.08510527014732361,.08842571824789047,.09339829534292221,.09885245561599731,.10519689321517944,.11075526475906372,.11514651775360107,.11802203953266144,.12075333297252655,.1256139874458313,.13037443161010742,.13335579633712769,.13590624928474426,.13845352828502655,.14051386713981628,.14281326532363892,.14462639391422272,.1474030315876007,.14993467926979065,.15206162631511688,.15375789999961853,.15510039031505585,.1568976193666458,.16047608852386475,.16244496405124664,.1619754284620285,.15956008434295654,.15911388397216797,.16051805019378662,.16220253705978394,.16339287161827087,.16817019879817963,.1691378653049469,.1733296662569046,.17635175585746765,.17739984393119812,.1781812608242035,.1788800060749054,.179578959941864,.1805102527141571,.18118412792682648,.18084801733493805,.1809125393629074,.18040704727172852,.1803770810365677,.17980511486530304,.17888100445270538,.1783691793680191,.17785581946372986,.17710234224796295,.17563144862651825,.17493033409118652,.17578718066215515,.17645862698554993,.17808093130588531,.17850945889949799,.17893598973751068,.1793605387210846,.1781248152256012,.17996591329574585,.1801469326019287,.17992591857910156,.17979110777378082,.17786075174808502,.1765793114900589,.1757817417383194,.17614437639713287,.1763828992843628,.1760745793581009,.175532266497612,.17000144720077515,.17798934876918793,.18044166266918182,.1830402910709381,.18508252501487732,.18801338970661163,.19068656861782074,.19288583099842072,.1943850964307785,.1968543529510498,.19853004813194275,.19969594478607178,.20005956292152405,.19948486983776093,.19708076119422913,.19639934599399567,.19776049256324768,.19648252427577972,.19823363423347473,.19928143918514252,.19990229606628418,.20020455121994019,.20006273686885834,.1997249573469162,.19983050227165222,.19970214366912842,.19841346144676208,.19805052876472473,.19810430705547333,.19685721397399902,.19602729380130768,.19612106680870056,.19644367694854736,.19630220532417297,.19524583220481873,.1948966234922409,.1967880129814148,.19962766766548157,.20184089243412018,.20416498184204102,.20613132417201996,.20815029740333557,.21119704842567444,.21485301852226257,.21767209470272064,.2193913459777832,.2214810848236084,.22390158474445343,.22508792579174042,.22688575088977814,.22867389023303986,.2303154319524765,.23202818632125854,.2334231734275818,.2347700595855713,.23560024797916412,.2359764128923416,.23699909448623657,.23832473158836365,.2413720041513443,.2436947226524353,.24627922475337982,.2482144832611084,.25055620074272156,.252065509557724,.2537287175655365,.255422443151474,.2573851943016052,.2590693533420563,.2595943212509155,.26089927554130554,.2619263827800751,.26327550411224365,.26422709226608276,.2644113302230835,.264626681804657,.2653657793998718,.2647804915904999,.26457858085632324,.26427149772644043,.2664474546909332,.2698238790035248,.2716246545314789,.2734459638595581,.27534791827201843,.27682632207870483,.278094083070755,.2793622314929962,.281468003988266,.2841964066028595,.2864077687263489,.3113132417201996,.3109165132045746,.2921828627586365,.29650065302848816,.2987038195133209,.2998643219470978,.3021745979785919,.3055926561355591,.30825933814048767,.3102712035179138,.3115549087524414,.31340160965919495,.3142159581184387,.3163806200027466,.3181276321411133,.3207624554634094,.32338985800743103,.32660284638404846,.3281813859939575,.3292769491672516,.3301006853580475,.330658882856369,.33153483271598816,.3322407603263855,.33308956027030945,.3339982032775879,.336342990398407,.3381139039993286,.33985790610313416,.34159502387046814,.34324055910110474,.34463974833488464,.34720635414123535,.3491968810558319,.35099461674690247,.3522225320339203,.3520236015319824,.35369664430618286,.35610437393188477,.35808098316192627,.35924243927001953,.3604559600353241,.3621419072151184,.36392471194267273,.365704745054245,.36587202548980713,.36725008487701416,.3692101836204529,.37044093012809753,.3718912601470947,.3729761242866516,.37464624643325806,.3760864734649658,.37633466720581055,.3769460916519165,.37964940071105957,.38137000799179077,.3817136287689209,.3899126946926117,.39389508962631226,.3882501423358917,.3882785439491272,.3892737030982971,.3897378146648407,.39019322395324707,.39150139689445496,.39715123176574707,.3923966884613037,.3935118615627289,.3955766558647156,.39682093262672424,.39756137132644653,.3979155123233795,.39838099479675293,.39896711707115173,.3998925983905792,.4014876186847687,.40231338143348694,.4035143554210663,.40474817156791687,.40536826848983765,.40616217255592346,.40641242265701294,.4066004753112793,.40643879771232605,.40606242418289185,.4052995443344116,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866,-1.5707963705062866],valleyAzimuth:-.10855485151228958,valleyAltitude:.044846922558071926,source:"Calibrated silhouette of the photographed 3D fjord; terrain outside the photographed field is unknown."},Ri={azimuthMin:-3.141592653589793,azimuthMax:3.141592653589793,profile:[-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,.2818322,.2792311,.2816794,.2810859,.2784019,.284062,.2810268,.2842516,.28498,.2791574,.2803143,.2827976,.282463,.2777171,.2786842,.2799308,.2799525,.2796941,.2729185,.2746071,.2768348,.2774539,.2749968,.2707791,.2755944,.2698503,.2689289,.2672422,.2651317,.2636069,.2636544,.2668379,.2611901,.2597935,.2585455,.2565503,.2578123,.2611801,.2588397,.2578614,.2548594,.258329,.2522748,.2536707,.2495166,.2438421,.2452239,.2394804,.2379481,.2323876,.2363947,.2333412,.2253831,.2215855,.2173794,.2099254,.2049864,.2033156,.1964449,.1851605,.1909261,.1859822,.1905899,.1793205,.1818454,.1807891,.1870297,.1777018,.1858223,.1820483,.1679342,.17483,.1735449,.173239,.1604331,.1517153,.1494186,.1430266,.1422635,.1397097,.1452586,.1391708,.1368377,.1331579,.1296852,.1284931,.1338417,.1286644,.1299291,.1238891,.1231831,.1277979,.13128,.1166836,.1119234,.1025429,.0974569,.0968662,.0956044,.0986105,.0947843,.0955305,.0936031,.0898324,.0900284,.0911706,.0916319,.0947912,.0936218,.0933664,.0941981,.0920615,.0942716,.0924392,.0915465,.089893,.0948629,.0934015,.0902712,.0916943,.0912729,.0906269,.0913425,.0948186,.0936056,.0902141,.0923163,.0924869,.093739,.0944914,.0955968,.0964288,.0948673,.0904143,.0901364,.0874394,.085261,.080935,.0799485,.0772059,.0786812,.0768509,.0747474,.072637,.0761364,.0809891,.0800595,.0826319,.0780642,.0787886,.0739841,.0775646,.0795124,.0798293,.0790803,.0794894,.0819336,.0840733,.0866062,.0884211,.09066,.0921823,.0931903,.0941996,.0954736,.0959977,.0971009,.0993737,.101033,.1026415,.1042523,.1058654,.1060021,.1076183,.1095329,.1105604,.1106981,.1105374,.1106726,.1110715,.11267,.1136654,.11479,.1161204,.1168534,.1172868,.1177197,.1184525,.1149212,.1141986,.1144842,.1156541,.1175281,.1180169,.1187457,.1191718,.1205064,.1212355,.1216748,.1236047,.1264614,.1265845,.126402,.1243893,.1245066,.125844,.1260263,.1266865,.1275493,.1287778,.1310089,.1320422,.1339954,.1359477,.1385176,.1386323,.1387456,.1385503,.1383531,.1384621,.1367427,.1352824,.1347515,.1327032,.1328012,.1332078,.1339235,.1343285,.1353727,.1369984,.1383332,.1390469,.1400056,.1425512,.1439817,.144383,.1444723,.145544,.1477592,.149403,.1498008,.1508203,.1524622,.1534805,.1535633,.1445895,.1447563,.1456776,.1507557,.1517678,.1521537,.1546937,.164454,.1676726,.169305,.1714363,.1735824,.1760357,.1783129,.1796276,.1811934,.1831859,.184522,.1872491,.189749,.1920939,.1931393,.1932003,.1940565,.1948693,.1958565,.1987804,.200617,.2022185,.2035082,.2044863,.2054625,.2058177,.2058614,.2065226,.2065626,.2059809,.2056943,.2057412,.2060834,.2048732,.2042808,.2046175,.2052626,.2066823,.2077876,.2093564,.212765,.2137234,.2149186,.2159129,.2174254,.2185062,.2199503,.2230373,.223963,.2252671,.2264224,.2273403,.2288704,.2303972,.2313068,.2328547,.2343443,.2355662,.2382854,.2385685,.2385436,.2360745,.2337689,.2299459,.2283137,.2255279,.2250033,.2257469,.2252134,.2247421,.2231608,.2231144,.2215288,.2217861,.2231421,.2235225,.2250965,.2289241,.2297797,.2304888,.2320523,.2332444,.2356116,.2361459,.2379454,.240246,.2425908,.2425051,.242114,.2399018,.237383,.2372902,.2371952,.2367948,.2345723,.2296122,.2295117,.2297129,.2296081,.2272453,.2153911,.2152863,.2151796,.2126302,.2100787,.207525,.2077152,.2091318,.2113554,.2137365,.2185039,.2195891,.220065,.2214452,.2258382,.2270314,.2279442,.2299869,.2319489,.2344204,.2354612,.2361803,.2398963,.2418323,.2431487,.2444265,.2456866,.245883,.2477719,.2490618,.2494631,.2530976,.2550668,.2553436,.2539689,.2537648,.2553139,.2594823,.2610139,.2628294,.2652171,.2673054,.2688072,.2702398,.2717904,.2724095,.2693206,.2684668,.268218,.2699751,.2702926,.273452,.2811735,.2817517,.2817486,.2831775,.2843067,.2874019,.2886975,.2890608,.2904426,.2915373,.2931838,.2951002,.2959027,.2977421,.2982994,.2992021,.3006754,.3011641,.2997214,.2988009,.2954551,.2926316,.2909093,.2901207,.2880127,.2876633,.2873113,.2858586,.2871476,.2870609,.2875669,.2879691,.2894411,.2907605,.2917367,.2924006,.2936685,.2951629,.2955725,.29544,.2954162,.2983762,.3020051,.3031364,.3040214,.305638,.3063442,.3061676,.3059876,.3063298,.3071604,.3077842,.3091542,.3110354,.3126444,.3126872,.313502,.3150837,.3169115,.3176163,.3187371,.3197655,.321295,.3217962,.3210756,.3197366,.3206971,.3220883,.3229451,.3213972,.3198484,.3188015,.3172049,.3141938,.3133954,.3158187,.3172837,.3177331,.3186846,.319794,.3214356,.3227885,.3244853,.3261812,.3273889,.3290844,.3300524,.3317483,.3329617,.3344172,.3358732,.3367076,.337957,.3394317,.3404197,.3409252,.3416578,.3427474,.3447375,.3463646,.3481423,.3500746,.351401,.3525522,.3536105,.3542397,.3557709,.3570779,.3585611,.3618369,.3646604,.3654344,.3653056,.3652853,.3656948,.3668729,.3664933,.3608127,.3604338,.3670746,.3662324,.3638586,.3617034,.3604198,.3554315,.3530606,.3554721,.3528817,.3515918,.3505159,.3466311,.3433968,.3377877,.3356398,.3343555,.331587,.3280406,.3253377,.320832,.3159001,.3144149,.313358,.3140098,.3197539,.3219916,.3166597,.3183057,.3183236,.3207637,.3231204,.3184657,.3183117,.3176331,.320802,.3168058,.3175239,.3220086,.3249842,.3234479,.3226436,.323943,.3243647,.3266595,.3285529,.3281402,.3296514,.3308295,.3290157,.3329389,.3349695,.33008,.3327461,.3326251,.33294,.3330021,.3394108,.336307,.337425,.338954,.3394599,.3407726,.3435007,.3441896,.3461077,.3460063,.346377,.3483168,.3483584,.3513162,.3550491,.3530207,.3520781,.3541271,.3560036,.3556236,.3543234,.3573342,.3570411,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963],source:"Lago d\u2019Isola 16K, calibrated to Vast shoreline geometry"},Ci={azimuthMin:-3.141592653589793,azimuthMax:3.141592653589793,profile:[-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,.0816446,.0813894,.0813246,.0812559,.0819733,.0813051,.0818227,.0817416,.081456,.0817691,.0816772,.0816507,.0816855,.0819917,.0818867,.0826017,.0836541,.0868375,.0878806,.088615,.0889326,.0888289,.0889323,.08861,.0882823,.0879494,.0873972,.0872677,.0869865,.0867812,.0864227,.0864944,.0859198,.0855353,.0853767,.0836791,.0837203,.0835464,.0829231,.0827404,.0830026,.0838219,.0846528,.0849161,.084707,.0845294,.0843307,.0838992,.0838675,.083713,.0832687,.0832834,.0835285,.0837728,.0835484,.0833205,.083795,.0837981,.0837991,.083798,.0840327,.0835507,.0835425,.0835323,.0832792,.0830228,.0830049,.082985,.0829629,.0829388,.0834016,.0839158,.0845744,.0847928,.0854505,.0867128,.0873671,.0881464,.0893643,.0898363,.0900582,.0902792,.0904994,.0907186,.0906841,.0906475,.0906088,.0903133,.0902699,.0902244,.0901769,.0901274,.0903336,.0902806,.0904845,.090428,.0901094,.0897876,.0897239,.0896582,.0893281,.0889949,.0889221,.0885832,.0882412,.0881614,.0880797,.0877295,.0873763,.0864849,.0863004,.0857611,.0851254,.0847555,.0843825,.0840066,.0836278,.083246,.0825887,.0819274,.0820832,.0814156,.0810188,.0806176,.0802166,.0798113,.0791263,.0784356,.0782445,.0775954,.0757762,.0747874,.0743539,.0725146,.0717919,.0713471,.0708996,.070732,.0708457,.0703915,.0699347,.0695218,.069013,.0682626,.0677947,.0675595,.0671378,.0663751,.0655993,.064839,.0640657,.0635782,.0629942,.0623054,.0615901,.0610208,.0605198,.0598279,.059218,.0584163,.0579045,.0576841,.057168,.056944,.0567184,.0559004,.0556709,.0548472,.0540203,.0531903,.052357,.0518184,.0512775,.051033,.0501887,.0496407,.0493903,.048838,.0479827,.0471244,.0463232,.0457001,.045135,.0445675,.0439977,.0437288,.0432357,.042882,.0423034,.0423317,.0417489,.0414691,.0406389,.039986,.0403124,.0406381,.0406711,.0412876,.0416112,.0419287,.0419356,.0422488,.0425601,.0428695,.0431768,.0434818,.0431644,.0434634,.0431384,.0434304,.0434075,.04338,.0433473,.0436207,.0435209,.0432125,.0431529,.0430846,.0430064,.0432303,.0425011,.0423838,.0422493,.0414661,.0419165,.0413568,.0398941,.0386646,.0380127,.0376683,.0370004,.0366457,.0369214,.0368787,.0373331,.0374205,.0373712,.037002,.0369475,.0368903,.0377843,.0378623,.0379751,.037907,.0378356,.0377609,.0376827,.0372817,.037196,.0383842,.0386107,.0401121,.041477,.0418252,.0429764,.0446759,.0457279,.0470928,.0481295,.0484573,.0495367,.0504099,.0512288,.0518999,.0528039,.052622,.0537153,.0547989,.0557331,.0569769,.0587513,.0718713,.0638361,.0663046,.0677906,.0678371,.0691119,.0692308,.0709499,.0719987,.0733404,.0752417,.0765211,.0779749,.0790778,.0800334,.0809882,.0812991,.0819306,.0832043,.0841555,.0854273,.086698,.0893919,.0934121,.1009712,.1290176,.1613282,.1771977,.1785818,.2005808,.2019488,.2098795,.2188059,.2123413,.2092536,.2037816,.2007576,.2067982,.209977,.2186068,.2234934,.2215972,.2314485,.2336384,.2355644,.2358757,.2413174,.2478863,.2590347,.2597081,.2582775,.2616842,.2668735,.2648415,.2554338,.252308,.2407348,.2361546,.2312928,.2347443,.2264895,.2256278,.2191756,.2239611,.2275343,.2226869,.2225033,.2219072,.2206943,.2242421,.3068983,.307082,.3159823,.3101765,.3174452,.3234442,.3221143,.3227377,.3247042,.3200888,.2989683,.3133336,.3039807,.3179202,.3269653,.3218693,.319562,.3456839,.3321423,.3503905,.342396,.3394523,.3527415,.3575405,.3521895,.352473,.3566618,.3396606,.3430201,.3432519,.3438356,.3469159,.35199,.3559685,.3717091,.3758892,.3814239,.3832793,.3895544,.3914443,.3884817,.3833951,.3839476,.3862781,.3838981,.3726131,.3669115,.363647,.3612551,.3569875,.3583814,.3669089,.3658623,.3561353,.3652367,.3611792,.3570295,.3329141,.3364867,.3356497,.3273676,.3259636,.32761,.326489,.327021,.3252106,.3123044,.3316521,.3186995,.3287965,.3312016,.3250623,.3134955,.3054761,.2979721,.2993307,.2990194,.3367889,.3392129,.3389765,.335709,.3366969,.3647874,.3677248,.3686307,.3976983,.4028592,.4046931,.4031927,.40945,.4100968,.4190218,.427275,.4287463,.4349711,.441598,.4513587,.4541625,.4594242,.4615793,.4620764,.4653328,.4637767,.4634877,.4633794,.5037034,.5103689,.5110024,.5134029,.5134918,.5126239,.5117508,.5123977,.5150087,.5212549,.5243204,.5265784,.5382659,.5369574,.539406,.5388941,.5384971,.535122,.5305313,.5304837,.5253071,.5232922,.524449,.5227855,.5082549,.5081472,.5069632,.5039246,.5043946,.4975206,.4940296,.4947662,.492703,.4902006,.4900632,.4843252,.4770494,.4757497,.4704822,.4699112,.4695157,.4612674,.4612167,.4611755,.4526312,.3798406,.3788219,.3802024,.3788911,.3685036,.3595514,.3356128,.3323334,.339242,.343656,.3432923,.3468153,.3509034,.3599698,.3609509,.3616979,.3650935,.3683787,.3694157,.3635493,.360835,.3562141,.3550192,.3510695,.3468658,.3607937,.4283551,.4279941,.4302536,.429563,.4301461,.4250108,.423287,.4296488,.433259,.427782,.4249843,.4239029,.4255611,.4388172,.4370343,.4429135,.4447318,.4571996,.4614861,.4634525,.4631908,.4597588,.456937,.4683324,.4705741,.482801,.4978052,.515526,.5137767,.5297134,.5252657,.5258921,.5566531,.5553445,.5540291,.5525388,.5513782,.5500426,.5487003,.5473512,.5459954,.5446328,.5432634,.5418873,.5405044,.5391147,.5377182,.5363148,.5349047,.5334878,.532064,.5306335,.5291961,.5277518,.5263007,.5248428,.523378,.5219063,.5204278,.5189424,.5174501,.5159509,.5144449,.5129319,.5114121,.5098853,.5083517,.5068111,.5052637,.5037093,.5021479,.5005797,.4990045,.4974224,.4958333,.4942373,.4919032,.4899067,.4866907,.4877838,.4861531,.4845153,.4828707,.481219,.4795604,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963,-1.5707963],source:"Original Lakeside 16K, calibrated to Vast shoreline geometry"},J0,Q0;function ir(e,t=""){if(J0===void 0){let o=$e(12);J0=o.sunAzimuth-Math.atan2(o.direction[0],o.direction[2])}if(Q0===void 0){let o=12,n=24;for(let s=0;s<36;s++){let c=(o+n)/2;$e(c).sunAltitude>Bt.valleyAltitude?o=c:n=c}Q0=$e((o+n)/2).sunAzimuth-Bt.valleyAzimuth}let i=t==="mountains"?Q0:J0,a=(o,n)=>[Math.sin(o-i)*Math.cos(n),Math.sin(n),Math.cos(o-i)*Math.cos(n)],r=Math.max(0,Math.min(1,(.19-e.sunAltitude)/.19));return{sun:a(e.sunAzimuth,e.sunAltitude),moon:a(e.moonAzimuth,e.moonAltitude),sunRadius:.011+.009*r*r*(3-2*r),sunset:e.magicHour,moonPhase:e.moonIllumination}}function Lo(e,t,i){if(!i)return[...e,1];let a=Math.atan2(e[0],e[2]),r=Math.asin(Math.max(-1,Math.min(1,e[1]))),{profile:o,azimuthMin:n,azimuthMax:s}=i,c=0,l=0,u=0;for(let m=0;m<73;m++){let v=m*2.399963,f=t*Math.sqrt((m+.5)/73),p=Math.cos(v)*f/Math.max(Math.cos(r),.1),y=Math.sin(v)*f,g=(a+p-n)/(s-n)*(o.length-1),x=Math.max(0,Math.min(o.length-2,Math.floor(g))),w=Math.max(0,Math.min(1,g-x)),k=o[x]*(1-w)+o[x+1]*w,F=Math.max(0,Math.min(1,(r+y-k+7e-4)/.0014)),I=F*F*(3-2*F);c+=I,l+=p*I,u+=y*I}if(c<1e-6)return[...e,0];let d=a+l/c,h=r+u/c;return[Math.sin(d)*Math.cos(h),Math.sin(h),Math.cos(d)*Math.cos(h),c/73]}function Io(e,t,i,a){if(!i||a<=0||a>=1)return[...e,0];let r=Math.atan2(e[0],e[2]),o=Math.asin(e[1]),{profile:n,azimuthMin:s,azimuthMax:c}=i,l=0,u=0,d=0;for(let v=0;v<9;v++){let f=(v-4)/4.5,p=f*t/Math.max(Math.cos(o),.1),y=(r+p-s)/(c-s)*(n.length-1),g=Math.max(0,Math.min(n.length-2,Math.floor(y))),x=Math.max(0,Math.min(1,y-g)),w=n[g]*(1-x)+n[g+1]*x,k=(w-o)/t,F=Math.max(0,1-f*f-k*k);l+=(r+p)*F,u+=w*F,d+=F}if(d<1e-8)return[...e,0];let h=l/d,m=u/d;return[Math.sin(h)*Math.cos(m),Math.sin(m),Math.cos(h)*Math.cos(m),4*a*(1-a)]}function ar(e,t="",i=!1,a=.012){let r=t==="mountains"?Bt:t==="lakeside"?Ci:t==="disola"?Ri:null;if(!r)return 1;let{profile:o,azimuthMin:n,azimuthMax:s}=r,c=Math.atan2(e[0],e[2]),l=Math.asin(Math.max(-1,Math.min(1,e[1]))),u=0;for(let d=0;d<37;d++){let h=d*2.399963,m=a*Math.sqrt((d+.5)/37),v=(c+Math.cos(h)*m/Math.max(Math.cos(l),.1)-n)/(s-n)*(o.length-1),f=Math.max(0,Math.min(o.length-2,Math.floor(v))),p=Math.max(0,Math.min(1,v-f)),y=o[f]*(1-p)+o[f+1]*p,g=l+Math.sin(h)*m-y,x=Math.max(0,Math.min(1,(g+5e-4)/.001));u+=x*x*(3-2*x)}return u/37}var zo=class{update(e,t,i=.65){if(this.hour===void 0)return this.hour=e,this.now=t,this.phase=e*120,this.breeze=i,this.wind=[this.phase*(2.4+i*2.2),this.phase*.93],this.phase;let a=(e-this.hour+36)%24-12,r=Math.min(Math.max((t-this.now)/1e3,0),.1)+a*120;return this.phase+=r,this.wind[0]+=r*(2.4+(this.breeze+i)*1.1),this.wind[1]+=r*.93,this.breeze=i,this.hour=e,this.now=t,this.phase}};function ga(e){let t=Math.max(0,Math.cos((e-13)*Math.PI/14));return Math.round(8+80*t*t)}var Bo=`#version 300 es
precision highp float;
precision highp sampler2D;
layout(location=0) in vec4 aParticle;
layout(location=1) in float aOpacity;
uniform vec3 uCameraPosition,uCameraForward,uCameraRight,uCameraUp;
uniform float uTanHalfFov,uAspect,uHeight,uTouchGain;
uniform sampler2D uTide;
out float vOpacity,vRadiusPixels,vViewDepth;
out vec3 vCentre;
void main(){
 vec3 relative=aParticle.xyz-uCameraPosition*.44;
 float distance=dot(relative,uCameraForward);
 vec2 projected=vec2(dot(relative,uCameraRight)/(uTanHalfFov*uAspect),dot(relative,uCameraUp)/uTanHalfFov);
 gl_Position=vec4(projected,0.,distance);
 float diameter=aParticle.w*uHeight/(uTanHalfFov*max(distance,.05));
 gl_PointSize=clamp(diameter,1.,18.);
 vRadiusPixels=gl_PointSize*.5;
 vec2 uv=(aParticle.xz-vec2(-12.,-2.))/24.;
 float surface=textureLod(uTide,uv,0.).r*uTouchGain;
 // Keep subpixel drops from becoming a screen full of equally bright dots.
 vOpacity=aOpacity*min(1.,diameter*diameter)*step(.002,aParticle.y-surface)*step(.05,distance);
 vCentre=aParticle.xyz;vViewDepth=distance;
}
`,Uo=`#version 300 es
precision highp float;
precision highp sampler2D;
in float vOpacity,vRadiusPixels,vViewDepth;
in vec3 vCentre;
out vec4 outColor;
uniform vec3 uCameraPosition,uCameraForward,uCameraRight,uCameraUp;
uniform vec3 uSprayDirection,uSprayLight;
uniform float uSprayPower,uSprayExposure,uSpraySourceVisibility;
uniform vec2 uSprayTexel;
uniform sampler2D uSprayBackground,uSprayDepth;
${ki}
float sprayFresnel(float c){
 c=clamp(c,.0001,1.);
 float transmitted=sqrt(1.-(1.-c*c)/(1.333*1.333));
 float rs=(c-1.333*transmitted)/(c+1.333*transmitted);
 float rp=(1.333*c-transmitted)/(1.333*c+transmitted);
 return .5*(rs*rs+rp*rp);
}
void main(){
 vec2 p=gl_PointCoord*2.-1.;
 float r=dot(p,p);
 if(r>1.||vOpacity<.002)discard;
 vec2 screen=gl_FragCoord.xy*uSprayTexel;
 float depth=textureLod(uSprayDepth,screen,0.).r;
 float sceneDistance=2.*.12*14000./(14000.+.12-(depth*2.-1.)*(14000.-.12));
 if(depth<.9999999&&vViewDepth>sceneDistance+.015)discard;
 vec3 view=normalize(uCameraPosition*.44-vCentre);
 // Spherical impostor: the camera basis, rather than a painted corner,
 // determines the world normal and where sun/sky reflections appear.
 vec3 normal=normalize(uCameraRight*p.x-uCameraUp*p.y-uCameraForward*sqrt(max(0.,1.-r)));
 float nv=max(dot(normal,view),.0001),F=sprayFresnel(nv);
 vec3 reflection=reflect(-view,normal);
 vec4 centre=textureLod(uSprayBackground,screen,0.);
 vec3 background=unpackLight(centre.rgb);
 vec2 bend=vec2(p.x,-p.y)*sqrt(max(0.,1.-r))*vRadiusPixels*.26*uSprayTexel;
 vec3 transmitted=unpackLight(textureLod(uSprayBackground,screen-bend,0.).rgb);
 vec3 reflected=sampleSky(reflection,1.).rgb*uSprayExposure;
 // The lower hemisphere reflects the nearby water, not a bright sky dome.
 reflected=mix(background,reflected,smoothstep(-.06,.12,reflection.y));
 vec3 halfway=normalize(view+uSprayDirection);
 float nh=max(dot(normal,halfway),0.),nl=max(dot(normal,uSprayDirection),0.);
 // Integrate a small source over the pixel footprint of the sphere.
 float alpha=max(.025,.40/max(vRadiusPixels,1.)),a2=alpha*alpha;
 float den=nh*nh*(a2-1.)+1.;
 float D=a2/(3.14159265*den*den);
 float masking=2.*nv/(nv+sqrt(a2+(1.-a2)*nv*nv));
 float visible=worldVisibility(vCentre,normal)*uSpraySourceVisibility;
 vec3 direct=uSprayLight*uSprayPower*uSprayExposure*visible
   *D*masking*sprayFresnel(max(dot(view,halfway),.0001))*nl/max(4.*nv,.02);
 vec3 radiance=transmitted*(1.-F)+reflected*F+direct*.23;
 float coverage=(1.-smoothstep(max(0.,1.-1.5/max(vRadiusPixels,1.)),1.,r))*vOpacity;
 // Read a separate snapshot, mix in linear radiance, then encode once.
 // Hardware alpha blending the companded lighting caused milky bead rims.
 vec3 color=mix(background,radiance,coverage);
 outColor=vec4(sqrt(max(color,vec3(0.))/(1.+max(color,vec3(0.)))),centre.a*(1.-coverage));
}
`,_o=class{constructor(e,{mobile:t=!1}={}){this.gl=e,this.limit=t?96:240,this.particles=[],this.pending=[],this.seed=7331,this.values=new Float32Array(this.limit*5),this.program=e.createProgram();for(let[i,a]of[[e.VERTEX_SHADER,Bo],[e.FRAGMENT_SHADER,Uo]]){let r=e.createShader(i);e.shaderSource(r,a),e.compileShader(r),e.attachShader(this.program,r)}if(e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(this.program));for(let i of e.getAttachedShaders(this.program))e.detachShader(this.program,i),e.deleteShader(i);this.uniforms=new Map,this.vao=e.createVertexArray(),this.buffer=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,this.values.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,4,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,1,e.FLOAT,!1,20,16),e.bindVertexArray(null)}random(){return this.seed=Math.imul(this.seed,1664525)+1013904223>>>0,this.seed/4294967296}burst(e,t,i=1,a=performance.now(),r=85){this.pending.push({x:e,z:t,energy:i,time:a+r})}wake(e,t,i,a){a<.75||this.random()<i*7&&this.burst(e,t,a*.35,performance.now(),0)}emit(e){let t=Math.max(2,Math.round((this.limit<200?10:24)*e.energy));for(let i=0;i<t;i++){let a=this.random()*Math.PI*2,r=.025+this.random()*.1,o=(.1+this.random()*.65)*Math.sqrt(e.energy);this.particles.push({x:e.x+Math.cos(a)*r,z:e.z+Math.sin(a)*r,vx:Math.cos(a)*o,vz:Math.sin(a)*o,vy:(.85+this.random()*1.25)*Math.sqrt(e.energy),radius:.0018+this.random()*.0044,time:e.time})}this.particles.length>this.limit&&this.particles.splice(0,this.particles.length-this.limit)}render(e,t,i){for(let d of this.pending.filter(h=>h.time<=t))this.emit(d);if(this.pending=this.pending.filter(d=>d.time>t),this.particles=this.particles.filter(d=>{let h=(t-d.time)/1e3;return h>=0&&.018+d.vy*h-4.903325*h*h>0}),!this.particles.length||e.altSettings.ripple===0||!e.waterSurfaceEnabled)return;let a=this.gl,r=e.camera;this.particles.forEach((d,h)=>{let m=(t-d.time)/1e3,v=.018+d.vy*m-4.903325*m*m;this.values.set([d.x+d.vx*m,v,d.z+d.vz*m,d.radius,Math.min(1,m/.045)*Math.min(1,v/.035)],h*5)}),a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindBuffer(a.ARRAY_BUFFER,this.buffer),a.bufferSubData(a.ARRAY_BUFFER,0,this.values.subarray(0,this.particles.length*5));let o=d=>(this.uniforms.has(d)||this.uniforms.set(d,a.getUniformLocation(this.program,d)),this.uniforms.get(d));for(let[d,h]of[["Position",r.position],["Forward",r.forward],["Right",r.right],["Up",r.up]])a.uniform3fv(o("uCamera"+d),h);a.uniform1f(o("uTanHalfFov"),r.tanHalfFov),a.uniform1f(o("uAspect"),e.aspect),a.uniform1f(o("uHeight"),e.sceneTarget.height),a.uniform1f(o("uTouchGain"),e.altSettings.ripple/100*(e.activeBed==="salt"?.55:1));let n=e.worldRenderer;if(!(n!=null&&n.ready))return;let s=e.sceneTarget.width,c=e.sceneTarget.height;(!this.background||this.background.width!==s||this.background.height!==c)&&(this.background&&(a.deleteTexture(this.background.texture),a.deleteFramebuffer(this.background.framebuffer)),this.background=Ke(a,s,c,e.floatTargets?{internalFormat:a.RGBA16F}:{})),a.bindFramebuffer(a.READ_FRAMEBUFFER,e.sceneTarget.framebuffer),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,this.background.framebuffer),a.blitFramebuffer(0,0,s,c,0,0,s,c,a.COLOR_BUFFER_BIT,a.NEAREST),a.bindFramebuffer(a.FRAMEBUFFER,e.sceneTarget.framebuffer);let l=(d,h,m)=>{a.activeTexture(a.TEXTURE0+h),a.bindTexture(a.TEXTURE_2D,m),a.uniform1i(o(d),h)};l("uTide",0,e.tide.output.texture),l("uSprayBackground",1,this.background.texture),l("uSkyMap",2,n.sky.texture),l("uCloudShadow",3,n.cloud.texture),l("uShadowMap",4,n.shadow.depthTexture),l("uSprayDepth",5,n.scene.depthTexture);let u=n.weather.uSourceDirection;a.uniform3fv(o("uShadowLightDirection"),u),a.uniform3fv(o("uSprayDirection"),u),a.uniform3fv(o("uSprayLight"),n.sourceColor),a.uniform1f(o("uSprayPower"),n.sourcePower),a.uniform1f(o("uSprayExposure"),e.altSettings.exposure/100*(1+i.night*5)),a.uniform1f(o("uSpraySourceVisibility"),ar(u,e.activeEnvironment,Y(),e.celestial.source==="sun"?ir(e.celestial,e.activeEnvironment).sunRadius:.0045)),a.uniformMatrix4fv(o("uShadowMatrix"),!1,n.shadowMatrix),a.uniform1f(o("uShadowTexel"),1/n.shadow.width),a.uniform2f(o("uSprayTexel"),1/s,1/c),a.disable(a.BLEND),a.drawArrays(a.POINTS,0,this.particles.length),a.bindVertexArray(e.screenVao)}},No=`#version 300 es
precision highp float;
precision highp sampler2D;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUV;
layout(location=3) in vec3 aPivot;
layout(location=4) in vec3 aMotion;
uniform mat4 uViewProjection;
uniform float uWindTime,uBreeze,uLakePhoto,uFjord,uDisola;
// One world-space medium for the sky, ground shadow cache and elevated land.
precision highp sampler3D;
uniform sampler3D uCloudVolume,uCloudDensity;
uniform float uCloudCoverage,uCloudFade,uFjordWeather,uFjordStratus,uFjordClearing;
uniform vec2 uCloudOffset;
uniform vec3 uSourceDirection;
#define CLOUD_BASE mix(1250.,650.,uFjordWeather)
#define CLOUD_TOP mix(mix(3400.,2350.,uFjordWeather),1750.,uFjordStratus)
const float CLOUD_EXTINCTION=.023;
vec2 filteredCloudProperties(vec3 p,float lod){
 float h=(p.y-CLOUD_BASE)/(CLOUD_TOP-CLOUD_BASE);
 if(h<=0.||h>=1.)return vec2(0.);
 if(uFjordStratus>.5){
   // A connected stratus bank with stretched, feathered openings. Its
   // horizontal structure is independent of height: no isolated cumulus lobes.
   vec2 q=mat2(.94,-.342,.342,.94)*(p.xz-uCloudOffset);
   vec4 broadField=textureLod(uCloudVolume,vec3(q.x/9000.,.37,q.y/7000.),max(0.,lod-2.));
vec4 wispField=textureLod(uCloudVolume,vec3(q.x/4200.,h*.12+.21,q.y/1150.),max(0.,lod-1.));
float broad=broadField.r;
// B/A are finer, continuous world-space channels in the same sampledvolume.
// Preserve the broad weather layout; perturb the transition shape only.
float detail=(dot(wispField.ba,vec2(.68,.32))-.494)*2.;
float detailWeight=1.-smoothstep(.5,2.8,lod);
   float wisp=clamp(wispField.g+detail*.16*detailWeight,0.,1.);
   float opening=mix(.46,.64,uFjordClearing)+.025*sin(uCloudOffset.x*.00012);
   float sheet=smoothstep(opening,mix(.64,.82,uFjordClearing),broad*mix(.78,.45,uFjordClearing)+wisp*mix(.22,.55,uFjordClearing));
   float feather=mix(.50,1.,smoothstep(.20,.76,wisp));
   float envelope=smoothstep(0.,.18,h)*(1.-smoothstep(.58,1.,h));
   float amount=mix(.42,1.,uCloudFade)*uCloudCoverage/.48*mix(1.,.09,uFjordClearing);
   float density=sheet*feather*envelope*.16*amount;
   return vec2(density,sheet*feather*(1.-h)*2.4*amount);
 }
 vec2 field=textureLod(uCloudDensity,vec3((p.xz-uCloudOffset)/mix(vec2(26000.),vec2(31000.,20500.),uFjordWeather),h),lod).rg;
 float amount=uCloudFade*uCloudFade*uCloudCoverage/.48;
 if(uFjordWeather>.5){
   // Anisotropic erosion opens thin, feathered gaps instead of making the
   // whole cloud bank a uniformly transparent version of the old cumulus.
   vec3 drift=vec3(uCloudOffset.x,0.,uCloudOffset.y);
   float wisps=textureLod(uCloudVolume,(p-drift)/vec3(5800.,900.,1700.),0.).g;
   amount*=mix(.18,.80,smoothstep(.12,.84,wisps));
 }
 vec2 medium=field*field*vec2(.65,24.)*amount;
if(uFjordWeather<.5&&field.x>.01&&field.x<.58&&lod<2.8){
  vec3 drift=vec3(uCloudOffset.x,0.,uCloudOffset.y);
  // Medium-scale billows, never per-pixelwhite noise. Filter relative to the
  // density footprint: noisevoxel size differs from basefield voxel size.
  vec3 baseVoxel=vec3(float(textureSize(uCloudDensity,0).x)/26000.,
    float(textureSize(uCloudDensity,0).z)/(CLOUD_TOP-CLOUD_BASE),
    float(textureSize(uCloudDensity,0).y)/26000.);
  vec3 detailVoxel=vec3(textureSize(uCloudVolume,0))/vec3(3600.,1800.,5200.);
  vec3 ratio=detailVoxel/baseVoxel;
  float detailLod=max(0.,lod+log2(max(ratio.x,max(ratio.y,ratio.z))));
  vec4 detailField=textureLod(uCloudVolume,(p-drift)/vec3(3600.,1800.,5200.),detailLod);
  float detail=(dot(detailField.ba,vec2(.68,.32))-.494)*2.;
  float shell=smoothstep(.01,.08,field.x)*(1.-smoothstep(.24,.58,field.x));
  // Redistribute existingdensity rather than only eroding it, which otherwise
  // removes cloudcover and brightens the entire scene. Keep the coarsecolumn
  // integral/lighting unchanged and bound the perturbation to cloudedges.
  medium.x*=1.+detail*.32*shell*(1.-smoothstep(.6,2.8,lod));
}
return medium;

}
vec2 cloudProperties(vec3 p){return filteredCloudProperties(p,0.);}
float densityAt(vec3 p){return cloudProperties(p).x;}
float cloudTransmission(vec3 origin,vec3 direction){
 if(uCloudFade<.002||uCloudCoverage<.004)return 1.;
 if(direction.y<=.001)return 0.;
 float start=max(0.,(CLOUD_BASE-origin.y)/direction.y);
 float end=(CLOUD_TOP-origin.y)/direction.y;
 if(end<=start)return 1.;
 float stepLength=(end-start)/24.,opticalDepth=0.;
 // A long grazing segment covers many density voxels. Integrating their
 // filtered mean prevents the 24 midpoint samples from drawing contour bands
 // across elevated receivers as the sun moves. Keep the existing step budget.
 vec2 voxel=mix(vec2(26000.),vec2(31000.,20500.),uFjordWeather)/vec2(textureSize(uCloudDensity,0).xy);
 float footprint=max(abs(direction.x)*stepLength/voxel.x,abs(direction.z)*stepLength/voxel.y);
 float lod=clamp(log2(max(1.,footprint))-.25,0.,4.);
 for(int i=0;i<24;i++){
   vec3 p=origin+direction*(start+(float(i)+.5)*stepLength);
   opticalDepth+=filteredCloudProperties(p,lod).x*stepLength*CLOUD_EXTINCTION;
 }
 return exp(-opticalDepth);
}

// Shared eye-to-surface transport, in the renderer's metre coordinates.
// Terrain, reflected terrain and the non-reflected water component use this
// exact function. No screen-side masks or separate twilight color curves.
uniform sampler2D uValleyAtmosphere;
precision highp sampler3D;
uniform sampler3D uValleyNoise;
uniform float uMistTime,uMistSolar,uMistStrength;
uniform vec2 uMistWind;
float mistErf(float x){
 float a=abs(x),t=1./(1.+.3275911*a);
 return sign(x)*(1.-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*exp(-a*a));
}
float mistBand(vec2 heights,float centre,float width){
 vec2 h=(heights-centre)/width;
 float delta=h.y-h.x;
 if(abs(delta)<.02)return exp(-pow((h.x+h.y)*.5,2.));
 return max(0.,.886226925*(mistErf(h.y)-mistErf(h.x))/delta);
}
float valleyMistDensity(vec3 point,vec2 heights){
 // Fold the mirrored camera path at the water plane: reflected banks and
 // sky see the same moving volume as the direct view, never a flat overlay.
 vec3 p=vec3(point.x,abs(point.y),point.z);
 // The right shore begins only ~140 m away. Starting fog at 80\u2013320 m
 // left it outside most of the volume while the kilometre-distant left
 // shore received the full layer. Bring the same volume across both banks.
 float range=smoothstep(60.,110.,p.z)*(1.-smoothstep(6200.,9000.,p.z));
 if(range<.001||p.y>650.)return 0.;
 vec3 drift=vec3(uMistWind.x*.12+uMistTime*.60,0.,uMistWind.y*.12+uMistTime*.32);
 vec3 q=p-drift;
 float broad=textureLod(uValleyNoise,q/vec3(1100.,210.,850.),1.).r;
 float fine=textureLod(uValleyNoise,q/vec3(380.,105.,280.)+vec3(.31,.19,.73),1.).g;
 float filament=smoothstep(.24,.69,broad*.62+fine*.38);
 float lowCentre=42.+23.*sin(p.z*.003+p.x*.0016+uMistTime*.007);
 // Integrate the thin height profile analytically within each ray segment.
 // A point-sampled layer otherwise becomes disconnected stripes on slopes.
 float low=mistBand(heights,lowCentre,55.);
 float highCentre=190.+60.*sin(p.z*.0017-p.x*.002+uMistTime*.005);
 float high=mistBand(heights,highCentre,105.);
 // Pockets dissolve as they advect. The scene-hour envelope supplies the
 // morning build-up and complete afternoon dissipation independently.
 float life=.38+.62*pow(.5+.5*sin(uMistTime*.038+p.z*.0021+p.x*.0013),2.);
 float warmth=mix(1.,.50,smoothstep(10.,55.,uMistSolar));
 // A thin continuous carrier joins the advected wisps. A shallow foreground
 // bank has enough local density to be visible on near faces, tapering into
 // the distant valley instead of making its long paths uniformly opaque.
 float foreground=1.-smoothstep(180.,650.,p.z);
 float structure=.05+life*filament;
 return range*warmth*structure*(low*mix(.00065,.0044,foreground)
   +high*mix(.0004,.0008,foreground))*uMistStrength;
}
float valleyMistDepth(vec3 eye,vec3 point,float kind){
 if(kind<1.5||kind>2.5||uMistStrength<=0.)return 0.;
 vec3 delta=point-eye;
 float distance=min(length(delta),8500.);
 vec3 direction=normalize(delta+vec3(0.,0.,.000001));
 // Intersect the occupied valley first. Near water and sky rays that miss
 // it need no marching; mirrored paths use the same symmetric height slab.
 float start=0.;
 vec2 origin=eye.zy,ray=direction.zy,lower=vec2(60.,-650.),upper=vec2(9000.,650.);
 for(int axis=0;axis<2;axis++){
   if(abs(ray[axis])<.000001){
     if(origin[axis]<lower[axis]||origin[axis]>upper[axis])return 0.;
   }else{
     float a=(lower[axis]-origin[axis])/ray[axis],b=(upper[axis]-origin[axis])/ray[axis];
     start=max(start,min(a,b));distance=min(distance,max(a,b));
   }
 }
 if(distance-start<.01)return 0.;
 eye+=direction*start;distance-=start;
 float optical=0.;
 for(int i=0;i<16;i++){
   float a=pow(float(i)/16.,1.5),b=pow(float(i+1)/16.,1.5);
   vec2 heights=abs(eye.y+direction.y*vec2(a,b)*distance);
   optical+=valleyMistDensity(eye+direction*(a+b)*.5*distance,heights)*(b-a)*distance;
 }
 return optical;
}

uniform sampler2D uCloudShadow;
uniform vec3 uEye;
out float vCloudShade,vMistOpticalDepth;
float terrainCloudTransmission(vec3 point){
 // Below the cloud base, translating along the light ray reaches exactly
 // the same optical path as the ground cache. Height shifts both x and z;
 // elevated receivers inside the clouds still trace their remaining path.
 vec2 uv=(point.xz-uSourceDirection.xz*point.y/max(uSourceDirection.y,.001))/6400.+.5;
 float edge=min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y));
 float cached=smoothstep(.015,.07,edge)*(1.-smoothstep(CLOUD_BASE-120.,CLOUD_BASE,point.y));
 if(uSourceDirection.y<=.001)cached=0.;
 float visibility=textureLod(uCloudShadow,uv,0.).r;
 if(cached>.999)return visibility;
 return mix(cloudTransmission(point,uSourceDirection),visibility,cached);
}

out vec2 vUV;out vec3 vWorld,vNormal;
void main(){
 vec3 p=aPosition;
 float gust=sin(uWindTime*.63+aMotion.y)+.31*sin(uWindTime*1.17+aMotion.y*1.7);
 float height=max(0.,p.y-aPivot.y);
 // Rooted bending, with independently phased crowns. Immovable rock and
 // shoreline vertices have zero weight; the UVs stay attached to the mesh.
 // Lakeside retains its requested 160% foliage flutter even when the water
 // breeze settles overnight. Rock and rooted bank weights remain zero.
 float foliageBreeze=mix(max(.9,uBreeze),max(1.6,uBreeze),uLakePhoto);
 float weight=foliageBreeze*aMotion.x;
 float angle=gust*weight*mix(mix(.0032,.0048,uLakePhoto),.012,uFjord);
 p.x+=sin(angle)*height;p.y+=(cos(angle)-1.)*height;
 p.z+=sin(uWindTime*.81+aMotion.y)*weight*height*.00040;
 // Small asynchronous leaf-cluster flutter rides the slower rooted bend.
 // Rest coordinates keep each cluster attached through every render pass.
 float leaf=sin(uWindTime*1.83+dot(aPosition,vec3(.71,1.31,.43)));
 p+=vec3(leaf*.032,sin(uWindTime*1.47+aMotion.y)*.010,leaf*.014)*weight*mix(.35,1.,uLakePhoto);
 vCloudShade=terrainCloudTransmission(p);
 vMistOpticalDepth=valleyMistDepth(uEye,p,uFjord>.5?2.:0.);
 vWorld=p;// The Disola depth sheet contains backwards-facing normal bands.
 // Orient at each vertex toward the photograph origin, before interpolation.
 // This fixed reference is identical for the main and reflected cameras.
 vec3 photoNormal=aNormal;
 if(uDisola>.5 && dot(photoNormal,-aPosition)<0.)photoNormal=-photoNormal;
 vNormal=normalize(vec3(photoNormal.x+angle*photoNormal.y,photoNormal.y-angle*photoNormal.x,photoNormal.z));vUV=aUV;
 gl_Position=uViewProjection*vec4(p,1.);
}`,Wo=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUV;in vec3 vWorld,vNormal;in float vCloudShade;out vec4 outColor;
uniform sampler2D uPhoto,uCloudShadow,uSkyMap,uTerrainNormal,uTerrainShadow;
uniform sampler2D uTerrainNearShadow;
uniform mat4 uTerrainShadowMatrix;
uniform mat4 uTerrainNearShadowMatrix;
uniform float uTerrainShadowTexel;
uniform vec3 uEye,uSourceDirection,uSourceColor;
uniform float uSolarAltitude,uDaylight,uNight,uSourcePower,uFjord,uMoonVisibility,uVast,uLakePhoto,uDisola;
// Shared eye-to-surface transport, in the renderer's metre coordinates.
// Terrain, reflected terrain and the non-reflected water component use this
// exact function. No screen-side masks or separate twilight color curves.
uniform sampler2D uValleyAtmosphere;
precision highp sampler3D;
uniform sampler3D uValleyNoise;
uniform float uMistTime,uMistSolar,uMistStrength;
uniform vec2 uMistWind;
float mistErf(float x){
 float a=abs(x),t=1./(1.+.3275911*a);
 return sign(x)*(1.-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*exp(-a*a));
}
float mistBand(vec2 heights,float centre,float width){
 vec2 h=(heights-centre)/width;
 float delta=h.y-h.x;
 if(abs(delta)<.02)return exp(-pow((h.x+h.y)*.5,2.));
 return max(0.,.886226925*(mistErf(h.y)-mistErf(h.x))/delta);
}
float valleyMistDensity(vec3 point,vec2 heights){
 // Fold the mirrored camera path at the water plane: reflected banks and
 // sky see the same moving volume as the direct view, never a flat overlay.
 vec3 p=vec3(point.x,abs(point.y),point.z);
 // The right shore begins only ~140 m away. Starting fog at 80\u2013320 m
 // left it outside most of the volume while the kilometre-distant left
 // shore received the full layer. Bring the same volume across both banks.
 float range=smoothstep(60.,110.,p.z)*(1.-smoothstep(6200.,9000.,p.z));
 if(range<.001||p.y>650.)return 0.;
 vec3 drift=vec3(uMistWind.x*.12+uMistTime*.60,0.,uMistWind.y*.12+uMistTime*.32);
 vec3 q=p-drift;
 float broad=textureLod(uValleyNoise,q/vec3(1100.,210.,850.),1.).r;
 float fine=textureLod(uValleyNoise,q/vec3(380.,105.,280.)+vec3(.31,.19,.73),1.).g;
 float filament=smoothstep(.24,.69,broad*.62+fine*.38);
 float lowCentre=42.+23.*sin(p.z*.003+p.x*.0016+uMistTime*.007);
 // Integrate the thin height profile analytically within each ray segment.
 // A point-sampled layer otherwise becomes disconnected stripes on slopes.
 float low=mistBand(heights,lowCentre,55.);
 float highCentre=190.+60.*sin(p.z*.0017-p.x*.002+uMistTime*.005);
 float high=mistBand(heights,highCentre,105.);
 // Pockets dissolve as they advect. The scene-hour envelope supplies the
 // morning build-up and complete afternoon dissipation independently.
 float life=.38+.62*pow(.5+.5*sin(uMistTime*.038+p.z*.0021+p.x*.0013),2.);
 float warmth=mix(1.,.50,smoothstep(10.,55.,uMistSolar));
 // A thin continuous carrier joins the advected wisps. A shallow foreground
 // bank has enough local density to be visible on near faces, tapering into
 // the distant valley instead of making its long paths uniformly opaque.
 float foreground=1.-smoothstep(180.,650.,p.z);
 float structure=.05+life*filament;
 return range*warmth*structure*(low*mix(.00065,.0044,foreground)
   +high*mix(.0004,.0008,foreground))*uMistStrength;
}
in float vMistOpticalDepth;
float valleyMistDepth(vec3 eye,vec3 point,float kind){return max(0.,vMistOpticalDepth);}
vec2 valleyAirUV(vec3 direction){
  vec3 d=normalize(vec3(direction.x,max(direction.y,length(direction)*.028),direction.z));
  float a=atan(d.x,d.z);
  return vec2(.5+atan(3.*tan(a*.5))/3.14159265359,
    pow(asin(clamp(d.y,0.,1.))/1.57079632679,.70));
}
vec3 valleyDecode(vec3 value){
  value*=value;
  return value/max(vec3(.0001),1.-value);
}
float valleyTransmission(vec3 eye,vec3 point,float kind){
  float lake=1.-step(.5,kind),disola=step(2.5,kind);
  float scaleHeight=mix(1500.,950.,lake);
  float startHeight=abs(eye.y),endHeight=max(0.,point.y);
  float delta=(endHeight-startHeight)/scaleHeight;
  float density=exp(-startHeight/scaleHeight)*(abs(delta)<.001
    ?1.-delta*.5:(1.-exp(-delta))/delta);
  // Reference photographs already contain some atmospheric attenuation.
  // Keep the additional local-valley transport clear and continuous.
  float extinction=mix(mix(.000065,.000085,lake),.000014,disola);
  return exp(-length(point-eye)*density*extinction-valleyMistDepth(eye,point,kind));
}
vec3 valleyAirlight(vec3 direction,float night,float moon,float kind){
  vec2 uv=valleyAirUV(direction);
  vec3 clear=valleyDecode(textureLod(uValleyAtmosphere,uv,0.).rgb);
  float mist=(kind>1.5&&kind<2.5)?clamp(uMistStrength/.85,0.,1.):0.;
  // Clear Fjords uses the same bounded sky radiance as Disola and Lakeside.
  // Its brighter, cooler upper-hemisphere fill belongs only to actual mist;
  // retaining that fill all evening made distant rock look independently lit.
  // Interpolate the existing lookup as the mist evaporates, with no branch at
  // 2 p.m., extra texture fetch, or separate water/reflection treatment.
  vec2 diffuseUV=uv;
  if(mist>0.){
    vec3 upper=vec3(direction.x,max(abs(direction.y),length(direction.xz)*.65),direction.z);
    diffuseUV=mix(uv,valleyAirUV(upper),mist);
  }
  vec4 sky=textureLod(uSkyMap,diffuseUV,mix(8.,5.,mist)+(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.));
  vec3 air=mix(clear,valleyDecode(sky.rgb),mix(.60,1.-.08*sky.a,mist))*mix(.40,.72,mist);
  float luminance=dot(air,vec3(.2126,.7152,.0722));
  air=mix(air,mix(air,vec3(luminance),.35)*vec3(.82,.98,1.15),mist*.70);
  // Bound radiance without changing hue or flattening terrain contrast.
  float energyLimit=mix(.24,.70,mist);
  air*=energyLimit/(energyLimit+dot(air,vec3(.2126,.7152,.0722)));
  return air+vec3(.0015,.0023,.0038)*night*moon;
}
#ifdef VALLEY_CACHED_SKY
uniform sampler2D uValleyMistCache;
uniform float uValleyMistReady;
#endif
vec3 valleyMistSky(vec3 sky,vec3 eye,vec3 direction,float kind,float night,float moon){
#ifdef VALLEY_CACHED_SKY
 if(kind<1.5||kind>2.5||uValleyMistReady<.5)return sky;
 vec3 d=normalize(direction);
 float phi=atan(d.x,d.z),elevation=asin(clamp(d.y,-1.,1.));
 vec2 uv=vec2(.5+atan(3.*tan(phi*.5))/3.14159265359,
   .5+.5*sign(elevation)*sqrt(abs(elevation)/1.57079632679));
 vec2 cached=textureLod(uValleyMistCache,uv,0.).rg;
 float transmission=eye.y<0.?cached.g:cached.r;
#else
 float transmission=exp(-valleyMistDepth(eye,eye+direction*8500.,kind));
#endif
 return sky*transmission+valleyAirlight(direction,night,moon,kind)*(1.-transmission);
}

// The diffuse illumination must belong to the sky being reflected in the lake.
// Keep its color broad and bounded; texture/albedo still provides all detail.
vec3 terrainSkyFill(vec3 normal,vec3 source,float solarAltitude,out float skyEnergy){
  vec3 top=normalize(vec3(normal.x*.35,.8+max(normal.y,0.)*.2,normal.z*.35));
  vec3 toward=normalize(vec3(source.x,.22,source.z));
  vec3 away=normalize(vec3(-source.x,.4,-source.z));
  vec3 weights=vec3(.50,.35,.15);
  if(uFjord>.5){
    // Reuse the three broad sky samples as cosine-weighted incident light.
    // The sunset hemisphere cannot illuminate the back of an opaque face.
    // Normalize for the portion of an unobstructed sky dome above a slope,
    // not to unit energy: vertical cliffs see half the dome, upward faces all.
    weights=vec3(.50,.25,.25)*max(vec3(dot(normal,top),
      dot(normal,toward),dot(normal,away)),vec3(0.));
    float skyView=clamp(.5+.5*normal.y,.08,1.);
    weights*=skyView/max(dot(weights,vec3(1.)),.001);
  }
  vec3 sky=valleyDecode(textureLod(uSkyMap,valleyAirUV(top),6.+(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.)).rgb)*weights.x
    +valleyDecode(textureLod(uSkyMap,valleyAirUV(toward),6.+(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.)).rgb)*weights.y
    +valleyDecode(textureLod(uSkyMap,valleyAirUV(away),6.+(float(textureSize(uSkyMap,0).x)==1024.?.4150375:0.)).rgb)*weights.z;
 float brightness=dot(sky,vec3(.2126,.7152,.0722));
 skyEnergy=brightness;
  vec3 chroma=clamp(sky/max(brightness,.002),vec3(.32,.55,.28),vec3(1.65,1.3,1.5));
  float golden=exp(-pow((solarAltitude-2.)/8.,2.))*smoothstep(-8.,-2.,solarAltitude);
  return mix(vec3(1.),chroma,golden*.85);
}

vec3 inverseFilmic(vec3 y){
 y=clamp(y,vec3(0.),vec3(.98));
 vec3 a=2.51-2.43*y,b=.03-.59*y;
 return max((-b+sqrt(b*b+.56*a*y))/(2.*a),vec3(0.))/.95;
}
// Photographic terrain uses captured occlusion and bounded normal relighting.
// The estimated-depth shadow passes are disabled. Do not sample their neutral
// 1x1 placeholder maps: receiver-plane slope extrapolation can exceed depth 1
// even for an empty map, inventing straight bands at projection boundaries.
// Moving cloud transmission is applied separately by the fragment shader.
float terrainVisibility(vec3 n){
 return 1.;
}
void main(){
 vec4 photo=texture(uPhoto,vUV);
 photo.rgb/=max(photo.a,.00001);
 vec3 terrainNormal=textureLod(uTerrainNormal,vUV,4.).xyz*2.-1.;
 if(photo.a<.01||vWorld.y<-.015)discard;
 vec3 color=mix(photo.rgb/12.92,pow((photo.rgb+.055)/1.055,vec3(2.4)),step(vec3(.04045),photo.rgb));
 vec3 n=normalize(vNormal);
 float daylight=smoothstep(-7.,12.,uSolarAltitude);
 float direct=max(dot(n,uSourceDirection),0.);
 float shade=clamp(vCloudShade,0.,1.);
 // Preserve the real photograph's fine radiometry and baked occlusion. This
 // is bounded relighting of estimated geometry, not recovered material BRDFs.
 // At night its captured daylight is removed from the reflection as well.
 vec3 nightAmbient=mix(vec3(.0012,.0020,.0040),vec3(.027,.036,.052),uFjord);
 vec3 ambient=mix(nightAmbient,vec3(1.),daylight);
 vec3 illumination=ambient*(.65+.17*daylight)
   +uSourceColor*uSourcePower*(.12+.30*direct)*mix(.52,1.,shade);
 float twilight=exp(-pow((uSolarAltitude-2.)/7.,2.));
 illumination+=vec3(.11,.037,.012)*twilight*(.35+.65*direct);
 if(uFjord>.5||uLakePhoto>.5||uDisola>.5){
   // The source is already camera-tonemapped. Invert our display curve before
   // lighting so its midtones are not tonemapped twice into a painted HDR look.
   color=inverseFilmic(color);
   // The open bank contains dry grass, warm earth and pale stone. Red over
   // blue is not evidence of living grass: qualify the existing olive/green
   // hues instead, protecting neutral rock, warm soil and dark canopy noise.
   // One material grade spans the entire connected shore, with no UV/depth
   // region boundary. Terrain and its reflection receive identical color.
   float peak=max(photo.r,max(photo.g,photo.b));
   float chroma=peak-min(photo.r,min(photo.g,photo.b));
   float olive=smoothstep(.69,.93,(photo.g-photo.b)/max(chroma,.001));
   float colored=smoothstep(.10,.26,chroma/max(peak,.001));
   float reliable=smoothstep(.07,.22,peak)*(1.-smoothstep(.72,.94,peak));
   float vegetationGrade=uLakePhoto*olive*colored*reliable;
   float luminance=dot(color,vec3(.2126,.7152,.0722));
   vec3 meadow=color*vec3(.985,1.012,.992);
   meadow*=luminance/max(dot(meadow,vec3(.2126,.7152,.0722)),.00001);
   meadow=max(vec3(0.),mix(vec3(luminance),meadow,1.035));
   color=mix(color,meadow,vegetationGrade);
   // The photograph already contains fine surface shading and occlusion.
   // Estimated depth is useful for broad illumination, but is not a measured
   // normal map or an albedo scan. Keep its influence bounded, rather than
   // dividing out an invented reference light and relighting every detail.
   if(uFjord>.5)n=normalize(terrainNormal);
   else n=normalize(vec3(-vWorld.x,0.,-vWorld.z));
   color/=mix(.86,1.,uFjord);
   direct=max(dot(n,uSourceDirection),0.);
   float visible=terrainVisibility(n)*shade;
   float skyEnergy;
   vec3 skyTint=terrainSkyFill(n,uSourceDirection,uSolarAltitude,skyEnergy);
   // Every photographed landscape shares the same sky-energy bound. A
   // separate altitude ramp must not illuminate leaves, rock or snow before
   // their sky brightens. Preserve the texture and direct sun/moon shading.
   daylight=min(daylight,skyEnergy*2.);
   skyTint*=mix(vec3(1.),vec3(.93,1.,1.07),uFjord*clamp(uMistStrength/.85,0.,1.));
   vec3 dayFill=vec3(.56,.60,.65)*(.86+.14*max(n.y,0.))*skyTint;
   vec3 nightFill=vec3(.0035,.0055,.010)*(.30+.70*max(n.y,0.));
   illumination=mix(nightFill,dayFill,daylight);
   illumination+=uSourceColor*uSourcePower*.65*direct*visible;
   // Broad moonlit sky is diffuse hemisphere fill. Only the direct lunar
   // term above follows the terrain shadow; do not turn sky fill into a
   // second, overly strong hard-edged moon spotlight.
   illumination+=vec3(.64,.77,1.)*.010*uMoonVisibility*uNight*(.28+.72*max(n.y,0.));
   float goldenFill=twilight*smoothstep(-8.,-2.,uSolarAltitude)*min(1.,skyEnergy*2.);
   illumination+=skyTint*goldenFill*.075*(.65+.35*max(n.y,0.));
   // Wet rock near the shore has a restrained broad specular response;
   // distant foliage remains rough. No synthetic grain is painted on stone.
   float vegetation=smoothstep(.005,.10,photo.g-photo.r);
   float wet=(1.-smoothstep(.1,2.8,vWorld.y))*(1.-vegetation);
   vec3 halfway=normalize(normalize(uEye-vWorld)+uSourceDirection);
   float gloss=pow(max(dot(n,halfway),0.),mix(8.,42.,wet))*.003;
   color=color*illumination*(1.-wet*.20)+uSourceColor*gloss*visible*uSourcePower;
   float kind=uDisola>.5?3.:(uLakePhoto>.5?0.:2.);
   float airTransmission=valleyTransmission(uEye,vWorld,kind);
   vec3 airlight=valleyAirlight(vWorld-uEye,uNight,uMoonVisibility,kind);
   color=color*airTransmission+airlight*(1.-airTransmission);
 }else{
   color*=illumination;
 }
 outColor=vec4(sqrt(max(color,vec3(0.))/(1.+max(color,vec3(0.))))*photo.a,photo.a);
}`;var qo=`#version 300 es
precision highp float;
precision highp sampler2D;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
uniform vec3 uMistEye;
// Shared eye-to-surface transport, in the renderer's metre coordinates.
// Terrain, reflected terrain and the non-reflected water component use this
// exact function. No screen-side masks or separate twilight color curves.
uniform sampler2D uValleyAtmosphere;
precision highp sampler3D;
uniform sampler3D uValleyNoise;
uniform float uMistTime,uMistSolar,uMistStrength;
uniform vec2 uMistWind;
float mistErf(float x){
 float a=abs(x),t=1./(1.+.3275911*a);
 return sign(x)*(1.-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*exp(-a*a));
}
float mistBand(vec2 heights,float centre,float width){
 vec2 h=(heights-centre)/width;
 float delta=h.y-h.x;
 if(abs(delta)<.02)return exp(-pow((h.x+h.y)*.5,2.));
 return max(0.,.886226925*(mistErf(h.y)-mistErf(h.x))/delta);
}
float valleyMistDensity(vec3 point,vec2 heights){
 // Fold the mirrored camera path at the water plane: reflected banks and
 // sky see the same moving volume as the direct view, never a flat overlay.
 vec3 p=vec3(point.x,abs(point.y),point.z);
 // The right shore begins only ~140 m away. Starting fog at 80\u2013320 m
 // left it outside most of the volume while the kilometre-distant left
 // shore received the full layer. Bring the same volume across both banks.
 float range=smoothstep(60.,110.,p.z)*(1.-smoothstep(6200.,9000.,p.z));
 if(range<.001||p.y>650.)return 0.;
 vec3 drift=vec3(uMistWind.x*.12+uMistTime*.60,0.,uMistWind.y*.12+uMistTime*.32);
 vec3 q=p-drift;
 float broad=textureLod(uValleyNoise,q/vec3(1100.,210.,850.),1.).r;
 float fine=textureLod(uValleyNoise,q/vec3(380.,105.,280.)+vec3(.31,.19,.73),1.).g;
 float filament=smoothstep(.24,.69,broad*.62+fine*.38);
 float lowCentre=42.+23.*sin(p.z*.003+p.x*.0016+uMistTime*.007);
 // Integrate the thin height profile analytically within each ray segment.
 // A point-sampled layer otherwise becomes disconnected stripes on slopes.
 float low=mistBand(heights,lowCentre,55.);
 float highCentre=190.+60.*sin(p.z*.0017-p.x*.002+uMistTime*.005);
 float high=mistBand(heights,highCentre,105.);
 // Pockets dissolve as they advect. The scene-hour envelope supplies the
 // morning build-up and complete afternoon dissipation independently.
 float life=.38+.62*pow(.5+.5*sin(uMistTime*.038+p.z*.0021+p.x*.0013),2.);
 float warmth=mix(1.,.50,smoothstep(10.,55.,uMistSolar));
 // A thin continuous carrier joins the advected wisps. A shallow foreground
 // bank has enough local density to be visible on near faces, tapering into
 // the distant valley instead of making its long paths uniformly opaque.
 float foreground=1.-smoothstep(180.,650.,p.z);
 float structure=.05+life*filament;
 return range*warmth*structure*(low*mix(.00065,.0044,foreground)
   +high*mix(.0004,.0008,foreground))*uMistStrength;
}
float valleyMistDepth(vec3 eye,vec3 point,float kind){
 if(kind<1.5||kind>2.5||uMistStrength<=0.)return 0.;
 vec3 delta=point-eye;
 float distance=min(length(delta),8500.);
 vec3 direction=normalize(delta+vec3(0.,0.,.000001));
 // Intersect the occupied valley first. Near water and sky rays that miss
 // it need no marching; mirrored paths use the same symmetric height slab.
 float start=0.;
 vec2 origin=eye.zy,ray=direction.zy,lower=vec2(60.,-650.),upper=vec2(9000.,650.);
 for(int axis=0;axis<2;axis++){
   if(abs(ray[axis])<.000001){
     if(origin[axis]<lower[axis]||origin[axis]>upper[axis])return 0.;
   }else{
     float a=(lower[axis]-origin[axis])/ray[axis],b=(upper[axis]-origin[axis])/ray[axis];
     start=max(start,min(a,b));distance=min(distance,max(a,b));
   }
 }
 if(distance-start<.01)return 0.;
 eye+=direction*start;distance-=start;
 float optical=0.;
 for(int i=0;i<16;i++){
   float a=pow(float(i)/16.,1.5),b=pow(float(i+1)/16.,1.5);
   vec2 heights=abs(eye.y+direction.y*vec2(a,b)*distance);
   optical+=valleyMistDensity(eye+direction*(a+b)*.5*distance,heights)*(b-a)*distance;
 }
 return optical;
}

void main(){
 // Concentrate angular samples around the valley and horizon, where the
 // thin mist layers vary fastest. Both hemispheres remain addressable.
 const float PI=3.141592653589793;
 float phi=2.*atan(tan((vUv.x-.5)*PI)/3.);
 float vertical=vUv.y*2.-1.;
 float elevation=sign(vertical)*vertical*vertical*PI*.5;
 vec3 direction=vec3(sin(phi)*cos(elevation),sin(elevation),cos(phi)*cos(elevation));
 vec3 mirror=uMistEye;mirror.y=-mirror.y;
 float direct=exp(-valleyMistDepth(uMistEye,uMistEye+direction*8500.,2.));
 float reflected=exp(-valleyMistDepth(mirror,mirror+direction*8500.,2.));
 outColor=vec4(direct,reflected,0.,1.);
}
`,Di=`
// One world-space medium for the sky, ground shadow cache and elevated land.
precision highp sampler3D;
uniform sampler3D uCloudVolume,uCloudDensity;
uniform float uCloudCoverage,uCloudFade,uFjordWeather,uFjordStratus,uFjordClearing;
uniform vec2 uCloudOffset;
uniform vec3 uSourceDirection;
#define CLOUD_BASE mix(1250.,650.,uFjordWeather)
#define CLOUD_TOP mix(mix(3400.,2350.,uFjordWeather),1750.,uFjordStratus)
const float CLOUD_EXTINCTION=.023;
vec2 filteredCloudProperties(vec3 p,float lod){
 float h=(p.y-CLOUD_BASE)/(CLOUD_TOP-CLOUD_BASE);
 if(h<=0.||h>=1.)return vec2(0.);
 if(uFjordStratus>.5){
   // A connected stratus bank with stretched, feathered openings. Its
   // horizontal structure is independent of height: no isolated cumulus lobes.
   vec2 q=mat2(.94,-.342,.342,.94)*(p.xz-uCloudOffset);
   vec4 broadField=textureLod(uCloudVolume,vec3(q.x/9000.,.37,q.y/7000.),max(0.,lod-2.));
vec4 wispField=textureLod(uCloudVolume,vec3(q.x/4200.,h*.12+.21,q.y/1150.),max(0.,lod-1.));
float broad=broadField.r;
// B/A are finer, continuous world-space channels in the same sampledvolume.
// Preserve the broad weather layout; perturb the transition shape only.
float detail=(dot(wispField.ba,vec2(.68,.32))-.494)*2.;
float detailWeight=1.-smoothstep(.5,2.8,lod);
   float wisp=clamp(wispField.g+detail*.16*detailWeight,0.,1.);
   float opening=mix(.46,.64,uFjordClearing)+.025*sin(uCloudOffset.x*.00012);
   float sheet=smoothstep(opening,mix(.64,.82,uFjordClearing),broad*mix(.78,.45,uFjordClearing)+wisp*mix(.22,.55,uFjordClearing));
   float feather=mix(.50,1.,smoothstep(.20,.76,wisp));
   float envelope=smoothstep(0.,.18,h)*(1.-smoothstep(.58,1.,h));
   float amount=mix(.42,1.,uCloudFade)*uCloudCoverage/.48*mix(1.,.09,uFjordClearing);
   float density=sheet*feather*envelope*.16*amount;
   return vec2(density,sheet*feather*(1.-h)*2.4*amount);
 }
 vec2 field=textureLod(uCloudDensity,vec3((p.xz-uCloudOffset)/mix(vec2(26000.),vec2(31000.,20500.),uFjordWeather),h),lod).rg;
 float amount=uCloudFade*uCloudFade*uCloudCoverage/.48;
 if(uFjordWeather>.5){
   // Anisotropic erosion opens thin, feathered gaps instead of making the
   // whole cloud bank a uniformly transparent version of the old cumulus.
   vec3 drift=vec3(uCloudOffset.x,0.,uCloudOffset.y);
   float wisps=textureLod(uCloudVolume,(p-drift)/vec3(5800.,900.,1700.),0.).g;
   amount*=mix(.18,.80,smoothstep(.12,.84,wisps));
 }
 vec2 medium=field*field*vec2(.65,24.)*amount;
if(uFjordWeather<.5&&field.x>.01&&field.x<.58&&lod<2.8){
  vec3 drift=vec3(uCloudOffset.x,0.,uCloudOffset.y);
  // Medium-scale billows, never per-pixelwhite noise. Filter relative to the
  // density footprint: noisevoxel size differs from basefield voxel size.
  vec3 baseVoxel=vec3(float(textureSize(uCloudDensity,0).x)/26000.,
    float(textureSize(uCloudDensity,0).z)/(CLOUD_TOP-CLOUD_BASE),
    float(textureSize(uCloudDensity,0).y)/26000.);
  vec3 detailVoxel=vec3(textureSize(uCloudVolume,0))/vec3(3600.,1800.,5200.);
  vec3 ratio=detailVoxel/baseVoxel;
  float detailLod=max(0.,lod+log2(max(ratio.x,max(ratio.y,ratio.z))));
  vec4 detailField=textureLod(uCloudVolume,(p-drift)/vec3(3600.,1800.,5200.),detailLod);
  float detail=(dot(detailField.ba,vec2(.68,.32))-.494)*2.;
  float shell=smoothstep(.01,.08,field.x)*(1.-smoothstep(.24,.58,field.x));
  // Redistribute existingdensity rather than only eroding it, which otherwise
  // removes cloudcover and brightens the entire scene. Keep the coarsecolumn
  // integral/lighting unchanged and bound the perturbation to cloudedges.
  medium.x*=1.+detail*.32*shell*(1.-smoothstep(.6,2.8,lod));
}
return medium;

}
vec2 cloudProperties(vec3 p){return filteredCloudProperties(p,0.);}
float densityAt(vec3 p){return cloudProperties(p).x;}
float cloudTransmission(vec3 origin,vec3 direction){
 if(uCloudFade<.002||uCloudCoverage<.004)return 1.;
 if(direction.y<=.001)return 0.;
 float start=max(0.,(CLOUD_BASE-origin.y)/direction.y);
 float end=(CLOUD_TOP-origin.y)/direction.y;
 if(end<=start)return 1.;
 float stepLength=(end-start)/24.,opticalDepth=0.;
 // A long grazing segment covers many density voxels. Integrating their
 // filtered mean prevents the 24 midpoint samples from drawing contour bands
 // across elevated receivers as the sun moves. Keep the existing step budget.
 vec2 voxel=mix(vec2(26000.),vec2(31000.,20500.),uFjordWeather)/vec2(textureSize(uCloudDensity,0).xy);
 float footprint=max(abs(direction.x)*stepLength/voxel.x,abs(direction.z)*stepLength/voxel.y);
 float lod=clamp(log2(max(1.,footprint))-.25,0.,4.);
 for(int i=0;i<24;i++){
   vec3 p=origin+direction*(start+(float(i)+.5)*stepLength);
   opticalDepth+=filteredCloudProperties(p,lod).x*stepLength*CLOUD_EXTINCTION;
 }
 return exp(-opticalDepth);
}

uniform float uWeatherTime,uBreeze,uSolarAltitude,uDaylight,uNight;
uniform vec3 uSunDirection,uMoonDirection;
const float PI=3.14159265359,TAU=6.28318530718;
float phaseHG(float mu,float g){return (1.-g*g)/(4.*PI*pow(max(1.+g*g-2.*g*mu,.01),1.5));}
vec2 sphere(vec3 p,vec3 d,float radius){float b=dot(p,d),c=dot(p,p)-radius*radius;float h=b*b-c;if(h<0.)return vec2(-1.);return vec2(-b-sqrt(h),-b+sqrt(h));}
vec3 sunTint(){
 float m=1./max(.09,uSunDirection.y+.12);
 return exp(-vec3(.008,.018,.039)*m)*mix(vec3(1.,.40,.12),vec3(1.),smoothstep(-.025,.18,uSunDirection.y));
}
vec3 atmosphere(vec3 direction){
 // Single-scattering Rayleigh/Mie integral through a spherical atmosphere.
 // Ozone absorbs the yellow/green band along the long twilight optical path.
 vec3 d=normalize(vec3(direction.x,max(direction.y,.001),direction.z));
 const float planet=6371000.,top=6471000.;
 const vec3 betaR=vec3(5.802,13.558,33.1)*1e-6;
 const vec3 betaM=vec3(3.3e-6);
 const vec3 betaO=vec3(.650,1.881,.085)*1e-6;
 vec3 p=vec3(0.,planet+2.,0.);float end=sphere(p,d,top).y;
 vec3 optical=vec3(0.),sumR=vec3(0.),sumM=vec3(0.);float stepSize=end/14.;
 for(int i=0;i<14;i++){
   vec3 q=p+d*(float(i)+.5)*stepSize;float height=length(q)-planet;
   vec3 dens=vec3(exp(-height/8000.),exp(-height/1200.),max(0.,1.-abs(height-25000.)/15000.));
   optical+=dens*stepSize*.5;
   float lightDistance=sphere(q,uSunDirection,top).y;vec3 sunOD=vec3(0.);
   for(int j=0;j<6;j++){
     float sh=length(q+uSunDirection*((float(j)+.5)*lightDistance/6.))-planet;
     sunOD+=vec3(exp(-sh/8000.),exp(-sh/1200.),max(0.,1.-abs(sh-25000.)/15000.))*lightDistance/6.;
   }
   vec3 trans=exp(-betaR*(optical.x+sunOD.x)-betaM*1.1*(optical.y+sunOD.y)-betaO*(optical.z+sunOD.z));
   sumR+=trans*dens.x*stepSize;sumM+=trans*dens.y*stepSize;optical+=dens*stepSize*.5;
 }
 float mu=dot(d,uSunDirection),rayleigh=3./(16.*PI)*(1.+mu*mu);
 vec3 day=(sumR*betaR*rayleigh+sumM*betaM*phaseHG(mu,.76))*22.;
 // Twilight multiple-scattering fill; no terrain or clouds are baked into it.
 float dusk=exp(-pow((uSolarAltitude+4.)/7.,2.));
 day+=vec3(.012,.021,.054)*dusk*(.3+.7*max(d.y,0.));
 vec3 moonFill=vec3(.0007,.0010,.0018)*uNight*(.35+.65*max(uMoonDirection.y,0.));
 return max(day,vec3(0.))+moonFill;
}
vec3 encodeRadiance(vec3 c){return sqrt(max(c,vec3(0.))/(1.+max(c,vec3(0.))));}
vec3 decodeRadiance(vec3 c){c*=c;return c/max(vec3(.0001),1.-c);}
`,Xo=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;out vec4 outColor;
${Di}
void main(){
 float longitude=2.*atan(tan((vUv.x-.5)*PI)/3.),latitude=pow(vUv.y,1./.70)*PI*.5;
 vec3 d=vec3(sin(longitude)*cos(latitude),sin(latitude),cos(longitude)*cos(latitude));
 outColor=vec4(encodeRadiance(atmosphere(d)),1.);
}`;function Oo(e=!1,{cachedAtmosphere:t=!1,layerOnly:i=!1}={}){return`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;out vec4 outColor;
${Di}
${t?"uniform sampler2D uAtmosphereMap;":""}
void main(){
 float longitude=2.*atan(tan((vUv.x-.5)*PI)/3.),latitude=pow(vUv.y,1./.70)*PI*.5;
 vec3 d=vec3(sin(longitude)*cos(latitude),sin(latitude),cos(longitude)*cos(latitude));
 vec3 background=${t?"decodeRadiance(texture(uAtmosphereMap,vUv).rgb)":"atmosphere(d)"},scatter=vec3(0.);float transmittance=1.;
 vec3 angularFootprint=max(abs(dFdx(d)),abs(dFdy(d)));
 if(d.y>.001&&uCloudCoverage>.004&&uCloudFade>.002){
   float start=CLOUD_BASE/d.y,end=min(CLOUD_TOP/d.y,start+24000.);
   float dt=(end-start)/${e?"30.":"60."};
   // Two-point quadrature removes the stationary per-pixel random phase.
   // Reassign the nearest light tap to this second view-ray sample, keeping
   // three medium lookups with a reduced 30/60 march-step ceiling.
   vec3 voxelScale=vec3(vec2(textureSize(uCloudDensity,0).xy)/mix(vec2(26000.),vec2(31000.,20500.),uFjordWeather),float(textureSize(uCloudDensity,0).z)/(CLOUD_TOP-CLOUD_BASE));
   // Use the far end's conservative pixel footprint; all level selection
   // arithmetic is once per ray, not repeated in every cloud segment.
   // The two deterministic taps resolve structure within each segment.
   // A narrower segment filter retains it; the pixel filter still prevents
   // unresolved detail from aliasing. Evaluate that at each sample distance.
   // Grazing rays still need the full filter: their long segments otherwise
   // expose horizontal integration bands near the horizon.
   float segmentWidth=mix(.5,.3,smoothstep(.12,.45,d.y));
   vec3 segmentFootprint=abs(d).xzy*(dt*segmentWidth)*voxelScale;
   vec3 quadrature=d*(dt*.288675135);
 float segmentStart=start; float stepRatio=exp(2./${e?"30.":"60."}); float segmentLength=(end-start)*(stepRatio-1.)/(exp(2.)-1.);
   vec3 ambient=${t?"decodeRadiance(texture(uAtmosphereMap,vec2(.5,1.)).rgb)":"atmosphere(vec3(0.,1.,0.))"};
   float mu=dot(d,uSourceDirection);
   float phase=.82*phaseHG(mu,.68)+.18*phaseHG(mu,-.22);
   vec3 light=sunTint()*3.7*smoothstep(-.07,.04,uSunDirection.y)+vec3(.018,.026,.048)*uNight;
   for(int i=0;i<${e?"30":"60"};i++){
     float distance=start+(float(i)+.5)*dt;
 if(${Y()?"true":"false"}){
   dt=segmentLength;distance=segmentStart+dt*.5;
   segmentStart+=dt;segmentLength*=stepRatio;
   quadrature=d*(dt*.288675135);
   segmentFootprint=abs(d).xzy*(dt*segmentWidth)*voxelScale;
 }
     vec3 p=d*distance;
     vec3 footprint=max(segmentFootprint,angularFootprint.xzy*distance*voxelScale);
     float densityLod=max(0.,log2(max(1.,max(footprint.x,max(footprint.y,footprint.z)))));
     vec2 medium=filteredCloudProperties(p-quadrature,densityLod);
     // Keep empty-space lookups at one, as in the original march. A cell
     // this far below visible extinction does not need the second tap.
     if(${Y()?"true":"medium.x>.00001"})medium=(medium+filteredCloudProperties(p+quadrature,densityLod))*.5;
     float density=medium.x;
     if(${Y()?"density*dt*CLOUD_EXTINCTION>.0001":"density>.001"}){
       // A column integral supplies multiple-scattering occlusion. Two
       // oblique samples preserve moving directional shadowing inexpensively.
       float optical=medium.y*.55/max(uSourceDirection.y,.24);
       optical+=density*120.*CLOUD_EXTINCTION;
       optical+=filteredCloudProperties(p+uSourceDirection*520.,densityLod).x*340.*CLOUD_EXTINCTION;
       float direct=exp(-optical);
       float multiple=.22*exp(-optical*.25)+.10*exp(-optical*.065);
       float h=clamp((p.y-CLOUD_BASE)/(CLOUD_TOP-CLOUD_BASE),0.,1.);
       float powder=1.-exp(-density*dt*CLOUD_EXTINCTION*2.);
       float edge= mix(1.,.75+powder*.25,smoothstep(-.4,.6,mu));
       vec3 illumination=light*(direct*phase*4.5*edge+multiple*(1.+1.2*pow(max(mu,0.),64.)*smoothstep(.03,.20,uSunDirection.y)))
         +ambient*(.22+.52*h)*exp(-medium.y*.045);
       float stepT=exp(-density*dt*CLOUD_EXTINCTION);
       scatter+=transmittance*(1.-stepT)*illumination;
       transmittance*=stepT;if(transmittance<.006)break;
     }
   }
   // High, thin ice clouds drift at another altitude and speed, independent
   // of both the cumulus deck and the stars. They clear on the Salar at dusk.
   vec2 high=d.xz*(5400./d.y)-uCloudOffset*vec2(2.,1.9);
   float filaments=textureLod(uCloudVolume,vec3(high.x/18000.,.24,high.y/6200.),1.).g;
   float cirrus=smoothstep(.58,.80,filaments)*.16*uCloudCoverage*sqrt(uCloudFade)*(1.-.55*uCloudFade);
   scatter+=transmittance*(background*.8+vec3(.5)*uDaylight)*cirrus;
   transmittance*=1.-cirrus;
 }
 float aerial=exp(-max(CLOUD_BASE/max(d.y,.001)-3500.,0.)*.000060);
 scatter*=aerial;transmittance=mix(1.,transmittance,aerial);
 outColor=vec4(encodeRadiance(${i?"scatter":"scatter+background*transmittance"}),transmittance);
}`}var Vo=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;out vec4 outColor;
${Di}
void main(){vec3 p=vec3((vUv.x-.5)*6400.,0.,(vUv.y-.5)*6400.);
 float t=cloudTransmission(p,uSourceDirection);outColor=vec4(t,t,t,1.);}`,Ne=(e,t)=>e.reduce((i,a,r)=>i+a*t[r],0),k0=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],tt=e=>{let t=Math.hypot(...e)||1;return e.map(i=>i/t)};function $0(e,t,i=.12,a=14e3){let{position:r,forward:o,right:n,up:s,tanHalfFov:c}=e,l=1/(c*t),u=1/c,d=(a+i)/(a-i),h=-2*a*i/(a-i);return new Float32Array([l*n[0],u*s[0],d*o[0],o[0],l*n[1],u*s[1],d*o[1],o[1],l*n[2],u*s[2],d*o[2],o[2],-l*Ne(n,r),-u*Ne(s,r),h-d*Ne(o,r),-Ne(o,r)])}function Go(e){let t=i=>[i[0],-i[1],i[2]];return{...e,position:t(e.position),forward:t(e.forward),right:t(e.right),up:t(e.up)}}function ya(e,t,i=[0,0,90]){let a=tt(e.map(c=>-c)),r=tt(k0(Math.abs(a[1])>.98?[0,0,1]:[0,1,0],a)),o=k0(a,r),n=i.map((c,l)=>c-a[l]*t*1.5),s=1/(t*2);return new Float32Array([r[0]/t,o[0]/t,a[0]*s,0,r[1]/t,o[1]/t,a[1]*s,0,r[2]/t,o[2]/t,a[2]*s,0,-Ne(r,n)/t,-Ne(o,n)/t,-Ne(a,n)*s-.5,1])}var Ho=class{constructor(){this.reset()}reset(){this.kind=null,this.atmosphereState=null,this.atmosphereAt=-1/0}next(e,t){let i=this.kind!==t.kind;this.kind=t.kind;let a=this.atmosphereState,r=(!a||i||Math.abs(a.solar-t.solar)>.035||Math.abs(a.clock-t.clock)>3)&&(i||e-this.atmosphereAt>=40);return r&&(this.atmosphereState={...t},this.atmosphereAt=e),{atmosphere:r,reset:i,volume:!0}}},jo=class{constructor(){this.invalidate()}invalidate(){this.lastAt=-1/0,this.last=null}due(e,t){if(t.kind===1)return!1;let i=this.last,a=!i||i.kind!==t.kind||i.camera!==t.camera||Math.abs(i.solar-t.solar)>.08||Math.abs(i.breeze-t.breeze)>.005||i.materials!==t.materials,r=t.kind===0?1e3/20:t.kind===2?100:180;return!a&&e-this.lastAt<r?!1:(this.last={...t},this.lastAt=e,!0)}};function Yo(e,t=!1){let i=Math.max(0,Math.min(1,(e+4)/30)),a=i*i*(3-2*i);return t?a:.035+.965*a}var Ko={lakeside:.48,clouds:.58,mountains:.46,disola:.38},At={volume:"/_p/data-gz-5da63c9db5bd74e69dd285211337",density:"/_p/data-gz-38ff48084c233db825552420f4a4",densityMobile:"/_p/data-gz-ca39cbca18cdd338259f3eb29187",fjordPhoto:"/_p/ea0d6aafe334993349a394c44296",fjordPhotoMobile:"/_p/6aa08bf6b2938334966156bb637a",fjordDepth:"/_p/data-gz-4ef07b75669881b76babec714bc0",fjordNormal:"/_p/a98f6c0244a0801698ca39c7cf32",fjordNormalMobile:"/_p/82170745ee59212e8ce045899fa4",disolaPhoto:"/_p/7fb51d350882bb22006e8327e329",disolaPhotoMobile:"/_p/b12555fe28126e4fb4ad489e0cc8",disolaDepth:"/_p/data-gz-351f19f21e791f9e941da6cc0642",lakesidePhoto:"/_p/3f9bdf44879eb0a6470b02cb8279",lakesidePhotoMobile:"/_p/049709836fae67eb9dd982e98da2",lakesideDepth:"/_p/data-gz-0667a7d2ff600d18ab45932b45e6",redwoodPhoto:"/_p/d5c2d84892d18a7828ce3bfac0d2",redwoodPhotoMobile:"/_p/13645a87ea6d9e787f9fbc0bd197",redwoodDepth:"/_p/data-gz-f6e11f8314db7c5ad58be5a4ee29"},e6=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;out vec4 outColor;
uniform vec3 uCameraPosition,uCameraForward,uCameraRight,uCameraUp;
uniform float uTanHalfFov,uAspect,uAltNight,uAltSalt,uAltSolarAltitude;
const float PI=3.141592653589793,TAU=6.283185307179586,METRES=.44;
vec3 linearColor(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
${tr}
void main(){vec2 p=vUv*2.-1.;vec3 ray=normalize(uCameraForward+uCameraRight*p.x*uTanHalfFov*uAspect+uCameraUp*p.y*uTanHalfFov);
 vec3 c=skyRadiance(ray,0.);outColor=vec4(sqrt(c/(1.+c)),1.);}`;function Et(e,t,i){let a=e.createProgram();for(let[r,o]of[[e.VERTEX_SHADER,t],[e.FRAGMENT_SHADER,i]]){let n=e.createShader(r);e.shaderSource(n,o),e.compileShader(n),e.attachShader(a,n)}return e.linkProgram(a),{program:a,locations:new Map}}function Zo(e,t){if(!e.getProgramParameter(t.program,e.LINK_STATUS)){let i=e.getAttachedShaders(t.program).map(a=>e.getShaderInfoLog(a));throw new Error("Environment shader: "+e.getProgramInfoLog(t.program)+" "+i.join(`
`))}}function q(e,t,i,a,r=!1){t.locations.has(i)||t.locations.set(i,e.getUniformLocation(t.program,i));let o=t.locations.get(i);o!==null&&(r?e.uniform1i(o,a):typeof a=="number"?e.uniform1f(o,a):a.length===16?e.uniformMatrix4fv(o,!1,a):a.length===4?e.uniform4fv(o,a):a.length===3?e.uniform3fv(o,a):a.length===2&&e.uniform2fv(o,a))}function j(e,t,i,a,r,o=e.TEXTURE_2D){e.activeTexture(e.TEXTURE0+a),e.bindTexture(o,r??null),q(e,t,i,a,!0)}function ke(e,t,i,{depth:a=!1,samples:r=0,depthOnly:o=!1,floating:n=!1}={}){let s=o?null:e.createTexture();if(s){e.bindTexture(e.TEXTURE_2D,s),e.texImage2D(e.TEXTURE_2D,0,n?e.RGBA16F:e.RGBA8,t,i,0,e.RGBA,n?e.HALF_FLOAT:e.UNSIGNED_BYTE,null);for(let m of[e.TEXTURE_MIN_FILTER,e.TEXTURE_MAG_FILTER])e.texParameteri(e.TEXTURE_2D,m,e.LINEAR);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}let c=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,c),s?e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,s,0):(e.drawBuffers([e.NONE]),e.readBuffer(e.NONE));let l=null;if(a&&(l=e.createTexture(),e.bindTexture(e.TEXTURE_2D,l),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,i,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,l,0)),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("Environment framebuffer unavailable");e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);let u=null,d=null,h=null;if(r){let m=Array.from(e.getInternalformatParameter(e.RENDERBUFFER,e.RGBA8,e.SAMPLES)),v=Array.from(e.getInternalformatParameter(e.RENDERBUFFER,e.DEPTH_COMPONENT24,e.SAMPLES));r=m.filter(f=>f<=r&&v.includes(f)).sort((f,p)=>p-f)[0]??0}if(r&&(u=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,u),d=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,d),e.renderbufferStorageMultisample(e.RENDERBUFFER,r,e.RGBA8,t,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,d),h=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,h),e.renderbufferStorageMultisample(e.RENDERBUFFER,r,e.DEPTH_COMPONENT24,t,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,h),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE))throw new Error("Multisample environment framebuffer unavailable");return{texture:s,depthTexture:l,framebuffer:c,width:t,height:i,multisample:u,colorBuffer:d,depthBuffer:h}}function xa(e,t){t&&(e.deleteTexture(t.texture),e.deleteTexture(t.depthTexture),e.deleteFramebuffer(t.framebuffer),e.deleteFramebuffer(t.multisample),e.deleteRenderbuffer(t.colorBuffer),e.deleteRenderbuffer(t.depthBuffer))}async function ba(e,t,i=!1){let a=i?ea(t):null,r=await fetch(t);if(!r.ok)throw new Error("Material unavailable");let o=await createImageBitmap(await r.blob(),{colorSpaceConversion:"none",premultiplyAlpha:"none",imageOrientation:"flipY"}),n=e.getParameter(e.MAX_TEXTURE_SIZE);if(Math.max(o.width,o.height)>n){let l=n/Math.max(o.width,o.height),u=await createImageBitmap(o,{resizeWidth:Math.round(o.width*l),resizeHeight:Math.round(o.height*l),resizeQuality:"high",colorSpaceConversion:"none",premultiplyAlpha:"none"});o.close(),o=u}let s=e.createTexture();if(i){o=ta(o,await a);let l=Math.min(2048,o.width),u=Math.round(o.height*l/o.width),d=typeof OffscreenCanvas=="function"?new OffscreenCanvas(l,u):document.createElement("canvas");d.width=l,d.height=u;let h=d.getContext("2d",{willReadFrequently:!0});h.drawImage(o,0,0,l,u);let m=h.getImageData(0,0,l,u).data,v=new Uint8Array(l*u);for(let f=0;f<v.length;f++)v[f]=m[f*4+3];Oa.set(s,{width:l,height:u,data:v})}e.bindTexture(e.TEXTURE_2D,s),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,o),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.close(),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT);let c=e.getExtension("EXT_texture_filter_anisotropic");return c&&e.texParameterf(e.TEXTURE_2D,c.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,e.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),s}function Jo(e){let t=new DataView(e).getUint32(0,!0),i=JSON.parse(new TextDecoder().decode(new Uint8Array(e,4,t))),a=4+t;return{meta:i,vertices:new Float32Array(e,a,i.vertices*14),indices:new Uint32Array(e,a+i.vertices*56,i.indices)}}var Qo=class{constructor(e,t,{mobile:i=!1,environment:a="mountains",vast:r=!1}={}){this.gl=e,this.vao=t,this.mobile=i,this.vast=r,this.reflectionFloat=!!e.getExtension("EXT_color_buffer_float"),this.meshes=new Map,this.materials={},this.horizons={};for(let[o,n]of Object.entries({mountains:Bt,lakeside:Ci,disola:Ri})){let s=e.createTexture();e.bindTexture(e.TEXTURE_2D,s),e.texImage2D(e.TEXTURE_2D,0,e.R32F,n.profile.length,1,0,e.RED,e.FLOAT,new Float32Array(n.profile)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.horizons[o]=s}this.ready=!1,this.error=null,this.assetPromises=new Map,this.request=0,this.geometry=Et(e,No,Wo),this.shadowProgram=this.geometry,this.skyProgram=Et(e,ct,Oo(i,{cachedAtmosphere:!0})),this.atmosphereProgram=Et(e,ct,Xo),this.cloudProgram=Et(e,ct,Vo),this.mistProgram=Et(e,ct,qo),this.mistCache=ke(e,256,128,{floating:this.reflectionFloat}),this.sky=ke(e,i?768:1024,i?384:512,{floating:this.reflectionFloat}),this.atmosphere=ke(e,256,128,{floating:this.reflectionFloat}),this.cloud=ke(e,128,128),this.shadow=ke(e,1,1,{depth:!0,depthOnly:!0}),this.nearShadow=ke(e,1,1,{depth:!0,depthOnly:!0}),this.aerial=ke(e,1,1),e.bindFramebuffer(e.FRAMEBUFFER,this.aerial.framebuffer),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),this.skyCadence=new Ho,this.sceneCadence=new jo,this.select(a)}select(e){let t=++this.request;this.ready=!1,this.error=null,this.loading=this.load(e).then(()=>{for(let i of[this.geometry,this.shadowProgram,this.skyProgram,this.atmosphereProgram,this.cloudProgram,this.mistProgram])Zo(this.gl,i);t===this.request&&(this.environment=e,this.ready=!0,this.skyCadence.reset(),this.sceneCadence.invalidate())}).catch(i=>{t===this.request&&(this.error=i)})}cached(e,t){return this.assetPromises.has(e)||this.assetPromises.set(e,t().catch(i=>{throw this.assetPromises.delete(e),i})),this.assetPromises.get(e)}async load(e){let t=this.gl,i=e==="mountains"?"fjord":e==="disola"?"disola":"lakeside";await Promise.all([this.cached("density",async()=>{let a=this.mobile||t.getParameter(t.MAX_3D_TEXTURE_SIZE)<480,r=await fetch(At[a?"densityMobile":"density"]);if(!r.ok)throw new Error("Cloud medium unavailable");let o=await r.arrayBuffer(),n=a?256:480,s=a?64:80;if(o.byteLength!==n*n*s*2)throw new Error("Cloud medium has invalid dimensions");this.cloudDensity=t.createTexture(),t.bindTexture(t.TEXTURE_3D,this.cloudDensity),t.texImage3D(t.TEXTURE_3D,0,t.RG8,n,n,s,0,t.RG,t.UNSIGNED_BYTE,new Uint8Array(o)),t.generateMipmap(t.TEXTURE_3D),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_WRAP_T,t.REPEAT),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE)}),this.cached("volume",async()=>{let a=await fetch(At.volume);if(!a.ok)throw new Error("Cloud data unavailable");let r=await a.arrayBuffer();this.volume=t.createTexture(),t.bindTexture(t.TEXTURE_3D,this.volume),t.texImage3D(t.TEXTURE_3D,0,t.RGBA8,128,128,128,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array(r)),t.generateMipmap(t.TEXTURE_3D),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MAG_FILTER,t.LINEAR);for(let o of[t.TEXTURE_WRAP_S,t.TEXTURE_WRAP_T,t.TEXTURE_WRAP_R])t.texParameteri(t.TEXTURE_3D,o,t.REPEAT)}),...e==="clouds"?[]:[this.cached(i,async()=>{let[a,r,o]=await Promise.all([ba(t,At[i+"Photo"+(this.mobile?"Mobile":"")],!0),fetch(At[i+"Depth"]),i==="fjord"?ba(t,At["fjordNormal"+(this.mobile?"Mobile":"")]):Promise.resolve(null)]);if(!r.ok)throw new Error("Photographic landscape unavailable");let{meta:n,vertices:s,indices:c}=Jo(await r.arrayBuffer()),l=Vr(s,c);c=l.indices;let u=t.createVertexArray();ji(s,i),t.bindVertexArray(u);let d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,s,t.STATIC_DRAW);for(let[m,v,f]of[[0,3,0],[1,3,12],[2,2,24],[3,3,32],[4,3,44]])t.enableVertexAttribArray(m),t.vertexAttribPointer(m,v,t.FLOAT,!1,56,f);let h=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,h),t.bufferData(t.ELEMENT_ARRAY_BUFFER,c,t.STATIC_DRAW),t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),o&&(t.bindTexture(t.TEXTURE_2D,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)),this.meshes.set(i,{vao:u,vbo:d,ibo:h,meta:n,photo:a,normal:o,tiles:l.tiles,waterRegion:new $t(s,c,Oa.get(a))})})]]),t.bindVertexArray(null)}resize(e,t,i,a=e,r=t){var o,n,s,c;i===1&&(e=1,t=1,a=1,r=1);let l=i===1?1:Math.max(256,Math.round(e*1.05)),u=i===1?1:Math.max(192,Math.round(t*1.05));if(!(((o=this.scene)==null?void 0:o.width)===a&&((n=this.scene)==null?void 0:n.height)===r&&((s=this.reflection)==null?void 0:s.width)===l&&((c=this.reflection)==null?void 0:c.height)===u)){xa(this.gl,this.scene),xa(this.gl,this.reflection),this.scene=ke(this.gl,a,r,{depth:!0}),this.reflection=ke(this.gl,l,u,{depth:!0,floating:this.reflectionFloat});for(let d of[this.scene,this.reflection])this.gl.bindTexture(this.gl.TEXTURE_2D,d.texture),this.gl.generateMipmap(this.gl.TEXTURE_2D);this.sceneCadence.invalidate()}}putWeather(e,t){let i=this.gl;for(let[a,r]of Object.entries(t))q(i,e,a,r);j(i,e,"uCloudVolume",0,this.volume,i.TEXTURE_3D),j(i,e,"uAtmosphereMap",1,this.atmosphere.texture),j(i,e,"uCloudDensity",2,this.cloudDensity,i.TEXTURE_3D)}fullscreen(e,t){let i=this.gl;i.useProgram(e.program),i.bindFramebuffer(i.FRAMEBUFFER,t.framebuffer),i.viewport(0,0,t.width,t.height),i.disable(i.DEPTH_TEST),i.disable(i.BLEND),i.bindVertexArray(this.vao)}renderMistCache(e,t,i){if(t!==2||this.mist.uMistStrength<=0){this.mistCacheReady=!1;return}let a=i.join(","),r=this.mist.uMistSolar,o=this.mist.uMistStrength;if(!(!(!this.mistCacheReady||a!==this.mistEyeKey||Math.abs(r-this.mistCacheSolar)>.15||Math.abs(o-this.mistCacheStrength)>.025)&&e-(this.mistCacheAt??-1/0)<125)){this.fullscreen(this.mistProgram,this.mistCache);for(let[s,c]of Object.entries(this.mist))q(this.gl,this.mistProgram,s,c);q(this.gl,this.mistProgram,"uMistEye",i),j(this.gl,this.mistProgram,"uValleyNoise",0,this.volume,this.gl.TEXTURE_3D),this.gl.drawArrays(this.gl.TRIANGLES,0,3),this.mistCacheReady=!0,this.mistCacheAt=e,this.mistEyeKey=a,this.mistCacheSolar=r,this.mistCacheStrength=o}}renderSky(e,t,i){if(this.skyComplete)return this.renderSkyTiles(e,t,i);this.skyComplete=!0,this.skyState={...t},this.pendingCloud=null,this.skyAtmospherePending=!1;let a=this.gl,r=this.skyCadence.next(e,t,this.sky.width,this.sky.height),o=this.mobile?220:1e3/12;!r.atmosphere&&!r.reset&&e-(this.skyAt??-1/0)<o||(this.skyAt=e,r.atmosphere&&(this.fullscreen(this.atmosphereProgram,this.atmosphere),this.putWeather(this.atmosphereProgram,i),a.drawArrays(a.TRIANGLES,0,3)),this.fullscreen(this.skyProgram,this.sky),this.putWeather(this.skyProgram,i),a.drawArrays(a.TRIANGLES,0,3),a.bindTexture(a.TEXTURE_2D,this.sky.texture),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),(r.atmosphere||e-(this.cloudAt??-1/0)>180)&&(this.fullscreen(this.cloudProgram,this.cloud),this.putWeather(this.cloudProgram,i),a.drawArrays(a.TRIANGLES,0,3),this.cloudAt=e))}renderSkyTiles(e,t,i){var c;let a=this.gl,r=this.skyCadence.next(e,t);if(r.reset||Math.abs((((c=this.skyState)==null?void 0:c.solar)??t.solar)-t.solar)>.3)return this.skyJob=null,this.skyComplete=!1,this.skyCadence.reset(),this.renderSky(e,t,i);if(this.pendingCloud&&(this.fullscreen(this.cloudProgram,this.cloud),this.putWeather(this.cloudProgram,this.pendingCloud),a.drawArrays(a.TRIANGLES,0,3),this.cloudAt=e,this.pendingCloud=null),this.skyAtmospherePending||=r.atmosphere,!this.skyJob){if(!this.skyAtmospherePending&&e-(this.skyAt??-1/0)<220)return;this.skyAtmospherePending&&(this.fullscreen(this.atmosphereProgram,this.atmosphere),this.putWeather(this.atmosphereProgram,i),a.drawArrays(a.TRIANGLES,0,3),this.skyAtmospherePending=!1),this.skyBack??=ke(a,this.sky.width,this.sky.height,{floating:this.reflectionFloat});let l=Object.fromEntries(Object.entries(i).map(([u,d])=>[u,Array.isArray(d)||ArrayBuffer.isView(d)?d.slice():d]));this.skyJob={tile:0,weather:l},this.skyAt=e,this.skyState={...t}}let o=this.skyJob,n=this.skyBack,s=n.height/4;this.fullscreen(this.skyProgram,n),this.putWeather(this.skyProgram,o.weather),a.enable(a.SCISSOR_TEST),a.scissor(0,Math.floor(o.tile*s),n.width,Math.ceil(s)),a.drawArrays(a.TRIANGLES,0,3),a.disable(a.SCISSOR_TEST),++o.tile===4&&(a.bindTexture(a.TEXTURE_2D,n.texture),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),this.skyBack=this.sky,this.sky=n,this.pendingCloud=o.weather,this.skyJob=null)}render(e,t,i,a,r){if(!this.ready)return;let o=this.gl,n=e.activeEnvironment==="clouds"?1:e.activeEnvironment==="mountains"?2:e.activeEnvironment==="disola"?3:0;this.resize(e.sceneTarget.width,e.sceneTarget.height,n,e.canvas.width,e.canvas.height);let s=e.altSettings.breeze/100,c=t/1e3*(e.reducedMotion?.28:1),l=r.altitude,u=Yo(l,e.activeBed==="salt"),d={...e.camera,position:e.camera.position.map(y=>y*.44)};this.renderTanHalfFov=d.tanHalfFov,this.renderHeight=e.sceneTarget.height;let h=Go(d);h.tanHalfFov*=1.55,this.reflectionMatrix=$0(h,e.aspect);let m=e.celestial.source==="sun"?a.sun:a.moon,v=e.celestial.source==="sun"?[1,Math.max(.32,Math.min(1,.44+a.sun[1]*2)),Math.max(.12,Math.min(.94,.21+a.sun[1]*3))]:[.55,.68,1],f={uFjordWeather:n===2?1:0,uFjordStratus:n===2&&this.vast?1:0,uFjordClearing:n===2&&this.vast?Ji(e.environmentHour??e.celestial.hour):0,uCloudOffset:e.environmentClock.wind,uWeatherTime:i,uBreeze:s,uCloudCoverage:Ko[e.activeEnvironment],uCloudFade:u,uSunDirection:a.sun,uMoonDirection:a.moon,uSourceDirection:m,uSolarAltitude:l,uDaylight:r.daylight,uNight:r.night};this.weather=f,this.mist={uMistTime:i,uMistSolar:l,uMistWind:e.environmentClock.wind,uMistStrength:n===2?Zi(e.environmentHour??e.celestial.hour,this.vast):0},this.sourceColor=v,this.sourcePower=e.celestial.source==="sun"?Math.max(0,Math.min(1,m[1]*20)):r.sourcePower*.3,this.renderSky(t,{kind:n,solar:l,clock:i,breeze:s,clear:u},f),this.renderMistCache(t,n,d.position),this.shadowMatrix=ya(m,n>=2?5e3:800,n>=2?[0,300,2500]:[0,60,400]),this.nearShadowMatrix=ya(m,850,[0,140,350]);let p=[...d.position,...d.forward,d.tanHalfFov,e.aspect].join(",");if(this.sceneCadence.due(t,{kind:n,solar:l,breeze:s,camera:p,materials:this.request})){let y=this.meshes.get(n===2?"fjord":n===3?"disola":"lakeside"),g={...f,...this.mist,uDisola:n===3?1:0,uLakePhoto:n===0?1:0,uVast:this.vast?1:0,uFjord:n===2?1:0,uMoonVisibility:r.moonVisible,uWindTime:c,uBreeze:s,uSolarAltitude:l,uDaylight:r.daylight,uNight:r.night,uSourceDirection:m,uSourceColor:v,uSourcePower:e.celestial.source==="sun"?Math.max(0,Math.min(1,m[1]*20)):r.sourcePower*.3};o.enable(o.DEPTH_TEST),o.depthMask(!0),o.depthFunc(o.LESS),o.disable(o.BLEND),o.disable(o.CULL_FACE),o.colorMask(!0,!0,!0,!0),o.bindVertexArray(y.vao);let x=this.geometry;o.useProgram(x.program);for(let[w,k]of Object.entries(g))q(o,x,w,k);j(o,x,"uPhoto",0,y.photo),j(o,x,"uCloudShadow",1,this.cloud.texture),j(o,x,"uSkyMap",2,this.sky.texture),j(o,x,"uTerrainNormal",3,y.normal??y.photo),j(o,x,"uTerrainShadow",4,this.shadow.depthTexture),j(o,x,"uTerrainNearShadow",5,this.nearShadow.depthTexture),j(o,x,"uValleyAtmosphere",6,this.atmosphere.texture),j(o,x,"uCloudDensity",7,this.cloudDensity,o.TEXTURE_3D),j(o,x,"uCloudVolume",8,this.volume,o.TEXTURE_3D),j(o,x,"uValleyNoise",8,this.volume,o.TEXTURE_3D),q(o,x,"uTerrainNearShadowMatrix",this.nearShadowMatrix),q(o,x,"uTerrainShadowMatrix",this.shadowMatrix),q(o,x,"uTerrainShadowTexel",1/this.shadow.width);for(let[w,k]of[[d,this.scene],[h,this.reflection]])o.bindFramebuffer(o.FRAMEBUFFER,k.framebuffer),o.viewport(0,0,k.width,k.height),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),q(o,x,"uViewProjection",$0(w,e.aspect)),q(o,x,"uEye",w.position),Hr(o,y,$0(w,e.aspect)),o.bindTexture(o.TEXTURE_2D,k.texture),o.generateMipmap(o.TEXTURE_2D),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR_MIPMAP_LINEAR)}n===1&&this.shadowKind!==1&&(o.bindFramebuffer(o.FRAMEBUFFER,this.shadow.framebuffer),o.depthMask(!0),o.clear(o.DEPTH_BUFFER_BIT)),this.shadowKind=n,o.disable(o.DEPTH_TEST),o.bindVertexArray(e.screenVao)}bindWater(e){var a;if(!this.ready)return;let t=this.gl,i={program:e,locations:this.waterLocations??(this.waterLocations=new Map)};for(let[r,o,n]of[["uSkyMap",3,this.sky.texture],["uCloudShadow",4,this.cloud.texture],["uWorldColor",7,this.scene.texture],["uWorldDepth",8,this.scene.depthTexture],["uReflectionColor",9,this.reflection.texture],["uReflectionDepth",10,this.reflection.depthTexture],["uShadowMap",11,this.shadow.depthTexture],["uValleyAtmosphere",12,this.atmosphere.texture],["uTerrainHorizon",13,this.horizons[this.environment]??this.horizons.mountains]])j(t,i,r,o,n);j(t,i,"uValleyNoise",14,this.volume,t.TEXTURE_3D),j(t,i,"uValleyMistCache",15,this.mistCache.texture),q(t,i,"uValleyMistReady",this.mistCacheReady?1:0);for(let[r,o]of Object.entries(this.mist??{}))q(t,i,r,o);q(t,i,"uShadowLightDirection",((a=this.weather)==null?void 0:a.uSourceDirection)??[0,1,0]),q(t,i,"uTerrainHorizonReady",this.horizons[this.environment]?1:0),q(t,i,"uReflectionAlphaFloor",this.reflectionFloat?1e-5:.015),q(t,i,"uSkyPixelAngle",2*(this.renderTanHalfFov??.445)/Math.max(this.renderHeight??768,1)),q(t,i,"uShadowMatrix",this.shadowMatrix),q(t,i,"uReflectionMatrix",this.reflectionMatrix),q(t,i,"uShadowTexel",1/this.shadow.width),q(t,i,"uWorldReady",1)}bindDetail(e){var a;let t=this.gl,i={program:e,locations:this.detailLocations??(this.detailLocations=new Map)};j(t,i,"uFlareSky",4,this.sky.texture),q(t,i,"uSunAperture",this.sunAperture??[0,1,0,0]),q(t,i,"uSunContact",this.sunContact??[0,1,0,0]),q(t,i,"uFlareSun",((a=this.weather)==null?void 0:a.uSunDirection)??[0,-1,0]),j(t,i,"uNativeScene",2,this.scene.texture),j(t,i,"uNativeDepth",3,this.scene.depthTexture),q(t,i,"uDetailReady",this.ready&&this.environment!=="clouds"?1:0)}},$o="/_p/3fa5b9baf5d53335a70d880a44a9",en=`#version 300 es
precision highp float;
precision highp sampler2D;
layout(location=0)in vec3 aDirection;
layout(location=1)in vec2 aPhotometry;
uniform mat3 uStarOrientation;
uniform vec3 uCameraForward,uCameraRight,uCameraUp;
uniform float uAspect,uTanHalfFov,uStrength,uMoonlight,uStarPixelRatio;
out vec3 vColor,vDirection;out float vEnergy;
void main(){
 vec3 d=uStarOrientation*aDirection;vDirection=d;
 float front=dot(d,uCameraForward);
 gl_Position=vec4(dot(d,uCameraRight)/(uTanHalfFov*uAspect),dot(d,uCameraUp)/uTanHalfFov,front*.999,front);
 if(d.y<=0.||front<=0.)gl_Position=vec4(2.,2.,2.,1.);
 float magnitude=aPhotometry.x,bv=aPhotometry.y>90.?.65:clamp(aPhotometry.y,-.4,2.);
 vColor=mix(vec3(.70,.82,1.),vec3(1.,.70,.43),smoothstep(-.1,1.8,bv));
 float visible=1.-smoothstep(mix(5.6,4.9,uMoonlight),mix(6.1,5.5,uMoonlight),magnitude);
 float flux=pow(10.,-.4*(magnitude-2.));
 gl_PointSize=(3.+min(2.,sqrt(flux)*.60))*clamp(uStarPixelRatio,1.,2.5);
 vEnergy=uStrength*visible*min(1.35,.82*pow(flux,.50));
}
`,tn=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec3 vColor,vDirection;in float vEnergy;
uniform sampler2D uTerrainDepth,uSkyMap;
uniform vec2 uResolution;
out vec4 outColor;
void main(){
 vec2 uv=gl_FragCoord.xy/uResolution;
 if(texture(uTerrainDepth,uv).r<.9999999)discard;
 vec2 p=gl_PointCoord*2.-1.;float r2=dot(p,p);
 float psf=exp(-r2*6.)*(1.-smoothstep(.6,1.,r2));
 float a=atan(vDirection.x,vDirection.z);
 vec2 skyUV=vec2(.5+atan(3.*tan(a*.5))/3.141592654,pow(asin(clamp(vDirection.y,0.,1.))/1.570796327,.70));
 float clear=textureLod(uSkyMap,skyUV,0.).a;
 float extinction=exp(-.14/max(vDirection.y,.045));
 // This pass overlays the already display-encoded composite. Convert the
 // stellar radiance to that same encoding so faint stars survive, including
 // on dense displays. Cloud extinction and terrain occlusion still apply.
 vec3 light=1.-exp(-vColor*vEnergy*psf*clear*extinction*1.3);
 vec3 display=mix(light*12.92,1.055*pow(light,vec3(1./2.4))-.055,step(vec3(.0031308),light));
 outColor=vec4(display,0.);
}
`,rr=(e,t)=>[Math.cos(t)*Math.cos(e),Math.cos(t)*Math.sin(e),Math.sin(t)],or=rr(266.4051*Math.PI/180,-28.936175*Math.PI/180),nr=rr(192.85948*Math.PI/180,27.12825*Math.PI/180),an=tt(k0(nr,or)),Ut=tt([.18,.23,.956]),wa=tt([.72,.68,-.3]),mi=tt(wa.map((e,t)=>e-Ut[t]*Ne(wa,Ut))),rn=tt(k0(Ut,mi));function on(e){let t=e/2880*Math.PI*2,i=Math.cos(t),a=Math.sin(t),r=mi.map((s,c)=>s*i-Ut[c]*a),o=Ut.map((s,c)=>s*i+mi[c]*a),n=new Float32Array(9);for(let s=0;s<3;s++)for(let c=0;c<3;c++)n[s*3+c]=r[c]*an[s]+rn[c]*nr[s]+o[c]*or[s];return n}var nn=class{constructor(e){this.gl=e,this.locations=new Map,this.program=e.createProgram();for(let[t,i]of[[e.VERTEX_SHADER,en],[e.FRAGMENT_SHADER,tn]]){let a=e.createShader(t);e.shaderSource(a,i),e.compileShader(a),e.attachShader(this.program,a)}e.linkProgram(this.program),this.loading=fetch($o).then(t=>{if(!t.ok)throw new Error("Star catalogue unavailable");return t.arrayBuffer()}).then(t=>{if(!e.getProgramParameter(this.program,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(this.program));this.count=t.byteLength/20,this.vao=e.createVertexArray(),this.buffer=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,20,12),e.bindVertexArray(null),this.ready=!0}).catch(t=>{this.error=t})}render(e,t){if(!this.ready||t.night<.02)return;let i=this.gl,a=this.program,r=e.camera,o=n=>(this.locations.has(n)||this.locations.set(n,i.getUniformLocation(a,n)),this.locations.get(n));i.useProgram(a),i.bindVertexArray(this.vao),i.disable(i.DEPTH_TEST),i.uniformMatrix3fv(o("uStarOrientation"),!1,on((e.environmentHour??e.celestial.hour)*120));for(let[n,s]of[["Forward",r.forward],["Right",r.right],["Up",r.up]])i.uniform3fv(o("uCamera"+n),s);i.uniform1f(o("uStarPixelRatio"),e.canvas.height/(e.canvas.clientHeight||e.canvas.height)),i.uniform1f(o("uAspect"),e.aspect),i.uniform1f(o("uTanHalfFov"),r.tanHalfFov),i.uniform1f(o("uStrength"),t.night*e.altSettings.exposure/100),i.uniform1f(o("uMoonlight"),t.moonVisible),i.uniform2f(o("uResolution"),e.canvas.width,e.canvas.height),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,e.worldRenderer.scene.depthTexture),i.uniform1i(o("uTerrainDepth"),0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,e.worldRenderer.sky.texture),i.uniform1i(o("uSkyMap"),1),i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),i.drawArrays(i.POINTS,0,this.count),i.disable(i.BLEND),i.bindVertexArray(e.screenVao)}},u0={albedo:"/_p/a030810303080a7d8ddc069bc2a8",albedoMobile:"/_p/a5d114919ae53f4430dd6a7b0d93",geometry:"/_p/d8ecfbc00cc7ba8d1260fcdf0cbf",geometryMobile:"/_p/8fbbe2595ebd0fb19ae44cb65904",sand:"/_p/cec9df2370fa67dc30402ff79445",sandMobile:"/_p/8c746679e8b9ae5442a78739a6ab",sandGeometry:"/_p/fdcd276779073494ce48819f2ff2",sandGeometryMobile:"/_p/65e268a9ccab7148e3fb34097d17",salt:"/_p/90a094ecf9f5aaff4982717af6b4",saltMobile:"/_p/26334193c42086687ce2479a708e",saltGeometry:"/_p/168c0c18691197ce4628ce1ea5c7",saltGeometryMobile:"/_p/3369230665bc1fe2ea719205ac20",milkyWay:"/_p/d60463c0951dbb5d1a4565cc316d",milkyWayMobile:"/_p/d83031d8a650b58f0ca6f9b0eebc",moon:"/_p/42c4bd80da6d02a3c3ee0711e3b1"};function Ta(e,t){let i=e.createProgram();for(let[a,r]of[[e.VERTEX_SHADER,ct],[e.FRAGMENT_SHADER,t]]){let o=e.createShader(a);e.shaderSource(o,r),e.compileShader(o),e.attachShader(i,o)}return e.linkProgram(i),i}function sn(e,t){for(let i of e.getAttachedShaders(t)||[])e.detachShader(t,i),e.deleteShader(i);e.deleteProgram(t)}function kt(e,t){let i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(t)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),i}function d0(e,t,{environment:i=!1,priority:a="auto"}={}){return new Promise((r,o)=>{let n=(c,l=!1)=>{if(e.isContextLost()){o(new Error("Context lost"));return}let u=e.createTexture();e.bindTexture(e.TEXTURE_2D,u),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!l),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,i?e.CLAMP_TO_EDGE:e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.generateMipmap(e.TEXTURE_2D);let d=e.getExtension("EXT_texture_filter_anisotropic");d&&!i&&e.texParameterf(e.TEXTURE_2D,d.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,e.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(e.TEXTURE_2D,null),r(u)},s=()=>{let c=new Image;c.decoding="async",c.fetchPriority=a,c.onload=()=>n(c),c.onerror=()=>o(new Error("Lake material unavailable")),c.src=t};typeof createImageBitmap=="function"?fetch(t,{priority:a}).then(c=>{if(!c.ok)throw new Error("Lake material unavailable");return c.blob()}).then(c=>createImageBitmap(c,{premultiplyAlpha:"none",colorSpaceConversion:"none",imageOrientation:"flipY"})).then(c=>{try{n(c,!0)}finally{c.close()}}).catch(s):s()})}var ln=class extends hi{farRippleWeight(e,t){let i=Math.min(e+12,12-e,t+2,22-t),a=Math.max(0,Math.min(1,i/2.5));return 1-a*a*(3-2*a)}addFarRipple(e,t,i=1){if(!Number.isFinite(e)||!Number.isFinite(t))return!1;let a=this.farRippleWeight(e,t);if(a<.001)return!1;let r=performance.now(),o=this.farRipples??(this.farRipples=[]);for(let n=o.length-1;n>=0;n--)r-o[n].born>=1e4&&o.splice(n,1);return o.length>=8&&o.shift(),o.push({x:e,z:t,born:r,strength:Math.max(.1,Math.min(1.5,i))*a}),!0}bindFarRipples(e,t){let i=this.farRipples??(this.farRipples=[]);for(let r=i.length-1;r>=0;r--)t-i[r].born>=1e4&&i.splice(r,1);let a=this.farRippleValues??(this.farRippleValues=new Float32Array(32));a.fill(0);for(let r=0;r<i.length;r++){let o=i[r];a.set([o.x,o.z,(t-o.born)/1e3,o.strength],r*4)}this.gl.uniform1i(b(this.gl,e,"uFarRippleCount"),i.length),i.length&&this.gl.uniform4fv(b(this.gl,e,"uFarRipples[0]"),a)}isWaterAt(e,t){var s,c;let i=this.canvasBounds??this.canvas.getBoundingClientRect();if(e<i.left||e>i.left+i.width||t<i.top||t>i.top+i.height)return!1;let a=this.screenToWorld(e,t);if(!a)return!1;let r=this.activeEnvironment??this.altSettings.environment;if(r==="clouds")return!0;let o=r==="mountains"?"fjord":r,n=(c=(s=this.worldRenderer)==null?void 0:s.meshes.get(o))==null?void 0:c.waterRegion;return!!n&&n.contains(this.camera.position.map(l=>l*.44),{x:a.x*.44,z:a.z*.44})}setTimeHours(e,t){if(super.setTimeHours(e,t),this.environmentHour=e,!this.altSettings)return;let i=Math.max(0,Math.min(160,ga(e)+(this.breezeOffset??0)));this.altSettings.breeze!==i&&(this.altSettings.breeze=i,window.dispatchEvent(new CustomEvent("altbreezefollow",{detail:{breeze:i}})))}getAmbientActivity(){return .34+.66*Math.min(1,this.altSettings.breeze/100)}resize(){var e;super.resize(),G0(this.camera,this.activeEnvironment??((e=this.altSettings)==null?void 0:e.environment)??m0().environment,this.aspect)}createCamera(){return Y()?ia(m0().environment):super.createCamera()}constructor(e,t){if(super(e,t),this.altSettings=m0(),this.breezeOffset=0,this.setTimeHours(this.environmentHour??this.celestial.hour),this.altUniforms=new Map,this.bedGeometryTexture=kt(this.gl,[128,128,255,18]),this.environmentTexture=kt(this.gl,[140,160,185,24]),this.environmentMaskTexture=kt(this.gl,[255,0,0,255]),this.milkyWayTexture=kt(this.gl,[0,0,0,255]),this.moonTexture=kt(this.gl,[150,150,150,255]),this.nightSkyReady=!1,d0(this.gl,u0.moon,{environment:!0}).then(a=>{this.gl.deleteTexture(this.moonTexture),this.moonTexture=a}).catch(()=>{}),d0(this.gl,u0[this.isMobile?"milkyWayMobile":"milkyWay"],{environment:!0}).then(a=>{this.gl.deleteTexture(this.milkyWayTexture),this.milkyWayTexture=a,this.nightSkyReady=!0}).catch(()=>{}),this.environmentReady=!1,this.environmentCache=new Map,this.environmentRequest=0,this.bedCache=new Map,this.bedRequest=0,this.environmentClock=new zo,this.tide&&(this.spray=new _o(this.gl,{mobile:this.isMobile}),this.tide.onWake=(...a)=>this.spray.wake(...a)),this.altMaterialStart=performance.now(),this.worldRenderer=new Qo(this.gl,this.screenVao,{mobile:this.isMobile,environment:this.altSettings.environment,vast:Y()}),this.starRenderer=new nn(this.gl),this.loadLakeBedTexture(),this.altSettingsListener=a=>{let r=this.altSettings.environment,o=this.altSettings.breeze;this.altSettings=Va(a.detail),a.detail.reset?(this.breezeOffset=0,this.setTimeHours(this.environmentHour)):this.altSettings.breeze!==o&&(this.breezeOffset=this.altSettings.breeze-ga(this.environmentHour)),this.altSettings.environment!==r&&(this.loadEnvironment(),this.loadLakeBedTexture())},window.addEventListener("altwaterchange",this.altSettingsListener),this.tide){let a=r=>{let o=this.screenToWorld(r.clientX,r.clientY);return o&&this.isWaterAt(r.clientX,r.clientY)&&this.tide.contains(o.x*.44,o.z*.44)?o:null};e.addEventListener("pointerdown",r=>{var o;if(r.pointerType==="mouse"&&(r.button!==0||(r.buttons&1)!==1)||(o=e.closest(".lake"))!=null&&o.classList.contains("is-context-menu-open"))return;let n=a(r);n&&this.tide.begin(r.pointerId,n.x*.44,n.z*.44,performance.now(),r.pressure||.5)},!0),e.addEventListener("pointermove",r=>{var o;if(!this.tide.contacts.has(r.pointerId))return;if(r.pointerType==="mouse"&&!(r.buttons&1)){this.tide.end(r.pointerId);return}let n=((o=r.getCoalescedEvents)==null?void 0:o.call(r))??[r];for(let s of n.length?n:[r]){let c=a(s);if(!c){this.tide.end(r.pointerId);break}let l=performance.now(),u=Math.abs(s.timeStamp-l)<6e4?s.timeStamp:l;this.tide.move(r.pointerId,c.x*.44,c.z*.44,u)}},!0);for(let r of["pointerup","pointercancel","lostpointercapture"])window.addEventListener(r,o=>this.tide.end(o.pointerId),!0);window.addEventListener("blur",()=>this.tide.endAll()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.tide.endAll()})}let i=(a,r)=>this.isWaterAt(a,r);e.addEventListener("pointerdown",a=>{i(a.clientX,a.clientY)||a.stopImmediatePropagation()},!0),e.addEventListener("pointermove",a=>{a.buttons&&!i(a.clientX,a.clientY)&&e.dispatchEvent(new PointerEvent("pointercancel",{pointerId:a.pointerId,pointerType:a.pointerType,clientX:a.clientX,clientY:a.clientY,bubbles:!0}))},!0)}createPrograms(){super.createPrograms(),this.physicalPrograms={water:Ta(this.gl,Eo(this.floatTargets,$a(this.isMobile),Y(),this.isMobile)),composite:Ta(this.gl,ko)},this.physicalInstalled=!1}createSimulation(){super.createSimulation(),this.floatTargets&&(this.tide=new Fo(this.gl,this.screenVao,{mobile:this.isMobile}))}stepSimulation(){this.tide||super.stepSimulation()}dragThrough(e,t,i){if(e&&t){let a=t.x*.44,r=t.z*.44,o=performance.now(),n=(i==null?void 0:i.pointerId)??0,s=this.farDragSamples??(this.farDragSamples=new Map),c=s.get(n),l=Math.hypot(t.x-e.x,t.z-e.z)*.44;if(this.farRippleWeight(a,r)>.001&&l>.025&&(!c||o-c.time>=240)){let u=l/Math.max(.004,((i==null?void 0:i.deltaMs)??16)/1e3);this.addFarRipple(a,r,Math.min(.7,.2+u*.06)),s.set(n,{time:o})}if(s.size>8)for(let[u,d]of s)o-d.time>2e3&&s.delete(u)}this.tide||super.dragThrough(e,t,i)}advanceRippleArrivals(e,t=!1){(!this.tide||!t)&&super.advanceRippleArrivals(e,t)}rippleArrivalAtBottom(e,t,i={}){let a=super.rippleArrivalAtBottom(e,t,i);if(!this.tide||!a)return a;let r=this.screenToWorld(e,t),o=this.screenToWorld(a.clientX,a.clientY);if(!r||!o||!this.tide.contains(r.x*.44,r.z*.44))return null;let n=Math.max(0,Math.hypot(o.x-r.x,o.z-r.z)*.44-me.dropBroad),s=Math.ceil(n/Mo(Math.SQRT2/me.dropBroad)/ne.dt);return{...a,simulationSteps:s,delaySeconds:s*ne.dt}}splashAt(e,t,{holdDurationMs:i=140,onViewerArrival:a=null,...r}={}){var o;let n=this.screenToWorld(e,t);if(n&&this.isWaterAt(e,t)){let l=n.x*.44,u=n.z*.44;if(this.addFarRipple(l,u,.82+Math.min(i,400)/400*.35),this.tide&&!this.tide.contains(l,u)||!this.tide&&(n.x<this.world.minX||n.x>this.world.maxX||n.z<this.world.minZ||n.z>this.world.maxZ))return n}if(!this.tide)return super.splashAt(e,t,{holdDurationMs:i,onViewerArrival:a,...r});let s=this.screenToWorld(e,t);if(!s||!this.tide.contains(s.x*.44,s.z*.44))return null;if(i<260){let l=.82+Math.min(i,260)/260*.35;this.tide.impulse(s.x*.44,s.z*.44,me.dropHeight*l,me.dropVelocity*l,me.dropCore,me.dropBroad)}(o=this.spray)==null||o.burst(s.x*.44,s.z*.44,i<260?1:.62);let c=this.rippleArrivalAtBottom(e,t,{holdDurationMs:i,onsetDelayMs:0});return this.queueRippleArrival(c,performance.now(),a),s}finishProgramCompilation(){var e,t,i,a;if(!super.finishProgramCompilation())return!1;if((e=this.worldRenderer)!=null&&e.error)return this.programCompilationFailed=!0,this.stop(),this.canvas.dispatchEvent(new CustomEvent("waterfatal",{detail:this.worldRenderer.error})),!1;if(this.physicalInstalled)return this.lakeBedReady&&((t=this.worldRenderer)==null?void 0:t.ready);let r=this.gl,o=(i=this.parallelCompile)==null?void 0:i.COMPLETION_STATUS_KHR;if(o&&!Object.values(this.physicalPrograms).every(n=>r.getProgramParameter(n,o)))return!1;for(let[n,s]of Object.entries(this.physicalPrograms)){if(!r.getProgramParameter(s,r.LINK_STATUS)){let c=new Error(`Physical water material: ${r.getProgramInfoLog(s)}`);return this.programCompilationFailed=!0,this.stop(),this.canvas.dispatchEvent(new CustomEvent("waterfatal",{detail:c})),!1}this.programs[n]&&sn(r,this.programs[n]);for(let c of r.getAttachedShaders(s)||[])r.detachShader(s,c),r.deleteShader(c);this.programs[n]=s}return this.physicalInstalled=!0,this.lakeBedReady&&((a=this.worldRenderer)==null?void 0:a.ready)}loadLakeBedTexture(){if(this.programCompilationFailed||this.gl.isContextLost()||!this.bedGeometryTexture||!this.bedCache)return;this.lakeBedLoading=!0;let e=this.gl,t=this.isMobile?"Mobile":"",i=this.altSettings.environment==="clouds",a=i?Y()?"salt":"sand":"stone",r=++this.bedRequest;this.bedCache.has(a)||this.bedCache.set(a,Promise.all([d0(e,u0[(i?a:"albedo")+t],{priority:"high"}),d0(e,u0[(i?a+"Geometry":"geometry")+t],{priority:"high"})]).catch(o=>{throw this.bedCache.delete(a),o})),this.bedCache.get(a).then(([o,n])=>{r===this.bedRequest&&(this.lakeBedReady||(e.deleteTexture(this.lakeBedTexture),e.deleteTexture(this.bedGeometryTexture)),this.lakeBedTexture=o,this.bedGeometryTexture=n,this.activeBed=a,this.bedLoadFailures=0,this.lakeBedReady=!0,this.lakeBedLoading=!1)}).catch(o=>{r===this.bedRequest&&(this.lakeBedLoading=!1,this.bedLoadFailures=(this.bedLoadFailures??0)+1,this.bedLoadFailures<3?setTimeout(()=>{r===this.bedRequest&&!this.gl.isContextLost()&&this.loadLakeBedTexture()},500*this.bedLoadFailures):(this.programCompilationFailed=!0,this.stop(),this.canvas.dispatchEvent(new CustomEvent("waterfatal",{detail:o}))))}),this.environmentReady||this.loadEnvironment()}loadEnvironment(){var e;this.farRipples=[],(e=this.farDragSamples)==null||e.clear(),this.activeEnvironment&&this.activeEnvironment!==this.altSettings.environment&&this.worldRenderer.select(this.altSettings.environment),this.activeEnvironment=this.altSettings.environment,this.environmentReady=!0,Y()&&(this.camera=ia(this.activeEnvironment)),G0(this.camera,this.activeEnvironment,this.aspect)}renderWater(e){var t,i;let a=performance.now();(t=this.tide)==null||t.update(a,()=>hi.prototype.advanceRippleArrivals.call(this,a,!0));let r=this.gl,o=this.programs.water,n=this.altSettings,s=this.environmentClock.update(this.environmentHour??this.celestial.hour,a,n.breeze/100),c=ir(this.celestial,this.activeEnvironment),l=va(this.celestial);this.worldRenderer.render(this,a,s,c,l),r.useProgram(o),this.bindFarRipples(o,a);let u=v=>(this.altUniforms.has(v)||this.altUniforms.set(v,r.getUniformLocation(o,v)),this.altUniforms.get(v));for(let[v,f,p]of[[2,"uBedGeometry",this.bedGeometryTexture],[5,"uMilkyWay",this.milkyWayTexture],[6,"uMoonAlbedo",this.moonTexture]])r.activeTexture(r.TEXTURE0+v),r.bindTexture(r.TEXTURE_2D,p),r.uniform1i(u(f),v);let d=this.activeEnvironment==="mountains"?Bt:this.activeEnvironment==="disola"?Ri:Ci,h=this.activeEnvironment+":"+c.sun.join(",")+":"+c.sunRadius;this.worldRenderer.sunKey!==h&&(this.worldRenderer.sunAperture=Lo(c.sun,c.sunRadius,d),this.worldRenderer.sunContact=Io(c.sun,c.sunRadius,d,this.worldRenderer.sunAperture[3]),this.worldRenderer.sunKey=h),r.uniform1f(u("uEnvironmentReady"),this.environmentReady?1:0),r.uniform1f(u("uAltTideEnabled"),this.tide?1:0),r.uniform1f(u("uAmbientWaveDepth"),this.activeBed==="salt"?.85:this.activeEnvironment==="mountains"?80:this.activeEnvironment==="disola"?40:this.activeEnvironment==="clouds"?2.4:18),r.uniform1f(u("uWaterPixelAngle"),2*this.camera.tanHalfFov/this.sceneTarget.height),r.uniform2fv(u("uTerrainSourceVisibility"),[this.worldRenderer.sunAperture[3],ar(c.moon,this.activeEnvironment,Y())]),r.uniform1f(u("uAltSunRadius"),c.sunRadius),r.uniform1f(u("uAltSand"),this.activeBed==="sand"?1:0),r.uniform1f(u("uAltSalt"),Y()&&this.activeEnvironment==="clouds"?1:0),r.uniform1f(u("uNightSkyReady"),this.nightSkyReady?1:0),r.uniform1f(u("uAltEnvironmentKind"),this.activeEnvironment==="clouds"?1:this.activeEnvironment==="mountains"?2:this.activeEnvironment==="disola"?3:0),r.uniform1f(u("uAltEnvironmentTime"),s),r.uniform1f(u("uAltStellarPhase"),this.celestial.hour/24),r.uniform3fv(u("uAltSunDirection"),c.sun),r.uniform3fv(u("uAltMoonDirection"),c.moon),r.uniform1f(u("uAltSunset"),c.sunset),r.uniform1f(u("uAltMoonPhase"),c.moonPhase),r.uniform1f(u("uAltSourceIsSun"),this.celestial.source==="sun"?1:0),r.uniform1f(u("uAltClarity"),n.clarity/100),r.uniform1f(u("uAltDepth"),n.depth/100*(this.activeEnvironment==="disola"?1.15:this.activeEnvironment==="mountains"?1.3:1)),r.uniform1f(u("uAltBreeze"),n.breeze/100),r.uniform1f(u("uAltRipple"),n.ripple/100),r.uniform1f(u("uAltExposure"),n.exposure/100),r.uniform1f(u("uAltEnvironmentRotation"),this.activeEnvironment==="clouds"?0:.25),r.uniform1f(u("uAltFog"),this.activeEnvironment==="mountains"?.12:0),this.worldRenderer.bindWater(o);for(let[v,f]of Object.entries({uAltDaylight:l.daylight,uAltNight:l.night,uAltNightRadiance:l.nightRadiance,uAltSourcePower:l.sourcePower,uAltSolarAltitude:l.altitude}))r.uniform1f(u(v),f);let m=this.simulationTargets[this.simulationIndex];this.tide&&(this.simulationTargets[this.simulationIndex]=this.tide.output),super.renderWater(a/1e3),this.simulationTargets[this.simulationIndex]=m,(i=this.spray)==null||i.render(this,a,l)}renderPostProcessing(e){var t,i;let a=this.gl,r=this.programs.composite;a.useProgram(r),a.bindVertexArray(this.screenVao),a.bindFramebuffer(a.FRAMEBUFFER,((t=this.presentTarget)==null?void 0:t.framebuffer)??null),a.viewport(0,0,this.canvas.width,this.canvas.height);let o=this.detailUniforms??(this.detailUniforms=new Map),n=c=>(o.has(c)||o.set(c,a.getUniformLocation(r,c)),o.get(c));a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.sceneTarget.texture),a.uniform1i(n("uScene"),0),a.uniform2f(n("uSceneTexel"),1/this.sceneTarget.width,1/this.sceneTarget.height),a.uniform1f(n("uTime"),e),this.worldRenderer.bindDetail(r);let s=va(this.celestial);a.uniform1f(n("uDetailExposure"),this.altSettings.exposure/100*(1+(this.activeEnvironment!=="clouds"?s.night*5:0))),this.setCameraUniforms(r),a.drawArrays(a.TRIANGLES,0,3),(i=this.starRenderer)==null||i.render(this,s),this.presentTarget&&(a.bindFramebuffer(a.READ_FRAMEBUFFER,this.presentTarget.framebuffer),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.blitFramebuffer(0,0,this.presentTarget.width,this.presentTarget.height,0,0,this.canvas.width,this.canvas.height,a.COLOR_BUFFER_BIT,a.NEAREST)),a.bindFramebuffer(a.FRAMEBUFFER,null),this.isAndroid&&a.flush()}};function cn(e,t=Math.random){let i=Array.from({length:e},(a,r)=>r);for(let a=i.length-1;a>0;a-=1){let r=Math.floor(t()*(a+1));[i[a],i[r]]=[i[r],i[a]]}return i}var un=class{constructor(e,t=Math.random,i=Math.min(5,Math.max(0,e-1))){this.length=e,this.random=t,this.cooldown=i,this.last=null,this.recent=[],this.queue=[],this.timeline=[],this.cursor=-1}refill(){this.queue=cn(this.length,this.random)}draw(e=null){this.queue.length===0&&this.refill();let t=new Set(this.recent.slice(-this.cooldown));e!==null&&t.add(e),this.recent.length===0&&this.last!==null&&t.add(this.last);let i=this.queue.findIndex(r=>!t.has(r)),a=this.queue.splice(Math.max(0,i),1)[0];return this.last=a,this.recent.push(a),this.recent.length>this.cooldown&&this.recent.shift(),a}next(){if(this.cursor<this.timeline.length-1)return this.cursor+=1,this.timeline[this.cursor];let e=this.draw(this.timeline[this.cursor]??null);return this.timeline.push(e),this.cursor=this.timeline.length-1,e}previous(){if(this.cursor>0)return this.cursor-=1,this.timeline[this.cursor];let e=this.draw(this.timeline[this.cursor]??null);return this.timeline.unshift(e),this.cursor=0,e}},dn=[{name:"Click 1",file:"click1.flac",originalFile:"click1.wav",src:"/_media/d9c0bd0727e2fadd2c946619c39c.flac",gain:2.1},{name:"Little splash",file:"little-splash.flac",originalFile:"little-splash.wav",src:"/_media/9d8f17c5f2ce6c793d1b4b8992c0.flac",gain:1.15},{name:"Splash",file:"splash.flac",originalFile:"splash.wav",src:"/_media/8642f4424be9e15abbd95f95a4d2.flac",gain:10.8},{name:"Click X",file:"click-x.flac",originalFile:"click-x.wav",src:"/_media/e2e1f356a57fc384a07fbca66c9e.flac",gain:4.27},{name:"Click Y",file:"click-y.flac",originalFile:"click-y.wav",src:"/_media/66c8d3d57091681530afe67ca8e6.flac",gain:7.08},{name:"Anotha One",file:"anothaone.flac",originalFile:"anothaone.wav",src:"/_media/d77440cba7af298467fe66e2bf82.flac",gain:4.64}],hn=[{name:"Swoosh 2",file:"swoosh-2.mp3",originalFile:"swoosh-2.wav",src:"/_media/fcd413d49e32d03e5ac8d77f9467.mp3",direction:"any",gestureClass:"gentle",gain:.26,bodyStart:0,bodyEnd:1.293,partialEntry:0,minimumTailSeconds:.72,useForDrag:!0},{name:"Swoosh 3",file:"swoosh-3.mp3",originalFile:"swoosh-3.wav",src:"/_media/a654eb6ac0294c84a6ce5c709c84.mp3",direction:"any",gestureClass:"gentle",gain:.36,bodyStart:0,bodyEnd:1.145,partialEntry:0,minimumTailSeconds:.72,useForDrag:!0},{name:"Swoosh 4",file:"swoosh-4.mp3",originalFile:"swoosh-4.wav",src:"/_media/be6aa52587c465bfb31d8dfcb9ef.mp3",direction:"any",gestureClass:"gentle",gain:.31,bodyStart:0,bodyEnd:.863,partialEntry:0,minimumTailSeconds:.72,useForDrag:!0},{name:"Swoosh 5",file:"swoosh-5.mp3",originalFile:"swoosh-5.wav",src:"/_media/788690f901dae257a078ea7fe56f.mp3",direction:"any",gestureClass:"gentle",gain:.5,bodyStart:0,bodyEnd:.939,partialEntry:0,minimumTailSeconds:.72,useForDrag:!0}],ft=(e,t,i)=>Math.min(i,Math.max(t,e)),Sa=5;function mn(e,t=Sa){let i=Number.isFinite(e)?Math.max(1,Math.round(e)):1,a=Number.isFinite(t)&&t>0?t:Sa;return i*a}function fn(e,t){return!Number.isFinite(e)||!Number.isFinite(t)||t<=0?0:ft(e/t,0,1)}function pn(e,t,i){return!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(i)||i<=0?0:ft((e-t)/i,0,1)}function vn({viewportLeft:e=0,viewportWidth:t,waveformLeft:i,waveformRight:a,artistWidth:r,titleWidth:o,gap:n=24,gutter:s=16}){if(![e,t,i,a,r,o,n,s].every(Number.isFinite)||t<=0||a<i||r<0||o<0)return!1;let c=e+Math.max(0,s),l=e+t-Math.max(0,s),u=Math.max(0,n);return i-u-r>=c&&a+u+o<=l}function gn(e,t,i){if(!Number.isFinite(t)||!Number.isFinite(i)||i<=0)return 0;let a=ft(e,0,1)*i-t,r=ft(a,0,1);return r*r*(3-2*r)}function yn(e){let t=Array.from(e??[],n=>ft(Number.isFinite(n)?n:0,0,1));if(t.length===0)return new Float32Array;let i=[...t].sort((n,s)=>n-s),a=i[Math.floor((i.length-1)*.12)],r=i[Math.floor((i.length-1)*.94)],o=Math.max(r-a,1e-4);return Float32Array.from(t,n=>{let s=ft((n-a)/o,0,1);return .06+Math.pow(s,1.28)*.94})}function Aa(e){let t=Math.max(0,Math.round(Number.isFinite(e)?e:0));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var xn=Object.freeze({"/_media/67755876c535c1072ed9d3453c9e.mp3":"6+nZ6Ozk4e/o4Ont5vb/+fD5//f19+fg6e7Z4O/n2Pj/9vT/9/P+/OPf7+fe5u/j3e768//+8e7/+u7o7+Xb7+jg6O+TPw==","/_media/1307e69d8b2a317d2333dd22fd36.mp3":"5vD78+j57vbs9ffz/Pz+//n37vT48+75///37Pv0+Ovw+PP/+v/+9/T39/by7u/z8vHu9O746u/438que1ApEQ8=","/_media/c32d7b4a3ac95aadc2559bbfaf22.mp3":"9evq7+Xx5/Dw5ezt6efy7Orv5O7s/PD0+ufz8PD/7Pbt7+z78vj26P//7P/q7vru9Pr1+P/n/fPt/+3y+tTp8vCvlGCX6er46O7u7OjYDw==","/_media/1f57403f9b31d276b684327afe84.mp3":"tdHKys/Xz9jW2uLX5urY4NPg3dri8dve4ejj593f3t7l/+Xv6vfs6uTg5uTe//Xx7+78+dzk5Obf//3r6/b29fzw5uvt8f/84vX/5vrr5fr0//vr6vLs8Ob52cSKakkpFQ8=","/_media/8a59df048190c3a9cb01e9858852.mp3":"HRoYkf/7//n7////9PPz+v//7/Dr6ebv7b1y3ePn6ert7eLV3+Dl2+HV39nn2XUiIiPT7e/p4+Xp6+vq6ubd4Nba4+Tl2+nr19za29rfzc/X3drk3JlXRDcT","/_media/ea53a9d5a99be7b0fd8b7c7de4f3.mp3":"nob5/92j1pX/4f/zzMOcwLjz+taaq4Xmxf/UqdOz4//5/d+3yIKww/nmvseyravf996uybukmHx7fnVlYX6hyr/E7drX6PDl5enw6+Xt9fTy+/ru/P/39Ozr9/zrjSE=","/_media/0e1539e88517fb360e4875fc2bb0.mp3":"s7z0//z3/////P3//Pz1/Pz78fLv7fT/6/H1+Pr08er5+uby6Ofq7+3s7vjy8eLo7eTh4+7Sx83bz9/Y4tnT1dfe0dfW1tXq7efo6OHn3uXh5uHe5eLZ4OPaz9Hb1LYgDw==","/_media/dd3cbe88218f04b0c3fec47d0261.mp3":"ccvf6OP17N3r8Ofy8Ovl7+3u8eLy7ujq7fDn9vv09vXw+Ob2/+Po/+jx+OXz9+T5+fn5+Pn6/PDq/fX+////9Nu0ontdMA8=","/_media/09e72ccc6b77d35e268e6e035e2f.mp3":"H976//38+/P87vj4/P/0/f///Pzo+Pny9/nu9fH18Pr98unr/ej7+fHz6v307/Tt8fz49eT26vHg6/D07Ov06er/5NWiaDke","/_media/61fa7626ca63a0a5a3215a50ef8c.mp3":"hIahwMnT6e3w8/39//T4/P/26+/+/Pfo8fjr/+rz8/L89vz29f//8O/9/fjt6//s/ezu/ejzwp9LEg==","/_media/71f27c10fc50b390c46f7c7fd26d.mp3":"3NPs/eDz7/3r6vr49Or7+Pf++/709P/i4ubf09nj+Ovg7tvi1//y2eTX6Nf/9/z///72/eXi4t/ZzvPt4dzk5s7f1+nYw5c=","/_media/9568c42edc0b7d4e2dcc1d525cd8.mp3":"QVJg4Pbx49zz7+fg6O/o8PDx9fDq7O/x7vH5+P/08+ny//L09O/39/Ds+P/49///4+Tm4ePm3N74/vLy8/r54dPmLg==","/_media/30f05d0808078cade7b284d80fe8.mp3":"U2FgYqvU1trU1Njj4vHo//j3//////rp/fbz9+/58/L29vTt6Ovm7/Hq5O/t7ebo+vXv9vT19PLy9PTq8/Hu8u7y7+XjlQ==","/_media/3c49e69401e9a68fa4c17a779b55.mp3":"FiQ2Q2CBp9Tn/vHu7vHx9er79fPx8fv3/Pzp6/Dw69GrmqGqrKa56P727+zv9uzi+/T/5vD7/+fy5+jv9+/5sKanpriuut399v/x////8f778/T34tq+uZmGb11GMhoP","/_media/6b93404a7e3323fd08374d3079a6.mp3":"gKrB2tHK0M3JxdHN0N/P3Ozq8e7/7cXBuMvCwNPG1On67vfs7v/9/+fh6/Du5uvn5ePt+vb/+P/x9Obd1NPNvLmjfGQhDw==","/_media/a70457981c3b72fd32f9fb6c78a6.mp3":"MzvEy8XLw9HKz7/c//v///T/9fr/+/v48f/w8szCv7+8xMXBwt367fb57/vq6ej09eP08/Ssoqih2vTt+uLv9PP+9fD57ffIuMa8vmok","/_media/4ca52a37ed48702bb7fe2d3a7e79.mp3":"FxcYGNr+7v71//P76vr19ffx8/D36v/x/u337ffw8/fu+uz99P/z/+Y=","/_media/4b08dddce8f0f3beb02b1edf008b.mp3":"tLuysIk1My3b4vH/4P/63v/s3/Xx7+L89/Pp8+jw9OzL++rv4vbn75trztvU/+v79O726+zi5+/49eng2u/13Pbt7/Lv7frp8e/w9//H","/_media/2095463886c2c3c15991ef806694.mp3":"bGedyc/W4OX06s7k4+Tr8f/87OXV5P7j+NTQ7eXn5///3u7x4Pz33vv16fL1//rz3ff29/H39O309O+DDw==","/_media/aee18c2e11749eceea226b1e44c2.mp3":"taqalbqdnq216v/q///p/vXs8fXv8vLq/vbv9+Xz8Ojw9+v0/On/++n///L9+ef9+vn38+j4+uD7/eT68u728en24vPs8/vs6vHOztrZ18hkSUZGREZIRqKvrLSir4xgRg==","/_media/85d3545b93f7ae560b4481cfee36.mp3":"GBYX8vT2+v36//D//fj/9fz7+ff/8vr89Pv2+uO+yuv2+f71/fbz9vHy9PLz/+35+PXfusrXucrTVMvHbsunrsu5+f/2/P/2+Pb69ff28dvOx55yKw8P","/_media/b2c6fdaf6df228b207fb723a912c.mp3":"09fn3efb+d/93//s9/f18/ns/fH9//32+Pn/5vfu8e/w7uns+fv8//f//+vi8eby5e/r6vvv9vn57fT8+Pf2+fb4/Pz88/r4/Pz4+tu9ppJyYUxANikiDw==","/_media/03be61b8b67336e5d0370d332937.m4a":"9/f89fD88/D48fD99/b/7/P49Pb78v/28vv08/Ty8f318/318vvt+ffw8/v4/f/z9v/29f358vzz+Pfv/vb2//f3/fP1/vn4/fr4/+7z/fT//Pb9z6tyOhM=","/_media/e5dc05da9b28a913fdf11441c552.m4a":"3tzd3N7d3t/g4ubs8/X/+vTxxdjB7uTSzcru2MrGxtPz9/7y8Pny9fPv//b/+vv37uC3qZiIiIp7cHfI3MnUzr/Erpjx+fzz6/b57Ov3//////799vDl5N/e3d3c3dufDw8=","/_media/b456dbd86d913e09194e02b3b515.m4a":"QT+t8OLy/fXy+Pbg+PXv6u3r9/Xz6/X/7uz/9Pbs8vT6//Hu8vb99PTz8uvt8e/o9//x8/zx//vx7Pvz8/jy7un12IxJJQ8=","/_media/a9cc8c82a5996631e49a92131ed1.m4a":"+fv7/tRiX2BeXGFgZtD//P/8+//9+/v+/v7++//9yNX8+v77/P/8+9y2sbO0r7aut9v8+//9+v375xMP","/_media/c6c78cfebd2c6b4e9a25081ed0e9.m4a":"YnRrZXBvZ3Nkd1j//f//8Pv99/3y/P73/P7w6v34//H++fr11cnm9/T67vj39vv68Pj/8erz+vn0+/Tu+f3Sm4+AeYpW","/_media/87a2aae64abe65cc7c0c7036d686.m4a":"ouns7Ozl6Ozo+v79/f/8///n0e3j8+vt6N/m+/r9/v75/f76//z/z9Xm+/Pu6Pbx6uzp6fHo6YWIn73m09TOwLaVWSQP"}),ei=new Map,sr={"/_media/67755876c535c1072ed9d3453c9e.mp3":{duration:234.292245,peaks:"rKaZs6+UsJ+du6yUtqihuLOasaubvKmSua2lta6gubSnyr2nvMmmysKmv7upwrykxbexyL+kubKYvKiPtayit7KRsZ6ct6uSubOgubGQtKulw7uovsWjybyfwLaqybqixbqoy7ugu7OdvKmXubimtrGduq+hxrmmv76hvLqdwbSpx8emwcinzsijwr2vxr+jwbyyzMKiu6uYuKuesKufs7KWta6atqicsqect66bs5A+MTEg",sha256:"67755876c535c1072ed9d3453c9e645e9ca83032e8242e548c3514daae1e6e82"},"/_media/1307e69d8b2a317d2333dd22fd36.mp3":{duration:217.512,peaks:"OYJ7hneFdoV6g4CEgX1/ho+NhoWQeX15koyKiYuGgX+PkYaLjoqJh4+ikZqYl4yIh4h8jIyFfoiCgX1+iot+gIiRjpaInI6Vk5p/g4qSfIGIkIeOkId8iIySeouIhoZ8iZSQkJKVeZGYn5manJaGhYqOhI6Xj3+JiYd+kJiIeoGNg32DfYB5iH2AgYKDinx+fIqFg4GDfoaJd4WPhIiCe2JrXl5HRS8qGRIMDAYDAQEAAAAA",sha256:"1307e69d8b2a317d2333dd22fd36d38f3b77883250130ee3e37724da3433aa35"},"/_media/c32d7b4a3ac95aadc2559bbfaf22.mp3":{duration:264.881633,peaks:"cGtpY3NyYmt6aWJydWVnfnxlcHdpZnyBXW98bGl6dmZtgoBucndkbH10X21ocnNkbmxrbG11Z2t9aW13dmRrdmphd39iZ31pZG5zYmR2bGVtdGlmdGxnZ29naXFwa3KCZnFrcGFta21scnJnYXFtY296bGd8c2hycXdod2xrcH59bXVxbm6AaG52d1Zib2VhdW9lXnYzLj9RNChUPWJqbmthc2pnam1lb2p0aWt1am5iDgEA",sha256:"c32d7b4a3ac95aadc2559bbfaf225a70654a36198802795fb82774ee73db889d"},"/_media/1f57403f9b31d276b684327afe84.mp3":{duration:326.452245,peaks:"N0xFTEFITk9LSkhMVFJiWU9gU2NTUFRsYWdcU1pcT2tiWmdZTFdsa1hyeFVVY29we2JcVVxZY1laX2Rnb4J0ZHNfW3R1iX5VZW9eVWpgV2ZwZmx4eV2Dc15rd3d/YWZgVmNiXGZyc1pseIlWeW5TXnl1eV1YfF1tYG5mb2leg22EYmp4W11vboF7Y2NwYVl2b3VrbXd/h3Vkgldoc3iAcl1WW1hgVlNBOR8iFQwJBAMBAQAA",sha256:"1f57403f9b31d276b684327afe84d7912b7f12a6717c025647ffbbeda9d2cd06"},"/_media/8a59df048190c3a9cb01e9858852.mp3":{duration:299.284898,peaks:"MCw9OkE7Pnmbm5WblZ+eoKCVnpaimZ2ejpyalJeYn5iXoJudl52YmJ6ZnKCdmZ+UlXhlYkNgg5iXlJebnpSamZybmp2Uk5aclZaii5iYlJGQl46WlpmOk5aOclhEPTU8PkA/RH+Oj4uIiJGOk36Mj4yClJSMj46WgZKRh4uPkZSKkYqTjJGNmpmTkI+ZkY2XmZGYkpSTj5OPnpWXlpmZk5qRkpWOl5aQbldDJyIfGxgXCQIB",sha256:"8a59df048190c3a9cb01e98588522e925b4632343c8b452d42ebcb29ee600c49"},"/_media/ea53a9d5a99be7b0fd8b7c7de4f3.mp3":{duration:317.962449,peaks:"AS0oHjY5OjM8KzA6NTYzPkA5OT47NT01OTY9Ny03MzcyR0A3Pzw0OT81Lj8/OzBCRzg7QTgxOzM5Oj89O0RFPjtGQThEPDw/RD04QEU/Oj84OkA9OzlBOz1AQkFDPz9EQkNDPEE8Ozo3JBsuHRcaKycZLiQfJS0sLCs2LDQ8QUJLQUZCR0hGQkNCRURDRkhCQ0dFRkdJSkhHS0xOTElHSUlER0lISk5MTEtGTEpIRTobCQIA",sha256:"ea53a9d5a99be7b0fd8b7c7de4f3893eddf2be7f1e13d2c53e57cc420742aca5"},"/_media/0e1539e88517fb360e4875fc2bb0.mp3":{duration:323.73551,peaks:"Yl9iWIV+gIiLgXmJhoiJkIiDjoKBin2BhYCMi5GNjJWOh36LhouLgHd9hJKIgY6Ei3mJmY2Gj4aBfXKCeoSBj4iQg4mFg3uAg5SAiI2Khn2Aj4mNhIZ8enyJhoB/gH12eI5/eHF2ZmxudHNyd4aGiIOIh319fISKeoWMgIaAgYiBfnmGlY2QjIuMiYiJgoeJjZSXkpSRjI2QkY+IkJGHiY+OkYmSiYt2cWlja2hnZoIKAQAA",sha256:"0e1539e88517fb360e4875fc2bb04cb4fcdfadc72f7e8fc55080ddafe5974e79"},"/_media/dd3cbe88218f04b0c3fec47d0261.mp3":{duration:235.72898,peaks:"LiArUmpjX21ca2FvYXRfcGV2bG9pb3ZscG5xcnV2eW53cINzd2lxdnpicm5tbGp2cnVweG55YHNvd3V1bXZrd3x2fGZqdndteG51e3iBc3BzdW52aGlqbmpnZnZvdGtvanZ0cm97cXOCZ4R2emN5aHt0foJzb3ZzcIF6fXKIcIVxiGx8coF5eGx6cnN6fXNtiG99aoRme2BsaGpiZV1eYWtaUU5FOzM2JiYbGhEOCAYCAQAA",sha256:"dd3cbe88218f04b0c3fec47d0261f54c125005c166ee4abbfd34570d2178cc98"},"/_media/09e72ccc6b77d35e268e6e035e2f.mp3":{duration:241.005714,peaks:"GSUrenyDfH1/hXx9gYZ7eIWHio6NhZKRiIqTkHuRlJyPkKKPlpiii5aUoZSQln9+g4R3hn6Ah4uHipCWkoSSkoaRkKCelqaUmZqvi5ufoJeel39/g3WIfH6ZpKWapKCojpuXpZ2XoJaIjX12i319go13ko+DkJicmaCunqeeqI6cpqKZm5GLnKakoaOWo6Olm62Sk56FiJGcjnyBm5p5gZCRfo+BiIODgGFIRykeEwwHBAIB",sha256:"09e72ccc6b77d35e268e6e035e2ffd03fdac2d77d24251a58dbf5d2663d7e28d"},"/_media/61fa7626ca63a0a5a3215a50ef8c.mp3":{duration:194.925714,peaks:"SVpJX1ZVU05fe4p/f3WLh5SPkJSan52bnqqinqukpaerqa+lrq2vo62bqaiona6jsKumtqqwqKq1raWyr6ugpaurn6yqr6e3tqatrquWqa6wrqirqaysp6esqqmdq6ajraOmrbSutK+tq7alrKmnp6etqK6vrayxraupu62msriup6qzp6WmqamrqLCbr7Gmp7Wxqq2or6+wqKqrqaeorayrsKmoqaiol5+YglonEgkFAQAA",sha256:"61fa7626ca63a0a5a3215a50ef8c5f3f3b26bc150923a289515410746153fc27"},"/_media/71f27c10fc50b390c46f7c7fd26d.mp3":{duration:235.128163,peaks:"hXp5fIeUiouQjIyFkZCOiJCRko2NlJCUi46Vk4CRmJGTipKRlY6AlJiUi5OWmJGIlpaYlI+QlJGXi5GMjoyNlpGPgpaNkZCOlI2XlpSVlpmRmJKTm5eSm5uXmpOWlZ6HmpeTl46UlpuSjp6YnJSYnaOfj56ioJifn6Odop6foZ2lmKKbnpqdoZuinqKfpKGdpaKenaalop+goaSipKKhpKKonZybnI58gISPf4KDgn5weUkA",sha256:"71f27c10fc50b390c46f7c7fd26d9fba722ea87e7010bf5fafb50281f14cc79e"},"/_media/9568c42edc0b7d4e2dcc1d525cd8.mp3":{duration:222.772245,peaks:"AAkOCw4PDg86P0pQU0tJSktIRUJISUtEQ1NJUWtJaE9rT3RiSUI6Ql9uXF5kZmF0ZVlQTU1SSU5JW15OSHRoa25iSEhPUE1fXlVUXExTWExLSU1HRUZFYmdiR1JiVnV7dXJrSExicWNjan2EdIV2e11VZWdWbHJRVn11bGJsY3F4PU5CS05DT0tHTEBDTlBRTkhHQE1PU0tTVFpPQktfT05RQE9UUFtOTlpNPD1CRGUyDQIA",sha256:"9568c42edc0b7d4e2dcc1d525cd8f70250a6a436db38f1bfadae87e0c130e46b"},"/_media/30f05d0808078cade7b284d80fe8.mp3":{duration:233.560816,peaks:"ICgqMC4oXl5RTEhri4R/fn6EjYmNjYeRkZCDeoCZmoqSnY2ZiYKIlKOUjJ2WmKGehJqVkKWOjZmYoKCTlqOhnaCim5acqKWckqCfk6GmnpykqqSdlqCfnJWNiY6al42bkpCTk42VjZaWl5CVkpGioJiRkpmXnJeVn6iVl6Sgo6CfnZijp6SmlZ2hmKamlKKpoa+Qoqmqrq6XobeurKadq7qtsaOjtbatuq+twa6rlYuEhQEA",sha256:"30f05d0808078cade7b284d80fe89d2feb7d954ccc1e88bc017f818a57c485e6"},"/_media/3c49e69401e9a68fa4c17a779b55.mp3":{duration:320.496327,peaks:"BAkLEhghKSoyP0dfbnaYpa+xsa2nr6atrq6orK2noamsmpmdmaegoqOfnp+jqq2mp6qrrKSkpK6hoKCJgImXloyPkIF+jpeYmKeur66vqqquqqqqrq6traKfqqCYnaKaqqGkm5ufoKmkra6mpqmtoaSmrqCpnZGPk6WXlZuUjpOinZWZqKWwsLKwr7atsba4u7W2uru8wL26ssLFvsW+saijlod8c2NUPzQyIRsUDgoFAgAA",sha256:"3c49e69401e9a68fa4c17a779b55e3e304230142110d77d884a9dd73deb16652"},"/_media/6b93404a7e3323fd08374d3079a6.mp3":{duration:233.221224,peaks:"HRAbFzQnU1tIVVpISVNNS0xcU1FJQkhRW0RUTVZOXlZMVFxRVmNTXnVobXdwbXFwc3dmcnRvbXJPTUBSRUg/R1ZBVkhHQ0lEXUhUQVdGSmpgZnl5dntwc3htf39pfnl7bX+DbW59ZnKFaWxxbmZycXJ2fmx3enFrb2xrbW5oaXh5Z3l5dnZ0cnRwcHBnZG1uYVxuX11nYmZcZVxdYWFlZHBPXVRTY0Y5SkEpMC8iDAIBAQAA",sha256:"6b93404a7e3323fd08374d3079a699ea131af6dc5e8443d4f3c1389cad4e8841"},"/_media/a70457981c3b72fd32f9fb6c78a6.mp3":{duration:261.312,peaks:"BgoNDRBkcW9tcV9yaW5qZ2xnamtvbGtibmh0cXeJdnp9eX+Ednx/f3p8f3t8hH2Hg3t9eYKAeXd+f3t/eXpze3VsZWNpamFuYnJwZ29kdGVvbm5ob25uc3d0fHZ0fH5+e351doZ5c3iHhIOKhISHfHuAf4KDhIWEfoNqVUM1V0RCRUxHZXh2cndreHpqcXB3dG97f257doJ5fH19cIKAd3hwenhsbmFpbWVoZW5qUDUSCQMB",sha256:"a70457981c3b72fd32f9fb6c78a6152724389c2f7cc432428dc1fd62537fefd5"},"/_media/4ca52a37ed48702bb7fe2d3a7e79.mp3":{duration:135.418776,peaks:"GB0fHR4YIB8gGhdLGyAjICEiH6M6pKyrinmimptfk6eppk6Tmp6eXbS2uJ2MqqCgj6qxuKqLqKmlnX60t6yVjqunnn+msKuubqKrnZx/s7G3jZ+opLJ4sLK0sFmssKiUlbuvs2SoraqyTqyst6J/qqCmhZuwrqxmnaicrlq1sLScjbKdr22jsrephaCenp6Itre1lJ2srKaFmbSvq3aerJ+ahLK2q5WPqZygTJymp6k+mZ9y",sha256:"4ca52a37ed48702bb7fe2d3a7e793926bb5344d2c274440867dfbe27f9a566f6"},"/_media/4b08dddce8f0f3beb02b1edf008b.mp3":{duration:258.847347,peaks:"HWg2YGc/bVxVLlYrTFBQSU1PfZq+tbCsra+wrLTGvLGqs6yyqLC4sbyssa2uor20vLy8vsDEqKqsqLquw7iwxMDKtai0oLOvsbu8srW9vLO0rLqusLTAsbKyqramhXeCZpOTs62no6rHu7K6u7Oytba9pLmzr6u2w7qzvcTKrLCts62+xrnAvcS6w7qsuqCtubO/ur3Hu76vs7mrtsHEtrG0uri5xq2wvrW+tr29uMbCuqcO",sha256:"4b08dddce8f0f3beb02b1edf008b78f0dbe05ee8569689fd05be24e0db5675ae"},"/_media/2095463886c2c3c15991ef806694.mp3":{duration:205.035102,peaks:"AgohIh0PFyglJUg+RC88MUM2MDdFPDY1O0g6Pkc/Njo9SDg+T1Y/QzdGSjEzOkNASUZWN0A0PjgxRUlFTENKTD5CQk84PjRDRztEREY5PllKSkJJQjM/NEE2QTRBQEE9VS8zL0s/P0w+RzgyNDxCVk1JPTQvNjgyPT45T1JIR01VS0VASEo+P0pPR2RHWEJBOlBEXlJKNzZBQzY3Skk7SDs8OTw2PTY8Pjw2Oj5SIwoBAAAA",sha256:"2095463886c2c3c15991ef806694dbf4e121675dffb8794621ac3f38bf2a9e09"},"/_media/aee18c2e11749eceea226b1e44c2.mp3":{duration:324.04898,peaks:"LzIMLjIMMzs6MDM6MTg2NTxPTkRIQFBQSE1AS08+RVJBRmBTSkxMUklQWEtVW0dIVEpPXE9DW0pdVVJMWVJJUVJbTFRaS0pNTVpVS01WS0xNS09cUVZIQ1BPVFRPV05VVlNTS0RJTEhPT05KUEtTT1hNVlRSSlJaUFNHR01IR0hKSFJQSkVPSlRPV0k/TkQ/Sz1BPRQ7SDcmHyMwRzQvJiIQHg8qNy4/Oy0kKS8kIRgRCAgD",sha256:"aee18c2e11749eceea226b1e44c2934725633f794bbe4a237d5d9236e0da5572"},"/_media/85d3545b93f7ae560b4481cfee36.mp3":{duration:289.906939,peaks:"PkdSNVFTlJ+goqKWo62qrqavqrGtq7C0pa6xra6qsa60sK2xrqmvtbKtsbOwubeqrrGpsrWrr7CxtKyhlJimi522srGwsauptKmxsK6trZylrKqpraumpKOqs72vr7O3tLi4sLa0t7WhkoutlqGhlouepI+aj1dxnlxrnYpzj514l5R5kZ5xirCtr66wqrWtpa6sqqy3ta+vt7C0uLW0t7GxtqegmpqSkohqXTIhCgMBAAAA",sha256:"85d3545b93f7ae560b4481cfee3685b6406bca69295c8f4b684b8b84dc8caccf"},"/_media/b2c6fdaf6df228b207fb723a912c.mp3":{duration:291.996735,peaks:"NXRmOGR0cUdnZk1/g3yBhYd0hYtomYJ7gIWIjo6AkIyFjpGPhIqLjIyZlIyTj46Mg5SQioqikIZ9lIeBhn6JiYaSkISSioiIjZCTlI+PiYWJlpSNkp+dgYqJgX+Mgnt/iIx9gIF7iH6GgYSMlJ6PkI+NkZmTmIibnZOLko2RkYyJlZ2clI+RnJaMj5ucn42Qk5inmpCQmqWdn5qGioBgXUhMRjMrHR0WFA4MCwkIBQQDAwEA",sha256:"b2c6fdaf6df228b207fb723a912c80c1846bcc7f0a4b8ad1af6f00091a79f3a1"},"/_media/03be61b8b67336e5d0370d332937.m4a":{duration:296.17,peaks:"fnt/eYB6hYd9foKCgHyBd4WAfHd+g3x+eoZ+gH9xe3t/eH2Afnx9eXl+f3uAgYFvenyDfX16goB6gXyJg36CfYCKg4F/hn+DhoKBfIKBhop9f3p+eYCAfXt0gX2AdoR5fXx4f3l+gnaJfoGBe4h7f3yGfoJ9eYeEf4KKi4R/fYCMfoODgH9/e4R6iIGAh3+UiIKFgYGCgYOCh4aIgoB5d4B7dX2BhH2EfXpmcU5BJBMOBQEA",sha256:"03be61b8b67336e5d0370d332937a21c280567dad62ef1009d97b70ea5777555"},"/_media/e5dc05da9b28a913fdf11441c552.m4a":{duration:326.565011,peaks:"UU9PTE9PT1BPTE5QUk9RTk5RUVhWVFRZWF5eWVtcXFtbUE1MVUpRWVlTU01KUE9HU1lPTEpJSUxMSlZXXFxdYFxcW1tdXVtbWVxbWVxgXlxeXl5dW1xeW1tcWU5MSUZMR0RETExCQkRARUpGSFBVU1NQTlBOTExNTU5LRzJaWl5bW15aXFpZW19cXFpbV1tdX19hXV9dXFxdW11eXFlZVVRXVlJSUE5QUU9RT0tSThwgFQIB",sha256:"e5dc05da9b28a913fdf11441c5526643675aaaa3187c392d52abdbfd1b1d314a"},"/_media/b456dbd86d913e09194e02b3b515.m4a":{duration:237.238,peaks:"Uk1KXE5iU4qUiYJ9hZF/h4yTeo2WgI2ZhIuJhHh8goGAgomLfYSAh4eUlYGAg4eRj4mNkIp+jKGTjJiThIGkkX+SiJeMhYeKiI6IgYaHmJmHjpCLkJKJg3+IjImHl4ONj5eJkpWHjYqOhoWHloWbh5aEhoyPjImIpZGAnJaEi5+QipCXl3+TiYeSk4eFjYOJjImKfYuOgoWDkoOPkoWBiI6DjIOVj4iMe15HMhkOCAYDAQAA",sha256:"b456dbd86d913e09194e02b3b515a28786d990f3c2aecc718259e95e1b6d4f9d"},"/_media/a9cc8c82a5996631e49a92131ed1.m4a":{duration:200.225011,peaks:"l6KVnp6ZoJWgopeem4BSN1lbQ0ldUzxgXDhXYF9NYGBFZ15eZWJucImjoaqnoqemoaehoqSfpKSeqaSmop+nqKion6ewp6+ypa6msq2tsqWjr6yrtbCqrq2vrZeLgo2no6mopKaipKmepqSfpaWgpaSnop6soq+goZCBaXV6Y153dm2AdVpWdoJ7fnxnbYFwfYGEjJeho6GkpKaoqaGupqKno6Cnq6eppa6ppKeGJB4QBAEA",sha256:"a9cc8c82a5996631e49a92131ed11f13a98663007344ddc1a901d83d61b27975"},"/_media/c6c78cfebd2c6b4e9a25081ed0e9.m4a":{duration:231.549002,peaks:"NyY5MTo2OTstOTc/Lj1PUVdRUkVSUVJVVFNGSGt7c4Nue3V9fXJ4cYR6gnJ9cHJ6fXVvgXRxd3hveXt2bn15dXN8gnR1d3JbdHp2dHh6cHx8dWl/f3x6fm9/d3V7hIF3dHl8anR7fn98goB4goaKgIl/j316hH16f3qAhXp4fpGCeHyHf4OGcHmMdXF+e3Jyh3Z7eH9+dZCDfYCEfYKFhHx9gIByWVpxXGNsZmFkamV7ck0v",sha256:"c6c78cfebd2c6b4e9a25081ed0e9f2f68b4ff919842f20a891fea5f181d0b042"},"/_media/87a2aae64abe65cc7c0c7036d686.m4a":{duration:229.923991,peaks:"CiGPpKqrp6CvoqKgn56espqdqq2jmqKfnaWUopejopyUlJuen5SYmp2koJeXiXprkZyXoaaYnZmfmo+io6OZlZKYmZ+dnpGasZecpJ+knp6gqqKakZSalpqTk5OknpiYl5WfnZaWkoB0c6qVnqWuoZytoKOgm5iXo6aioKWjop+Zn5iPopaenJygkZKfn4lxe2x0iXSLi4aJnp2lrJygmJulnpmejI+TeWtOQygkFQkDAQAA",sha256:"87a2aae64abe65cc7c0c7036d686a7d18321babca5afc073efdd8e6ece5a8fa3"},"/_media/5122e86454a11ade818f9fffc6a5.mp3":{duration:321.671837,peaks:"QEM5ST5FSkpMQTxJT0BUQVc/VElLSURXZUlgYFFPSE1IUkpLZltLX0thUFtoSEpeT0tGV05fYFZIR1hMRktGS2hHVD9DY1ZJV2VMU0xYTlJcUFpVVWVLXFFNUUpMTEFaWltBUUtBYUlVUUlPSEpKPFFKQ2RNSDpVWFteT0hdU0xNSlZKYUpSUVZIV0RXSU1IWEtMTVJGSElSU0xWTlJZUkNUQVE/QkU5MykdHhINBgQCAQEA",sha256:"5122e86454a11ade818f9fffc6a599fd078b9d2fb42035b28942b85179e30bf6"}};function bn(e){var r;if(ei.has(e))return ei.get(e);let t=((r=sr[e])==null?void 0:r.peaks)??xn[e];if(!t)return[];let i=Uint8Array.from(atob(t),o=>o.charCodeAt(0)),a=yn(Float32Array.from(i,o=>o/255));return ei.set(e,a),a}var ve=(e,t,i)=>Math.min(i,Math.max(t,e));function pe(e,t,i){let a=ve((i-e)/Math.max(t-e,1e-6),0,1);return a*a*(3-2*a)}function wn(e){let t=pe(.34,1,e);return .36+Math.pow(t,.82)*.64}function Tn(e){let t=(e%1440+1440)%1440,i=17.25*60,a=20.25*60,r=4.75*60,o=326;return t>=i?pe(i,a,t):t<o?1-pe(r,o,t):0}function Sn(e){let t=(e%1440+1440)%1440,i=6.5*60,a=540,r=10.5*60,o=13.5*60,n=17.25*60,s=20.25*60,c=t<i?0:.5+pe(i,a,t)*.5,l=pe(r,o,t),u=pe(n,s,t);return{morning:c*(1-l),afternoon:l*(1-u)}}var lr=.21,An=30,cr=32,En=.025,kn=1.72;var fi=.065,ti=.2,ii=.36,Ea=.48,ka=fi;function Ma(e=.5,t=e,i=!1){return i||ve(e,0,1)>=ka||ve(t,0,1)>=ka}function Dt({speed:e=0,acceleration:t=0,pathDistance:i=0}={}){let a=pe(An,112,i),r=pe(lr,1.08,e),o=pe(.004,.032,t),n=r*r*.86+o*.14;return a*Math.pow(n,1.08)}function Mn({motionEnergy:e=0,pathDistance:t=0}={}){let i=ve(e,0,1),a=pe(cr,320,t);return 1.35+i*.55+a*.35}function ur(e=.5){let t=ve(e,0,1);return t<=fi?0:t<ti?pe(fi,ti,t)*.16:t<ii?.16+pe(ti,ii,t)*.34:t<Ea?.5+pe(ii,Ea,t)*.5:1}function Rn(e=.5){return ur(e)}function Cn({speed:e=0,acceleration:t=0,pathDistance:i=0,depth:a=.5,verticalSpeed:r=0,sampleGain:o=1}={}){let n=Dt({speed:e,acceleration:t,pathDistance:i});if(n<.012)return 0;let s=Rn(a),c=1+ve(r/1.4,-1,1)*.05,l=.2+Math.pow(n,.72)*.8;return ve(l*s*c*o*kn,0,.95)}function Dn({speed:e=0,acceleration:t=0,pathDistance:i=0}={}){return i>=cr&&e>=lr&&Dt({speed:e,acceleration:t,pathDistance:i})>=En}var Pn=class{constructor(e=0){this.pathDistance=Math.max(0,e),this.triggered=!1}update({movement:e=0,speed:t=0,acceleration:i=0}={}){return this.pathDistance+=Math.max(0,e),this.triggered||!Dn({speed:t,acceleration:i,pathDistance:this.pathDistance})?!1:(this.triggered=!0,!0)}};function Fn(e,{direction:t=1,dayMinutes:i=1440,stepMinutes:a=1}={}){let r=Math.max(1,Math.round(i)),o=(Math.round(e)%r+r)%r,n=t<0?-1:1,s=Math.max(1,Math.round(a));return(Math.round(o+n*s)%r+r)%r}function Ln(e=!1,{normalIntervalMs:t=160,speedMultiplier:i=20}={}){let a=Math.max(16,Math.round(t));return e?Math.max(8,Math.round(a/Math.max(1,i))):a}function In(e,t,{direction:i=1,dayMinutes:a=1440,tickMinutes:r=60}={}){if(!Number.isFinite(e)||!Number.isFinite(t))return 0;let o=Math.max(1,Math.round(a)),n=Math.max(1,r),s=(e%o+o)%o,c=(t%o+o)%o;return i<0?(c>=s&&(c-=o),Math.max(0,Math.ceil(s/n)-Math.ceil(c/n))):(c<=s&&(c+=o),Math.max(0,Math.floor(c/n)-Math.floor(s/n)))}function zn(e,t,{visibleRadiusTicks:i=12,gapDistortion:a=1}={}){let r=Math.max(1,i),o=(e-t)/r,n=o>=-1&&o<1,s=ve(o,-1,1)*Math.PI*.5,c=Math.sin(s),l=ve(a,0,1),u=o+(c-o)*l;return{visible:n,position:.5+u*.5,bulge:Math.max(0,Math.cos(s))}}function Bn(e,t,{height:i=570,maximumMinutes:a=1439,dayMinutes:r=1440,tickCount:o=24,visibleRadiusTicks:n=12,invertDirection:s=!1,wrap:c=!1}={}){let l=Math.max(1,i/2),u=(Number.isFinite(t)?t/l:0)*Math.max(1,n),d=c?r/Math.max(1,o):a/Math.max(1,o-1),h=s?1:-1,m=e+u*d*h;if(c){let v=Math.max(1,r);return(m%v+v)%v}return ve(m,0,a)}function Un(e,{deltaMode:t=0,viewportHeight:i=800,dialHeight:a=540,dayMinutes:r=1440,distanceScale:o=.25,responseMultiplier:n=1}={}){if(!Number.isFinite(e))return 0;let s=t===1?16:t===2?Math.max(1,i):1;return e*s*Math.max(1,r)/Math.max(1,a)*Math.max(0,o)*Math.max(0,n)}function _n(e=0){let t=ve(e,0,1);return{holdSeconds:.18+t*.18,fadeSeconds:1.55+t*.45,stopSeconds:5.2+t*1.5,wetTarget:.2+t*.05}}function Nn(e=0){let t=ve(e,0,1);return{delaySeconds:.38+t*.3,timeConstant:.62+t*.24}}var ai=class{constructor(e,t=Math.random){this.length=Math.max(0,Math.floor(e)),this.random=t,this.queue=[],this.last=-1}refill(){this.queue=Array.from({length:this.length},(e,t)=>t);for(let e=this.queue.length-1;e>0;e-=1){let t=Math.floor(this.random()*(e+1));[this.queue[e],this.queue[t]]=[this.queue[t],this.queue[e]]}this.queue.length>1&&this.queue[0]===this.last&&([this.queue[0],this.queue[1]]=[this.queue[1],this.queue[0]])}next(){if(this.length===0)return-1;this.queue.length===0&&this.refill();let e=this.queue.shift();return this.last=e,e}},t6=Math.PI*2,D=(e,t,i)=>Math.min(i,Math.max(t,e)),le=1440,Wn=2,We=e=>(e%le+le)%le,F0=(e,t)=>(t-e+le*1.5)%le-le/2,h0=.5,qn=.16,Ra=.24,dr=2,Xn=650,On=.66*.85,Ca=1.15,hr=e=>e==="touch"?4:2,Gt=/^\/debug(?:\.html)?\/?$/.test(window.location.pathname),Pi=!Gt;document.body&&(document.body.dataset.lakeView=Y()?"vast":"alt");document.documentElement.classList.toggle("is-effect-debug",Gt);document.documentElement.classList.toggle("is-alt-layout",Pi);var at=[{title:"Lost",artist:"Frank Ocean",year:2012,gain:.708,src:"/_media/67755876c535c1072ed9d3453c9e.mp3"},{title:"Paradise",artist:"Sade",year:1988,gain:1.035,src:"/_media/1307e69d8b2a317d2333dd22fd36.mp3"},{title:"Promises",artist:"Cleo Sol",year:2021,gain:1.603,src:"/_media/c32d7b4a3ac95aadc2559bbfaf22.mp3"},{title:"Gotta Serve Somebody",artist:"Bob Dylan",year:1979,gain:1.245,src:"/_media/1f57403f9b31d276b684327afe84.mp3"},{title:"Let Down",artist:"Radiohead",year:1997,gain:.676,src:"/_media/8a59df048190c3a9cb01e9858852.mp3"},{title:"Weird Fishes",artist:"Radiohead",year:2007,gain:1.531,src:"/_media/ea53a9d5a99be7b0fd8b7c7de4f3.mp3"},{title:"There There",artist:"Radiohead",year:2003,gain:.708,src:"/_media/0e1539e88517fb360e4875fc2bb0.mp3"},{title:"Where Are We Going?",artist:"Marvin Gaye",year:1973,gain:1.059,src:"/_media/dd3cbe88218f04b0c3fec47d0261.mp3"},{title:"La Isla Bonita",artist:"Madonna",year:1986,gain:.776,src:"/_media/09e72ccc6b77d35e268e6e035e2f.mp3"},{title:"Trees and Flowers",artist:"Strawberry Switchblade",year:1983,gain:.617,src:"/_media/61fa7626ca63a0a5a3215a50ef8c.mp3"},{title:"A Drawing Of The Sun",artist:"Far Caspian",year:2025,gain:.724,src:"/_media/71f27c10fc50b390c46f7c7fd26d.mp3"},{title:"Enter Laughing",artist:"Electrelane",year:2004,gain:1.496,src:"/_media/9568c42edc0b7d4e2dcc1d525cd8.mp3"},{title:"Sweet Disposition",artist:"The Temper Trap",year:2008,gain:.624,src:"/_media/30f05d0808078cade7b284d80fe8.mp3"},{title:"Space Song",artist:"Beach House",year:2015,gain:.653,src:"/_media/3c49e69401e9a68fa4c17a779b55.mp3"},{title:"All Apologies",artist:"Nirvana",year:1993,gain:1.109,src:"/_media/6b93404a7e3323fd08374d3079a6.mp3"},{title:"1979",artist:"The Smashing Pumpkins",year:1995,gain:1.012,src:"/_media/a70457981c3b72fd32f9fb6c78a6.mp3"},{title:"ILoveUIHateU",artist:"Playboi Carti",year:2020,gain:.832,src:"/_media/4ca52a37ed48702bb7fe2d3a7e79.mp3"},{title:"Time to Pretend",artist:"MGMT",year:2005,gain:.457,src:"/_media/4b08dddce8f0f3beb02b1edf008b.mp3"},{title:"Reflections After Jane",artist:"The Clientele",year:1999,gain:1.799,src:"/_media/2095463886c2c3c15991ef806694.mp3"},{title:"Inner City Blues",artist:"Marvin Gaye",year:1971,gain:1.797,src:"/_media/aee18c2e11749eceea226b1e44c2.mp3"},{title:"Lebanese Blonde",artist:"Thievery Corporation",year:1998,gain:.759,src:"/_media/85d3545b93f7ae560b4481cfee36.mp3"},{title:"One of These Nights",artist:"Eagles",year:1975,gain:.912,src:"/_media/b2c6fdaf6df228b207fb723a912c.mp3"},{title:"This Must Be the Place",artist:"Talking Heads",year:1983,gain:1.195,src:"/_media/03be61b8b67336e5d0370d332937.m4a"},{title:"4 AM, Adam K & Soba Mix",artist:"Kaskade",year:2008,gain:1.256,src:"/_media/e5dc05da9b28a913fdf11441c552.m4a"},{title:"Could You Be Loved",artist:"Bob Marley & The Wailers",year:1980,gain:.887,src:"/_media/b456dbd86d913e09194e02b3b515.m4a"},{title:"I'm Not Alone",artist:"Calvin Harris",year:2009,gain:.655,src:"/_media/a9cc8c82a5996631e49a92131ed1.m4a"},{title:"Slide",artist:"Calvin Harris feat. Frank Ocean & Migos",year:2017,gain:.863,src:"/_media/c6c78cfebd2c6b4e9a25081ed0e9.m4a"},{title:"Electric Feel",artist:"MGMT",year:2007,gain:.655,src:"/_media/87a2aae64abe65cc7c0c7036d686.m4a"},{title:"Keep Looking",artist:"Sade",year:1988,gain:1.883,src:"/_media/5122e86454a11ade818f9fffc6a5.mp3"}],Vn={src:"/_media/7198828891f2b383c766578f437e.mp3",volume:.255},Gn={src:"/_media/090bd0e9eb8d10cb04649812bd3b.flac",gain:.24},Hn={src:"/_media/9559ed7d792b032b39c01e20c6ab.mp3",maximumGain:.288},Da=Object.freeze({depth:16,depthRange:6,horizontalRange:8,periodSeconds:84}),jn=[{period:"morning",src:"/_media/ed50833893831dea2e43b7fca3ff.mp3",maximumGain:.648,rearOrbit:Da},{period:"afternoon",src:"/_media/7b0943e89914c8e55bdc7a6a94bb.mp3",maximumGain:.78,rearOrbit:Da}],Oe=document.querySelector("#water"),Ht=document.querySelector("#fallback-water"),O=document.querySelector(".lake"),Ze=document.querySelector(".interface"),Q=document.querySelector("#cursor-cross"),Yn=document.querySelectorAll(".cursor-text"),Me=document.querySelector("#context-links"),mr=[...Me.querySelectorAll("a, button")],it=document.querySelector("#time-button"),Kn=document.querySelector("#time-label"),pi=document.querySelector("#time-label-value"),Zn=new Map([...pi.querySelectorAll("[data-time-part]")].map(e=>[e.dataset.timePart,e])),_t=document.querySelector("#site-title");Pi&&_t.setAttribute("aria-label","Info about Oscar Dumlao");var vi=document.querySelector("#about-panel"),K=document.querySelector("#time-scrubber"),ae=Object.freeze({width:358,height:378,tickCount:48,visibleTickCount:24,tickWidth:100,widthVariation:.14,bulgePower:.72,activeOvershoot:1.482,gap:.46,edgeFadeStart:.54,edgeOpacity:.035});K.style.setProperty("--dial-width",`${ae.width}px`);K.style.setProperty("--dial-height",`${ae.height}px`);var _=document.querySelector("#time-range"),fr=document.querySelector("#time-ticks"),Fi=document.querySelector("#time-slider-value"),Pa=document.querySelector("#time-slider-numerals"),Fa=document.querySelector("#time-slider-meridiem"),fe=document.querySelector("#time-slider-mode"),Jn=document.querySelector("#time-slider-mode-current"),se=document.querySelector("#track-waveform"),st=document.querySelector("#track-waveform-canvas"),H=document.querySelector("#track-waveform-range"),pr=document.querySelector("#track-waveform-artist"),Qn=document.querySelector(".track-waveform-title"),$n=document.querySelector("#track-waveform-title-text"),e7=document.querySelector("#track-waveform-year"),Li=document.querySelector("#track-playback"),M0=document.querySelector("#track-playback-toggle"),J=document.querySelector("#track-current-title"),ie=J.querySelector(".track-current-title-text"),R0=document.querySelector("#track-previous"),Nt=document.querySelector("#track-next"),gi="Play music",vr=!1,C0=0;function gr(){C0=0,J.classList.toggle("is-overflowing",Yr({contentWidth:ie.scrollWidth,containerWidth:J.clientWidth}))}function g0(){cancelAnimationFrame(C0),C0=requestAnimationFrame(gr)}var La;(La=document.fonts)==null||La.ready.then(g0);var Ii=matchMedia("(prefers-reduced-motion: reduce)").matches,yr=matchMedia("(hover: hover) and (pointer: fine)"),Wt=matchMedia("(min-width: 701px)");for(let e=0;e<ae.tickCount;e+=1)fr.append(document.createElement("span"));var Qe=[...fr.children];_.disabled=!0;function t7(e,t,i,a){let r={depth:0,distance:1/0,cutoff:1200,arrivalGain:0};if(!(e!=null&&e.camera)||!t||!Number.isFinite(i)||!Number.isFinite(a))return r;let o=e.screenToWorld(i,a);if(!o)return r;let n=e.camera.position,s=Math.hypot(o.x-n[0],n[1],o.z-n[2])*.44;if(!Number.isFinite(s)||s<=0)return r;let c=t.position[1]*.44,l=Math.min(1,c/s),u=Math.sqrt(Math.max(0,1-l*l)),d=(-l*t.up[1]+u*t.up[2])/Math.max(1e-6,-l*t.forward[1]+u*t.forward[2]),h=Math.max(0,Math.min(1,(1-d/t.tanHalfFov)*.5)),m=(1-2*.48)*t.tanHalfFov,v=t.forward[1]+t.up[1]*m,f=t.forward[2]+t.up[2]*m,p=c*Math.hypot(v,f)/Math.max(1e-6,-v);return{depth:h,distance:s,cutoff:Math.max(1200,18e3/(1+Math.max(0,s-p)/9)),arrivalGain:Math.min(1,p/s)}}var i7=class{constructor(e,t,i,a,r,o,n,{diagnosticMode:s=!1}={}){this.playlist=e,this.impacts=t,this.drags=i,this.diagnosticMode=s,this.effectSequence=0,this.index=0,this.impactRandom=new ai(t.length),this.rippleArrivalPending=!1,this.rippleArrivalCooldownUntil=-1/0,this.gestureDragIndices=i.flatMap((c,l)=>c.useForDrag&&c.gestureClass==="gentle"?[l]:[]),this.gestureDragRandom=new ai(this.gestureDragIndices.length),this.rippleArrivalRandom=new ai(this.gestureDragIndices.length),this.audio=new Audio,this.audio.preload="none",this.audio.autoplay=!1,this.audio.playsInline=!0,this.audio.setAttribute("playsinline",""),this.audio.setAttribute("webkit-playsinline",""),this.audio.volume=.33*Ca,this.playbackState="paused",this.playRequestId=0,this.activationInProgress=!1,this.musicFadeFrame=0,this.musicPauseTimer=0,this.seekTransitionShouldRestore=!1,this.hasPlayedCurrentSource=!1,this.pendingSeekProgress=null,this.mediaTargetVolume=.33*Ca,this.ambienceFadeFrame=0,this.ambienceBaseVolume=a.volume,this.ambienceTargetVolume=a.volume,this.ambienceOutputLevel=a.volume,this.ambienceGainNode=null,this.ambience=new Audio,this.ambienceSource=a.src,this.bufferedAmbience=new e0(this,"/_p/staging-water-loop.mp3"),this.ambience.loop=!0,this.ambience.preload="none",this.ambience.playsInline=!0,this.ambience.setAttribute("playsinline",""),this.ambience.setAttribute("webkit-playsinline",""),this.ambience.volume=a.volume,this.crickets=new Audio,this.cricketSource=o.src,this.cricketMaximumGain=o.maximumGain,this.cricketOutputLevel=0,this.cricketGainNode=null,this.cricketPlayPending=!1,this.cricketPauseTimer=0,this.crickets.loop=!0,this.crickets.preload="none",this.crickets.playsInline=!0,this.crickets.setAttribute("playsinline",""),this.crickets.setAttribute("webkit-playsinline",""),this.crickets.volume=0,this.dayparts=n.map(c=>{let l=new Audio;return l.loop=!0,l.preload="none",l.playsInline=!0,l.setAttribute("playsinline",""),l.setAttribute("webkit-playsinline",""),l.volume=0,l.addEventListener("error",()=>{}),{...c,media:l,outputLevel:0,gainNode:null,sourceNode:null,playPending:!1,pauseTimer:0}}),this.context=null,this.musicNodes=null,this.spatial={x:70,y:4,echo:17,strength:100,volume:82.225,bass:100},this.currentSource="",this.impactBufferPromises=[],this.dragBufferPromises=[],this.activeDragVoices=new Map,this.dragGestures=new Set,this.dragTargets=new Map,this.timeTick=r,this.timeTickBufferPromise=null,this.audio.addEventListener("error",()=>{}),this.ambience.addEventListener("error",()=>{}),this.crickets.addEventListener("error",()=>{})}createImpulse(e,t=3.8,i=3.4){let a=e.sampleRate,r=Math.floor(a*t),o=e.createBuffer(2,r,a);for(let n=0;n<2;n+=1){let s=o.getChannelData(n),c=(2654435769^n*2246822507^r)>>>0,l=1,u=Math.exp(-i/Math.max(r,1));for(let d=0;d<r;d+=1){c^=c<<13,c^=c>>>17,c^=c<<5;let h=(c>>>0)/4294967295*2-1,m=d<a*.08&&d%149===0?l*(n?-.12:.12):0;s[d]=h*l*.72+m,l*=u}}return o}createRearOrbit(e,{depth:t=18,depthRange:i=7,horizontalRange:a=9,periodSeconds:r=72}={}){if(typeof e.createPanner!="function")return null;let o=e.createPanner(),n=Math.max(2,t),s=D(i,0,n-1);if(o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=8,o.maxDistance=60,o.rolloffFactor=.32,o.coneInnerAngle=360,o.coneOuterAngle=360,o.coneOuterGain=1,!o.positionX||!o.positionZ)return o.setPosition(0,1.2,n),{panner:o};o.positionX.value=0,o.positionY.value=1.2,o.positionZ.value=n;let c=e.createOscillator(),l=e.createOscillator(),u=e.createGain(),d=e.createGain(),h=1/Math.max(30,r);c.frequency.value=h,l.frequency.value=h,l.setPeriodicWave(e.createPeriodicWave(new Float32Array([0,-1]),new Float32Array([0,0]))),u.gain.value=a,d.gain.value=s,c.connect(u).connect(o.positionX),l.connect(d).connect(o.positionZ);let m=e.currentTime;return c.start(m),l.start(m),{panner:o,horizontalOscillator:c,depthOscillator:l}}loadBuffer(e){if(!this.context)return Promise.resolve(null);let t=this.context;return fetch(e,{cache:"force-cache"}).then(i=>{if(!i.ok)throw new Error(`Unable to load ${e}`);return i.arrayBuffer()}).then(i=>t.decodeAudioData(i)).catch(()=>null)}loadImpactBuffer(e){return this.impactBufferPromises[e]??=this.loadBuffer(this.impacts[e].src)}loadDragBuffer(e){return this.dragBufferPromises[e]??=this.loadBuffer(this.drags[e].src)}loadTimeTickBuffer(){return this.context?(this.timeTickBufferPromise||(this.timeTickBufferPromise=this.loadBuffer(this.timeTick.src)),this.timeTickBufferPromise):Promise.resolve(null)}setupGraph(){var e,t,i,a,r,o,n,s;if(this.context)return;let c=window.AudioContext||window.webkitAudioContext;if(!c)return;let l;try{l=new c({latencyHint:"playback"})}catch{l=new c}const localOutput=l.createGain();localOutput.connect(l.destination);this.localOutput=localOutput;let u=l.createMediaElementSource(this.audio),d=this.ambienceOutputLevel,h=l.createMediaElementSource(this.ambience),m=l.createGain(),v=l.createMediaElementSource(this.crickets),f=l.createGain(),p=l.createBiquadFilter(),y=l.createBiquadFilter(),g=this.createRearOrbit(l),x=(g==null?void 0:g.panner)??null,w=l.createGain(),k=l.createGain(),F=this.dayparts.map(E=>{let De=E.rearOrbit?this.createRearOrbit(l,E.rearOrbit):null;return{layer:E,source:l.createMediaElementSource(E.media),mono:De!=null&&De.panner?l.createGain():null,orbit:De,output:l.createGain()}}),I=[{delay:l.createDelay(.16),panner:(e=l.createStereoPanner)==null?void 0:e.call(l),gain:l.createGain(),delayTime:.052,pan:-.46,level:.09},{delay:l.createDelay(.16),panner:(t=l.createStereoPanner)==null?void 0:t.call(l),gain:l.createGain(),delayTime:.079,pan:.38,level:.065}];this.audio.volume=1,this.ambience.volume=1,this.crickets.volume=1,this.dayparts.forEach(E=>{E.media.volume=1});let U=l.createBiquadFilter(),M=l.createBiquadFilter(),L=l.createBiquadFilter(),z=l.createBiquadFilter(),N=l.createBiquadFilter(),$=l.createGain(),ue=l.createGain(),ee=l.createGain(),Le=l.createGain(),W=typeof l.createPanner=="function"?l.createPanner():null,de=W?null:(i=l.createStereoPanner)==null?void 0:i.call(l),Ae=l.createGain(),he=l.createGain(),Ie=l.createGain(),ze=l.createDynamicsCompressor(),gt=[{delay:l.createDelay(.18),filter:l.createBiquadFilter(),panner:(a=l.createStereoPanner)==null?void 0:a.call(l),gain:l.createGain(),side:-.78,baseDelay:.018,depthDelay:.027,level:.06},{delay:l.createDelay(.18),filter:l.createBiquadFilter(),panner:(r=l.createStereoPanner)==null?void 0:r.call(l),gain:l.createGain(),side:.72,baseDelay:.026,depthDelay:.041,level:.045},{delay:l.createDelay(.18),filter:l.createBiquadFilter(),panner:(o=l.createStereoPanner)==null?void 0:o.call(l),gain:l.createGain(),side:-.18,baseDelay:.039,depthDelay:.057,level:.028}],yt=l.createDelay(.18),Gi=l.createConvolver(),xt=l.createBiquadFilter(),U0=l.createGain(),Jt=l.createOscillator(),je=l.createOscillator(),bt=l.createGain(),Qt=l.createGain(),_0=l.createGain(),N0=l.createGain(),W0=l.createGain(),Ye=l.createDynamicsCompressor();m.gain.value=d,p.type="highpass",p.frequency.value=680,p.Q.value=.18,y.type="lowpass",y.frequency.value=6400,y.Q.value=.24,w.gain.value=.78,k.gain.value=this.cricketOutputLevel;try{f.channelCount=1,f.channelCountMode="explicit",f.channelInterpretation="speakers"}catch{}for(let E of I)E.delay.delayTime.value=E.delayTime,E.gain.gain.value=E.level,E.panner&&(E.panner.pan.value=E.pan);U.type="highpass",U.frequency.value=20,U.Q.value=.18,M.type="lowpass",M.Q.value=.2,L.type="highshelf",L.frequency.value=2600,z.type="peaking",z.frequency.value=1800,z.Q.value=.72,N.type="lowshelf",N.frequency.value=165,N.gain.value=0,$.gain.value=1,ue.gain.value=((n=this.playlist[this.index])==null?void 0:n.gain)??1,Ie.gain.value=1,ze.threshold.value=-2,ze.knee.value=0,ze.ratio.value=20,ze.attack.value=.003,ze.release.value=.12,xt.type="lowpass",xt.frequency.value=5600,xt.Q.value=.2,Jt.type="sine",Jt.frequency.value=.0107,je.type="sine",je.frequency.value=.0063,bt.gain.value=0,Qt.gain.value=0,_0.gain.value=0,N0.gain.value=0,W0.gain.value=0;try{ee.channelCount=1,ee.channelCountMode="explicit",ee.channelInterpretation="speakers"}catch{}W&&(W.panningModel="HRTF",W.distanceModel="linear",W.refDistance=1.25,W.maxDistance=34,W.rolloffFactor=.68,W.coneInnerAngle=360,W.coneOuterAngle=360,W.coneOuterGain=1),gt.forEach(E=>{var De;E.filter.type="lowpass",E.filter.Q.value=.16,(De=E.panner)==null||De.pan.setValueAtTime(E.side,l.currentTime)});let Hi=u.connect(U).connect(N).connect($).connect(ue);Hi.connect(M).connect(L).connect(z).connect(ee),Hi.connect(Le).connect(he),W?ee.connect(W).connect(Ae).connect(he):de?ee.connect(de).connect(Ae).connect(he):ee.connect(Ae).connect(he),Jt.connect(bt),je.connect(Qt),je.connect(_0).connect(Ae.gain),je.connect(N0).connect(M.frequency),je.connect(W0).connect(U0.gain),W!=null&&W.positionX&&W!=null&&W.positionZ?(bt.connect(W.positionX),Qt.connect(W.positionZ)):de&&bt.connect(de.pan);for(let E of gt)ee.connect(E.delay).connect(E.filter),E.panner?E.filter.connect(E.panner).connect(E.gain).connect(he):E.filter.connect(E.gain).connect(he);ee.connect(yt).connect(Gi).connect(xt).connect(U0).connect(he),he.connect(Ie).connect(ze).connect(localOutput),Ye.threshold.value=-8,Ye.knee.value=14,Ye.ratio.value=2.5,Ye.attack.value=.012,Ye.release.value=.28,Ye.connect(localOutput),h.connect(m).connect(localOutput);let q0=v.connect(f).connect(p).connect(y);x?q0.connect(x).connect(w).connect(k):q0.connect(w).connect(k);for(let E of I){let De=q0.connect(E.delay);E.panner?De.connect(E.panner).connect(E.gain).connect(k):De.connect(E.gain).connect(k)}k.connect(localOutput);for(let E of F){if(E.output.gain.value=E.layer.outputLevel,E.mono&&(s=E.orbit)!=null&&s.panner){try{E.mono.channelCount=1,E.mono.channelCountMode="explicit",E.mono.channelInterpretation="speakers"}catch{}E.source.connect(E.mono).connect(E.orbit.panner).connect(E.output).connect(localOutput)}else E.source.connect(E.output).connect(localOutput);E.layer.sourceNode=E.source,E.layer.gainNode=E.output,E.layer.orbit=E.orbit}this.context=l,this.ambienceGainNode=m,this.cricketGainNode=k,this.cricketNodes={orbit:g,panner:x,highpass:p,lowpass:y,direct:w,reflections:I},this.musicNodes={highpass:U,lowpass:M,highShelf:L,presence:z,bassShelf:N,bassCompensation:$,normalization:ue,original:Le,panner:W,stereoFallback:de,dry:Ae,master:he,fade:Ie,reflections:gt,diffuseDelay:yt,space:Gi,spaceFilter:xt,wet:U0,drift:{horizontalGain:bt,depthGain:Qt,directGain:_0,toneGain:N0,wetGain:W0}},this.master=Ye,this.applySpatialSettings({immediate:!0}),Jt.start(),je.start()}ensureMusicSpace(){var e;!this.context||!((e=this.musicNodes)!=null&&e.space)||this.musicNodes.space.buffer||(this.musicNodes.space.buffer=this.createImpulse(this.context,.31,10.8))}applySpatialSettings({immediate:e=!1}={}){var t,i,a;if(!this.musicNodes)return;let{x:r,y:o,echo:n,strength:s,volume:c,bass:l}=this.spatial,u=D((100-o)/100,0,1),d=D(s/100,0,1),h=d*d*(3-2*d),m=u*(.34+h*.96),v=1.25+Math.pow(m,1.04)*(11+h*26),f=(r/50-1)*(5.2+h*11.8),p=this.context.currentTime,y=.075,g=(M,L)=>{M.cancelScheduledValues(p),e?M.setValueAtTime(L,p):M.setTargetAtTime(L,p,y)};g(this.musicNodes.highpass.frequency,20),g(this.musicNodes.lowpass.frequency,Math.max(1450,19e3-m*6800)),g(this.musicNodes.highShelf.gain,-m*2.15),g(this.musicNodes.presence.gain,-m*.72),g(this.musicNodes.spaceFilter.frequency,5600);let x=D(l/100,0,1),w=Math.pow(x,1.25)*12;g(this.musicNodes.bassShelf.gain,w),g(this.musicNodes.bassCompensation.gain,Math.pow(10,-w*.5/20)),(t=this.musicNodes.panner)!=null&&t.positionX?(g(this.musicNodes.panner.positionX,f),g(this.musicNodes.panner.positionY,0),g(this.musicNodes.panner.positionZ,-v)):(i=this.musicNodes.panner)!=null&&i.setPosition?this.musicNodes.panner.setPosition(f,0,-v):this.musicNodes.stereoFallback&&g(this.musicNodes.stereoFallback.pan,D((r/50-1)*(.2+m*.78),-1,1)),g(this.musicNodes.master.gain,c/100),g(this.musicNodes.original.gain,Math.cos(h*Math.PI*.5)),g(this.musicNodes.dry.gain,Math.sin(h*Math.PI*.5)*(.86-m*.34));let k=D(n/20,0,1),F=.28+k*.72;for(let M of this.musicNodes.reflections)if(g(M.delay.delayTime,M.baseDelay+M.depthDelay*m*(.58+h*.72)),g(M.filter.frequency,10800-m*3300),g(M.gain.gain,M.level*F*h*(.62+m*1.18)*(.62+h*.82)),M.panner){let L=D((r/50-1)*.32,-.32,.32);g(M.panner.pan,D(M.side+L,-1,1))}g(this.musicNodes.diffuseDelay.delayTime,.038+m*(.024+h*.052)),g(this.musicNodes.wet.gain,h*(.003+k*.032)*(.58+m*.92)*(.72+h*.7));let I=this.musicNodes.drift,U=!!((a=this.musicNodes.panner)!=null&&a.positionX);g(I.horizontalGain.gain,h*(U?1.15:.022)),g(I.depthGain.gain,U?h*1.85:0),g(I.directGain.gain,h*.012),g(I.toneGain.gain,h*175),g(I.wetGain.gain,h*-.0045)}setPlaybackState(e){this.playbackState!==e&&(this.playbackState=e,this.audio.dispatchEvent(new CustomEvent("lakeplaybackstatechange",{detail:{state:e}})))}fadeMediaElement(e,t,i,a){cancelAnimationFrame(this[a]);let r=performance.now();e.volume=0;let o=n=>{let s=D((n-r)/(i*1e3),0,1),c=s*s*(3-2*s);e.volume=t*c,s<1?this[a]=requestAnimationFrame(o):this[a]=0};this[a]=requestAnimationFrame(o)}beginFadeIn(e=h0,t=this.mediaTargetVolume){var i;if(clearTimeout(this.musicPauseTimer),this.musicPauseTimer=0,this.context&&(i=this.musicNodes)!=null&&i.fade){let a=this.context.currentTime,r=this.musicNodes.fade.gain;r.cancelScheduledValues(a),r.setValueAtTime(0,a),r.linearRampToValueAtTime(1,a+e)}else this.fadeMediaElement(this.audio,t,e,"musicFadeFrame")}setMusicOutputLevel(e){var t;let i=D(e,0,1);if(cancelAnimationFrame(this.musicFadeFrame),this.musicFadeFrame=0,this.context&&(t=this.musicNodes)!=null&&t.fade){let a=this.context.currentTime,r=this.musicNodes.fade.gain;r.cancelScheduledValues(a),r.setValueAtTime(i,a)}else this.audio.volume=this.mediaTargetVolume*i}fadeMusicOutputTo(e,t){var i;let a=D(e,0,1),r=Math.max(0,t);if(cancelAnimationFrame(this.musicFadeFrame),this.musicFadeFrame=0,this.context&&(i=this.musicNodes)!=null&&i.fade){let l=this.context.currentTime,u=this.musicNodes.fade.gain;if(typeof u.cancelAndHoldAtTime=="function")u.cancelAndHoldAtTime(l);else{let d=D(u.value,0,1);u.cancelScheduledValues(l),u.setValueAtTime(d,l)}u.linearRampToValueAtTime(a,l+r);return}let o=performance.now(),n=this.audio.volume,s=this.mediaTargetVolume*a;if(r===0){this.audio.volume=s;return}let c=l=>{let u=D((l-o)/(r*1e3),0,1),d=u*u*(3-2*u);this.audio.volume=n+(s-n)*d,u<1?this.musicFadeFrame=requestAnimationFrame(c):this.musicFadeFrame=0};this.musicFadeFrame=requestAnimationFrame(c)}beginSeekTransition(){this.seekTransitionShouldRestore=(this.playbackState==="playing"||this.playbackState==="pending")&&!this.audio.paused,this.seekTransitionShouldRestore&&this.fadeMusicOutputTo(0,qn)}finishSeekTransition(e){let t=this.seekTransitionShouldRestore;this.seekTransitionShouldRestore=!1,t&&this.setMusicOutputLevel(0);let i=this.seekToProgress(e);return t&&this.fadeMusicOutputTo(1,Ra),i}cancelSeekTransition(){let e=this.seekTransitionShouldRestore;this.seekTransitionShouldRestore=!1,e&&this.fadeMusicOutputTo(1,Ra)}fadeMediaElementOut(e,t){cancelAnimationFrame(this.musicFadeFrame);let i=performance.now(),a=this.audio.volume,r=o=>{let n=D((o-i)/(e*1e3),0,1),s=n*n*(3-2*n);this.audio.volume=a*(1-s),n<1?this.musicFadeFrame=requestAnimationFrame(r):(this.musicFadeFrame=0,t())};this.musicFadeFrame=requestAnimationFrame(r)}setAmbienceOutputLevel(e){let t=D(e,0,1);if(this.ambienceOutputLevel=t,this.context&&this.ambienceGainNode){let i=this.context.currentTime,a=this.ambienceGainNode.gain;a.cancelScheduledValues(i),a.setValueAtTime(t,i),this.ambience.volume=1}else this.ambience.volume=t}setCricketTime(e){let t=this.cricketMaximumGain*Tn(e);if(this.cricketOutputLevel=t,this.context&&this.cricketGainNode){let i=this.context.currentTime,a=this.cricketGainNode.gain;if(typeof a.cancelAndHoldAtTime=="function")a.cancelAndHoldAtTime(i);else{let r=a.value;a.cancelScheduledValues(i),a.setValueAtTime(r,i)}t<=5e-4?a.setValueAtTime(0,i):a.setTargetAtTime(t,i,.32),this.crickets.volume=1}else this.crickets.volume=t*.7;if(clearTimeout(this.cricketPauseTimer),this.cricketPauseTimer=0,t>5e-4){this.context&&this.startCrickets();return}this.crickets.paused||(this.cricketPauseTimer=window.setTimeout(()=>{this.cricketPauseTimer=0,this.cricketOutputLevel<=5e-4&&this.crickets.pause()},2200))}startCrickets(){this.diagnosticMode||this.cricketOutputLevel<=5e-4||this.cricketPlayPending||(clearTimeout(this.cricketPauseTimer),this.cricketPauseTimer=0,this.crickets.getAttribute("src")||(this.crickets.src=this.cricketSource),this.crickets.paused&&(this.cricketPlayPending=!0,this.crickets.play().catch(()=>{}).finally(()=>{this.cricketPlayPending=!1})))}setDaypartTime(e){let t=Sn(e);for(let i of this.dayparts){let a=i.maximumGain*t[i.period];if(i.outputLevel=a,this.context&&i.gainNode){let r=this.context.currentTime,o=i.gainNode.gain;if(typeof o.cancelAndHoldAtTime=="function")o.cancelAndHoldAtTime(r);else{let n=o.value;o.cancelScheduledValues(r),o.setValueAtTime(n,r)}a<=5e-4?o.setValueAtTime(0,r):o.setTargetAtTime(a,r,.42),i.media.volume=1}else i.media.volume=a*.7;clearTimeout(i.pauseTimer),i.pauseTimer=0,a>5e-4?this.context&&this.startDaypart(i):i.media.paused||(i.pauseTimer=window.setTimeout(()=>{i.pauseTimer=0,i.outputLevel<=5e-4&&i.media.pause()},2200))}}startDaypart(e){this.diagnosticMode||e.outputLevel<=5e-4||e.playPending||(clearTimeout(e.pauseTimer),e.pauseTimer=0,e.media.getAttribute("src")||(e.media.src=e.src),e.media.paused&&(e.playPending=!0,e.media.play().catch(()=>{}).finally(()=>{e.playPending=!1})))}startDayparts(){this.dayparts.forEach(e=>this.startDaypart(e))}startHabitat(){this.diagnosticMode||(this.startCrickets(),this.startDayparts())}fadeAmbience(e=5){cancelAnimationFrame(this.ambienceFadeFrame);let t=performance.now();this.setAmbienceOutputLevel(0);let i=a=>{let r=D((a-t)/(e*1e3),0,1),o=r*r*(3-2*r);this.setAmbienceOutputLevel(this.ambienceTargetVolume*o),r<1?this.ambienceFadeFrame=requestAnimationFrame(i):this.ambienceFadeFrame=0};this.ambienceFadeFrame=requestAnimationFrame(i)}startAmbience({fadeIn:e=!1,durationSeconds:t=5}={}){if(!this.diagnosticMode&&this.bufferedAmbience.activate()){this.startHabitat();return}var i;this.diagnosticMode||(this.setupGraph(),(i=this.context)==null||i.resume().catch(()=>{}),this.startHabitat(),this.ambience.getAttribute("src")||(this.ambience.src=this.ambienceSource),this.ambience.paused&&(e?this.setAmbienceOutputLevel(0):this.setAmbienceOutputLevel(this.ambienceTargetVolume),this.ambience.play().then(()=>{e&&this.fadeAmbience(t)}).catch(()=>{})))}setAmbienceWaveEnergy(e){this.ambienceTargetVolume=this.ambienceBaseVolume*wn(e),(!this.ambienceFadeFrame||this.ambience.paused)&&this.setAmbienceOutputLevel(this.ambienceTargetVolume)}unlock({fadeIn:e=!1,startMusic:t=!1,startLakeAmbience:i=!t}={}){var a,r;if(this.diagnosticMode){this.setupGraph(),(a=this.context)==null||a.resume().catch(()=>{});return}let o=t&&(this.audio.paused||!!this.musicPauseTimer);if(!(e&&o&&this.activationInProgress)&&(e&&o&&(this.activationInProgress=!0),this.setupGraph(),(r=this.context)==null||r.resume().catch(()=>{}),this.startHabitat(),!t&&i&&this.startAmbience(),o)){if(this.hasPlayedCurrentSource){this.resumeTrack({fadeIn:e});return}this.play(this.index,{startAmbience:!1,fadeIn:e})}}prepareTrack(e=this.index){if(this.diagnosticMode)return this.playlist[e];this.index=e;let t=this.playlist[e];return this.currentSource!==t.src&&(this.audio.preload="auto",this.audio.src=t.src,this.currentSource=t.src,this.hasPlayedCurrentSource=!1,this.pendingSeekProgress=null,this.audio.load()),t}seekToProgress(e){if(!Number.isFinite(e))return!1;let t=D(e,0,1),i=this.seekDuration();if(this.pendingSeekProgress=t,this.audio.preload="auto",this.audio.readyState===0||!Number.isFinite(i)||i<=0)return!1;try{this.audio.currentTime=Math.min(t*i,Math.max(0,i-.05))}catch{return!1}return this.pendingSeekProgress=null,!0}seekDuration(){var e,t;return Number.isFinite(this.audio.duration)&&this.audio.duration>0?this.audio.duration:((t=sr[(e=this.playlist[this.index])==null?void 0:e.src])==null?void 0:t.duration)??Number.NaN}applyPendingSeek(){return this.pendingSeekProgress===null?!1:this.seekToProgress(this.pendingSeekProgress)}async waitForAudioGraph(e,t=1600){return!this.context||this.context.state==="running"?!0:(await Promise.race([e??Promise.resolve(),new Promise(i=>window.setTimeout(i,t))]).catch(()=>{}),this.context.state==="running")}resumeTrack({fadeIn:e=!0}={}){var t;if(this.diagnosticMode)return;clearTimeout(this.musicPauseTimer),this.musicPauseTimer=0,this.setupGraph(),this.ensureMusicSpace();let i=(t=this.context)==null?void 0:t.resume().catch(()=>{}),a=++this.playRequestId;e?this.setMusicOutputLevel(0):this.setMusicOutputLevel(1),this.setPlaybackState("pending"),this.audio.preload="auto";let r=this.audio.play();r&&r.then(async()=>{let o=await this.waitForAudioGraph(i);if(a===this.playRequestId){if(!o){this.audio.pause(),this.activationInProgress=!1,this.setMusicOutputLevel(0),this.setPlaybackState("blocked");return}this.activationInProgress=!1,e&&this.beginFadeIn(h0),this.setPlaybackState("playing")}}).catch(()=>{a===this.playRequestId&&(this.activationInProgress=!1,this.setMusicOutputLevel(0),this.setPlaybackState("blocked"))})}play(e=this.index,{startAmbience:t=!1,fadeIn:i=!1}={}){var a,r;if(this.diagnosticMode)return;clearTimeout(this.musicPauseTimer),this.musicPauseTimer=0,t&&this.startAmbience();let o=this.prepareTrack(e);this.setupGraph(),this.ensureMusicSpace();let n=(a=this.context)==null?void 0:a.resume().catch(()=>{});if(this.mediaTargetVolume=D(.33*(o.gain??1),0,1),(r=this.musicNodes)!=null&&r.normalization&&this.context){let l=this.context.currentTime;this.musicNodes.normalization.gain.cancelScheduledValues(l),this.musicNodes.normalization.gain.setValueAtTime(o.gain??1,l)}else this.audio.volume=this.mediaTargetVolume;i?this.beginFadeIn(h0):this.setMusicOutputLevel(1);let s=++this.playRequestId;this.setPlaybackState("pending"),this.audio.preload="auto";let c=this.audio.play();c&&c.then(async()=>{let l=await this.waitForAudioGraph(n,1600);if(s===this.playRequestId){if(!l){this.audio.pause(),this.activationInProgress=!1,this.setPlaybackState("blocked");return}this.activationInProgress=!1,this.hasPlayedCurrentSource=!0,this.startHabitat(),this.setPlaybackState("playing")}}).catch(()=>{s===this.playRequestId&&this.audio.paused&&(this.activationInProgress=!1,this.setMusicOutputLevel(0),this.setPlaybackState("blocked"))})}pauseTrack({durationSeconds:e=h0}={}){var t;if(clearTimeout(this.musicPauseTimer),this.musicPauseTimer=0,this.playRequestId+=1,this.activationInProgress=!1,this.setPlaybackState("paused"),this.audio.paused||e<=0){this.audio.pause(),this.setMusicOutputLevel(0);return}let i=this.playRequestId,a=()=>{i===this.playRequestId&&(clearTimeout(this.musicPauseTimer),this.musicPauseTimer=0,this.audio.pause(),this.setMusicOutputLevel(0))};if(this.context&&(t=this.musicNodes)!=null&&t.fade){let r=this.context.currentTime,o=this.musicNodes.fade.gain;if(typeof o.cancelAndHoldAtTime=="function")o.cancelAndHoldAtTime(r);else{let n=D(o.value,0,1);o.cancelScheduledValues(r),o.setValueAtTime(n,r)}o.linearRampToValueAtTime(0,r+e),this.musicPauseTimer=window.setTimeout(a,e*1e3)}else this.musicPauseTimer=window.setTimeout(a,e*1e3),this.fadeMediaElementOut(e,a)}emitEffectStart(e,{action:t,category:i,context:a,startedAt:r,offsetSeconds:o=0,durationSeconds:n,playbackRate:s=1,gain:c=1}){if(!this.diagnosticMode)return null;let l=`${e.file}-${++this.effectSequence}`,u=Math.max(0,(r-a.currentTime)*1e3);return document.dispatchEvent(new CustomEvent("lake-effect",{detail:{phase:"start",id:l,action:t,category:i,file:e.file,originalFile:e.originalFile,name:e.name,startedAtMs:performance.now()+u,offsetSeconds:o,durationSeconds:n,playbackRate:s,gain:c}})),l}emitEffectEnd(e){!this.diagnosticMode||!e||document.dispatchEvent(new CustomEvent("lake-effect",{detail:{phase:"end",id:e,endedAtMs:performance.now()}}))}waterSoundAt(e,t){return Y()?(this.waterSoundReference??=hi.prototype.createCamera(),t7(typeof S>"u"?null:S,this.waterSoundReference,e,t)):{depth:D(t/Math.max(window.innerHeight,1),0,1),distance:0,cutoff:2e4,arrivalGain:1}}connectWaterSound(e,t,i){if(e.connect(t),!Y())return t.connect(this.localOutput??this.context.destination),null;let a=this.context.createBiquadFilter();return a.type="lowpass",a.Q.value=.3,a.frequency.value=i.cutoff,t.connect(a).connect(this.localOutput??this.context.destination),a}playImpact(e,t){let i=this.impactRandom.next();if(i<0)return;let a=this.impacts[i];this.setupGraph();let r=this.context;if(!r)return;r.resume().catch(()=>{});let o=this.waterSoundAt(e,t),n=o.depth,s=ur(n);s<=0||this.loadImpactBuffer(i).then(c=>{if(!c)return;let l=r.createBufferSource(),u=r.createGain(),d=r.currentTime,h=On*a.gain*s;l.buffer=c,l.playbackRate.value=1,u.gain.setValueAtTime(h,d);let m=this.connectWaterSound(l,u,o),v=this.emitEffectStart(a,{action:"Click",category:"click",context:r,startedAt:d,durationSeconds:c.duration,gain:h});l.onended=()=>{this.emitEffectEnd(v),l.disconnect(),u.disconnect(),m==null||m.disconnect()},l.start(d)})}playApproachingRipple(e,t,{category:i="Ripple arrival",waveStrength:a=1,excludeDragIndex:r=-1}={}){this.setupGraph();let o=this.context;if(!o)return;o.resume().catch(()=>{});let n=performance.now();if(this.rippleArrivalPending||n<this.rippleArrivalCooldownUntil)return;let s=this.nextRippleArrivalIndex(r);if(s<0)return;let c=this.drags[s],l=this.waterSoundAt(e,t);l.arrivalGain<=0||(this.rippleArrivalPending=!0,this.loadDragBuffer(s).then(u=>{if(this.rippleArrivalPending=!1,!u)return;this.rippleArrivalCooldownUntil=performance.now()+u.duration*1e3+Xn;let d=o.createBufferSource(),h=o.createGain(),m=o.currentTime+.005,v=.18*c.gain*D(a,.5,2.5)*l.arrivalGain;d.buffer=u,d.playbackRate.value=1,h.gain.setValueAtTime(Math.max(v,1e-4),m);let f=this.connectWaterSound(d,h,l),p=this.emitEffectStart(c,{action:i,category:"ripple",context:o,startedAt:m,offsetSeconds:0,durationSeconds:u.duration,gain:v});d.onended=()=>{this.emitEffectEnd(p),d.disconnect(),h.disconnect(),f==null||f.disconnect()},d.start(m,0)}))}prepareRippleArrival(){if(this.gestureDragIndices.length){this.setupGraph();for(let e of this.gestureDragIndices)this.loadDragBuffer(e)}}nextRippleArrivalIndex(e=-1){for(let t=0;t<this.gestureDragIndices.length;t+=1){let i=this.rippleArrivalRandom.next(),a=this.gestureDragIndices[i]??-1;if(a>=0&&a!==e)return a}return-1}nextDragIndex(){return this.gestureDragIndices.length?this.gestureDragIndices[this.gestureDragRandom.next()]??-1:-1}releaseDragVoice(e,t){if(!t||t.ending||!this.context)return;t.ending=!0;let i=this.context.currentTime,a=_n(t.lastEnergy),r=Math.max(1e-4,t.lastGain??1e-4);typeof t.gain.gain.cancelAndHoldAtTime=="function"?t.gain.gain.cancelAndHoldAtTime(i):(t.gain.gain.cancelScheduledValues(i),t.gain.gain.setValueAtTime(r,i)),t.gain.gain.setTargetAtTime(1e-4,i+a.holdSeconds,a.fadeSeconds/4)}startDragVoice(e,t){if(t.voicePending||t.currentVoice)return;let i=this.nextDragIndex();if(i<0)return;let a=this.drags[i];t.dragIndex=i,this.setupGraph();let r=this.context;r&&(t.voicePending=!0,r.resume().catch(()=>{}),this.loadDragBuffer(i).then(o=>{if(!this.dragGestures.has(e)||t.currentVoice){t.voicePending=!1;return}if(!o||!this.dragGestures.has(e)){t.voicePending=!1;return}let n=r.createBufferSource(),s=r.createGain(),c=r.currentTime;n.buffer=o,n.loop=!1,n.playbackRate.value=1,s.gain.setValueAtTime(1e-4,c);let l=this.connectWaterSound(n,s,this.waterSoundAt(t.clientX,t.clientY)),u={source:n,gain:s,tone:l,drag:a,lastEnergy:0,lastGain:1e-4,audible:!1,ending:!1},d=this.emitEffectStart(a,{action:"Drag",category:"drag",context:r,startedAt:c,offsetSeconds:0,durationSeconds:o.duration,playbackRate:1,gain:a.gain});u.effectId=d;let h=this.activeDragVoices.get(e);h||(h=new Set,this.activeDragVoices.set(e,h)),h.add(u),t.voicePending=!1,t.currentVoice=u,n.onended=()=>{this.emitEffectEnd(d);let v=this.activeDragVoices.get(e);v==null||v.delete(u),(v==null?void 0:v.size)===0&&this.activeDragVoices.delete(e),n.disconnect(),s.disconnect(),l==null||l.disconnect()},n.start(c,0);let m=this.dragTargets.get(e);m&&this.updateDrag(e,m.clientX,m.clientY,m.speed,m.acceleration,m.verticalSpeed)}))}beginDrag(e,t,i,a,r,o,n=0,s=i){if(!this.drags.length||this.dragGestures.has(e))return;let c=this.waterSoundAt(t,s).depth,l=this.waterSoundAt(t,i).depth,u=Ma(c,l),d={clientX:t,clientY:i,speed:a,acceleration:r,verticalSpeed:o,peakSpeed:a,peakAcceleration:r,peakMotionEnergy:Dt({speed:a,acceleration:r,pathDistance:n}),audioGate:new Pn(n),currentVoice:null,voicePending:!1,dragIndex:-1,startDepth:c,farStarted:!u,farOpen:u,farOpenedAt:u?performance.now():0};this.dragGestures.add(e),this.dragTargets.set(e,d),d.audioGate.update({speed:a,acceleration:r})&&d.farOpen&&this.startDragVoice(e,d)}updateDrag(e,t,i,a=.25,r=0,o=0){var w;let n=this.dragTargets.get(e);if(!n||!this.dragGestures.has(e))return;let s=this.waterSoundAt(t,i),c=t-n.clientX,l=i-n.clientY,u=Math.hypot(c,l),d=s.depth,h=n.farOpen;n.farOpen=Ma(n.startDepth,d,n.farOpen),!h&&n.farOpen&&(n.farOpenedAt=performance.now()),n.peakSpeed=Math.max(n.peakSpeed,a),n.peakAcceleration=Math.max(n.peakAcceleration,r);let m=n.audioGate.update({movement:u,speed:a,acceleration:r});n.peakMotionEnergy=Math.max(n.peakMotionEnergy,Dt({speed:a,acceleration:r,pathDistance:n.audioGate.pathDistance})),(m||n.audioGate.triggered)&&n.farOpen&&!n.currentVoice&&!n.voicePending&&this.startDragVoice(e,n),n.clientX=t,n.clientY=i,n.speed=a,n.acceleration=r,n.verticalSpeed=o;let v=n.currentVoice;if(!v||v.ending||!this.context)return;let f=this.context.currentTime,p=Dt({speed:a,acceleration:r,pathDistance:n.audioGate.pathDistance}),y=Cn({speed:a,acceleration:r,pathDistance:n.audioGate.pathDistance,depth:d,verticalSpeed:o,sampleGain:v.drag.gain});Y()&&(y=Math.min(.95,y*1.4)),(w=v.tone)==null||w.frequency.setTargetAtTime(s.cutoff,f,.1);let g=Math.min(v.gain.gain.value,v.lastGain??1e-4);v.lastEnergy=p,v.lastGain=Math.max(y,1e-4),v.gain.gain.cancelScheduledValues(f),v.gain.gain.setValueAtTime(g,f);let x=Nn(p);if(y<=0)v.audible=!1,v.gain.gain.setTargetAtTime(1e-4,f,x.timeConstant);else{v.audible=!0;let k=n.farStarted&&performance.now()-n.farOpenedAt<520;v.gain.gain.setTargetAtTime(y,f,k?.24:.13),v.gain.gain.setTargetAtTime(1e-4,f+x.delaySeconds,x.timeConstant)}}getDragArrivalProfile(e){let t=this.dragTargets.get(e);return t?{waveStrength:Mn({motionEnergy:t.peakMotionEnergy,pathDistance:t.audioGate.pathDistance}),excludeDragIndex:t.dragIndex}:null}endDrag(e){this.dragGestures.delete(e),this.dragTargets.delete(e);let t=this.activeDragVoices.get(e);if(t)for(let i of t)this.releaseDragVoice(e,i)}endAllDrags(){let e=new Set([...this.dragGestures,...this.activeDragVoices.keys()]);for(let t of e)this.endDrag(t)}playTimeTicks(e=1,{allowDeferred:t=!1}={}){this.setupGraph();let i=this.context;if(!i||!this.master||e<1)return;i.resume().catch(()=>{});let a=i.currentTime;this.loadTimeTickBuffer().then(r=>{if(!r||!this.master||!t&&i.currentTime-a>.12)return;let o=i.currentTime,n=i.createBufferSource(),s=i.createGain();n.buffer=r,s.gain.value=this.timeTick.gain,n.connect(s).connect(this.master),n.onended=()=>{n.disconnect(),s.disconnect()},n.start(o)})}},a7=class{constructor(e){this.canvas=e,this.context=e.getContext("2d",{alpha:!1}),this.hour=12,this.ripples=[],this.sweeps=[],this.dragArrivals=new Map,this.running=!1,this.frameGovernor=new Ga,this.lastFrame=performance.now(),this.staticFrameAt=0,this.staticCanvas=document.createElement("canvas"),this.staticContext=this.staticCanvas.getContext("2d",{alpha:!1}),this.staticPixels=null,this.resize()}setTimeHours(e){this.hour=e}splashAt(e,t,{holdDurationMs:i=140,onViewerArrival:a=null}={}){let r=D(t/Math.max(innerHeight,1),0,1),o=D((r-1/3)/(2/3),0,1),n=o*o*(3-2*o),s=A0,c=zt(innerWidth,n),l=Ei(i);this.ripples.push({x:e,y:t,born:performance.now(),gentleness:n,rippleDelay:s,interactionScale:c.tapRadius,energy:c.tapEnergy*l.energyScale,displacementScale:l.depthScale,onViewerArrival:a,viewerArrivalFired:!1})}queueDragArrival(e,t,i,a){if(typeof a!="function")return;let r=Math.max(0,innerHeight-i)/152*1e3,o=performance.now()+r,n=this.dragArrivals.get(e);(!n||o<n.arrivesAt)&&this.dragArrivals.set(e,{arrivesAt:o,callback:a})}dragThrough(e,t,{deltaMs:i=16,screenDepth:a=.5,strength:r=1}={}){if(!e||!t)return;let o=e.screenX??e.x,n=e.screenY??e.y,s=t.screenX??t.x,c=t.screenY??t.y,l=Math.hypot(s-o,c-n);if(l<1)return;let u=D(l/Math.max(i,4),0,4),d=D(a,0,1),h=d*d*(3-2*d),m=zt(innerWidth,h);this.sweeps.push({x1:o,y1:n,x2:s,y2:c,born:performance.now(),depth:d,speed:u,strength:r*m.dragEnergy,interactionScale:m.dragRadius}),this.sweeps.length>90&&this.sweeps.splice(0,this.sweeps.length-90)}resize(){var e;let t=matchMedia("(hover: none), (pointer: coarse)").matches,i=navigator.deviceMemory||4,a=navigator.hardwareConcurrency||4,r=t&&(i<=4||a<=4),o=this.canvas.getBoundingClientRect(),n=Math.max(o.width,1),s=Math.max(o.height,1),c=li({width:n,height:s,devicePixelRatio:devicePixelRatio||1,cap:r?1.05:t?1.2:1.25,pixelBudget:r?62e4:t?9e5:125e4});this.canvas.width=Math.max(1,Math.round(n*c)),this.canvas.height=Math.max(1,Math.round(s*c)),this.canvas.style.width=`${n}px`,this.canvas.style.height=`${s}px`,this.ratio=c;let l=432,u=Math.max(32,Math.round(l*(n/s)/2.35));(this.staticCanvas.width!==u||this.staticCanvas.height!==l)&&(this.staticCanvas.width=u,this.staticCanvas.height=l,this.staticPixels=((e=this.staticContext)==null?void 0:e.createImageData(u,l))??null)}compactByAge(e,t,i){let a=0;for(let r=0;r<e.length;r+=1){let o=e[r];t-o.born>=i||(e[a]=o,a+=1)}e.length=a}drawStaticFrame(){let e=this.context,t=this.staticContext,i=this.staticPixels;if(!e)return;if(!t||!i){e.fillStyle="#111",e.fillRect(0,0,this.canvas.width,this.canvas.height);return}let a=i.data,r=i.width,o=i.height,n=(Math.random()-.5)*18;for(let c=0;c<o;c+=1){n=n*.86+(Math.random()-.5)*16,Math.random()<.025&&(n+=(Math.random()-.5)*58);for(let l=0;l<r;l+=1){let u=(c*r+l)*4,d=Math.random(),h=d<.018?228:d>.982?12:48+Math.floor(Math.random()*116),m=D(Math.round(h+n),0,255);a[u]=m,a[u+1]=m,a[u+2]=m,a[u+3]=255}}t.putImageData(i,0,0),e.save(),e.globalAlpha=1,e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.filter=`blur(${Math.max(.7,this.ratio*.8)}px)`;let s=Math.ceil(this.ratio*2);e.drawImage(this.staticCanvas,-s,-s,this.canvas.width+s*2,this.canvas.height+s*2),e.filter="none",e.globalAlpha=.16,e.imageSmoothingEnabled=!1,e.drawImage(this.staticCanvas,0,0,this.canvas.width,this.canvas.height),e.restore()}processFallbackArrivals(e){for(let[t,i]of this.dragArrivals)e<i.arrivesAt||(this.dragArrivals.delete(t),i.callback());for(let t of this.ripples){if(t.wake||t.viewerArrivalFired||typeof t.onViewerArrival!="function")continue;let i=(e-t.born)/1e3,a=(t.rippleDelay??0)/1e3;if(i<a)continue;let r=D(t.y/Math.max(innerHeight,1),0,1),o=t.gentleness??0,n=t.interactionScale??1,s=i-a,c=(s-.3*o*(1-Math.exp(-s/.3)))*(152-o*28)*n*(.12+r*.1);t.y+c<innerHeight||(t.viewerArrivalFired=!0,t.onViewerArrival())}}render=e=>{this.running&&(this.frameHandle=requestAnimationFrame(this.render),this.frameGovernor.shouldRender(e)&&(e-this.staticFrameAt<1e3/24||(this.staticFrameAt=e,this.lastFrame=e,this.processFallbackArrivals(e),this.compactByAge(this.ripples,e,2300),this.compactByAge(this.sweeps,e,1350),this.drawStaticFrame())))};start(){this.running||(this.running=!0,this.lastFrame=performance.now(),this.frameGovernor.reset(),this.frameHandle=requestAnimationFrame(this.render))}stop(){this.running=!1,cancelAnimationFrame(this.frameHandle)}},S,V,qt=0,xe=Object.freeze({waterEnabled:!0,waterClarity:56,textureScale:102,causticDensity:199,causticIrregularity:200,causticSoftness:153,causticOpacity:76,causticChromatic:300,glintIntensity:300,middayBrightness:300,middayDiffusion:300});function r7(){S&&(S.setDebugWaterEnabled(xe.waterEnabled),S.setDebugWaterClarity(xe.waterClarity),S.setDebugBedTextureScale(xe.textureScale),S.setDebugCausticDensity(xe.causticDensity),S.setDebugCausticIrregularity(xe.causticIrregularity),S.setDebugCausticSoftness(xe.causticSoftness),S.setDebugCausticOpacity(xe.causticOpacity),S.setDebugCausticChromatic(xe.causticChromatic),S.setDebugGlintIntensity(xe.glintIntensity),S.setDebugMiddayRayBrightness(xe.middayBrightness),S.setDebugMiddayRayDiffusion(xe.middayDiffusion))}function zi(e=null){e&&console.warn(e),document.documentElement.classList.add("webgl-unavailable"),V||(V=new a7(Ht)),V.setTimeHours((P??te())/60),document.hidden||V.start(),jt()}function o7(){qt=0;try{S=new ln(Oe,{reducedMotion:Ii});let e=P??te(),t=$e(e/60);S.setTimeHours(e/60,{immediateWaveEnergy:!0}),S.setWaterClarity(t.waterClarity),r7(),document.hidden||S.start()}catch(e){zi(e)}}Oe.addEventListener("waterready",()=>{document.documentElement.classList.add("water-ready"),jt()},{once:!0});qt=requestAnimationFrame(()=>{qt=requestAnimationFrame(o7)});window.addEventListener("watercontextlost",()=>{zi()});Oe.addEventListener("waterfatal",e=>{zi(e.detail)},{once:!0});var A=new i7(at,dn,hn,Vn,Gn,Hn,jn,{diagnosticMode:Gt}),ht=0,yi=!1;function Bi(){ht&&(clearTimeout(ht),ht=0)}function Ui(){return yi?!1:(yi=!0,Bi(),!0)}function n7(){Gt||(ht=0,!(document.hidden||!Ui())&&A.startAmbience())}function jt(){Gt||yi||ht||document.hidden||(ht=window.setTimeout(n7,0))}var D0=new un(at.length);D0.last=0;var Te=0,Xt=!0,P=null,G=!1,we=!1,ce=!1,et=0,Re=null,Pe=null,Se=!1,s7={x:0,y:0},Z=!1,ut=0,Ce=0,ge=!1,X=null,oe=null,P0=0,mt=0,qe=null,Pt=0,pt=!1,xi=0,y0=null;var Ia=te(),Ft=0,Lt=0,xr=-1/0,Xe=null,ye=new Map,l7=180,x0=null,Mt=null;function Ot(e,t){return c7(e,t)}function c7(e,t){return S!=null&&S.isWaterAt?S.isWaterAt(e,t):!1}function vt(e,t,i=!1){let a=D(t/Math.max(window.innerHeight,1),0,1),r=(8+Math.pow(a,1.1)*18)*4,o=.055+Math.pow(a,.85)*.175,n=Math.max(2.5,r*o),s=(S==null?void 0:S.canvasBounds)??Oe.getBoundingClientRect(),c=Qi(S==null?void 0:S.camera,s,e,t,r);if(c){if(!Mt){let l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("class","cursor-water-ring"),l.setAttribute("aria-hidden","true"),l.setAttribute("focusable","false"),l.setAttribute("viewBox","0 0 1 1"),Mt=document.createElementNS("http://www.w3.org/2000/svg","path"),Mt.setAttribute("vector-effect","non-scaling-stroke"),l.append(Mt),Q.append(l)}Mt.setAttribute("d",c.path)}Q.classList.toggle("has-projected-circle",!!c),Q.style.setProperty("--cursor-x",`${e}px`),Q.style.setProperty("--cursor-y",`${t}px`),Q.style.setProperty("--cursor-circle-width",`${r.toFixed(2)}px`),Q.style.setProperty("--cursor-circle-height",`${n.toFixed(2)}px`),Q.classList.toggle("is-pressed",i)}function Yt(e,t){var i;let a=document.elementFromPoint(e,t),r=[...Yn].some(c=>{if(c.closest('[aria-hidden="true"]'))return!1;let l=c.getBoundingClientRect();return e>=l.left-20&&e<=l.right+20&&t>=l.top-20&&t<=l.bottom+20}),o=G&&[Fi,fe].some(c=>{let l=c.getBoundingClientRect();return e>=l.left&&e<=l.right&&t>=l.top&&t<=l.bottom}),n=!o&&br(e,t),s=o||!!((i=a==null?void 0:a.closest)!=null&&i.call(a,".interface-control, .about-panel, .track-waveform, .context-links"));O.classList.toggle("is-over-backdrop",!Ot(e,t)),O.classList.toggle("is-near-text",r),Q.classList.toggle("is-visible",!!a&&Ot(e,t)&&!(x0!=null&&x0.session)&&!r&&!s&&!n&&!X&&!Se)}function br(e,t){if(!G||K.getAttribute("aria-hidden")==="true")return!1;let i=_.getBoundingClientRect();return e>=i.left&&e<=i.right&&t>=i.top&&t<=i.bottom}function u7(e,t){Ot(e,t)&&(vt(e,t,!1),Yt(e,t),Q.classList.contains("is-visible")&&(clearTimeout(Lt),Q.classList.remove("is-tap-pulsing"),Q.offsetWidth,Q.classList.add("is-tap-pulsing"),Lt=window.setTimeout(()=>{Lt=0,Q.classList.remove("is-tap-pulsing")},320)))}function te(){if(Number.isFinite(globalThis.__stagingMinutes))return globalThis.__stagingMinutes;let e=new Date;return e.getHours()*60+e.getMinutes()}function wr(e){let t=Math.round(We(e))%le,i=Math.floor(t/60),a=i%12||12,r=String(t%60).padStart(2,"0"),o=String(a).padStart(2," "),n=i>=12?"p.m.":"a.m.";return{display:`${a}:${r} ${n}`,numerals:`${a}:${r}`,values:{"hour-tens":o[0]===" "?"":o[0],"hour-ones":o[1],"minute-tens":r[0],"minute-ones":r[1],meridiem:n}}}function d7(e){let t=window.__lakePrelude;if(P===null&&t!=null&&t.clearCustomMinutes){t.clearCustomMinutes();return}if(P!==null&&t!=null&&t.setCustomMinutes){t.setCustomMinutes(e);return}let i=e/60,a="#123e4d";i>=17&&i<19.75&&(a="#3d2a1d"),(i>=19.75||i<5.5)&&(a="#050b17"),i>=5.5&&i<8&&(a="#315b63"),document.documentElement.style.setProperty("--lake-page",a)}function h7(e){let t=D(e,0,1);return t*t*(3-2*t)}function Tr(e){if(Kn.setAttribute("aria-label",e.display),Fi.setAttribute("aria-label",e.display),pi.dataset.display!==e.display){pi.dataset.display=e.display;for(let[i,a]of Zn){let r=a.querySelector(".time-slot-value");r.textContent!==e.values[i]&&(r.textContent=e.values[i])}}Pa.textContent!==e.numerals&&(Pa.textContent=e.numerals);let t=" "+e.values.meridiem;Fa.textContent!==t&&(Fa.textContent=t)}function Fe(e,{animateLabel:t=!1,labelDirection:i=0,forceLabel:a=!1}={}){var r;let o=We(e),n=Math.round(o)%le,s=wr(n),c=s.display;Tr(s),_.value=String(n),_.setAttribute("aria-valuetext",c);let l=window.matchMedia("(max-width: 700px)").matches,u=P!==null;Jn.textContent=u?l?"Back to local":"Back to local time":"Now",fe.classList.toggle("is-custom",u),fe.setAttribute("aria-label",u?"Back to local time":"Now"),fe.setAttribute("aria-disabled",String(!u)),fe.tabIndex=u?0:-1;let d=Math.max(Qe.length,1),h=Math.min(ae.visibleTickCount,d)/2,m=le/d,v=o/m,f=v-Math.floor(v),p=l?16:28,y=Math.min(ae.width,Math.max(window.innerWidth-p,1))/ae.width,g=ae.tickWidth*(l?.9:1)*y,x=g*(1-ae.widthVariation),w=g*ae.activeOvershoot,k=(l?D(window.innerWidth*.07,24,36):24)*y;K.style.setProperty("--dial-active-width",`${w.toFixed(2)}px`),K.style.setProperty("--dial-label-offset",`${(w/2+k).toFixed(2)}px`),K.style.setProperty("--dial-label-width",`${(112*y).toFixed(2)}px`),Qe.forEach((M,L)=>{let z=L-d/2+f;for(;z>d/2;)z-=d;for(;z<-d/2;)z+=d;let N=zn(z,0,{visibleRadiusTicks:h,gapDistortion:ae.gap}),$=Math.pow(N.bulge,ae.bulgePower),ue=x+(g-x)*$,ee=1.5,Le=Math.abs(N.position-.5)*2,W=h7((Le-ae.edgeFadeStart)/(1-ae.edgeFadeStart)),de=N.visible?1-W*(1-ae.edgeOpacity):0;M.style.setProperty("--tick-y",`${(N.position*100).toFixed(3)}%`),M.style.setProperty("--tick-width",`${ue.toFixed(2)}px`),M.style.setProperty("--tick-stroke-width",`${ee.toFixed(3)}px`),M.style.setProperty("--tick-opacity",de.toFixed(3))});let F=o/60,I=$e(F);S==null||S.setTimeHours(F);let U=Math.round(I.waterClarity);A.setAmbienceWaveEnergy(((r=S==null?void 0:S.getAmbientActivity)==null?void 0:r.call(S))??I.waveEnergy),A.setDaypartTime(o),A.setCricketTime(o),S==null||S.setWaterClarity(U),V==null||V.setTimeHours(F),d7(o)}function L0(e,t,i=Math.sign(F0(e,t))){if(!G||i===0||In(e,t,{direction:i,dayMinutes:le,tickMinutes:le/Math.max(Qe.length,1)})<1)return;let a=le/Math.max(Qe.length,1),r=We(t),o=i>0?Math.floor(r/a)%Qe.length:Math.ceil(r/a)%Qe.length;(X==null?void 0:X.lastSoundedTick)!==o&&(X&&(X.lastSoundedTick=o),A.playTimeTicks())}function Ve(){let e=we||G||ce;for(let t of[_t,it,R0,J,M0,Nt])t.setAttribute("aria-hidden",String(e)),t.tabIndex=e?-1:0;Li.setAttribute("aria-hidden",String(e)),_t.setAttribute("aria-expanded",String(we)),J.setAttribute("aria-expanded",String(ce)),vi.classList.toggle("is-open",we),vi.setAttribute("aria-hidden",String(!we)),Ze.classList.toggle("is-time-selected",G),Ze.classList.toggle("is-time-custom",P!==null),Ze.classList.toggle("is-about-open",we),Ze.classList.toggle("is-waveform-open",ce),Ze.classList.toggle("is-resting",!e),it.setAttribute("aria-label",G?"Close time controls":"Change the time of day")}var za;(za=Wt.addEventListener)==null||za.call(Wt,"change",Ve);function _i(e,{focus:t=!1}={}){e&&ce&&Kt(!1),we=e,Ve(),e&&t&&vi.focus({preventScroll:!0})}function m7(e){Tr(wr(e))}function Ge(){ot(),!Z&&(cancelAnimationFrame(Ce),Ce=0,ge=!1,oe=null,G=!1,K.classList.remove("is-open"),K.setAttribute("aria-hidden","true"),K.inert=!0,it.setAttribute("aria-expanded","false"),_.disabled=!0,Ve(),m7(P??te()))}function Sr({focus:e=!0}={}){we=!1,ce&&Kt(!1),G=!0,K.inert=!1,K.classList.add("is-open"),K.setAttribute("aria-hidden","false"),it.setAttribute("aria-expanded","true"),_.disabled=Z||ge,Ve(),e&&!Z&&_.focus({preventScroll:!0})}var f7=(e,t,i)=>Math.min(i,Math.max(t,e));function p7(e,t){let i=(e==null?void 0:e.length)??0;if(!i||!Number.isFinite(t)||t<1)return new Float32Array;let a=Math.min(i,Math.floor(t)),r=new Float32Array(a);for(let o=0;o<a;o++){let n=Math.floor(o*i/a),s=Math.min(i,Math.ceil((o+1)*i/a)),c=0;for(let l=n;l<s;l++){let u=e[l];Number.isFinite(u)&&(c=Math.max(c,f7(u,0,1)))}r[o]=c}return r}function v7(e,t,{preferredPitch:i=5,strokeWidth:a=1.5,minGap:r=1.5}={}){let o=(e==null?void 0:e.length)??0,n=Number.isFinite(t)?Math.max(0,t):0,s=Number.isFinite(a)&&a>0?a:1.5,c=Number.isFinite(r)&&r>=0?r:1.5,l=s+c,u=Math.max(l,Number.isFinite(i)?i:5);if(!o||n<s)return{peaks:new Float32Array,count:0,width:0,pitch:0,strokeWidth:s,gap:0};let d=Math.min(o*u,n),h=Math.min(o,Math.max(1,Math.floor(d/l))),m=d/h;return{peaks:p7(e,h),count:h,width:d,pitch:m,strokeWidth:s,gap:Math.max(0,m-s)}}var Rt=null;function He(){var k;let e=st.getContext("2d");if(!e)return;let t=at[Te],i=bn(t.src),a=window.visualViewport,r=(a==null?void 0:a.width)??window.innerWidth,o=((k=se.offsetParent)==null?void 0:k.getBoundingClientRect().left)??0,s=((a==null?void 0:a.offsetLeft)??0)+r/2-o+"px";se.style.getPropertyValue("--track-waveform-left")!==s&&se.style.setProperty("--track-waveform-left",s);let c=Math.min(mn(i.length),Math.max(0,r-32));se.style.getPropertyValue("--track-waveform-width")!==`${c}px`&&se.style.setProperty("--track-waveform-width",`${c}px`),g7();let l=st.getBoundingClientRect();if(l.width<=0||l.height<=0)return;(!Rt||Rt.src!==t.src||Rt.width!==l.width)&&(Rt={src:t.src,width:l.width,layout:v7(i,l.width)});let u=Rt.layout;if(!u.count)return;let d=u.peaks,h=l.width/u.count,m=Math.min(window.devicePixelRatio||1,2),v=Math.max(1,Math.round(l.width*m)),f=Math.max(1,Math.round(l.height*m));(st.width!==v||st.height!==f)&&(st.width=v,st.height=f),e.setTransform(m,0,0,m,0,0),e.clearRect(0,0,l.width,l.height);let p=A.seekDuration(),y=fn(A.audio.currentTime,p);Re!==null&&Number.isFinite(p)&&Math.abs(y-Re)<=1/Math.max(i.length,1)&&(Re=null);let g=Re??y,x=l.height/2,w=Math.max(2,l.height-4);e.lineWidth=1.5,e.lineCap="round";for(let F=0;F<d.length;F+=1){let I=(F+.5)*h,U=Math.max(2,d[F]*w),M=.5+gn(g,F,d.length)*.5;e.strokeStyle=`rgb(255 255 255 / ${M})`,e.beginPath(),e.moveTo(I,x-U/2),e.lineTo(I,x+U/2),e.stroke()}H.disabled=!1,H.value=String(Math.round(g*1e3)),H.setAttribute("aria-valuetext",`${Aa(A.audio.currentTime)} of ${Aa(p)}`)}function Ar(e){pr.textContent=e.artist,$n.textContent=e.title,e7.textContent=` (${e.year})`}function g7(){if(!Pi||!ce){se.classList.remove("is-metadata-hidden");return}let e=window.visualViewport,t=se.getBoundingClientRect(),i=vn({viewportLeft:(e==null?void 0:e.offsetLeft)??0,viewportWidth:(e==null?void 0:e.width)??window.innerWidth,waveformLeft:t.left,waveformRight:t.right,artistWidth:pr.scrollWidth,titleWidth:Qn.scrollWidth});se.classList.toggle("is-metadata-hidden",!i)}var Ba=-1/0;function Ni(e=performance.now()){cancelAnimationFrame(et),et=0,ce&&(e-Ba>=50&&(He(),Ba=e),!A.audio.paused&&!A.audio.ended&&(et=requestAnimationFrame(Ni)))}function Kt(e,{focus:t=!1}={}){if(ce=e,se.inert=!e,se.setAttribute("aria-hidden",String(!e)),e){we=!1,Re=null,A.prepareTrack(Te);let i=at[Te];Ar(i),se.setAttribute("aria-label",`Waveform for ${i.title} by ${i.artist}`),He(),Ni()}else cancelAnimationFrame(et),et=0,Pe!==null&&A.cancelSeekTransition(),Pe=null,Re=null,se.classList.remove("is-metadata-hidden");Ve(),e&&t&&H.focus({preventScroll:!0})}function y7(){Z||(G?Ge():Sr())}function rt(e,{animateLabel:t=!0,labelDirection:i=null,soundTicks:a=!0}={}){let r=We(e),o=P??te(),n=i??Math.sign(F0(o,r));a&&L0(o,r,n),P=r,Fe(P,{animateLabel:t,labelDirection:n}),Ve()}function Er(e){return Ii?300:380+Math.min(Math.abs(e),720)/720*520}function kr(e){return 1-Math.pow(1-e,4)}function x7(e){cancelAnimationFrame(Ce);let t=We(e),i=P??te(),a=F0(i,t),r=Math.sign(a),o=performance.now(),n=Er(a);ge=!0,_.disabled=!0;let s=c=>{let l=D((c-o)/n,0,1),u=kr(l),d=We(i+a*u);if(L0(P??i,d,r),P=d,Fe(P,{animateLabel:!0,labelDirection:r}),l<1){Ce=requestAnimationFrame(s);return}Ce=0,ge=!1,P=t,Fe(P,{animateLabel:!0,labelDirection:r,forceLabel:!0}),Ve(),_.disabled=!G};Ce=requestAnimationFrame(s)}function Mr(){if(P===null||Z)return;cancelAnimationFrame(Ce),Ce=0,ge=!1,Sr({focus:!1}),Z=!0,_.disabled=!0;let e=P,t=te(),i=F0(e,t),a=Math.sign(i),r=performance.now(),o=Er(i),n=s=>{let c=D((s-r)/o,0,1),l=kr(c),u=We(e+i*l);if(L0(P,u,a),P=u,Fe(P,{animateLabel:!0,labelDirection:a}),c<1){ut=requestAnimationFrame(n);return}ut=0,Z=!1,P=null,Fe(te(),{animateLabel:!0,labelDirection:a,forceLabel:!0}),Ve(),_.disabled=!G};cancelAnimationFrame(ut),ut=requestAnimationFrame(n)}function bi(e=A.playbackState){e==="playing"&&(vr=!0);let t=e==="playing"||e==="pending";if(Li.dataset.playback=t?"playing":"paused",Xt){M0.setAttribute("aria-label",gi);return}let i=at[Te];M0.setAttribute("aria-label",`${t?"Pause":"Play"} ${i.title} by ${i.artist}`)}function Ua(e,t,{animate:i=!1,direction:a=1}={}){let r=ie.textContent,o=t==null?null:String(t),n=ie.hasAttribute("data-year")?ie.dataset.year:null;if(r===e&&n===o){g0();return}if(ie.getAnimations().forEach(v=>v.cancel()),J.querySelectorAll(".track-title-outgoing").forEach(v=>v.remove()),J.classList.remove("is-changing"),!i||Ii){ie.textContent=e,o===null?ie.removeAttribute("data-year"):ie.dataset.year=o,J.style.width="",g0();return}let s=ie.getBoundingClientRect().width,c=ie.cloneNode(!0);c.classList.add("track-title-outgoing"),c.setAttribute("aria-hidden","true"),J.append(c),ie.textContent=e,o===null?ie.removeAttribute("data-year"):ie.dataset.year=o,J.style.width="";let l=ie.getBoundingClientRect().width;J.style.width=Wt.matches?`${Math.ceil(Math.max(s,l))}px`:"",J.classList.add("is-changing");let u={duration:680,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"both"},d=a<0?-1:1,h=ie.animate([{transform:`translateY(${d*100}%)`,opacity:0},{transform:"translateY(0)",opacity:1}],u),m=c.animate([{transform:"translateY(0)",opacity:1},{transform:`translateY(${-d*100}%)`,opacity:0}],u);Promise.allSettled([h.finished,m.finished]).then(()=>{c.isConnected&&(c.remove(),J.classList.remove("is-changing"),J.style.width=Wt.matches?`${Math.ceil(l)}px`:"",g0())})}function Wi({play:e=!1,animateTitle:t=!1,titleDirection:i=1}={}){if(Xt){Ua(gi,null,{animate:t,direction:i}),J.setAttribute("aria-label",gi),R0.setAttribute("aria-label","Previous track"),Nt.setAttribute("aria-label","Next track"),bi();return}let a=at[Te];Ua(a.title,a.year,{animate:t,direction:i}),J.setAttribute("aria-label",`Show waveform for ${a.title}`),ce&&(Re=null,Ar(a),se.setAttribute("aria-label",`Waveform for ${a.title} by ${a.artist}`),He()),R0.setAttribute("aria-label","Previous track"),Nt.setAttribute("aria-label",`Next track. ${a.title} by ${a.artist}`),bi(),e&&A.play(Te)}it.addEventListener("click",e=>{e.stopPropagation(),y7()});function I0(e,t){let i=_.getBoundingClientRect();return Bn(e,t,{height:i.height,dayMinutes:le,tickCount:Qe.length,visibleRadiusTicks:ae.visibleTickCount/2,invertDirection:!0,wrap:!0})}function b7(e,t){let i=_.getBoundingClientRect();return I0(t,e-(i.top+i.height/2))}var w7=[_,Fi,fe];function qi(e){y0={clientX:e.clientX,clientY:e.clientY,until:performance.now()+500}}function T7(e){let t=y0;if(t){if(performance.now()>t.until){y0=null;return}Math.hypot(e.clientX-t.clientX,e.clientY-t.clientY)>24||(y0=null,e.preventDefault(),e.stopImmediatePropagation())}}document.addEventListener("click",T7,{capture:!0});Ki(O,{activate:()=>{Ui(),A.startAmbience()},isAudioReady:()=>{var e;return A.bufferedAmbience.playing||!A.ambience.paused&&((e=A.context)==null?void 0:e.state)==="running"},isSceneTarget:e=>{var t;return!Se&&!((t=e.closest)!=null&&t.call(e,".interface-control, .time-control, .time-scrubber, .about-panel, .track-waveform, .context-links, .water-tuning-panel, .water-tuning-button, .local-tools, button, a, input, select"))}});x0=Yi(O,{isWater:Ot,isBlocked:e=>{var t,i,a;return!((t=S==null?void 0:S.worldRenderer)!=null&&t.ready)||!!(Se||X||oe||br(e.clientX,e.clientY)||(a=(i=e.target).closest)!=null&&a.call(i,".interface-control, .time-control, .time-scrubber, .about-panel, .track-waveform, .context-links, .water-tuning-panel, .water-tuning-button, .local-tools, button, a, input, select"))},getMinutes:()=>P??te(),setMinutes:(e,t)=>rt(e,{animateLabel:!1,labelDirection:t}),onStart:()=>{cancelAnimationFrame(Ce),Ce=0,ge=!1,cancelAnimationFrame(ut),ut=0,Z=!1,_.disabled=!G,Q.classList.remove("is-visible","is-pressed","is-tap-pulsing"),O.classList.add("is-backdrop-scrubbing")},onEnd:e=>{qi(e),O.classList.remove("is-backdrop-scrubbing"),Yt(e.clientX,e.clientY)}});function S7(e){var t;if(e.button!==0&&e.pointerType==="mouse"||!G||K.inert||Z||ge)return;let i=e.currentTarget;Wt.matches&&i!==_||(i!==fe&&e.preventDefault(),i===fe?i.focus({preventScroll:!0}):_.focus({preventScroll:!0}),(t=i.setPointerCapture)==null||t.call(i,e.pointerId),X={pointerId:e.pointerId,startY:e.clientY,startMinutes:Math.round(P??te()),moved:!1,lastSoundedTick:null,source:i})}function A7(e){if(!(!X||X.pointerId!==e.pointerId)&&(!X.moved&&Math.abs(e.clientY-X.startY)>3&&(X.moved=!0,_.classList.add("is-dragging"),K.classList.add("is-dragging")),X.moved)){let t=e.clientY-X.startY;rt(I0(X.startMinutes,t),{labelDirection:Math.sign(t)})}}function E7(e){var t,i;if(!X||X.pointerId!==e.pointerId)return;let a=X,r=a.moved;X=null,_.classList.remove("is-dragging"),K.classList.remove("is-dragging"),(i=(t=a.source).hasPointerCapture)!=null&&i.call(t,e.pointerId)&&a.source.releasePointerCapture(e.pointerId),(r||a.source!==fe)&&(e.preventDefault(),e.stopPropagation(),qi(e));let o=r?I0(a.startMinutes,e.clientY-a.startY):b7(e.clientY,a.startMinutes);if(r){let n=Math.sign(e.clientY-a.startY);rt(o,{labelDirection:n})}else a.source===_?x7(o):a.source===fe&&P!==null&&!Z&&(e.preventDefault(),e.stopPropagation(),xi=performance.now()+280,Mr());r&&a.source===fe&&(xi=performance.now()+280)}function k7(e){!X||X.pointerId!==e.pointerId||(X=null,_.classList.remove("is-dragging"),K.classList.remove("is-dragging"))}w7.forEach(e=>{e.addEventListener("pointerdown",S7),e.addEventListener("pointermove",A7),e.addEventListener("pointerup",E7),e.addEventListener("pointercancel",k7)});O.addEventListener("wheel",e=>{if(!G||Z||ge||Se)return;e.preventDefault();let t=Un(e.deltaY,{deltaMode:e.deltaMode,viewportHeight:window.innerHeight,dialHeight:_.getBoundingClientRect().height,dayMinutes:le,responseMultiplier:Wn});if(Math.abs(t)<.01)return;let i=P??te();rt(i+t,{labelDirection:Math.sign(t)})},{passive:!1,capture:!0});function M7(e){var t,i,a;e.pointerType!=="touch"||!G||Z||ge||Se||(i=(t=e.target).closest)!=null&&i.call(t,"#time-range, .time-slider-value, .time-slider-mode, .time-control, .context-links, .local-core-close, .local-tools, .local-site-header")||(e.preventDefault(),e.stopPropagation(),(a=O.setPointerCapture)==null||a.call(O,e.pointerId),oe={pointerId:e.pointerId,startY:e.clientY,startMinutes:P??te(),moved:!1})}function R7(e){if(!oe||oe.pointerId!==e.pointerId)return;e.preventDefault(),e.stopPropagation();let t=e.clientY-oe.startY;!oe.moved&&Math.abs(t)>4&&(oe.moved=!0),oe.moved&&rt(I0(oe.startMinutes,t),{labelDirection:Math.sign(t)})}function Rr(e){var t;if(!oe||oe.pointerId!==e.pointerId)return;e.preventDefault(),e.stopPropagation(),qi(e);let i=oe.moved;oe=null,(t=O.hasPointerCapture)!=null&&t.call(O,e.pointerId)&&O.releasePointerCapture(e.pointerId),i||Ge()}O.addEventListener("pointerdown",M7,{capture:!0});O.addEventListener("pointermove",R7,{capture:!0});O.addEventListener("pointerup",Rr,{capture:!0});O.addEventListener("pointercancel",Rr,{capture:!0});_.addEventListener("input",()=>{X||ge||Z||rt(Number(_.value))});function wi(e){let t=Math.round(P??te());rt(Fn(t,{direction:e,stepMinutes:pt?1:3}),{labelDirection:e})}function ot(){window.clearTimeout(P0),window.clearInterval(mt),P0=0,mt=0,qe=null,Pt=0,pt=!1}function Cr({stepImmediately:e=!1}={}){window.clearInterval(mt),mt=0,!(!qe||!Pt)&&(e&&wi(Pt),mt=window.setInterval(()=>wi(Pt),Ln(!pt)))}function Ti(e){!qe||pt===e||(pt=e,mt&&Cr())}function C7(e,t,i){ot(),qe=e,Pt=t,pt=i,P0=window.setTimeout(()=>{P0=0,Cr({stepImmediately:!0})},320)}function Dr(e){var i;if(e.metaKey||e.ctrlKey||e.altKey||e.isComposing||document.hidden||Se||we||ce)return!1;let t=e.target;return t===_||t===fe?G&&!K.inert:!((i=t==null?void 0:t.closest)!=null&&i.call(t,'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], .water-tuning-panel, .track-waveform, .about-panel, .context-links, .local-tools'))}K.addEventListener("keydown",e=>{e.key==="Escape"&&(Ge(),it.focus({preventScroll:!0}))});window.addEventListener("keydown",e=>{if(e.key==="Escape"){ot();return}if(e.key==="Shift"){qe&&(e.preventDefault(),e.stopPropagation(),Ti(!0));return}let t=e.key==="ArrowUp"||e.key==="ArrowRight"?1:e.key==="ArrowDown"||e.key==="ArrowLeft"?-1:0;if(!(!t||!Dr(e)||Z||ge)){if(e.preventDefault(),e.stopPropagation(),e.repeat||qe===e.key){Ti(e.shiftKey);return}C7(e.key,t,e.shiftKey),wi(t)}},{capture:!0});window.addEventListener("keyup",e=>{e.key==="Shift"?Ti(!1):e.key===qe&&ot()},{capture:!0});window.addEventListener("focusin",e=>{qe&&!Dr(e)&&ot()});window.addEventListener("blur",ot);document.addEventListener("visibilitychange",()=>{document.hidden&&ot()});fe.addEventListener("click",e=>{e.stopPropagation(),!(!G||K.inert)&&(performance.now()<xi||P!==null&&!Z&&Mr())});_t.addEventListener("click",e=>{e.stopPropagation(),!Z&&(Ge(),_i(!0,{focus:!0}))});function Pr(e){let t=e<0?D0.previous():D0.next(),i=!vr;Xt=!1,Te=t,A.prepareTrack(Te),Wi({play:!1,animateTitle:!0,titleDirection:e}),A.playTimeTicks(),A.play(t,{startAmbience:!1,fadeIn:i})}function Fr(){Pr(1)}function D7(){Pr(-1)}function Lr(){return Xt?(Xt=!1,Te=D0.next(),A.prepareTrack(Te),Wi({play:!1,animateTitle:!0,titleDirection:1}),A.playTimeTicks(1,{allowDeferred:!0}),A.unlock({startMusic:!0,startLakeAmbience:!1,fadeIn:!0}),!0):!1}A.audio.addEventListener("ended",()=>{A.playbackState!=="paused"&&Fr()});A.audio.addEventListener("lakeplaybackstatechange",e=>{let t=at[Te];Nt.setAttribute("aria-label",`Next track. ${t.title} by ${t.artist}`),bi(e.detail.state),Ni()});for(let e of["loadedmetadata","durationchange","timeupdate","seeked"])A.audio.addEventListener(e,()=>{(e==="loadedmetadata"||e==="durationchange")&&A.applyPendingSeek(),ce&&He()});Nt.addEventListener("click",e=>{e.stopPropagation(),Fr()});R0.addEventListener("click",e=>{e.stopPropagation(),D7()});function Ir(e){e.stopPropagation(),!Lr()&&(Li.dataset.playback==="playing"?A.pauseTrack({durationSeconds:0}):A.unlock({startMusic:!0,startLakeAmbience:!1,fadeIn:!1}))}M0.addEventListener("click",Ir);J.addEventListener("click",e=>{e.stopPropagation(),!Z&&(Lr()||(Ge(),Kt(!0,{focus:!0})))});function Xi(e){let t=se.getBoundingClientRect(),i=pn(e,t.left,t.width);return Re=i,H.value=String(Math.round(i*1e3)),He(),i}function zr(e,{finishTransition:t=!1}={}){Re=e,t?A.finishSeekTransition(e):A.seekToProgress(e),He()}H.addEventListener("pointerdown",e=>{var t;e.pointerType==="mouse"&&e.button!==0||(e.preventDefault(),e.stopPropagation(),Pe=e.pointerId,A.beginSeekTransition(),(t=H.setPointerCapture)==null||t.call(H,e.pointerId),H.focus({preventScroll:!0}),Xi(e.clientX))});H.addEventListener("pointermove",e=>{e.pointerId===Pe&&(e.preventDefault(),e.stopPropagation(),Xi(e.clientX))});var P7=e=>{var t;if(e.pointerId!==Pe)return;e.preventDefault(),e.stopPropagation();let i=Xi(e.clientX);(t=H.hasPointerCapture)!=null&&t.call(H,e.pointerId)&&H.releasePointerCapture(e.pointerId),Pe=null,zr(i,{finishTransition:!0})};H.addEventListener("pointerup",P7);H.addEventListener("pointercancel",e=>{var t;e.pointerId===Pe&&(e.stopPropagation(),(t=H.hasPointerCapture)!=null&&t.call(H,e.pointerId)&&H.releasePointerCapture(e.pointerId),Pe=null,A.cancelSeekTransition(),Re=null,He())});H.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation()});H.addEventListener("input",e=>{if(e.stopPropagation(),Pe!==null)return;let t=Number(H.value)/1e3;zr(t)});document.addEventListener("pointerdown",e=>{var t,i,a,r,o,n,s,c;if(Se&&!((i=(t=e.target).closest)!=null&&i.call(t,".context-links"))){Vt();return}if(e.button!==2){if(ce){if((r=(a=e.target).closest)!=null&&r.call(a,".track-waveform"))return;Kt(!1)}we&&!((n=(o=e.target).closest)!=null&&n.call(o,".site-title, .about-panel, .contact-label"))&&_i(!1),!(!G||Z)&&((c=(s=e.target).closest)!=null&&c.call(s,".time-control, .time-scrubber")||Ge())}});function F7(e){var t;return!!((t=e==null?void 0:e.closest)!=null&&t.call(e,"input, textarea, select, button, a, [contenteditable]:not([contenteditable='false'])"))}document.addEventListener("keydown",e=>{if(!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.repeat&&!F7(e.target)&&(e.code==="Space"||e.key===" ")){e.preventDefault(),Ir(e);return}if(e.key==="Escape"&&Se){Vt();return}e.key==="Escape"&&(ce?(Kt(!1),J.focus({preventScroll:!0})):we?(_i(!1),_t.focus({preventScroll:!0})):G&&(Ge(),it.focus({preventScroll:!0})))});function Vt(){Se=!1,O.classList.remove("is-context-menu-open"),Ze.inert=!1,Me.classList.remove("is-open"),Me.setAttribute("aria-hidden","true"),mr.forEach(e=>{e.tabIndex=-1})}O.addEventListener("contextmenu",e=>{var t,i,a,r;if(e.preventDefault(),(i=(t=e.target).closest)!=null&&i.call(t,".track-previous, .track-next, .track-playback, .track-current-title")){Vt(),A.playbackState==="playing"||A.playbackState==="pending"?A.pauseTrack({durationSeconds:0}):A.unlock({startMusic:!0,startLakeAmbience:!1,fadeIn:!1});return}if((r=(a=e.target).closest)!=null&&r.call(a,".time-control, .time-scrubber, .site-title, .about-title")){Vt();return}Q.classList.remove("is-visible");let o=D(e.clientX-Me.offsetWidth+3,18,Math.max(18,innerWidth-Me.offsetWidth-18)),n=D(e.clientY,50,innerHeight-50);s7={x:e.clientX,y:e.clientY},Me.style.setProperty("--context-x",`${o}px`),Me.style.setProperty("--context-y",`${n}px`),Se=!0,O.classList.add("is-context-menu-open"),Ze.inert=!0,Me.classList.add("is-open"),Me.setAttribute("aria-hidden","false"),mr.forEach(s=>{s.tabIndex=s.disabled?-1:0})});Me.addEventListener("click",e=>{e.target.closest("a")&&Vt()});function Br(e){if(!Ot(e.clientX,e.clientY))return;var t,i;if(e.pointerType==="mouse"&&(e.button!==0||(e.buttons&1)!==1)||Se)return;Ui(),A.unlock({startMusic:!1,startLakeAmbience:!0,fadeIn:!0}),Ge(),A.prepareRippleArrival(),(i=(t=e.currentTarget).setPointerCapture)==null||i.call(t,e.pointerId);let a=(S==null?void 0:S.screenToWorld(e.clientX,e.clientY))??null,r=e.timeStamp||performance.now(),o=yr.matches&&e.pointerType==="mouse"&&e.isPrimary!==!1&&(e.buttons&1)===1;ye.set(e.pointerId,{point:a,fallbackPoint:{screenX:e.clientX,screenY:e.clientY},target:e.currentTarget,pointerType:e.pointerType,startClientX:e.clientX,startClientY:e.clientY,lastTime:r,lastClientX:e.clientX,lastClientY:e.clientY,lastVelocityX:0,lastVelocityY:0,startedAt:r,dragStarted:!1,audioDragStarted:!1,arrivalX:e.clientX,arrivalY:e.clientY,nearestArrivalY:e.clientY,arrivalFired:!1,arrivalCallback:null,arrivalKey:`${e.pointerId}:${r}`,arrivalWaveStrength:1.35,arrivalExcludeDragIndex:-1,waterStrength:1,showPressedCursor:o,cursorPressedAt:performance.now()}),o&&(Xe=e.pointerId,vt(e.clientX,e.clientY,!0),Q.classList.add("is-visible"))}function Ur(e){var t,i,a;if(!ye.has(e.pointerId))return;let r=ye.get(e.pointerId);if(r.pointerType==="mouse"&&(e.buttons&1)!==1){z0(e);return}let o=((t=e.getCoalescedEvents)==null?void 0:t.call(e))??[e];for(let n of o){let s=(S==null?void 0:S.screenToWorld(n.clientX,n.clientY))??null,c=n.timeStamp||performance.now(),l=D(c-r.lastTime,4,50),u=n.clientX-r.lastClientX,d=n.clientY-r.lastClientY,h=Math.hypot(u,d)/l,m=u/l,v=d/l,f=Math.hypot(m-r.lastVelocityX,v-r.lastVelocityY)/l,p=d/l,y=Math.hypot(n.clientX-r.startClientX,n.clientY-r.startClientY),g=hr(r.pointerType);if(!r.dragStarted&&y>=g){r.dragStarted=!0,r.arrivalCallback=()=>{r.arrivalFired||(r.arrivalFired=!0,A.playApproachingRipple(r.arrivalX,r.arrivalY,{category:"Drag ripple arrival",waveStrength:r.arrivalWaveStrength,excludeDragIndex:r.arrivalExcludeDragIndex}))};let x=V??S;(i=x==null?void 0:x.queueDragArrival)==null||i.call(x,r.arrivalKey,r.startClientX,r.startClientY,r.arrivalCallback),A.startAmbience({fadeIn:!0,durationSeconds:dr})}if(r.dragStarted){r.audioDragStarted?r.audioDragStarted&&A.updateDrag(e.pointerId,n.clientX,n.clientY,h,f,p):(r.audioDragStarted=!0,A.beginDrag(e.pointerId,n.clientX,n.clientY,h,f,p,y,r.startClientY));let x=A.getDragArrivalProfile(e.pointerId);if(x&&(r.arrivalWaveStrength=x.waveStrength,r.arrivalExcludeDragIndex=x.excludeDragIndex),r.point&&s){let w=D(n.clientY/Math.max(window.innerHeight,1),0,1);S.dragThrough(r.point,s,{deltaMs:l,screenDepth:w,pointerId:e.pointerId,strength:r.waterStrength}),V==null||V.dragThrough(r.fallbackPoint,{screenX:n.clientX,screenY:n.clientY},{deltaMs:l,screenDepth:w,strength:r.waterStrength})}if(!r.arrivalFired&&n.clientY>=r.nearestArrivalY+10){r.nearestArrivalY=n.clientY,r.arrivalX=n.clientX,r.arrivalY=n.clientY;let w=V??S;(a=w==null?void 0:w.queueDragArrival)==null||a.call(w,r.arrivalKey,n.clientX,n.clientY,r.arrivalCallback)}}r.point=s,r.fallbackPoint={screenX:n.clientX,screenY:n.clientY},r.showPressedCursor&&Xe===e.pointerId&&(e.buttons&1)===1&&vt(n.clientX,n.clientY,!0),r.lastTime=n.timeStamp||performance.now(),r.lastClientX=n.clientX,r.lastClientY=n.clientY,r.lastVelocityX=m,r.lastVelocityY=v}}function Oi(e){var t,i;let a=ye.get(e.pointerId);if(!a)return;ye.delete(e.pointerId),A.unlock({startMusic:!1,startLakeAmbience:!0,fadeIn:!0}),Xe===e.pointerId&&(Xe=null);let r=A.getDragArrivalProfile(e.pointerId);r&&(a.arrivalWaveStrength=r.waveStrength,a.arrivalExcludeDragIndex=r.excludeDragIndex),A.endDrag(e.pointerId);let o=Math.hypot(e.clientX-a.startClientX,e.clientY-a.startClientY),n=!a.dragStarted&&o<hr(a.pointerType);if(n){let s=e.timeStamp||performance.now(),c=D(s-a.startedAt,0,5e3),l=e.clientX,u=e.clientY,d=Ei(c).energyScale,h=()=>{A.playApproachingRipple(l,u,{waveStrength:d})};V?V.splashAt(l,u,{holdDurationMs:c,onViewerArrival:h}):S==null||S.splashAt(l,u,{holdDurationMs:c,onViewerArrival:h}),A.playImpact(l,u),A.startAmbience({fadeIn:!0,durationSeconds:dr})}if(a.showPressedCursor||e.pointerType==="mouse"){xr=performance.now(),clearTimeout(Ft);let s=()=>{Ft=0,vt(e.clientX,e.clientY,!1),Yt(e.clientX,e.clientY)},c=a.showPressedCursor&&n?Math.max(0,l7-(performance.now()-a.cursorPressedAt)):0;c>0?Ft=window.setTimeout(s,c):s()}(i=(t=a==null?void 0:a.target)==null?void 0:t.hasPointerCapture)!=null&&i.call(t,e.pointerId)&&a.target.releasePointerCapture(e.pointerId)}function z0(e){var t,i;let a=ye.get(e.pointerId);a&&(ye.delete(e.pointerId),Xe===e.pointerId&&(Xe=null),A.endDrag(e.pointerId),e.pointerType==="mouse"&&(vt(e.clientX,e.clientY,!1),Yt(e.clientX,e.clientY)),(i=(t=a.target)==null?void 0:t.hasPointerCapture)!=null&&i.call(t,e.pointerId)&&a.target.releasePointerCapture(e.pointerId))}function _r(){var e,t;A.endAllDrags(),oe=null;for(let[i,a]of ye)(t=(e=a==null?void 0:a.target)==null?void 0:e.hasPointerCapture)!=null&&t.call(e,i)&&a.target.releasePointerCapture(i);ye.clear(),Xe=null,clearTimeout(Ft),Ft=0,clearTimeout(Lt),Lt=0,Q.classList.remove("is-pressed","is-tap-pulsing")}Oe.addEventListener("pointerdown",Br);Oe.addEventListener("pointermove",Ur);Oe.addEventListener("pointerup",Oi);Oe.addEventListener("pointercancel",z0);Ht.addEventListener("pointerdown",Br);Ht.addEventListener("pointermove",Ur);Ht.addEventListener("pointerup",Oi);Ht.addEventListener("pointercancel",z0);window.addEventListener("pointerup",e=>{ye.has(e.pointerId)&&Oi(e)},{capture:!0});window.addEventListener("pointercancel",e=>{ye.has(e.pointerId)&&z0(e)},{capture:!0});yr.matches&&(O.addEventListener("click",e=>{var t,i;performance.now()-xr<280||(i=(t=e.target).closest)!=null&&i.call(t,".interface-control, .time-scrubber, .about-panel, .context-links")||u7(e.clientX,e.clientY)}),O.addEventListener("pointermove",e=>{let t=ye.get(e.pointerId),i=!!(t!=null&&t.showPressedCursor&&Xe===e.pointerId&&(e.buttons&1)===1);vt(e.clientX,e.clientY,i),Yt(e.clientX,e.clientY)}),O.addEventListener("pointerleave",()=>{Q.classList.remove("is-visible")}));var ri=0;function Nr(){let e=window.visualViewport,t=jr({surfaceHeight:O.getBoundingClientRect().height,viewportHeight:(e==null?void 0:e.height)??window.innerHeight,viewportOffsetTop:(e==null?void 0:e.offsetTop)??0});document.documentElement.style.setProperty("--visual-viewport-bottom",`${Math.round(t)}px`)}function Zt(){cancelAnimationFrame(ri),ri=requestAnimationFrame(()=>{ri=0,Nr(),S==null||S.resize(),V==null||V.resize(),gr(),G&&Fe(P??te()),ce&&He()})}Nr();window.addEventListener("resize",Zt,{passive:!0});var _a;(_a=window.visualViewport)==null||_a.addEventListener("resize",Zt,{passive:!0});var Na;(Na=window.visualViewport)==null||Na.addEventListener("scroll",Zt,{passive:!0});window.addEventListener("orientationchange",Zt,{passive:!0});document.addEventListener("visibilitychange",()=>{S==null||S.setVisible(!document.hidden),document.hidden?(V==null||V.stop(),Bi(),_r()):(V==null||V.start(),jt(),Vi(),B0())});window.addEventListener("pagehide",()=>{cancelAnimationFrame(qt),cancelAnimationFrame(C0),cancelAnimationFrame(et),qt=0,et=0,Bi(),clearTimeout(Si),S==null||S.stop(),V==null||V.stop(),_r()});window.addEventListener("pageshow",e=>{e.persisted&&(S==null||S.start(),V==null||V.start(),Zt(),jt(),Vi(),B0())});Fe(te());Wi({play:!1});jt();var Si=0;function Vi(){let e=te(),t=(e-Ia+2160)%1440-720;if(Ia=e,t===0)return;if(P===null){let a=Number(_.value);Fe(e,{animateLabel:G,labelDirection:Math.sign(t||e-a)});return}if(X||ge||Z)return;let i=P;P=We(P+t),P!==i&&(L0(i,P,Math.sign(t)),Fe(P,{animateLabel:G,labelDirection:Math.sign(t)}))}function B0(){if(clearTimeout(Si),document.hidden)return;let e=new Date,t=e.getSeconds()*1e3+e.getMilliseconds();Si=window.setTimeout(()=>{Vi(),B0()},6e4-t+16)}B0();for(let e of["altwaterchange","altbreezefollow"])window.addEventListener(e,()=>{S!=null&&S.getAmbientActivity&&A.setAmbienceWaveEnergy(S.getAmbientActivity())});

// Small adapter for the locally authored navigation.
export const localLakeControls = {
  setReadingMode(reading) {
    const renderer = S ?? V;
    if (!renderer) return;
    const fps = localBackgroundFrameRate({ reading, reducedMotion: renderer.reducedMotion });
    if (renderer.frameGovernor.targetFps === fps) return;
    renderer.frameGovernor.targetFps = fps;
    renderer.frameGovernor.reset();
    renderer.frameTimePressure?.reset();
    renderer.lastPresentedAt = 0;
  },
  setVolume(value) {
    A.setupGraph();
    if (A.localOutput) A.localOutput.gain.setTargetAtTime(Math.max(0, Math.min(1, value)), A.context.currentTime, 0.04);
  },
  getSettings() { return { ...be }; },
  setSettings(values) { be = Va({ ...be, ...values }); ra(); },
  resetSettings() { be = { ...Je }; ra(true); },
  getTime() { return { minutes: Math.round(P ?? te()) % 1440, live: P === null }; },
  setTime(minutes) { P = We(Number(minutes)); Fe(P); },
  resetTime() { P = null; Fe(te()); },
  openTime() { Sr(); },
  getUiState() { return { timeOpen: G, live: P === null, initialTrack: Xt, playing: A.playbackState === 'playing' || A.playbackState === 'pending', track: at[Te] }; },
  openAbout() { _i(true, { focus: true }); },
  getView() { return Y() ? 'vast' : 'alt'; },
  isWaterAt(x, y) { return V ? true : S?.isWaterAt ? S.isWaterAt(x, y) : true; },
  pulseWaterAt(x, y, holdDurationMs = 80) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (V) V.splashAt(x, y, { holdDurationMs });
    else if (S?.isWaterAt?.(x, y)) S.splashAt(x, y, { holdDurationMs });
  },
  closeOverlays() { Ge(); _i(false); Kt(false); Vt(); },
};
