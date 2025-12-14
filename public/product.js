// ---------------------------------------------------------
// 1. Fallback Data (Original Full List)
// ---------------------------------------------------------
// Fallback data removed - Only Farmer Products are shown.

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
    // Fixed: Don't mess with 'data:' URLs (Base64 images from Farmer Upload)
    if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('images/') && !imageSrc.startsWith('/uploads/') && !imageSrc.startsWith('data:')) {
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
// Fetch products from LocalStorage (Farmer Uploads) or Backend
async function loadProducts() {

  // 1. Try Loading Farmer Uploads from Local Storage
  const localData = JSON.parse(localStorage.getItem("farmerProducts")) || [];

  if (localData.length > 0) {
    console.log("Loaded Farmer Products:", localData);
    allProducts = localData; // 🌟 Use Farmer Data ONLY
  } else {
    // 🛑 No Fallback! As requested.
    console.warn("No farmer products found. Page will be empty.");
    allProducts = [];
  }

  // Categorize and Display
  const fruits = allProducts.filter(p => p.category === 'Fruits');
  const vegetables = allProducts.filter(p => p.category === 'Vegetables');
  const others = allProducts.filter(p => p.category !== 'Fruits' && p.category !== 'Vegetables');

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

// (Placeholder removed)


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
      let transcript = event.results[0][0].transcript;
      // Remove trailing period often added by speech recognition
      transcript = transcript.replace(/\.$/, "");

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
<div id="qtyModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
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
<div id="cartModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
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
  // Find Product Stock
  const product = allProducts.find(p => p.name === name);
  const maxStock = product && product.stock ? product.stock : 999; // Default large if no stock set

  selectedItem = { name, price, maxStock };

  const modal = document.getElementById("qtyModal");
  const input = document.getElementById("qtyInput");

  // Create or Update Max Stock Label
  let stockLabel = document.getElementById("stockLabel");
  if (!stockLabel) {
    stockLabel = document.createElement("p");
    stockLabel.id = "stockLabel";
    stockLabel.style.fontSize = "14px";
    stockLabel.style.color = "#555";
    input.parentNode.insertBefore(stockLabel, input);
  }

  stockLabel.innerHTML = `Available Stock: <strong>${maxStock}</strong> kg`;

  modal.style.display = "flex";

  input.value = 1;
  input.max = maxStock; // Set HTML Validation
  input.focus();
}

// OK BUTTON – Confirm quantity
document.getElementById("qtyOkBtn").onclick = function () {
  const qty = Number(document.getElementById("qtyInput").value);

  if (!qty || qty <= 0) {
    alert("❌ Enter valid quantity!");
    return;
  }

  // 🔒 Stock Validation
  if (qty > selectedItem.maxStock) {
    alert(`❌ Only ${selectedItem.maxStock} kg available!`);
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
  placeOrderBtn.innerText = `Pay Now • ₹${grandTotal}`; // Updated Label
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

// PLACE ORDER → PAY → INVOICE
document.getElementById("placeOrderBtn").onclick = function () {
  if (cart.length === 0) {
    showPopup("Cart is empty!");
    return;
  }

  // Calculate Total
  const totalAmount = cart.reduce((acc, item) => acc + item.totalCost, 0);

  if (totalAmount <= 0) {
    alert("Invalid Order Amount");
    return;
  }

  // User details for payment
  const custName = localStorage.getItem("username") || "Guest";
  const custEmail = localStorage.getItem("email") || "guest@example.com";
  const custContact = localStorage.getItem("contact") || "9999999999";

  // Razorpay Options
  var options = {
    "key": "rzp_test_RaNi4b2fzG2SRr", // Test Key
    "amount": Math.round(totalAmount * 100).toString(), // Paise
    "currency": "INR",
    "name": "Farm Care",
    "description": "Order Payment",
    "image": "https://cdn-icons-png.flaticon.com/512/3729/3729188.png",
    "handler": function (response) {
      // ✅ Payment Success
      console.log("Payment ID: " + response.razorpay_payment_id);

      // Save Order & Payment Info
      localStorage.setItem("orderData", JSON.stringify(cart));
      localStorage.setItem("orderTime", new Date().toLocaleString());
      localStorage.setItem("paymentId", response.razorpay_payment_id); // Save payment ID

      // 📜 SAVE TO PERSONAL HISTORY (Persistent)
      const currentUser = localStorage.getItem("username");
      if (currentUser) {
        const historyKey = `orderHistory_${currentUser}`;
        const currentHistory = JSON.parse(localStorage.getItem(historyKey)) || [];

        currentHistory.push({
          paymentId: response.razorpay_payment_id,
          date: new Date().toLocaleString(),
          amount: totalAmount,
          items: cart
        });

        localStorage.setItem(historyKey, JSON.stringify(currentHistory));
      }

      showToast("✅ Payment Successful! Generating Invoice...");

      setTimeout(() => {
        window.location.href = "invoice.html";
      }, 1500);
    },
    "prefill": {
      "name": custName,
      "email": custEmail,
      "contact": custContact
    },
    "theme": {
      "color": "#2d572c"
    }
  };

  try {
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      alert("❌ Payment Failed: " + response.error.description);
    });
    rzp1.open();
  } catch (e) {
    alert("❌ Payment Error: Razorpay not loaded. Check connection.");
    console.error(e);
  }
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
