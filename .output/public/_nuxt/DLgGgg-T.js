import{z as b,r as w,l as m,_ as N,A as T,B as h,f as $,C as I,P as q,v as B,D as A,O as D,Q as H,R,o as E,c as J,a as Q,I as U,H as K,J as L,S as W}from"./D1rtcPht.js";import{u as X}from"./CKc1U0eb.js";import{u as Y}from"./NKDqDbzt.js";const Z={wrapper:"relative",base:"relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",form:"form-input",rounded:"rounded-md",placeholder:"placeholder-gray-400 dark:placeholder-gray-500",file:{base:"file:mr-1.5 file:font-medium file:text-gray-500 dark:file:text-gray-400 file:bg-transparent file:border-0 file:p-0 file:outline-none"},size:{"2xs":"text-xs",xs:"text-xs",sm:"text-sm",md:"text-sm",lg:"text-sm",xl:"text-base"},gap:{"2xs":"gap-x-1",xs:"gap-x-1.5",sm:"gap-x-1.5",md:"gap-x-2",lg:"gap-x-2.5",xl:"gap-x-2.5"},padding:{"2xs":"px-2 py-1",xs:"px-2.5 py-1.5",sm:"px-2.5 py-1.5",md:"px-3 py-2",lg:"px-3.5 py-2.5",xl:"px-3.5 py-2.5"},leading:{padding:{"2xs":"ps-7",xs:"ps-8",sm:"ps-9",md:"ps-10",lg:"ps-11",xl:"ps-12"}},trailing:{padding:{"2xs":"pe-7",xs:"pe-8",sm:"pe-9",md:"pe-10",lg:"pe-11",xl:"pe-12"}},color:{white:{outline:"shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"},gray:{outline:"shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"}},variant:{outline:"shadow-sm bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 focus:ring-2 focus:ring-{color}-500 dark:focus:ring-{color}-400",none:"bg-transparent focus:ring-0 focus:shadow-none"},icon:{base:"flex-shrink-0 text-gray-400 dark:text-gray-500",color:"text-{color}-500 dark:text-{color}-400",loading:"animate-spin",size:{"2xs":"h-4 w-4",xs:"h-4 w-4",sm:"h-5 w-5",md:"h-5 w-5",lg:"h-5 w-5",xl:"h-6 w-6"},leading:{wrapper:"absolute inset-y-0 start-0 flex items-center",pointer:"pointer-events-none",padding:{"2xs":"px-2",xs:"px-2.5",sm:"px-2.5",md:"px-3",lg:"px-3.5",xl:"px-3.5"}},trailing:{wrapper:"absolute inset-y-0 end-0 flex items-center",pointer:"pointer-events-none",padding:{"2xs":"px-2",xs:"px-2.5",sm:"px-2.5",md:"px-3",lg:"px-3.5",xl:"px-3.5"}}},default:{size:"sm",color:"white",variant:"outline",loadingIcon:"i-heroicons-arrow-path-20-solid"}},_={...Z,form:"form-textarea",default:{size:"sm",color:"white",variant:"outline"}},G=(e,l)=>{const n=b("form-events",void 0),a=b("form-group",void 0),u=b("form-inputs",void 0);a&&(e!=null&&e.id&&(a.inputId.value=e==null?void 0:e.id),u&&(u.value[a.name.value]=a.inputId.value));const g=w(!1);function i(r,s){n&&n.emit({type:r,path:s})}function c(){i("blur",a==null?void 0:a.name.value),g.value=!0}function f(){i("change",a==null?void 0:a.name.value)}const y=Y(()=>{(g.value||a!=null&&a.eagerValidation.value)&&i("input",a==null?void 0:a.name.value)},300);return{inputId:m(()=>(e==null?void 0:e.id)??(a==null?void 0:a.inputId.value)),name:m(()=>(e==null?void 0:e.name)??(a==null?void 0:a.name.value)),size:m(()=>{var s;const r=l.size[a==null?void 0:a.size.value]?a==null?void 0:a.size.value:null;return(e==null?void 0:e.size)??r??((s=l==null?void 0:l.default)==null?void 0:s.size)}),color:m(()=>{var r;return(r=a==null?void 0:a.error)!=null&&r.value?"red":e==null?void 0:e.color}),emitFormBlur:c,emitFormInput:y,emitFormChange:f}},d=T(h.ui.strategy,h.ui.textarea,_),P=$({inheritAttrs:!1,props:{modelValue:{type:[String,Number],default:""},id:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rows:{type:Number,default:3},maxrows:{type:Number,default:0},autoresize:{type:Boolean,default:!1},autofocus:{type:Boolean,default:!1},autofocusDelay:{type:Number,default:100},resize:{type:Boolean,default:!1},padded:{type:Boolean,default:!0},size:{type:String,default:null,validator(e){return Object.keys(d.size).includes(e)}},color:{type:String,default:()=>d.default.color,validator(e){return[...h.ui.colors,...Object.keys(d.color)].includes(e)}},variant:{type:String,default:()=>d.default.variant,validator(e){return[...Object.keys(d.variant),...Object.values(d.color).flatMap(l=>Object.keys(l))].includes(e)}},textareaClass:{type:String,default:null},class:{type:[String,Object,Array],default:()=>""},ui:{type:Object,default:()=>({})},modelModifiers:{type:Object,default:()=>({})}},emits:["update:modelValue","blur","change"],setup(e,{emit:l}){const{ui:n,attrs:a}=X("textarea",I(e,"ui"),d,I(e,"class")),{emitFormBlur:u,emitFormInput:g,inputId:i,color:c,size:f,name:y}=G(e,d),r=w(q({},e.modelModifiers,{trim:!1,lazy:!1,number:!1})),s=w(null),z=()=>{var t;e.autofocus&&((t=s.value)==null||t.focus())},v=()=>{if(e.autoresize){if(!s.value)return;s.value.rows=e.rows;const t=window.getComputedStyle(s.value),o=parseInt(t.paddingTop),x=parseInt(t.paddingBottom),O=o+x,M=parseInt(t.lineHeight),{scrollHeight:V}=s.value,p=(V-O)/M;p>e.rows&&(s.value.rows=e.maxrows?Math.min(p,e.maxrows):p)}},k=t=>{r.value.trim&&(t=t.trim()),r.value.number&&(t=W(t)),l("update:modelValue",t),g()},C=t=>{v(),r.value.lazy||k(t.target.value)},S=t=>{const o=t.target.value;l("change",o),r.value.lazy&&k(o),r.value.trim&&(t.target.value=o.trim())},j=t=>{l("blur",t),u()};B(()=>{setTimeout(()=>{z()},e.autofocusDelay)}),A(()=>e.modelValue,()=>{D(v)}),B(()=>{setTimeout(()=>{z(),v()},100)});const F=m(()=>{var o,x;const t=((x=(o=n.value.color)==null?void 0:o[c.value])==null?void 0:x[e.variant])||n.value.variant[e.variant];return H(R(n.value.base,n.value.form,n.value.rounded,n.value.placeholder,n.value.size[f.value],e.padded?n.value.padding[f.value]:"p-0",t==null?void 0:t.replaceAll("{color}",c.value),!e.resize&&"resize-none"),e.textareaClass)});return{ui:n,attrs:a,name:y,inputId:i,textarea:s,textareaClass:F,onInput:C,onChange:S,onBlur:j}}}),ee=["id","value","name","rows","required","disabled","placeholder"];function ae(e,l,n,a,u,g){return E(),J("div",{class:L(e.ui.wrapper)},[Q("textarea",U({id:e.inputId,ref:"textarea",value:e.modelValue,name:e.name,rows:e.rows,required:e.required,disabled:e.disabled,placeholder:e.placeholder,class:e.textareaClass},e.attrs,{onInput:l[0]||(l[0]=(...i)=>e.onInput&&e.onInput(...i)),onBlur:l[1]||(l[1]=(...i)=>e.onBlur&&e.onBlur(...i)),onChange:l[2]||(l[2]=(...i)=>e.onChange&&e.onChange(...i))}),null,16,ee),K(e.$slots,"default")],2)}const re=N(P,[["render",ae]]);export{re as _};