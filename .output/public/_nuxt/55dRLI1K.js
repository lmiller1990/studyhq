import{_ as i}from"./DPNhhfcq.js";import{_}from"./WJeJSOQ5.js";import{f as p,k as u,j as l,l as d,o as f,g as x,w as h,a as s,b as g,d as w}from"./D1rtcPht.js";import{u as C}from"./cJH77P2W.js";import"./Dk2mhVY2.js";import"./CAZilBRX.js";import"./CKc1U0eb.js";import"./DvDH6DOc.js";const N={class:"flex flex-col justify-center items-center mt-48"},b=p({__name:"grading",async setup(k){let e,o;const n=u().params.id,{data:r}=([e,o]=l(()=>C(`/api/exams/:${n}`,"$R536Ng7IOm")),e=await e,o(),e);return d(()=>{var t;return(((t=r.value)==null?void 0:t.questions)??[]).map(a=>({question:a,answer:""}))}),(t,a)=>{const c=i,m=_;return f(),x(m,null,{default:h(()=>[s("div",N,[s("p",null,[g(c,{name:"i-heroicons-arrow-path",class:"animate-spin"}),w(" Grading in progress ... ")])])]),_:1})}}});export{b as default};
