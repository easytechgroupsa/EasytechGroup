"use strict";(self.webpackChunkaem_maven_archetype=self.webpackChunkaem_maven_archetype||[]).push([[7882],{9393:function(e,t,n){n.r(t),n.d(t,{default:function(){return o}});var c=n(8447);class o{constructor(e){this.el=e,this.linkAccordionBarInit()}linkAccordionBarInit(){(0,c.e)(this.el,".accordion-gradient .row","null",!1)}}},8447:function(e,t,n){n.d(t,{e:function(){return c}});let c=(e,t=".cmp-accordion__item",n=".cmp-accordion__header",c=!0,o=!1)=>{let i,r,l,a;i=e.querySelectorAll(t),i.forEach(((e,t)=>{l=`bg-gradient-steps-${1===i.length?0:Math.round(t/(i.length-1)*100)}`,"null"==n?e.classList.add(l):(r=e.querySelector(n),r?.classList.add(l)),c&&r?.addEventListener("click",(e=>{const t=e.currentTarget;a=o?(r.clientHeight-$(r).height())/2:2,setTimeout((function(){let e=0,n=document.querySelector(".dotcom-bluebar")?.getBoundingClientRect().height||0;e=n+(document.querySelector(".cog-inpage-navigation__sticky")?.getBoundingClientRect().height||0);const c=document.querySelector(".dotcom-bluebar.sticky-is-stuck")?0:n,o=t.getBoundingClientRect().top+window.pageYOffset-e-a-c;window.scrollTo({top:o,behavior:"smooth"})}),500)}))}))}}}]);