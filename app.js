// Educational approximations only. Mixing is not modeled.
const ingredients=[
{name:'꿀',density:1.42,color:'#dda13b'},
{name:'물엿',density:1.33,color:'#e6b66c'},
{name:'글리세린',density:1.26,color:'#dce6ed'},
{name:'시럽',density:1.20,color:'#dc6b81'},
{name:'우유',density:1.03,color:'#f5f0e0'},
{name:'물',density:1.00,color:'#82c5e9'},
{name:'식용유',density:0.92,color:'#e5da69'},
{name:'에탄올',density:0.79,color:'#b9c7ec'}
];
let selected=[];
const $=id=>document.getElementById(id);
function render(){
 $('ingredients').innerHTML='';
 for(const ingredient of ingredients){const b=document.createElement('button');b.className='ingredient';const swatch=document.createElement('span');swatch.className='swatch';swatch.style.background=ingredient.color;const name=document.createElement('span');name.textContent=ingredient.name;const small=document.createElement('small');small.textContent=`${ingredient.density.toFixed(2)} g/mL`;name.append(small);b.append(swatch,name);b.addEventListener('click',()=>{selected.push(ingredient);render()});$('ingredients').append(b)}
 const ordered=[...selected].sort((a,b)=>b.density-a.density);
 $('layers').innerHTML='';for(const i of ordered){const layer=document.createElement('div');layer.className='layer';layer.style.background=i.color;layer.style.height=`${100/Math.max(selected.length,5)}%`;layer.textContent=i.name;$('layers').append(layer)}
 $('recipe').textContent=ordered.length?ordered.map((i,n)=>`${n+1}. ${i.name} · ${i.density.toFixed(2)} g/mL`).join('  →  '):'재료를 골라 주세요.';
}
$('undo').addEventListener('click',()=>{selected.pop();render()});$('clear').addEventListener('click',()=>{selected=[];render();$('result').replaceChildren()});
$('generate').addEventListener('click',async()=>{
 if(!selected.length){alert('재료를 먼저 골라 주세요.');return}
 const result=$('result');result.textContent='AI 이미지를 생성하는 중…';const button=$('generate');button.disabled=true;
 try{const config=await fetch('config.json').then(r=>r.json());if(!config.apiBaseUrl||config.apiBaseUrl.includes('YOUR-'))throw Error('config.json에 API 서버 주소를 입력해 주세요.');const r=await fetch(config.apiBaseUrl.replace(/\/$/,'')+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:$('drinkName').value,idea:$('drinkIdea').value,ingredients:selected.map(({name,density,color})=>({name,density,color}))})});const data=await r.json();if(!r.ok)throw Error(data.error||'생성에 실패했습니다.');result.replaceChildren();if(data.image){const img=document.createElement('img');img.className='ai-image';img.alt='AI가 생성한 음료 이미지';img.src=data.image;result.append(img)}const text=document.createElement('div');text.className='result-text';text.textContent=data.description||'설명이 반환되지 않았습니다.';result.append(text)}catch(e){result.textContent='오류: '+e.message}finally{button.disabled=false}
});render();
