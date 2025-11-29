document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        alert(result.message || result.error);

        if (result.success) {
            // Store token and user info
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify({
                name: result.name,
                email: result.email,
                role: result.role
            }));

            // Redirect based on role
            if (result.role === 'farmer') {
                window.location.href = "farmer.html";
            } else if (result.role === 'customer') {
                window.location.href = "consumer.html";
            } else {
                window.location.href = "index.html";
            }
        }

    } catch (error) {
        alert("Something went wrong. Try again!");
        console.error(error);
    }
});
