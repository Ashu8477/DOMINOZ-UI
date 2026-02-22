const pizzas = [
  { name: 'Margherita', basePrice: 199, img: 'assets/margherita.jpg' },
  { name: 'Peppy Paneer', basePrice: 299, img: 'assets/peppy-paneer.jpg' },
  {
    name: 'Veggie Paradise',
    basePrice: 249,
    img: 'assets/veggie-paradise.jpg',
  },
  { name: 'Cheese Burst', basePrice: 269, img: 'assets/cheese-burst.jpg' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discount = 0;

const menuContainer = document.getElementById('menu-items');
const cartContainer = document.getElementById('cart-items');
const totalElement = document.getElementById('total');
const cartCount = document.getElementById('cart-count');

/* ================= MENU RENDER ================= */
function renderMenu() {
  menuContainer.innerHTML = '';

  pizzas.forEach((pizza, index) => {
    menuContainer.innerHTML += `
      <div class="pizza-card">
        <img src="${pizza.img}">
        <h3>${pizza.name}</h3>

        <p class="price" id="price-${index}">
          ₹${pizza.basePrice}
        </p>

        <select id="size-${index}" onchange="updatePrice(${index})">
          <option value="1">Small</option>
          <option value="1.5">Medium (+50%)</option>
          <option value="2">Large (Double)</option>
        </select>

        <label>
          <input type="checkbox" id="cheese-${index}" onchange="updatePrice(${index})">
          Extra Cheese (+₹40)
        </label>

        <button onclick="addToCart(${index})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

/* ================= LIVE PRICE UPDATE ================= */
function updatePrice(index) {
  const size = parseFloat(document.getElementById(`size-${index}`).value);
  const cheese = document.getElementById(`cheese-${index}`).checked;

  let price = pizzas[index].basePrice * size;
  if (cheese) price += 40;

  document.getElementById(`price-${index}`).innerText = `₹${price}`;
}

/* ================= ADD TO CART ================= */
function addToCart(index) {
  const size = parseFloat(document.getElementById(`size-${index}`).value);
  const cheese = document.getElementById(`cheese-${index}`).checked;

  let price = pizzas[index].basePrice * size;
  if (cheese) price += 40;

  const key = `${index}-${size}-${cheese}`;

  const existing = cart.find((item) => item.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      pizzaId: index,
      name: pizzas[index].name,
      size,
      cheese,
      price,
      qty: 1,
    });
  }

  saveCart();
}

/* ================= CHANGE QTY ================= */
function changeQty(key, delta) {
  const item = cart.find((p) => p.key === key);
  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((p) => p.key !== key);
  }

  saveCart();
}

/* ================= REMOVE ITEM ================= */
function removeItem(key) {
  cart = cart.filter((p) => p.key !== key);
  saveCart();
}

/* ================= RENDER CART ================= */
function renderCart() {
  cartContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    const sizeName =
      item.size === 1 ? 'Small' : item.size === 1.5 ? 'Medium' : 'Large';

    const itemTotal = item.price * item.qty;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>
            ${sizeName}
            ${item.cheese ? ' + Cheese' : ''}
          </small>
        </div>

        <div>
          ₹${item.price} x ${item.qty}
          <br>
          <strong>₹${itemTotal}</strong>
          <br>
          <button onclick="changeQty('${item.key}', 1)">+</button>
          <button onclick="changeQty('${item.key}', -1)">-</button>
          <button onclick="removeItem('${item.key}')">Remove</button>
        </div>
      </div>
    `;

    total += itemTotal;
    count += item.qty;
  });

  total -= discount;
  if (total < 0) total = 0;

  totalElement.innerText = 'Total: ₹' + total;
  cartCount.innerText = count;
}

/* ================= COUPON ================= */
function applyCoupon() {
  const code = document.getElementById('coupon').value;

  if (code === 'PIZZA50') {
    discount = 50;
    alert('₹50 Discount Applied');
  } else {
    alert('Invalid Coupon');
  }

  renderCart();
}

/* ================= CHECKOUT ================= */
function checkout() {
  if (cart.length === 0) {
    alert('Cart Empty');
    return;
  }

  alert('Order Placed Successfully!');
  cart = [];
  discount = 0;
  saveCart();
}

/* ================= SAVE CART ================= */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

renderMenu();
renderCart();
