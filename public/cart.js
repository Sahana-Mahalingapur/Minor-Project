let cart = [];
let currentProduct = {};

// Elements
const qtyModal = document.getElementById('qtyModal');
const qtyInput = document.getElementById('qtyInput');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const popupMsg = document.getElementById('popupMsg');
const popupText = document.getElementById('popupText');

// Open Quantity Modal
function openQtyModal(name, price) {
    currentProduct = { name, price };
    qtyInput.value = '';
    qtyModal.style.display = 'block';
    qtyInput.focus();
}

// Add to Cart Logic
document.getElementById('qtyOkBtn').addEventListener('click', () => {
    const quantity = qtyInput.value;
    if (quantity && quantity > 0) {
        const item = {
            ...currentProduct,
            quantity: quantity
        };
        cart.push(item);
        qtyModal.style.display = 'none';
        showPopup(`${item.name} (${quantity}) added to cart!`);
    } else {
        alert('Please enter a valid quantity');
    }
});

document.getElementById('qtyCancelBtn').addEventListener('click', () => {
    qtyModal.style.display = 'none';
});

// Show Popup
function showPopup(message) {
    popupText.innerText = message;
    popupMsg.style.display = 'block';
    setTimeout(() => {
        popupMsg.style.display = 'none';
    }, 3000);
}

// View Cart
document.getElementById('viewCartBtn').addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'block';
});

document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Render Cart Items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = calculateItemTotal(item.price, item.quantity);
        total += itemTotal;

        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #eee';
        div.style.padding = '10px 0';
        div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.price} x ${item.quantity}</small>
        </div>
        <div>
          <span>₹${itemTotal}</span>
          <button onclick="removeFromCart(${index})" style="background:red; color:white; border:none; border-radius:5px; padding:2px 6px; margin-left:10px; cursor:pointer;">X</button>
        </div>
      </div>
    `;
        cartItemsContainer.appendChild(div);
    });

    const totalDiv = document.createElement('div');
    totalDiv.style.marginTop = '15px';
    totalDiv.style.fontWeight = 'bold';
    totalDiv.style.textAlign = 'right';
    totalDiv.innerHTML = `Total: ₹${total}`;
    cartItemsContainer.appendChild(totalDiv);
}

// Helper to extract price number
function calculateItemTotal(priceStr, quantity) {
    // Assumes price format like "₹120/kg" or "₹60/dozen"
    const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''));
    return priceNum * quantity;
}

// Remove from Cart
window.removeFromCart = function (index) {
    cart.splice(index, 1);
    renderCart();
};

// Place Order with Razorpay
document.getElementById('placeOrderBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate total amount
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += calculateItemTotal(item.price, item.quantity);
    });

    // Razorpay options
    var options = {
        "key": "rzp_test_RaNi4b2fzG2SRr",
        "amount": totalAmount * 100, // Amount in paise
        "currency": "INR",
        "name": "Farm Care",
        "description": "Payment for Fresh Produce",
        "image": "https://cdn-icons-png.flaticon.com/512/862/862856.png",
        "handler": function (response) {
            // Payment Successful
            alert("✅ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);

            // Prepare invoice data
            const orderData = cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: parseInt(item.price.replace(/[^0-9]/g, '')),
                totalCost: calculateItemTotal(item.price, item.quantity)
            }));

            localStorage.setItem("orderData", JSON.stringify(orderData));
            localStorage.setItem("orderTime", new Date().toLocaleString());

            cart = [];
            renderCart();
            cartModal.style.display = 'none';
            window.location.href = "invoice.html";
        },
        "prefill": {
            "name": "Consumer",
            "email": "consumer@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#2d572c"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
    });
    rzp1.open();
});
