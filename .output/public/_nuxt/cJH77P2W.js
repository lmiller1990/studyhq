import{h as R}from"./DvDH6DOc.js";import{a5 as B,r as w,Z as F,C as T,a6 as j,x as M,D as S,a7 as O,a2 as U,a8 as $,h as x,a0 as z,a9 as H,l as L,aa as h,X as q,ab as K}from"./D1rtcPht.js";const N=s=>s==="defer"||s===!1;function G(...s){var _;const n=typeof s[s.length-1]=="string"?s.pop():void 0;typeof s[0]!="string"&&s.unshift(n);let[t,i,a={}]=s;if(typeof t!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof i!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");const e=U(),u=i,m=()=>null,g=()=>e.isHydrating?e.payload.data[t]:e.static.data[t];a.server=a.server??!0,a.default=a.default??m,a.getCachedData=a.getCachedData??g,a.lazy=a.lazy??!1,a.immediate=a.immediate??!0,a.deep=a.deep??B.deep,a.dedupe=a.dedupe??"cancel";const p=()=>a.getCachedData(t,e)!=null;if(!e._asyncData[t]||!a.immediate){(_=e.payload._errors)[t]??(_[t]=null);const c=a.deep?w:F;e._asyncData[t]={data:c(a.getCachedData(t,e)??a.default()),pending:w(!p()),error:T(e.payload._errors,t),status:w("idle")}}const r={...e._asyncData[t]};r.refresh=r.execute=(c={})=>{if(e._asyncDataPromises[t]){if(N(c.dedupe??a.dedupe))return e._asyncDataPromises[t];e._asyncDataPromises[t].cancelled=!0}if((c._initial||e.isHydrating&&c._initial!==!1)&&p())return Promise.resolve(a.getCachedData(t,e));r.pending.value=!0,r.status.value="pending";const f=new Promise((l,o)=>{try{l(u(e))}catch(y){o(y)}}).then(async l=>{if(f.cancelled)return e._asyncDataPromises[t];let o=l;a.transform&&(o=await a.transform(l)),a.pick&&(o=V(o,a.pick)),e.payload.data[t]=o,r.data.value=o,r.error.value=null,r.status.value="success"}).catch(l=>{if(f.cancelled)return e._asyncDataPromises[t];r.error.value=$(l),r.data.value=x(a.default()),r.status.value="error"}).finally(()=>{f.cancelled||(r.pending.value=!1,delete e._asyncDataPromises[t])});return e._asyncDataPromises[t]=f,e._asyncDataPromises[t]},r.clear=()=>I(e,t);const v=()=>r.refresh({_initial:!0}),b=a.server!==!1&&e.payload.serverRendered;{const c=z();if(c&&!c._nuxtOnBeforeMountCbs){c._nuxtOnBeforeMountCbs=[];const o=c._nuxtOnBeforeMountCbs;j(()=>{o.forEach(y=>{y()}),o.splice(0,o.length)}),M(()=>o.splice(0,o.length))}b&&e.isHydrating&&(r.error.value||p())?(r.pending.value=!1,r.status.value=r.error.value?"error":"success"):c&&(e.payload.serverRendered&&e.isHydrating||a.lazy)&&a.immediate?c._nuxtOnBeforeMountCbs.push(v):a.immediate&&v();const f=H();if(a.watch){const o=S(a.watch,()=>r.refresh());f&&O(o)}const l=e.hook("app:data:refresh",async o=>{(!o||o.includes(t))&&await r.refresh()});f&&O(l)}const D=Promise.resolve(e._asyncDataPromises[t]).then(()=>r);return Object.assign(D,r),D}function I(s,n){n in s.payload.data&&(s.payload.data[n]=void 0),n in s.payload._errors&&(s.payload._errors[n]=null),s._asyncData[n]&&(s._asyncData[n].data.value=void 0,s._asyncData[n].error.value=null,s._asyncData[n].pending.value=!1,s._asyncData[n].status.value="idle"),n in s._asyncDataPromises&&(s._asyncDataPromises[n].cancelled=!0,s._asyncDataPromises[n]=void 0)}function V(s,n){const t={};for(const i of n)t[i]=s[i];return t}function Y(s,n,t){const[i={},a]=typeof n=="string"?[{},n]:[n,t],e=L(()=>h(s)),u=i.key||R([a,typeof e.value=="string"?e.value:"",...X(i)]);if(!u||typeof u!="string")throw new TypeError("[nuxt] [useFetch] key must be a string: "+u);if(!s)throw new Error("[nuxt] [useFetch] request is missing.");const m=u===a?"$f"+u:u;if(!i.baseURL&&typeof e.value=="string"&&e.value[0]==="/"&&e.value[1]==="/")throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');const{server:g,lazy:p,default:r,transform:v,pick:b,watch:D,immediate:_,getCachedData:c,deep:f,dedupe:l,...o}=i,y=q({...K,...o,cache:typeof i.cache=="boolean"?void 0:i.cache}),E={server:g,lazy:p,default:r,transform:v,pick:b,immediate:_,getCachedData:c,deep:f,dedupe:l,watch:D===!1?[]:[y,e,...D||[]]};let d;return G(m,()=>{var P;(P=d==null?void 0:d.abort)==null||P.call(d),d=typeof AbortController<"u"?new AbortController:{};const C=h(i.timeout);return C&&setTimeout(()=>d.abort(),C),(i.$fetch||globalThis.$fetch)(e.value,{signal:d.signal,...y})},E)}function X(s){var t;const n=[((t=h(s.method))==null?void 0:t.toUpperCase())||"GET",h(s.baseURL)];for(const i of[s.params||s.query]){const a=h(i);if(!a)continue;const e={};for(const[u,m]of Object.entries(a))e[h(u)]=h(m);n.push(e)}return n}export{Y as u};
