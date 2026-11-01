const PRODUCTS=[
{id:1,name:'Khaddar Shawl',cat:'Textiles',price:3200,emoji:'🧣',bg:'#cfd8f6',note:'Handwoven, Faisalabad'},
{id:2,name:'Ajrak Cushion Cover',cat:'Textiles',price:1450,emoji:'🛋️',bg:'#f6d3d0',note:'Block-printed, Sindh'},
{id:3,name:'Cotton Bedsheet Set',cat:'Textiles',price:5800,emoji:'🛏️',bg:'#d6efe3',note:'King size, 4 pieces'},
{id:4,name:'Brass Karahi',cat:'Kitchen',price:4200,emoji:'🍳',bg:'#f8e6b3',note:'Serves 4–6'},
{id:5,name:'Clay Chai Cups (6)',cat:'Kitchen',price:1100,emoji:'🍵',bg:'#f0d9c8',note:'Kulhar style'},
{id:6,name:'Wooden Rolling Pin',cat:'Kitchen',price:650,emoji:'🥖',bg:'#e9e1cc',note:'Sheesham wood'},
{id:7,name:'Mango Chutney Jar',cat:'Pantry',price:480,emoji:'🥭',bg:'#fbe3a1',note:'350 g, small batch'},
{id:8,name:'Chakwal Honey',cat:'Pantry',price:1350,emoji:'🍯',bg:'#f6dc9a',note:'500 g, raw'},
{id:9,name:'Himalayan Pink Salt',cat:'Pantry',price:420,emoji:'🧂',bg:'#f7d6dc',note:'Coarse grind, 400 g'},
{id:10,name:'Truck Art Notebook',cat:'Stationery',price:550,emoji:'📒',bg:'#c9ecf2',note:'A5, 120 pages'},
{id:11,name:'Calligraphy Pen Set',cat:'Stationery',price:900,emoji:'🖋️',bg:'#d9d3f3',note:'3 nibs, 2 inks'},
{id:12,name:'Kashmiri Kahwa Tea',cat:'Pantry',price:760,emoji:'🫖',bg:'#cfe9c9',note:'100 g loose leaf'}
];
const $=s=>document.querySelector(s);
const rs=n=>'Rs '+n.toLocaleString('en-PK');
let cart={},cat='All';
try{const s=localStorage.getItem('chowk-cart');if(s)cart=JSON.parse(s)||{}}catch(e){}
const save=()=>{try{localStorage.setItem('chowk-cart',JSON.stringify(cart))}catch(e){}};

function chips(){
const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];
$('#chips').innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join('');
}
function list(){
const q=$('#q').value.trim().toLowerCase(),s=$('#sort').value;
let r=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&(p.name+p.cat+p.note).toLowerCase().includes(q));
if(s==='lo')r.sort((a,b)=>a.price-b.price);
if(s==='hi')r.sort((a,b)=>b.price-a.price);
if(s==='az')r.sort((a,b)=>a.name.localeCompare(b.name));
$('#grid').innerHTML=r.length?r.map(p=>`<article class="card"><div class="tile" style="background:${p.bg}" aria-hidden="true">${p.emoji}</div><div class="info"><h3>${p.name}</h3><small>${p.note}</small><div class="row"><span class="price">${rs(p.price)}</span><button class="add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button></div></div></article>`).join(''):'<p class="empty">No products match your search. Try a different word or category.</p>';
}
function render(){
const ids=Object.keys(cart).filter(id=>cart[id]>0);
let total=0,n=0;
$('#items').innerHTML=ids.length?ids.map(id=>{const p=PRODUCTS.find(x=>x.id==id),q=cart[id];total+=p.price*q;n+=q;
return `<div class="item"><div class="t">${p.emoji}</div><div><strong>${p.name}</strong><div class="qty"><button data-d="-1" data-id="${id}" aria-label="Decrease quantity">−</button><span>${q}</span><button data-d="1" data-id="${id}" aria-label="Increase quantity">+</button></div></div><div style="text-align:right">${rs(p.price*q)}<br><button class="rm" data-rm="${id}">Remove</button></div></div>`}).join(''):'<p class="empty">Your cart is empty. Add something from the store.</p>';
$('#total').textContent=rs(total);$('#count').textContent=n;$('#checkout').disabled=!ids.length;save();
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),1800)}
const openCart=o=>{$('#drawer').classList.toggle('open',o);$('#ov').classList.toggle('open',o)};
function closeAll(){openCart(false);$('#modal').classList.remove('open')}

$('#chips').onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;chips();list()}};
$('#q').oninput=list;$('#sort').onchange=list;
$('#grid').onclick=e=>{const id=e.target.dataset.id;if(id){cart[id]=(cart[id]||0)+1;render();toast('Added to cart')}};
$('#items').onclick=e=>{const t=e.target.dataset;
if(t.d){cart[t.id]=Math.max(0,(cart[t.id]||0)+ +t.d)}
if(t.rm){delete cart[t.rm]}
render()};
$('#openCart').onclick=()=>openCart(true);
$('#closeCart').onclick=()=>openCart(false);
$('#ov').onclick=closeAll;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
$('#checkout').onclick=()=>{openCart(false);$('#ov').classList.add('open');$('#modal').classList.add('open');$('#nm').focus()};
$('#form').onsubmit=e=>{e.preventDefault();
const nm=$('#nm').value.trim(),ph=$('#ph').value.replace(/\s|-/g,''),ad=$('#ad').value.trim();
if(nm.length<2)return $('#err').textContent='Enter your full name.';
if(!/^(\+92|0)?3\d{9}$/.test(ph))return $('#err').textContent='Enter a valid mobile number, like 0300 1234567.';
if(ad.length<8)return $('#err').textContent='Enter your full delivery address.';
$('#err').textContent='';cart={};render();closeAll();$('#form').reset();toast('Order placed. Thank you, '+nm.split(' ')[0]+'!')};
chips();list();render();
