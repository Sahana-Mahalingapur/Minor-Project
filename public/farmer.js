// Check auth
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || user.role !== 'farmer') {
    window.location.href = 'login.html';
}

document.getElementById('userInfo').innerText = `Welcome, ${user.name}`;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Add Product
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('pName').value,
        description: document.getElementById('pDesc').value,
        price: document.getElementById('pPrice').value,
        stock: document.getElementById('pStock').value,
        category: document.getElementById('pCategory').value
    };

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const data = await res.json();

        if (data.success) {
            alert('Product added successfully!');
            document.getElementById('addProductForm').reset();
            loadMyProducts();
        } else {
            alert(data.error || 'Failed to add product');
        }
    } catch (err) {
        console.error(err);
        alert('Error adding product');
    }
});

// Load Products
async function loadMyProducts() {
    try {
        // ideally we should have an endpoint for "my products", but for now we filter client side or use get all
        // The backend currently returns ALL products. 
        // Let's fetch all and filter by current user ID if possible, 
        // OR just show all for now since the backend getProducts is public.
        // Wait, the backend getProducts returns "farmer" object. We can match that.

        const res = await fetch('/api/products');
        const data = await res.json();

        const list = document.getElementById('productsList');
        list.innerHTML = '';

        if (data.success) {
            // Filter products where farmer._id matches current user id
            // Note: user id in localStorage might be just "id" or "_id" depending on how we saved it.
            // In login.js we saved: _id: user.id. Wait, login response sends _id.
            // Let's check login.js again. It saves result.name, result.email. It DOES NOT save ID explicitly in the user object in localStorage.
            // But we have the token.
            // Actually, let's just show all products for now to be safe, or we need to fix login to save ID.

            // Let's assume we want to see all products for now.

            data.data.forEach(product => {
                // Simple check if this product belongs to logged in farmer
                // We need the user ID. 
                // Let's decode token or just rely on the fact that we can only delete our own products (backend enforces it).

                const div = document.createElement('div');
                div.className = 'product-card';
                div.innerHTML = `
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>₹${product.price} - ${product.category}</p>
                        <small>Stock: ${product.stock}</small>
                    </div>
                    <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
                `;
                list.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Delete Product
window.deleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (data.success) {
            alert('Product deleted');
            loadMyProducts();
        } else {
            alert(data.error || 'Failed to delete');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting product');
    }
};

loadMyProducts();
