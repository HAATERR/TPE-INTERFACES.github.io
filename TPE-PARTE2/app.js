// ===== Loader 5s =====
(function () {
  const loader = document.getElementById('loader');
  const percent = document.getElementById('loaderPercent');
  const bar = document.getElementById('loaderBar');
  if (!loader || !percent || !bar) return;
  const DURATION = 5000; const start = performance.now();
  function step(t){ const p=Math.min(1,(t-start)/DURATION); const pct=Math.floor(p*100);
    percent.textContent=pct+'%'; bar.style.width=pct+'%';
    loader.querySelector('.progress').setAttribute('aria-valuenow', pct);
    if(p<1) requestAnimationFrame(step); else setTimeout(()=>{loader.style.transition='opacity .26s'; loader.style.opacity='0'; loader.addEventListener('transitionend',()=>loader.remove(),{once:true});},120);
  } requestAnimationFrame(step);
})();

// ===== API endpoints =====
const API_V1 = 'https://vj.interfaces.jima.com.ar/api';     // high-res for featured
const API_V2 = 'https://vj.interfaces.jima.com.ar/api/v2';  // low-res for rows

async function fetchJSON(url){ const r = await fetch(url, {cache:'no-store'}); if(!r.ok) throw new Error(url+': '+r.status); return r.json(); }
function computePrice(id){ const base=19.99,range=60; const pseudo=(id*2654435761%997)/997; return (base+pseudo*range).toFixed(2).replace('.',','); }

// ===== Generic carousel wiring =====
function wireCarousel(container, prevBtn, nextBtn, options={center:true}){
  const slides = Array.from(container.children);
  let index = Math.min(1, slides.length-1);
  let isPointer = false;

  function setActive(i){
    slides.forEach(s=>s.classList.remove('is-active'));
    if(slides[i]) slides[i].classList.add('is-active');
  }
  function centerTo(i, smooth=true){
    index=(i+slides.length)%slides.length;
    const s=slides[index];
    const target = options.center
      ? s.offsetLeft - (container.clientWidth - s.clientWidth)/2
      : s.offsetLeft;
    container.scrollTo({ left: target, behavior: smooth ? 'smooth':'auto' });
    setActive(index);
  }
  function nearestIndex(){
    const mid=container.getBoundingClientRect().left + container.clientWidth/2;
    let best=0, dBest=Infinity;
    slides.forEach((s,i)=>{ const r=s.getBoundingClientRect(), cx=r.left+r.width/2, d=Math.abs(cx-mid); if(d<dBest){dBest=d; best=i;} });
    return best;
  }

  prevBtn && prevBtn.addEventListener('click', ()=>centerTo(index-1));
  nextBtn && nextBtn.addEventListener('click', ()=>centerTo(index+1));
  window.addEventListener('resize', ()=>centerTo(index,false));
  container.addEventListener('pointerdown', ()=>isPointer=true);
  container.addEventListener('pointerup', ()=>{ isPointer=false; if(options.center) centerTo(nearestIndex()); });
  container.addEventListener('scroll', ()=>{ if(options.center && !isPointer) setActive(nearestIndex()); });

  // init
  centerTo(index, false);
}

// ===== Featured (v1) =====
function renderFeatured(games){
  const container = document.getElementById('carousel-featured');
  container.innerHTML = '';
  games.slice(0,3).forEach((g,i)=>{
    const slide = document.createElement('article');
    slide.className = 'slide';
    slide.innerHTML = `<img src="${g.background_image}" alt="${g.name}"><div class="badge">${i===0?'Jugar Ahora':'Comprar Ahora'}</div>`;
    container.appendChild(slide);
  });
  wireCarousel(container, document.querySelector('.car-prev'), document.querySelector('.car-next'), {center:true});
}

// ===== Popular (v2) =====
function renderPopular(games){
  const cont = document.getElementById('carousel-popular');
  cont.innerHTML = '';
  games.slice(0,18).forEach(g=>{
    const item = document.createElement('article');
    item.className = 'pitem'; item.setAttribute("data-id", g.id);
    const img = g.background_image_low_res || g.background_image;
    item.innerHTML = `
      <div class="thumb"><img src="${img}" alt="${g.name}" onerror="this.src='https://placehold.co/600x400/1d1926/ffffff?text=Sin+imagen'"></div>
      <div class="meta">
        <div class="title">${g.name}</div>
        <div class="actions">
          <button class="pill btn-fav" aria-pressed="false" aria-label="Favorito"><img class="heart" src="assets/heart.svg" alt=""><img class="heart-fill" src="assets/heart-fill.svg" alt=""></button>
          <button class="pill btn-cart" aria-pressed="false" aria-label="Agregar al carrito"><img class="cart" src="assets/cart.svg" alt=""><img class="cart-check" src="assets/cart-check (1).svg" alt=""></button>
        </div>
        <div class="price">$${computePrice(g.id)}</div>
      </div>`;
    cont.appendChild(item);
  });
  const prev = document.querySelector('.hcar-btn.prev[data-target="#carousel-popular"]');
  const next = document.querySelector('.hcar-btn.next[data-target="#carousel-popular"]');
  wireCarousel(cont, prev, next, {center:false});
  refreshStates(cont);
  refreshStates(cont);
  refreshStates(cont);
}

// ===== Offers helpers =====
function discountFor(id){ const pct = 35 + ((id * 97) % 31); return pct/100; } // 35..65%
function formatPrice(n){ return n.toFixed(2).replace('.', ','); }

// ===== Offers (v2) =====
function renderOffers(games){
  const cont = document.getElementById('carousel-offers'); cont.innerHTML='';
  const pick = games.slice(10, 22);
  pick.forEach(g=>{
    const img = g.background_image_low_res || g.background_image;
    const base = parseFloat(computePrice(g.id).replace(',','.'));
    const d = discountFor(g.id); const newP = base*(1-d);
    const item = document.createElement('article');
    item.className = 'pitem promo'; item.setAttribute("data-id", g.id);
    item.innerHTML = `
      <div class="thumb">
        <img src="${img}" alt="${g.name}">
        <div class="badge-pill"><span class="ico">🔥</span><span class="lbl">Oferta</span></div>
      </div>
      <div class="meta">
        <div class="title">${g.name}</div>
        <div class="actions">
          <button class="pill btn-fav" aria-pressed="false" aria-label="Favorito"><img class="heart" src="assets/heart.svg" alt=""><img class="heart-fill" src="assets/heart-fill.svg" alt=""></button>
          <button class="pill btn-cart" aria-pressed="false" aria-label="Agregar al carrito"><img class="cart" src="assets/cart.svg" alt=""><img class="cart-check" src="assets/cart-check (1).svg" alt=""></button>
        </div>
        <div class="price">
          <span class="old">$${formatPrice(base)}</span>
          <span class="new">$${formatPrice(newP)}</span>
        </div>
      </div>`;
    cont.appendChild(item);
  });
  const prev=document.querySelector('.hcar-btn.prev[data-target="#carousel-offers"]');
  const next=document.querySelector('.hcar-btn.next[data-target="#carousel-offers"]');
  wireCarousel(cont, prev, next, {center:false});
  refreshStates(cont);
}

// ===== Free (v2) =====
function isLikelyFree(name, id){
  const n = (name||'').toLowerCase();
  if (n.includes('fortnite') || n.includes('rocket league') || n.includes('efootball') || n.includes('apex') || n.includes('valorant')) return true;
  return id % 9 === 0;
}
function renderFree(games){
  const cont = document.getElementById('carousel-free'); cont.innerHTML='';
  const chosen = games.filter(g => isLikelyFree(g.name, g.id)).slice(0, 12);
  chosen.forEach(g=>{
    const img = g.background_image_low_res || g.background_image;
    const item = document.createElement('article');
    item.className = 'pitem free'; item.setAttribute("data-id", g.id);
    item.innerHTML = `
      <div class="thumb">
        <img src="${img}" alt="${g.name}">
        <div class="badge-pill">FREE</div>
      </div>
      <div class="meta">
        <div class="title">${g.name}</div>
        <div class="actions">
          <button class="pill btn-fav" aria-pressed="false" aria-label="Favorito"><img class="heart" src="assets/heart.svg" alt=""><img class="heart-fill" src="assets/heart-fill.svg" alt=""></button>
          <button class="pill btn-cart" aria-pressed="false" aria-label="Agregar al carrito"><img class="cart" src="assets/cart.svg" alt=""><img class="cart-check" src="assets/cart-check (1).svg" alt=""></button>
        </div>
        <div class="price"><span class="new">FREE</span></div>
      </div>`;
    cont.appendChild(item);
  });
  const prev=document.querySelector('.hcar-btn.prev[data-target="#carousel-free"]');
  const next=document.querySelector('.hcar-btn.next[data-target="#carousel-free"]');
  wireCarousel(cont, prev, next, {center:false});
  refreshStates(cont);
}

// ===== Search =====
function wireSearch(allGamesV2){
  const input=document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', () => {
    const q=input.value.trim().toLowerCase();
    const filtered = q ? allGamesV2.filter(g => (g.name||'').toLowerCase().includes(q)) : allGamesV2;
    renderPopular(filtered);
    renderOffers(filtered);
    renderFree(filtered);
  });
}


// ===== Interactions: favorites & cart (persisted) =====
const FAV_KEY='ng_favs', CART_KEY='ng_cart';
function getSet(key){ try{ return new Set(JSON.parse(localStorage.getItem(key)||'[]')); }catch{ return new Set(); } }
function saveSet(key,set){ localStorage.setItem(key, JSON.stringify([...set])); }
let favs=getSet(FAV_KEY), cart=getSet(CART_KEY);

function applyStateToCard(card){
  const id = String(card.getAttribute('data-id'));
  const favBtn = card.querySelector('.btn-fav');
  const cartBtn = card.querySelector('.btn-cart');
  if (favBtn){ const pressed = favs.has(id); favBtn.setAttribute('aria-pressed', pressed); }
  if (cartBtn){ const pressed = cart.has(id); cartBtn.setAttribute('aria-pressed', pressed); }
}

function refreshStates(scope=document){
  scope.querySelectorAll('.pitem').forEach(applyStateToCard);
}

// Delegate clicks
document.addEventListener('click', (e)=>{
  const favBtn = e.target.closest('.btn-fav');
  const cartBtn = e.target.closest('.btn-cart');
  if (favBtn){
    const card = favBtn.closest('.pitem');
    const id = String(card.getAttribute('data-id'));
    const pressed = favBtn.getAttribute('aria-pressed') === 'true';
    favBtn.setAttribute('aria-pressed', !pressed);
    if (pressed) favs.delete(id); else favs.add(id);
    saveSet(FAV_KEY, favs);
  }
  if (cartBtn){
    const card = cartBtn.closest('.pitem');
    const id = String(card.getAttribute('data-id'));
    const pressed = cartBtn.getAttribute('aria-pressed') === 'true';
    cartBtn.setAttribute('aria-pressed', !pressed);
    if (pressed) cart.delete(id); else cart.add(id);
    saveSet(CART_KEY, cart);
  }
});

// ===== Init =====
(async()=>{
  try{
    const [v1, v2] = await Promise.all([fetchJSON(API_V1), fetchJSON(API_V2)]);
    renderFeatured(v1);
    renderPopular(v2);
    renderOffers(v2);
    renderFree(v2);
    wireSearch(v2);
  }catch(err){
    console.error(err);
  }
})();