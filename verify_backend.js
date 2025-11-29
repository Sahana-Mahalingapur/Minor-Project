const API_URL = 'http://localhost:5000/api';

const testBackend = async () => {
    try {
        console.log('--- Starting Backend Verification ---');

        // Helper for fetch
        const post = async (url, body, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(`Failed: ${res.status} ${JSON.stringify(err)}`);
            }
            return res.json();
        };

        const get = async (url, token) => {
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, { headers });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(`Failed: ${res.status} ${JSON.stringify(err)}`);
            }
            return res.json();
        };

        // 1. Register User
        console.log('\n1. Testing Registration...');
        const userEmail = `testuser_${Date.now()}@example.com`;
        const registerRes = await post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: userEmail,
            password: 'password123',
            role: 'farmer'
        });
        console.log('✅ Registration Successful:', registerRes.email);
        const token = registerRes.token;

        // 2. Login User
        console.log('\n2. Testing Login...');
        const loginRes = await post(`${API_URL}/auth/login`, {
            email: userEmail,
            password: 'password123'
        });
        console.log('✅ Login Successful:', loginRes.email);

        // 3. Create Product
        console.log('\n3. Testing Create Product...');
        const productRes = await post(`${API_URL}/products`, {
            name: 'Test Tomato',
            description: 'Fresh red tomatoes',
            price: 50,
            category: 'Vegetables',
            stock: 100
        }, token);
        console.log('✅ Product Created:', productRes.data.name);

        // 4. Get Products
        console.log('\n4. Testing Get Products...');
        const getProductsRes = await get(`${API_URL}/products`);
        console.log(`✅ Products Retrieved: ${getProductsRes.count} items found`);

        console.log('\n--- Verification Complete: ALL TESTS PASSED ---');
    } catch (error) {
        console.error('\n❌ Verification Failed:');
        console.error(error.message);
        process.exit(1);
    }
};

testBackend();
