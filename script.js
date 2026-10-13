(function(){
var $=function(id){return document.getElementById(id)};
function hm(m){var t=330+m,h=Math.floor(t/60),mm=t%60;return h+":"+(mm<10?"0":"")+mm}
var d=new Date(),hr=d.getHours();
$("greet").textContent=(hr<12?"Good morning":hr<17?"Good afternoon":"Good evening")+", Gokul";
$("today").textContent=d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

/* Weather presets (sample) */
var WX={
 clear:{n:"Sunny",t:31,r:10,add:0,h:[["5 am",26],["6 am",27],["7 am",29],["8 am",31],["9 am",33]],a:"Dry road. Keep milk in the shade while you wait at the dairy."},
 cloud:{n:"Cloudy",t:29,r:35,add:3,h:[["5 am",25],["6 am",26],["7 am",27],["8 am",29],["9 am",30]],a:"Rain may start. Keep a plastic cover ready for the crates."},
 rain:{n:"Rain",t:26,r:80,add:11,h:[["5 am",24],["6 am",24],["7 am",25],["8 am",26],["9 am",26]],a:"Rain slows the round. Leave early and cover the crates."}
};
var wx="clear",q=20;
function est(){return 202+1.3*(q-20)+WX[wx].add}
function paint(){
 var tot=Math.round(est()),late=tot-180,w=WX[wx];
 $("qv").textContent=q;$("eta").textContent=hm(tot);
 var p=$("etaPill");
 if(late<=0){p.className="pill ok";p.textContent="On time"}
 else if(late<=15){p.className="pill warn";p.textContent=late+" min late"}
 else{p.className="pill bad";p.textContent=late+" min late"}
 $("etaTip").textContent=late<=0?"Good. Every home can get milk before 8:30.":"Each extra 10 min in the dairy queue pushes the finish about 13 min later.";
 $("wxTemp").textContent=w.t+"°";$("wxName").textContent=w.n;
 $("wxRain").textContent="Chance of rain: "+w.r+"%";$("wxAdvice").textContent=w.a;
 $("wxHours").innerHTML=w.h.map(function(x){return"<div>"+x[0]+"<b>"+x[1]+"°</b></div>"}).join("");
 document.querySelectorAll("#wxBtns button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.w===wx)});
}
$("queue").oninput=function(){q=+this.value;paint()};
document.querySelectorAll("#wxBtns button").forEach(function(b){b.onclick=function(){wx=b.dataset.w;paint()}});
paint();

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

/* Finish chart: totals of days 15-28 */
var T=[240,207,195,210,198,204,180,200,177,212,200,209,192,175],s="";
var lo=160,hi=250,H=190,top=20;
function yy(v){return top+H-(v-lo)/(hi-lo)*H}
T.forEach(function(v,i){var x=14+i*39,c=v<=180?"var(--green)":v<=195?"var(--amber)":"var(--red)",y=yy(v);
 s+='<rect x="'+x+'" y="'+y+'" width="30" height="'+(top+H-y)+'" rx="4" fill="'+c+'"/><text x="'+(x+15)+'" y="'+(y-4)+'" font-size="10" text-anchor="middle">'+hm(v)+'</text><text x="'+(x+15)+'" y="'+(top+H+16)+'" font-size="10" text-anchor="middle">'+(i+15)+'</text>'});
s+='<line x1="8" x2="552" y1="'+yy(180)+'" y2="'+yy(180)+'" stroke="var(--ink)" stroke-dasharray="5 4"/><text x="552" y="'+(yy(180)-5)+'" font-size="11" text-anchor="end" style="fill:var(--ink)">8:30 goal</text><text x="280" y="244" font-size="11" text-anchor="middle">Morning number</text>';
$("finChart").innerHTML=s;

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
})();