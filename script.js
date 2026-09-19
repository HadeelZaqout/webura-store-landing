/* ============ Product data (uses the same images as the source PDF) ============ */
const suggestedProducts = [
  {name:"camon 30 premier 5g12-512", price:1780, img:"assets/img/product-phone-silver.png", ribbon:false},
  {name:"Eufy clean L60 Hybrid SES", price:1780, img:"assets/img/product-eufy-vacuum.png", ribbon:true},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-samsung-spen-dark.png", ribbon:false},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-stick-vacuum.png", ribbon:false},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-phone-mint.png", ribbon:true},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-honor-dark.png", ribbon:true},
];

const bestSellingProducts = [
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-phone-silver.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-eufy-vacuum.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-samsung-spen-dark.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-phone-mint.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-honor-dark.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-stick-vacuum.png"},
];

const discountProducts = [
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-honor-dark.png"},
  {name:"samsung Galaxy S225 Ultra 256 GB", price:1780, img:"assets/img/product-honor-dark.png"},
];

const reviews = [
  {name:"باسم", letter:"ب", color:"#7cb732", stars:5, text:"روعة", img:"assets/img/product-phone-mint.png"},
  {name:"أحمد", letter:"أ", color:"#7cb732", stars:5, text:"رائع جدا", img:"assets/img/product-phone-silver.png"},
  {name:"أيهم", letter:"أ", color:"#7cb732", stars:5, text:"good brand", img:"assets/img/product-iphone.png"},
  {name:"ندى", letter:"ن", color:"#7cb732", stars:5, text:"عن تجربه الجهاز ممتاز", img:"assets/img/product-samsung-spen-dark.png"},
];

/* ============ Render helpers ============ */
let productSeq = 0;

function productCard(p){
  const id = 'p' + (++productSeq);
  return `
  <div class="col-lg-4 col-md-6 col-6">
    <div class="product-card">
      <button class="wish-btn" onclick="toggleWish(this,'${id}','${p.name.replace(/'/g,"")}')"><i class="bi bi-heart"></i></button>
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.ribbon ? '<span class="ribbon">كفالة<br>وكيل معتمد</span>' : ''}
      </div>
      <div class="product-title">${p.name}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="btn-add" onclick="addToCart(this,'${id}','${p.name.replace(/'/g,"")}',${p.price})">
        <i class="bi bi-cart3"></i> أضف الى السلة
      </button>
    </div>
  </div>`;
}

function discountCard(p){
  const id = 'p' + (++productSeq);
  return `
  <div class="col-md-4">
    <div class="product-card">
      <button class="wish-btn" onclick="toggleWish(this,'${id}','${p.name.replace(/'/g,"")}')"><i class="bi bi-heart"></i></button>
      <span class="discount-badge">خصم</span>
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="ribbon">كفالة<br>وكيل معتمد</span>
      </div>
      <div class="product-title">${p.name}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="btn-add" onclick="addToCart(this,'${id}','${p.name.replace(/'/g,"")}',${p.price})">
        <i class="bi bi-cart3"></i> أضف الى السلة
      </button>
    </div>
  </div>`;
}

function reviewCard(r){
  return `
  <div class="col-lg-3 col-md-6">
    <div class="review-card">
      <img src="${r.img}" alt="${r.name}" loading="lazy">
      <div class="review-body">
        <div class="review-head">
          <div class="avatar-circle" style="background:${r.color}">${r.letter}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="stars">${"★".repeat(r.stars)}</div>
          </div>
        </div>
        <div class="review-text">${r.text}</div>
        <div class="review-date"><i class="bi bi-calendar3"></i> 2025,Feb Sat</div>
      </div>
    </div>
  </div>`;
}

document.getElementById('suggestedRow').innerHTML = suggestedProducts.map(productCard).join('');
document.getElementById('bestSellingRow').innerHTML = bestSellingProducts.map(productCard).join('');
document.getElementById('reviewsRow').innerHTML = reviews.map(reviewCard).join('');

document.getElementById('discountRow').innerHTML = `
  ${discountCard(discountProducts[0])}
  ${discountCard(discountProducts[1])}
  <div class="col-md-4">
    <div class="flash-tile">
      <img src="assets/img/flash-sale-graphic.png" alt="Flash Sale" class="flash-tile-img">
      <a href="#best-selling" class="btn-flash-all">عرض جميع العروض</a>
    </div>
  </div>
`;

/* ============ Dynamic cart / wishlist ============ */
let cartCount = 0;
let wishCount = 0;
const cartBadge = document.getElementById('cartBadge');
const wishBadge = document.getElementById('wishBadge');
const cartModalBody = document.getElementById('cartModalBody');
const wishModalBody = document.getElementById('wishModalBody');

const cartItems = {};
const wishItems = {};

function renderCartModal(){
  const names = Object.values(cartItems);
  if(names.length === 0){
    cartModalBody.innerHTML = '<p class="text-muted mb-0">سلتك فارغة حالياً. أضف منتجات لتظهر هنا.</p>';
    return;
  }
  cartModalBody.innerHTML = '<ul class="list-unstyled mb-0">' +
    names.map(n => `<li class="d-flex justify-content-between border-bottom py-2"><span>${n.name}</span><span class="fw-bold">x${n.qty}</span></li>`).join('') +
    '</ul>';
}

function renderWishModal(){
  const names = Object.values(wishItems);
  if(names.length === 0){
    wishModalBody.innerHTML = '<p class="text-muted mb-0">لم تقم بإضافة أي منتج للمفضلة بعد.</p>';
    return;
  }
  wishModalBody.innerHTML = '<ul class="list-unstyled mb-0">' +
    names.map(n => `<li class="border-bottom py-2">${n}</li>`).join('') +
    '</ul>';
}

function addToCart(btn, id, name, price){
  cartCount++;
  cartBadge.textContent = cartCount;
  if(cartItems[id]){
    cartItems[id].qty++;
  } else {
    cartItems[id] = {name, price, qty:1};
  }
  renderCartModal();

  const original = btn.innerHTML;
  btn.classList.add('added');
  btn.innerHTML = '<i class="bi bi-check2"></i> تمت الإضافة';
  setTimeout(()=>{
    btn.classList.remove('added');
    btn.innerHTML = original;
  }, 1000);
}

function toggleWish(btn, id, name){
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if(btn.classList.contains('active')){
    icon.classList.replace('bi-heart','bi-heart-fill');
    wishCount++;
    wishItems[id] = name;
  } else {
    icon.classList.replace('bi-heart-fill','bi-heart');
    wishCount = Math.max(0, wishCount - 1);
    delete wishItems[id];
  }
  wishBadge.textContent = wishCount;
  renderWishModal();
}

/* ============ Newsletter subscribe (works fully offline, no backend) ============ */
document.getElementById('subscribeForm').addEventListener('submit', function(e){
  e.preventDefault();
  const input = document.getElementById('subscribeEmail');
  const btn = this.querySelector('.btn-subscribe');
  const original = btn.textContent;
  btn.textContent = 'تم الاشتراك بنجاح';
  setTimeout(()=>{ btn.textContent = original; input.value = ''; }, 1800);
});

/* ============ Working navigation ============ */
// subnav links scroll to their real section and highlight the active one
document.querySelectorAll('.subnav-link').forEach(link=>{
  link.addEventListener('click', function(){
    document.querySelectorAll('.subnav-link').forEach(l=>l.classList.remove('active'));
    this.classList.add('active');
  });
});

// drawer links: close the drawer first, then smoothly scroll to the section
// once the drawer has fully finished closing (avoids the abrupt "jump" caused
// by the anchor scroll fighting with the offcanvas's body scroll-lock).
document.querySelectorAll('.drawer-link').forEach(link=>{
  link.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelectorAll('.drawer-link').forEach(l=>l.classList.remove('active'));
    this.classList.add('active');

    const targetEl = document.querySelector(this.getAttribute('href'));
    const drawerEl = document.getElementById('categoriesDrawer');
    const instance = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);

    drawerEl.addEventListener('hidden.bs.offcanvas', function onHidden(){
      drawerEl.removeEventListener('hidden.bs.offcanvas', onHidden);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    instance.hide();
  });
});
