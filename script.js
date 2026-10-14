(function(){
var $=function(id){return document.getElementById(id)};
function hm(m){var t=330+m,h=Math.floor(t/60),mm=t%60;return h+":"+(mm<10?"0":"")+mm}
var d=new Date(),hr=d.getHours();
$("greet").textContent=(hr<12?"Good morning":hr<17?"Good afternoon":"Good evening")+", Gokul";
$("today").textContent=d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

/* Routes */
var R=[{n:"Route A",s:"Homes 1 to 18",t:18,d:0},{n:"Route B",s:"Homes 19 to 38",t:20,d:0},{n:"Route C",s:"Homes 39 to 52 (most late homes are here)",t:14,d:0}];
function routes(){
 $("routes").innerHTML=R.map(function(r,i){return'<div class="route"><div><b>'+r.n+'</b><div class="small">'+r.s+'</div><div class="bar"><i style="width:'+(r.d/r.t*100)+'%;background:var(--green)"></i></div></div><div class="step"><button data-i="'+i+'" data-k="-1" aria-label="'+r.n+' one less">−</button><output>'+r.d+'/'+r.t+'</output><button data-i="'+i+'" data-k="1" aria-label="'+r.n+' one more">+</button></div></div>'}).join("");
 var n=R.reduce(function(a,r){return a+r.d},0);
 $("allTxt").textContent=n+" of 52 homes delivered";$("allPct").textContent=Math.round(n/52*100)+"%";
 $("allBar").style.width=(n/52*100)+"%";
}
$("routes").onclick=function(e){var b=e.target.closest("button");if(!b)return;var r=R[+b.dataset.i];r.d=Math.max(0,Math.min(r.t,r.d+ +b.dataset.k));routes()};
routes();

/* KPIs: [label, value, goal text, pct of goal 0-100, status, plain meaning] */
var K=[
 ["Homes served by 8:30","78%","Goal: 98%",78/98*100,"bad","About 12 homes get milk late each day"],
 ["Mornings finished on time","3 of 28","Goal: every morning",11,"bad","Only 3 mornings met the 8:30 goal"],
 ["Milk gone sour","1.8%","Goal: 0.3% or less",17,"bad","42 litres a month are wasted"],
 ["Clean bottles","65%","Goal: 98%",65/98*100,"bad","14 of 40 checked bottles were not clean"],
 ["Complaints this month","30","Goal: 8 or fewer",27,"bad","More than half are about late milk"],
 ["Homes getting milk","52","Goal: 70 again",52/70*100,"warn","18 homes left in 12 months"],
 ["Monthly profit","Rs 11,700","Was Rs 15,750",74,"warn","Down 25.7% in a year"]
];
var ST={ok:["ok","Good"],warn:["warn","Needs work"],bad:["bad","Needs attention"]};
var col={ok:"var(--green)",warn:"var(--amber)",bad:"var(--red)"};
$("kpis").innerHTML=K.map(function(k){return'<div class="card kpi"><div class="l">'+k[0]+'</div><div class="v">'+k[1]+'</div><div class="bar" role="img" aria-label="'+Math.round(k[3])+' percent of the goal"><i style="width:'+k[3]+'%;background:'+col[k[4]]+'"></i></div><div class="small">'+k[2]+'</div><p style="margin:8px 0">'+k[5]+'</p><span class="pill '+ST[k[4]][0]+'">'+ST[k[4]][1]+'</span></div>'}).join("");

/* Trend chart */
var HH=[70,69,67,66,64,62,60,58,56,55,53,52],CC=[12,13,14,15,17,19,20,22,24,26,28,30];
function line(a,mn,mx,c,dash){return'<polyline fill="none" stroke="'+c+'" stroke-width="3" '+(dash?'stroke-dasharray="6 4" ':'')+'points="'+a.map(function(v,i){return(40+i*44)+","+(200-(v-mn)/(mx-mn)*170)}).join(" ")+'"/>'}
var t=line(HH,45,75,"var(--green)")+line(CC,5,35,"var(--red)",1);
for(var i=0;i<12;i++)t+='<text x="'+(40+i*44)+'" y="222" font-size="10" text-anchor="middle">'+(i+1)+'</text>';
t+='<text x="40" y="'+(200-(70-45)/30*170-8)+'" font-size="11" style="fill:var(--green);font-weight:700">70 homes</text><text x="524" y="'+(200-(52-45)/30*170+20)+'" font-size="11" text-anchor="end" style="fill:var(--green);font-weight:700">52 homes</text><text x="40" y="'+(200-(12-5)/30*170-8)+'" font-size="11" style="fill:var(--red);font-weight:700">12 complaints</text><text x="524" y="'+(200-(30-5)/30*170-8)+'" font-size="11" text-anchor="end" style="fill:var(--red);font-weight:700">30 complaints</text><text x="280" y="244" font-size="11" text-anchor="middle">Month (solid green: homes, dashed red: complaints)</text>';
$("trChart").innerHTML=t;

/* Bottle check */
var bc=0,bd=0;
function bottles(){var n=bc+bd;$("bTxt").textContent=n+" of 10 checked";
 $("bBar").style.width=(n*10)+"%";
 $("bBar").style.background=bd?"var(--amber)":"var(--green)";
 $("bClean").disabled=$("bDirty").disabled=n>=10;
 $("bRes").textContent=n<10?(bd?bd+" dirty so far. Wash these again before use.":"Goal: 98% clean. Now: 65%."):(bd===0?"All 10 clean. Well done.":bd+" of 10 bottles were dirty ("+(100-bd*10)+"% clean). Wash them again before use.")}
$("bClean").onclick=function(){if(bc+bd<10){bc++;bottles()}};
$("bDirty").onclick=function(){if(bc+bd<10){bd++;bottles()}};
$("bReset").onclick=function(){bc=bd=0;bottles()};

/* Spoilage */
var sp=0;
function spoil(){$("spV").textContent=sp+" L";$("spLoss").textContent="Loss today: Rs "+(sp*50).toLocaleString("en-IN")}
$("spP").onclick=function(){sp++;spoil()};
$("spM").onclick=function(){sp=Math.max(0,sp-1);spoil()};

/* Complaints */
var C=[["Late milk",0],["Dirty bottle",0],["Sour milk",0],["Missed home",0]];
function comp(){
 $("cpBtns").innerHTML=C.map(function(c,i){return'<button data-i="'+i+'">'+c[0]+' <b>'+c[1]+'</b></button>'}).join("");
 var n=C.reduce(function(a,c){return a+c[1]},0);
 $("cpTxt").textContent=n?n+" complaint"+(n>1?"s":"")+" today. Replace the milk today to keep the customer.":"No complaints yet today."}
$("cpBtns").onclick=function(e){var b=e.target.closest("button");if(!b)return;C[+b.dataset.i][1]++;comp()};
comp();
/* Navigation */
var pages={A:$("pgA"),B:$("pgB")};
function show(p){for(var k in pages)pages[k].hidden=k!==p;document.querySelectorAll(".side [data-p]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.p===p)});try{history.replaceState(null,"",p==="B"?"#plan":"#history")}catch(e){}window.scrollTo(0,0)}
document.querySelectorAll(".side [data-p]").forEach(function(b){b.onclick=function(){show(b.dataset.p)}});

/* Daily log: last 28 mornings */
var Q=[28,22,13,19,18,19,24,13,27,13,20,25,25,16,33,22,15,20,16,23,12,24,9,27,23,29,16,9],
TOT=[221,200,194,207,205,199,199,208,202,201,207,209,204,201,240,207,195,210,198,204,180,200,177,212,200,209,192,175],
TMP=[29.6,28.0,28.2,28.6,28.6,27.5,27.8,28.7,27.8,27.7,29.1,28.4,28.1,27.6,30.5,29.1,27.1,28.2,27.8,27.6,26.2,27.8,26.3,28.6,27.9,28.2,26.6,26.4],
SP=[3,1,1,2,2,1,1,2,1,1,2,1,1,1,4,2,1,1,1,1,1,1,1,2,1,1,1,1],RAIN=[0,2,3,4,10,14,15,18];
function mean(a){return a.reduce(function(x,y){return x+y},0)/a.length}
function pick(a,ix){return ix.map(function(i){return a[i]})}
function where(f){var r=[];TOT.forEach(function(_,i){if(f(i))r.push(i)});return r}
var onT=TOT.filter(function(v){return v<=180}).length;
$("finSub").textContent="Only "+onT+" of 28 mornings finished by 8:30. The average finish was "+hm(Math.round(mean(TOT)))+".";
(function(){var s="",lo=160,hi=250,H=190,top=20;function yy(v){return top+H-(v-lo)/(hi-lo)*H}
TOT.forEach(function(v,i){var x=18+i*38,c=v<=180?"var(--green)":v<=195?"var(--amber)":"var(--red)",y=yy(v);
s+='<rect x="'+x+'" y="'+y+'" width="28" height="'+(top+H-y)+'" rx="5" fill="'+c+'"/><text x="'+(x+14)+'" y="'+(top+H+18)+'" font-size="13" text-anchor="middle">'+(i+1)+'</text>'+(v>=235||v<=177?'<text x="'+(x+14)+'" y="'+(y-5)+'" font-size="13" text-anchor="middle" style="fill:var(--ink)">'+hm(v)+'</text>':'')});
s+='<line x1="8" x2="1092" y1="'+yy(180)+'" y2="'+yy(180)+'" stroke="var(--ink)" stroke-dasharray="6 5"/><text x="1092" y="'+(yy(180)-6)+'" font-size="14" text-anchor="end" style="fill:var(--ink)">8:30 goal</text><text x="550" y="262" font-size="14" text-anchor="middle">Morning number. Green: on time. Amber: up to 15 min late. Red: later.</text>';
$("finChart").innerHTML=s})();
function bars(id,items,max){$(id).innerHTML=items.map(function(i){return'<div class="br"><span>'+i.l+'</span><div><div class="bar" style="margin:0 0 3px"><i style="width:'+Math.max(2,i.v/max*100)+'%;background:'+i.c+'"></i></div><span class="small">'+i.t+'</span></div></div>'}).join("")}
function lateItem(l,ix){var m=mean(pick(TOT,ix)),late=Math.round(m-180);return{l:l,v:Math.max(late,0),c:late<=0?"var(--green)":late<=20?"var(--amber)":"var(--red)",t:"Finish "+hm(Math.round(m))+", "+late+" min late ("+ix.length+" mornings)"}}
var rainIx=RAIN,dryIx=where(function(i){return RAIN.indexOf(i)<0});
$("bQueue").innerHTML='<p class="small" style="margin:10px 0 0"><b>By dairy queue</b></p>';
bars("bQueue2",[lateItem("Short queue (under 16 min)",where(function(i){return Q[i]<16})),lateItem("Medium (16 to 24 min)",where(function(i){return Q[i]>=16&&Q[i]<25})),lateItem("Long (25 min or more)",where(function(i){return Q[i]>=25}))],60);
bars("bWx",[lateItem("Dry mornings",dryIx),lateItem("Rainy mornings",rainIx)],60);
bars("bRoute",[{l:"Route A, homes 1 to 18",v:0,c:"var(--green)",t:"0% of late homes"},{l:"Route B, homes 19 to 38",v:7,c:"var(--amber)",t:"7% of late homes"},{l:"Route C, homes 39 to 52",v:93,c:"var(--red)",t:"93% of late homes, about 11 each morning"}],100);
function tb(l,f){var ix=where(function(i){return f(TMP[i])}),m=mean(pick(SP,ix));return{l:l,v:m,c:m<=1?"var(--green)":m<=2?"var(--amber)":"var(--red)",t:ix.length+" mornings, "+m.toFixed(1)+" L spoiled each"}}
bars("bTemp",[tb("Under 27.5 °C",function(t){return t<27.5}),tb("27.5 to 28.4 °C",function(t){return t>=27.5&&t<28.5}),tb("28.5 to 29.4 °C",function(t){return t>=28.5&&t<29.5}),tb("29.5 °C or more",function(t){return t>=29.5})],4);
function cmp(a,tot,suf){return a.map(function(x,i){return{l:x[1],v:x[0],c:i?"var(--amber)":"var(--red)",t:x[0]+" ("+Math.round(x[0]/tot*100)+"% "+suf+")"}})}
bars("bComp",cmp([[17,"Late delivery"],[6,"Unclean bottle"],[5,"Sour or spoiled milk"],[2,"Missed delivery"]],30,"of 30 a month"),17);
bars("bBot",cmp([[6,"Milk residue inside"],[4,"Sour odour"],[3,"Dirty cap or seal"],[1,"Stain or crack"]],14,"of 14 failed"),6);

/* Planner for tomorrow */
var WX={clear:{a:0,n:"Sunny, 31°, rain chance 10%"},cloud:{a:3,n:"Cloudy, 29°, rain chance 35%"},rain:{a:11,n:"Rain, 26°, rain chance 80%"}},P={w:"clear",q:20,h:52,L:330},bestL=300,done={},cur=[];
function T(m){m=Math.round(m);var h=Math.floor(m/60),mm=m%60;return h+":"+(mm<10?"0":"")+mm}
var CK=["Wash, rinse and sanitise all delivery bottles","Check 10 bottles: all clean","Fuel the rickshaw","Insulated cover and crates ready","Customer list in route order","Cash and record sheet ready","Call the dairy about tomorrow's queue","Rain cover for the crates"];
function prog(){var n=cur.filter(function(t){return done[t]}).length;$("ckBar").style.width=n/cur.length*100+"%";$("ckTxt").textContent=n+" of "+cur.length+" ready"+(n===cur.length?". All set for tomorrow.":"")}
function ckr(){cur=CK.filter(function(t){return t.indexOf("Rain")<0||P.w!=="clear"});$("ck").innerHTML=cur.map(function(t){return'<label><input type="checkbox"'+(done[t]?" checked":"")+'> <span>'+t+'</span></label>'}).join("");prog()}
$("ck").onchange=function(e){done[e.target.nextElementSibling.textContent]=e.target.checked;prog()};
function plan(){
var w=WX[P.w],del=Math.round(102*P.h/52)+w.a,arr=P.L+65,st=Math.max(arr,360),ds=st+P.q+15,fin=ds+del,late=fin-510;
bestL=Math.max(240,Math.floor((510-(P.q+15+del)-65)/5)*5);
$("pqv").textContent=P.q;$("hV").textContent=P.h;$("lV").textContent=T(P.L);
$("pWn").textContent="Sample forecast: "+w.n+(w.a?". Adds about "+w.a+" min to the round.":". No extra time.");
document.querySelectorAll("#pW button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.w===P.w)});
$("pEta").textContent=T(fin);var p=$("pPill");p.className="pill "+(late<=0?"ok":late<=15?"warn":"bad");p.textContent=late<=0?"On time":late+" min late";
$("pTip").textContent=late<=0?"Good. You finish "+(-late)+" min before the 8:30 goal.":"To finish by 8:30, leave home by "+T(bestL)+".";
var lit=P.h*1.5,ot=Math.max(0,Math.min(P.h,Math.round(P.h*(510-ds)/del))),tmp=28+0.067*(fin-P.L-202);
$("cOn").textContent=ot+" of "+P.h;$("cMilk").textContent=lit+" L";$("cMar").textContent="Rs "+Math.round(lit*5).toLocaleString("en-IN");
$("cSp").textContent=tmp<28.5?"Normal, about 1 L":tmp<29.5?"High, about 2 L":"Very high, 3 L or more";
var S=[["Leave home",P.L,""],["First pickup",P.L+10,"10 min"],["Collection done",P.L+55,"45 min, about 25 homes"],["At the dairy",arr,arr<360?"Dairy opens at 6:00, wait "+(360-arr)+" min":"10 min drive"],["Milk handed over",st+P.q,P.q+" min queue and test"],["Loaded, start delivery",ds,"15 min"],["Last home delivered",fin,del+" min for "+P.h+" homes"]];
$("tt").innerHTML=S.map(function(r){return'<div class="tr"><b>'+T(r[1])+'</b><span>'+r[0]+'</span><span class="small">'+r[2]+'</span></div>'}).join("");
$("wi").innerHTML=[10,20,30].map(function(q){var f=st+q+15+del,l=f-510;return'<div class="chip"'+(q===P.q?' style="outline:3px solid var(--blue)"':'')+'><span class="small">Queue '+q+' min</span><b>'+T(f)+'</b><span class="small">'+(l<=0?"On time":l+" min late")+'</span></div>'}).join("")}
document.querySelectorAll("#pW button").forEach(function(b){b.onclick=function(){P.w=b.dataset.w;plan();ckr()}});
$("pq").oninput=function(){P.q=+this.value;plan()};
$("hM").onclick=function(){P.h=Math.max(20,P.h-1);plan()};$("hP").onclick=function(){P.h=Math.min(90,P.h+1);plan()};
$("lM").onclick=function(){P.L=Math.max(240,P.L-5);plan()};$("lP").onclick=function(){P.L=Math.min(420,P.L+5);plan()};
$("pBest").onclick=function(){P.L=bestL;plan()};
plan();ckr();show(location.hash==="#plan"?"B":"A");
})();