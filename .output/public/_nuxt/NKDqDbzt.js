import{r as h,M as y,D as S,a9 as j,a7 as w,h as T}from"./D1rtcPht.js";function p(e){return j()?(w(e),!0):!1}function f(e){return typeof e=="function"?e():T(e)}const m=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const D=Object.prototype.toString,v=e=>D.call(e)==="[object Object]",d=()=>{};function O(e,n){function o(...t){return new Promise((s,i)=>{Promise.resolve(e(()=>n.apply(this,t),{fn:n,thisArg:this,args:t})).then(s).catch(i)})}return o}function W(e,n={}){let o,t,s=d;const i=r=>{clearTimeout(r),s(),s=d};return r=>{const l=f(e),u=f(n.maxWait);return o&&i(o),l<=0||u!==void 0&&u<=0?(t&&(i(t),t=null),Promise.resolve(r())):new Promise((a,b)=>{s=n.rejectOnCancel?b:a,u&&!t&&(t=setTimeout(()=>{o&&i(o),t=null,a(r())},u)),o=setTimeout(()=>{t&&i(t),t=null,a(r())},l)})}}function x(e,n=200,o={}){return O(W(n,o),e)}function C(e,n=1e3,o={}){const{immediate:t=!0,immediateCallback:s=!1}=o;let i=null;const c=h(!1);function r(){i&&(clearInterval(i),i=null)}function l(){c.value=!1,r()}function u(){const a=f(n);a<=0||(c.value=!0,s&&e(),r(),i=setInterval(e,a))}if(t&&m&&u(),y(n)||typeof n=="function"){const a=S(n,()=>{c.value&&m&&u()});p(a)}return p(l),{isActive:c,pause:l,resume:u}}export{p as a,m as b,C as c,v as i,d as n,f as t,x as u};