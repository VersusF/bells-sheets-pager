import{n as c,s as g}from"./index.7ea565e8.js";const t=[];function q(n,u=c){let o;const i=new Set;function r(e){if(g(n,e)&&(n=e,o)){const b=!t.length;for(const s of i)s[1](),t.push(s,n);if(b){for(let s=0;s<t.length;s+=2)t[s][0](t[s+1]);t.length=0}}}function l(e){r(e(n))}function _(e,b=c){const s=[e,b];return i.add(s),i.size===1&&(o=u(r)||c),e(n),()=>{i.delete(s),i.size===0&&(o(),o=null)}}return{set:r,update:l,subscribe:_}}var a;const h=((a=globalThis.__sveltekit_1sqg9ax)==null?void 0:a.base)??"/bells-sheets-pager";var f;const d=((f=globalThis.__sveltekit_1sqg9ax)==null?void 0:f.assets)??h;export{d as a,h as b,q as w};