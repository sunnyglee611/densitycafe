'use strict';
const ITEMS=[
 {id:'honey',name:'꿀',rho:1.42,color:'#db9638'},
 {id:'syrup',name:'물엿',rho:1.33,color:'#e7b36d'},
 {id:'glycerin',name:'글리세린',rho:1.26,color:'#d5d5ea'},
 {id:'fruit',name:'과일 시럽',rho:1.20,color:'#d96385'},
 {id:'milk',name:'우유',rho:1.03,color:'#f2eee0'},
 {id:'water',name:'물',rho:1.00,color:'#80c3ec'},
 {id:'oil',name:'식용유',rho:0.92,color:'#eee07e'},
 {id:'ethanol',name:'에탄올',rho:0.79,color:'#9db5d7'}
];
const $=id=>document.getElementById(id);
let team='1',chosen=[],rendered=false;
const safeRead=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const key=()=>`densitycafe_free_team_${team}_v1`;
function saveState(){try{localStorage.setItem(key(),JSON.stringify({selected:chosen.map(i=>i.id),drinkName:$('drinkName').value,teamName:$('teamName').value,drinkIdea:$('drinkIdea').value}))}catch{}$('saveStatus').textContent=`${team}조 · 이 브라우저에 기록됨`}
function restore(){const d=safeRead(key())||{};chosen=(Array.isArray(d.selected)?d.selected:[]).map(id=>ITEMS.find(i=>i.id===id)).filter(Boolean).slice(0,6);$('drinkName').value=d.drinkName||'';$('teamName').value=d.teamName||'';$('drinkIdea').value=d.drinkIdea||'';rendered=false;render();paintPoster();$('reportText').textContent='이 조의 재료와 입력 내용이 복원되었습니다. 포스터 만들기를 눌러 탐구 내용을 확인하세요.'}
function order(){return [...chosen].sort((a,b)=>b.rho-a.rho)}
function render(){const host=$('ingredients');host.replaceChildren();for(const it of ITEMS){const b=document.createElement('button');b.type='button';b.className='ingredient';b.disabled=chosen.length>=6;const c=document.createElement('span');c.className='swatch';c.style.background=it.color;const n=document.createElement('span');n.className='name';n.textContent=it.name;const s=document.createElement('small');s.textContent=`${it.rho.toFixed(2)} g/mL`;n.append(s);b.append(c,n);b.onclick=()=>{chosen.push(it);rendered=false;render();paintPoster();saveState()};host.append(b)}
 const stack=order(),layers=$('layers');layers.replaceChildren();for(const item of stack){const div=document.createElement('div');div.className='layer';div.style.height=`${100/Math.max(chosen.length,6)}%`;div.style.background=item.color;div.textContent=item.name;layers.append(div)}
 $('volume').textContent=`${chosen.length} / 6 재료`;$('visualHint').textContent=chosen.length?'높은 밀도 → 아래쪽':'컵을 채워 보세요';$('recipe').textContent=stack.length?stack.map((i,n)=>`${n+1}. ${i.name} (${i.rho.toFixed(2)} g/mL)`).join('  ↓  '):'재료를 선택하면 밀도가 큰 순서대로 표시됩니다.';
 $('scienceTip').textContent=stack.length>1?`선택한 재료 중 가장 밀도가 큰 ${stack[0].name}(${stack[0].rho.toFixed(2)} g/mL)은 아래쪽, 가장 작은 ${stack.at(-1).name}(${stack.at(-1).rho.toFixed(2)} g/mL)은 위쪽에 표시돼요. 실제로는 서로 섞일 수도 있습니다.`:'같은 부피라면 밀도가 큰 물질의 질량이 더 큽니다. 여기서는 밀도가 큰 재료를 아래에 배열합니다.';
 $('undo').disabled=!chosen.length;$('clear').disabled=!chosen.length;$('create').disabled=!chosen.length;$('save').disabled=!chosen.length;$('copy').disabled=!chosen.length;$('downloadReport').disabled=!chosen.length;
}
const canvas=$('poster'),ctx=canvas.getContext('2d');
function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function textFit(s,x,y,maxWidth,initial=48,minimum=23){let size=initial;while(size>minimum){ctx.font=`800 ${size}px system-ui,sans-serif`;if(ctx.measureText(s).width<=maxWidth)break;size-=2}ctx.fillText(s,x,y,maxWidth)}
function paintPoster(){const w=canvas.width,h=canvas.height,stack=order();ctx.clearRect(0,0,w,h);const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#fae9d7');bg.addColorStop(.55,'#d4aa87');bg.addColorStop(1,'#82583f');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // Decorative highlights
 ctx.fillStyle='#ffffff24';for(const [x,y,r] of [[108,140,100],[790,280,145],[140,800,75],[690,880,55]]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
 ctx.textAlign='center';ctx.fillStyle='#70452d';ctx.font='bold 24px system-ui';ctx.fillText('D E N S I T Y   C A F É',450,95);ctx.fillStyle='#513523';textFit($('drinkName').value.trim()||'우리 조의 층층 음료',450,161,740,59,28);ctx.fillStyle='#77533f';ctx.font='24px system-ui';ctx.fillText(`${team}조 · ${($('teamName').value.trim()||'밀도 탐구단').slice(0,25)}`,450,212,720);
 // Cup shadow
 ctx.fillStyle='#3927183d';ctx.beginPath();ctx.ellipse(450,925,210,24,0,0,Math.PI*2);ctx.fill();
 const cx=294,cy=275,cw=312,ch=598,innerX=cx+14,innerY=cy+15,innerW=cw-28,innerH=ch-35;
 // glass mask with rounded base
 ctx.save();roundedRect(innerX,innerY,innerW,innerH,38);ctx.clip();ctx.fillStyle='#fffcf6a0';ctx.fillRect(innerX,innerY,innerW,innerH);const ht=innerH/6;stack.forEach((it,index)=>{const y=innerY+innerH-ht*(index+1);ctx.fillStyle=it.color;ctx.globalAlpha=.91;ctx.fillRect(innerX,y,innerW,ht+2);ctx.globalAlpha=1;ctx.fillStyle='#ffffff55';ctx.fillRect(innerX,y,innerW,3)});ctx.restore();ctx.lineWidth=17;ctx.strokeStyle='#ffffffb8';roundedRect(cx,cy,cw,ch,46);ctx.stroke();ctx.fillStyle='#ffffff4d';roundedRect(cx+22,cy+28,15,ch-82,10);ctx.fill();
 // Drink decoration
 ctx.textAlign='center';ctx.font='40px serif';ctx.fillText('✦',450,286);
 ctx.fillStyle='#fff9f1';roundedRect(86,961,728,91,23);ctx.fill();ctx.fillStyle='#72513b';ctx.font='bold 22px system-ui';ctx.textAlign='center';const ingredientsLine=stack.length?stack.map(i=>i.name).join(' · '):'원하는 재료를 선택해 보세요';ctx.fillText(ingredientsLine,450,1013,682);ctx.font='17px system-ui';ctx.fillStyle='#fff9f1';ctx.fillText('교육용 밀도 순서 모형 · 실제 층 형성 및 색은 다를 수 있습니다',450,1081,850)}
function report(){const stack=order();const name=$('drinkName').value.trim()||'우리 조의 층층 음료';let s=`[밀도카페 · ${team}조 탐구 결과]\n음료 이름: ${name}\n조 이름: ${$('teamName').value.trim()||'미입력'}\n콘셉트/예상: ${$('drinkIdea').value.trim()||'미입력'}\n\n밀도가 큰 순서(아래 → 위)\n`;stack.forEach((i,n)=>s+=`${n+1}. ${i.name} — ${i.rho.toFixed(2)} g/mL\n`);s+='\n관찰 및 해석: 이 시뮬레이션은 밀도가 큰 재료를 아래에 배치합니다.\n주의: 실제 층 형성은 밀도, 혼합성, 점성, 붓는 방법 등에도 좌우됩니다.\n수치는 교육용 근삿값이며 실제 음료·실험 결과를 보증하지 않습니다.';return s}
function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function png(){paintPoster();canvas.toBlob(blob=>{if(blob)download(blob,`밀도카페_${team}조_음료.png`)},'image/png')}
$('team').onchange=e=>{team=e.target.value;restore()};$('undo').onclick=()=>{chosen.pop();render();paintPoster();saveState()};$('clear').onclick=()=>{if(!confirm('현재 조에서 선택한 재료를 모두 지울까요? 음료 이름과 조 이름은 유지됩니다.'))return;chosen=[];render();paintPoster();saveState();$('reportText').textContent='재료를 새로 담고 포스터를 만들어 보세요.'};$('example').onclick=()=>{chosen=['honey','fruit','water','oil'].map(id=>ITEMS.find(i=>i.id===id));$('drinkName').value='노을빛 밀도 카페';render();paintPoster();saveState()};
for(const el of ['drinkName','teamName','drinkIdea'])$(el).addEventListener('input',()=>{saveState();paintPoster()});
$('create').onclick=()=>{if(!chosen.length)return;paintPoster();$('reportText').textContent=report();rendered=true;saveState();$('result-area')?.scrollIntoView?.({behavior:'smooth'});document.querySelector('.result-area').scrollIntoView({behavior:'smooth',block:'start'})};$('save').onclick=()=>{if(chosen.length)png()};$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(report());alert('탐구 내용을 복사했어요.')}catch{alert('브라우저 복사 기능을 사용할 수 없어요. TXT 저장을 이용해 주세요.')}};$('downloadReport').onclick=()=>{if(chosen.length)download(new Blob(['\ufeff'+report()],{type:'text/plain;charset=utf-8'}),`밀도카페_${team}조_탐구결과.txt`)};
restore();
