import{l as t,a4 as a}from"./D1rtcPht.js";function n(){return globalThis.$fetch}const s=()=>a("nuxt-session",()=>({}));function i(){const e=s();return{loggedIn:t(()=>!!e.value.user),user:t(()=>e.value.user||null),session:e,fetch:u,clear:o}}async function u(){s().value=await n()("/api/_auth/session",{headers:{Accept:"text/json"},retry:!1}).catch(()=>({}))}async function o(){await $fetch("/api/_auth/session",{method:"DELETE"}),s().value={}}export{i as u};
