// ========== SLIDER ==========
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('nav ul');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ========== CART FUNCTIONS ==========
function getCart() {
    const cart = localStorage.getItem('goharbin-cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('goharbin-cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = count;
    }
}

function addToCart(productId, name, price, image) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    alert(`${name} به سبد خرید اضافه شد!`);
}

// ========== LOAD FEATURED PRODUCTS ==========
async function loadFeaturedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products?limit=4');
        const products = await response.json();
        const container = document.getElementById('featured-products');
        
        if (container) {
            container.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image || 'https://via.placeholder.com/280x280/c9a03d/ffffff?text=Jewelry'}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            ${product.price.toLocaleString()} تومان
                            ${product.old_price ? `<span class="product-old-price">${product.old_price.toLocaleString()} تومان</span>` : ''}
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                            افزودن به سبد خرید
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback products if API not available
        const container = document.getElementById('featured-products');
        if (container) {
            container.innerHTML = `
                <div class="product-card">
                    <img src="https://via.placeholder.com/280x280/c9a03d/ffffff?text=Jewelry" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">انگشتر الماس</h3>
                        <div class="product-price">۱۲,۵۰۰,۰۰۰ تومان</div>
                        <button class="add-to-cart" onclick="addToCart(1, 'انگشتر الماس', 12500000, '')">افزودن به سبد خرید</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="https://via.placeholder.com/280x280/c9a03d/ffffff?text=Jewelry" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">گردنبند طلای رزگلد</h3>
                        <div class="product-price">۸,۲۰۰,۰۰۰ تومان</div>
                        <button class="add-to-cart" onclick="addToCart(2, 'گردنبند طلای رزگلد', 8200000, '')">افزودن به سبد خرید</button>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize
updateCartCount();
loadFeaturedProducts();
