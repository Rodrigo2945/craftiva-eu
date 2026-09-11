import{c as t,u as n,j as e,m as c,U as r,G as l}from"./index-oa33Ll4J.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],d=t("briefcase",o);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],m=t("circle-check-big",x);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],p=t("image",h);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]],g=t("scale",y);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],N=t("shield-alert",j);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],b=t("triangle-alert",k),w=()=>{const{t:a}=n(),i=[{id:"acceptance",icon:e.jsx(m,{className:"text-blue-500"})},{id:"platform_role",icon:e.jsx(g,{className:"text-emerald-500"})},{id:"accounts",icon:e.jsx(r,{className:"text-purple-500"})},{id:"user_content",icon:e.jsx(p,{className:"text-pink-500"})},{id:"prohibited",icon:e.jsx(b,{className:"text-red-500"})},{id:"liability",icon:e.jsx(N,{className:"text-orange-500"})},{id:"indemnification",icon:e.jsx(d,{className:"text-teal-500"})},{id:"governing_law",icon:e.jsx(l,{className:"text-indigo-500"})}];return e.jsxs("div",{className:"max-w-4xl mx-auto px-4 py-16",children:[e.jsxs(c.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"text-center mb-16",children:[e.jsx("h1",{className:"text-4xl font-black text-gray-900 mb-4 tracking-tight",children:a("terms.title")}),e.jsx("p",{className:"text-gray-500 font-medium",children:a("terms.lastUpdated")})]}),e.jsxs("div",{className:"prose prose-emerald max-w-none",children:[e.jsx("p",{className:"text-lg text-gray-600 mb-12 leading-relaxed",children:a("terms.intro")}),e.jsx("div",{className:"space-y-12",children:i.map(s=>e.jsxs(c.section,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0},className:"bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",children:[e.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center",children:s.icon}),e.jsx("h2",{className:"text-2xl font-bold text-gray-900 m-0",children:a(`terms.sections.${s.id}.title`)})]}),e.jsx("p",{className:"text-gray-600 leading-relaxed text-lg",children:a(`terms.sections.${s.id}.content`)})]},s.id))})]})]})};export{w as TermsPage};
