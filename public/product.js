// ---------------------------------------------------------
// 1. Fallback Data (Original Full List)
// ---------------------------------------------------------
const fallbackFruits = [
  { name: "Apples", price: "120", image: "images/Apples.jpg", category: "Fruits" },
  { name: "Bananas", price: "60", image: "images/Bananas.jpg", category: "Fruits" },
  { name: "Oranges", price: "90", image: "images/Oranges.jpg", category: "Fruits" },
  { name: "Strawberries", price: "200", image: "images/Strawberries.jpg", category: "Fruits" },
  { name: "Mangoes", price: "150", image: "images/Mangoes.jpg", category: "Fruits" },
  { name: "Grapes", price: "100", image: "images/Grapes.jpg", category: "Fruits" },
  { name: "Pomegranate", price: "180", image: "images/Pomegranate.jpg", category: "Fruits" },
  { name: "Papaya", price: "60", image: "images/Papaya.jpg", category: "Fruits" },
  { name: "Kiwi", price: "150", image: "images/Kiwi.jpeg", category: "Fruits" },
  { name: "Dragon Fruit", price: "200", image: "images/Dragon Fruit.jpg", category: "Fruits" },
  { name: "Guava", price: "50", image: "images/Guava.jpg", category: "Fruits" },
  { name: "Peach", price: "180", image: "images/Peach.jpg", category: "Fruits" },
  { name: "Pear", price: "160", image: "images/Pear.jpg", category: "Fruits" },
  { name: "Plum", price: "140", image: "images/Plum.jpg", category: "Fruits" },
  { name: "Apricot", price: "220", image: "images/Apricot.jpg", category: "Fruits" },
  { name: "Cherry", price: "300", image: "images/Cherry.jpg", category: "Fruits" },
  { name: "Avocado", price: "400", image: "images/Avocado.jpeg", category: "Fruits" },
  { name: "Blackberry", price: "350", image: "images/Blackberry.jpg", category: "Fruits" },
  { name: "Blueberry", price: "450", image: "images/Blueberry.jpg", category: "Fruits" },
  { name: "Raspberry", price: "400", image: "images/Raspberry.jpg", category: "Fruits" },
  { name: "Date", price: "300", image: "images/Date.jpg", category: "Fruits" },
  { name: "Passion Fruit", price: "250", image: "images/Passionfruit.jpg", category: "Fruits" },
  { name: "Jackfruit", price: "100", image: "images/Jackfruit.jpg", category: "Fruits" },
  { name: "Melon", price: "70", image: "images/Melon.jpg", category: "Fruits" },
  { name: "Watermelon", price: "80", image: "images/Watermelon.png", category: "Fruits" },
  { name: "Pineapple", price: "100", image: "images/Pineapple.png", category: "Fruits" }
];

const fallbackVeggies = [
  { name: "Tomatoes", price: "40", image: "images/Tomatoes.jpg", category: "Vegetables" },
  { name: "Carrots", price: "50", image: "images/Carrots.jpg", category: "Vegetables" },
  { name: "Onions", price: "45", image: "images/Onions.jpg", category: "Vegetables" },
  { name: "Potatoes", price: "35", image: "images/Potatoes.jpg", category: "Vegetables" },
  { name: "Cucumbers", price: "50", image: "images/Cucumbers.jpg", category: "Vegetables" },
  { name: "Spinach", price: "40", image: "images/Spinach.png", category: "Vegetables" },
  { name: "Cauliflower", price: "50", image: "images/Cauliflower.png", category: "Vegetables" },
  { name: "Broccoli", price: "120", image: "images/Broccoli.jpg", category: "Vegetables" },
  { name: "Beetroot", price: "40", image: "images/Beetroot.jpg", category: "Vegetables" },
  { name: "Pumpkin", price: "30", image: "images/Pumpkin.jpg", category: "Vegetables" },
  { name: "Bitter Gourd", price: "35", image: "images/Bitter Gourd.jpg", category: "Vegetables" },
  { name: "Corn", price: "20", image: "images/Corn.jpg", category: "Vegetables" },
  { name: "Sweet Potato", price: "40", image: "images/Sweet Patato.jpg", category: "Vegetables" },
  { name: "Ginger", price: "100", image: "images/Ginger.jpg", category: "Vegetables" },
  { name: "Garlic", price: "120", image: "images/Garlic.jpg", category: "Vegetables" },
  { name: "Chili", price: "60", image: "images/Chili.jpg", category: "Vegetables" },
  { name: "Coriander", price: "20", image: "images/Coriander.jpg", category: "Vegetables" },
  { name: "Mint", price: "20", image: "images/Mint.jpg", category: "Vegetables" }
];

const fallbackOthers = [
  { name: "Fresh Milk", price: "60", image: "images/Milk.png", category: "Other" },
  { name: "Organic Honey", price: "350", image: "images/Honey.png", category: "Other" },
  { name: "Farm Eggs", price: "10", image: "images/Eggs.png", category: "Other" },
  { name: "Cheese", price: "250", image: "images/Cheese.jpeg", category: "Other" },
  { name: "Butter", price: "280", image: "images/Butter.jpg", category: "Other" },
  { name: "Pickle", price: "120", image: "images/Pickel.jpg", category: "Other" },
  { name: "Jam", price: "150", image: "images/Jam.jpg", category: "Other" },
  { name: "Sauce", price: "100", image: "images/Sauce.jpg", category: "Other" }
];

// Global array to store fetched products for search functionality
let allProducts = [];

// Display function
function displayProducts(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = '<p style="color: #666; font-style: italic;">No items in this category.</p>';
    return;
  }

  data.forEach(item => {
    // Handle image paths. Uploaded images might need '/uploads/' prefix if not already complete URLs
    let imageSrc = item.image;
    // If it's a local file upload (not a URL and not starting with images/)
    if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('images/') && !imageSrc.startsWith('/uploads/')) {
      imageSrc = '/uploads/' + imageSrc;
    }

    // Fallback for missing images
    if (!imageSrc) imageSrc = 'https://via.placeholder.com/150?text=No+Image';

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image';">
      <h3>${item.name}</h3>
      <p>₹${item.price} / ${item.unit || 'unit'}</p>
      <button onclick="addToCart('${item.name}', '${item.price}', '${item.category}')" style="
        background-color: #2d572c;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 15px;
        transition: 0.3s;
      "
      onmouseover="this.style.background='#3d7a3d'"
      onmouseout="this.style.background='#2d572c'"
      >Add to Cart 🛒</button>
    `;
    container.appendChild(card);
  });
}

// Fetch products from Backend with Timeout
async function loadProducts() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

  try {
    console.log("Fetching products...");
    const response = await fetch('/api/products', { signal: controller.signal });
    const result = await response.json();

    clearTimeout(timeoutId);

    if (result.success && result.data.length > 0) {
      console.log("Loaded from DB:", result.data);
      allProducts = result.data;
    } else {
      console.warn("DB empty or no success, using fallback data.");
      throw new Error("Empty DB");
    }
  } catch (error) {
    console.warn('Using fallback data due to:', error.name === 'AbortError' ? 'Timeout' : error.message);
    allProducts = [...fallbackFruits, ...fallbackVeggies, ...fallbackOthers];
  }

  // Categorize and Display
  const fruits = allProducts.filter(p => p.category === 'Fruits' || (!p.category && fallbackFruits.find(f => f.name === p.name)));
  const vegetables = allProducts.filter(p => p.category === 'Vegetables' || (!p.category && fallbackVeggies.find(v => v.name === p.name)));
  const others = allProducts.filter(p => {
    // In fallback, category is explicit. In mixed list, might be 'Other' or null
    if (p.category === 'Fruits' || p.category === 'Vegetables') return false;
    if (fallbackFruits.find(f => f.name === p.name)) return false;
    if (fallbackVeggies.find(v => v.name === p.name)) return false;
    return true;
  });

  // Display
  displayProducts(fruits, "fruitsContainer");
  displayProducts(vegetables, "veggiesContainer");

  const otherContainer = document.getElementById("otherContainer");
  if (otherContainer) {
    displayProducts(others, "otherContainer");
  }
}

// Initial Load
loadProducts();

// Placeholder cart function
function addToCart(name, price) {
  alert(`Added ${name} directly to your cart!`);
}


// 🔍 Search functionality
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    // Categorize again from allProducts based on search query
    const filteredFruits = allProducts.filter(p => p.category === 'Fruits' && p.name.toLowerCase().includes(query));
    const filteredVeggies = allProducts.filter(p => p.category === 'Vegetables' && p.name.toLowerCase().includes(query));
    const filteredOthers = allProducts.filter(p => p.category !== 'Fruits' && p.category !== 'Vegetables' && p.name.toLowerCase().includes(query));

    displayProducts(filteredFruits, "fruitsContainer");
    displayProducts(filteredVeggies, "veggiesContainer");

    const otherContainer = document.getElementById("otherContainer");
    if (otherContainer) displayProducts(filteredOthers, "otherContainer");
  });
}

// 🎙️ Voice Search using Web Speech API
const micBtn = document.getElementById("micBtn");
if (micBtn) {
  micBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event("input"));
    };
  });
}

// ---------------------------------------------------------
// 🛒 FULL CART & INVOICE LOGIC (User Request)
// ---------------------------------------------------------

let cart = [];
let selectedItem = null;

// Inject Cart Modal & Quantity Modal HTML & Popup HTML
const modalHTML = `
<!-- TOAST NOTIFICATION (Bottom Center) -->
<div id="toastMsg" style="display:none; position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:12px 24px; border-radius:30px; z-index:2000; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:14px; transition: opacity 0.3s;">
  <span id="toastText">Item added</span>
</div>

<!-- QUANTITY MODAL -->
<div id="qtyModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; display:flex; justify-content:center; align-items:center;">
  <div style="background:white; padding:20px; width:300px; text-align:center; border-radius:12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
    <h3 style="margin-top:0;">Quantity</h3>
    <input type="number" id="qtyInput" placeholder="1" value="1" min="1" style="width:60px; padding:8px; text-align:center; font-size:18px; margin:15px 0; border:1px solid #ccc; border-radius:5px;">
    <br>
    <div style="display:flex; justify-content:center; gap:10px;">
      <button id="qtyCancelBtn" style="background:#f0f0f0; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:600;">Cancel</button>
      <button id="qtyOkBtn" style="background:#2d572c; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:600;">Add Item</button>
    </div>
  </div>
</div>

<!-- VIEW CART BUTTON (Hidden by default) -->
<button id="viewCartBtn" style="position:fixed; bottom:20px; right:20px; background:#2d572c; color:white; width:60px; height:60px; border-radius:50%; border:none; box-shadow:0 4px 15px rgba(0,0,0,0.4); cursor:pointer; font-size:24px; z-index:900; transition: transform 0.2s; display:none;">
  🛒
  <span id="cartBadge" style="position:absolute; top:-5px; right:-5px; background:red; color:white; font-size:12px; font-weight:bold; padding:4px 8px; border-radius:50%; display:none;">0</span>
</button>

<!-- CART MODAL -->
<div id="cartModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; display:flex; justify-content:center; align-items:center;">
  <div style="background:white; padding:25px; width:90%; max-width:450px; border-radius:12px; max-height:85vh; overflow-y:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
      <h2 style="margin:0;">Your Cart 🛒</h2>
      <button id="closeCart" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
    </div>
    
    <div id="cartItems" style="margin-bottom:20px;"></div>
    
    <!-- Grand Total Display in Modal -->
    <div id="cartTotalSection" style="display:none; border-top:2px dashed #eee; padding-top:15px; margin-top:10px;">
       <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold; margin-bottom:20px;">
          <span>Grand Total:</span>
          <span>₹<span id="modalGrandTotal">0</span></span>
       </div>
       <button id="placeOrderBtn" style="width:100%; background:#2d572c; color:white; border:none; padding:15px; border-radius:8px; cursor:pointer; font-size:16px; font-weight:bold;">Checkout</button>
    </div>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Convert ₹120 or ₹120/kg → 120
function extractPrice(priceText) {
  const str = String(priceText);
  return Number(str.replace(/[^0-9.]/g, ""));
}

// SHOW TOAST (Non-blocking notification)
function showToast(message) {
  const toast = document.getElementById("toastMsg");
  document.getElementById("toastText").innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

// Update Badge Count
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const btn = document.getElementById("viewCartBtn");

  if (cart.length > 0) {
    badge.innerText = cart.length;
    badge.style.display = "block";
    btn.style.display = "block"; // Show button

    // Animation effect
    btn.style.transform = "scale(1.1)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
  } else {
    badge.style.display = "none";
    btn.style.display = "none"; // Hide button if empty
  }
}

// OPEN Quantity Modal
window.addToCart = function (name, price, category) {
  selectedItem = { name, price };
  document.getElementById("qtyModal").style.display = "flex";
  document.getElementById("qtyInput").value = 1; // Default to 1
  document.getElementById("qtyInput").focus();
}

// OK BUTTON – Confirm quantity
document.getElementById("qtyOkBtn").onclick = function () {
  const qty = Number(document.getElementById("qtyInput").value);

  if (!qty || qty <= 0) {
    alert("❌ Enter valid quantity!");
    return;
  }

  const unitPrice = extractPrice(selectedItem.price);
  const totalCost = unitPrice * qty;

  cart.push({
    name: selectedItem.name,
    unitPrice,
    quantity: qty,
    totalCost,
    priceText: selectedItem.price
  });

  document.getElementById("qtyModal").style.display = "none";

  updateCartBadge();
  showToast(`${selectedItem.name} (${qty}) added to cart!`);
};

// CANCEL BUTTON
document.getElementById("qtyCancelBtn").onclick = function () {
  document.getElementById("qtyModal").style.display = "none";
};

// VIEW CART
document.getElementById("viewCartBtn").onclick = function () {
  document.getElementById("cartModal").style.display = "flex";
  loadCartItems();
};

// CLOSE CART
document.getElementById("closeCart").onclick = function () {
  document.getElementById("cartModal").style.display = "none";
};

// LOAD ITEMS
function loadCartItems() {
  let container = document.getElementById("cartItems");
  let totalSection = document.getElementById("cartTotalSection");
  let grandTotalSpan = document.getElementById("modalGrandTotal");
  let placeOrderBtn = document.getElementById("placeOrderBtn");

  container.innerHTML = "";
  let grandTotal = 0;

  if (cart.length === 0) {
    container.innerHTML = "<div style='text-align:center; padding:30px; color:#888;'>Your cart is empty 🛍️<br><br><small>Add items to get started!</small></div>";
    totalSection.style.display = "none";
    return;
  }

  cart.forEach((item, index) => {
    grandTotal += item.totalCost;
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:12px 0;">
        <div style="text-align:left;">
          <h4 style="margin:0; font-size:16px;">${item.name}</h4>
          <span style="font-size:13px; color:#666;">₹${item.unitPrice} x ${item.quantity}</span>
        </div>
        <div style="text-align:right;">
          <span style="display:block; font-weight:bold; margin-bottom:5px;">₹${item.totalCost}</span>
          <button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer; font-size:12px;">Remove</button>
        </div>
      </div>
    `;
  });

  grandTotalSpan.innerText = grandTotal;
  placeOrderBtn.innerText = `Checkout • ₹${grandTotal}`;
  totalSection.style.display = "block";
}

// REMOVE ITEM
window.removeItem = function (index) {
  cart.splice(index, 1);
  loadCartItems();
  updateCartBadge();

  if (cart.length === 0) {
    document.getElementById("cartTotalSection").style.display = "none";
  }
}

// PLACE ORDER → Invoice
document.getElementById("placeOrderBtn").onclick = function () {
  if (cart.length === 0) {
    showPopup("Cart is empty!");
    return;
  }

  localStorage.setItem("orderData", JSON.stringify(cart));
  localStorage.setItem("orderTime", new Date().toLocaleString());

  showPopup("🎉 Order placed!");

  setTimeout(() => {
    window.location.href = "invoice.html";
  }, 1200);
};

// 📷 Camera Access
const cameraBtn = document.getElementById("cameraBtn");
if (cameraBtn) {
  cameraBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      alert("✅ Camera access granted! (You can now capture or scan items in future updates)");
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("❌ Camera access denied or unavailable.");
    }
  });
}
