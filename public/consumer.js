// Check auth
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || user.role !== 'customer') {
    window.location.href = 'login.html';
}

document.getElementById('userInfo').innerText = `Hello, ${user.name}`;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Load Products
async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const data = await res.json();

        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        if (data.success) {
            data.data.forEach(product => {
                const div = document.createElement('div');
                div.className = 'product-card';
                // Use a placeholder image if none provided or if it's just a filename
                // Fix image URL handling
                let imgUrl = product.image;
                if (!imgUrl.startsWith('http')) {
                    // If it's a relative path like '/uploads/...' or just a filename
                    if (imgUrl.startsWith('/')) {
                        imgUrl = '' + imgUrl;
                    } else {
                        // Assume it's in root or uploads, let's try root for no-photo
                        imgUrl = '/' + imgUrl;
                    }
                }

                div.innerHTML = `
                    <img src="${imgUrl}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">₹${product.price}</div>
                        <small>Category: ${product.category}</small>
                    </div>
                    <button class="buy-btn" onclick="buyProduct('${product._id}')">Buy Now</button>
                `;
                grid.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p>Error loading products.</p>';
    }
}

// Buy Product (Create Order)
window.buyProduct = async (productId) => {
    if (!confirm('Confirm purchase?')) return;

    try {
        const orderData = {
            items: [
                { product: productId, qty: 1 }
            ]
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();

        if (res.ok) { // Status 201
            alert('Order placed successfully! Order ID: ' + data._id);
        } else {
            alert(data.message || 'Failed to place order');
        }
    } catch (err) {
        console.error(err);
        alert('Error placing order');
    }
};

loadProducts();
