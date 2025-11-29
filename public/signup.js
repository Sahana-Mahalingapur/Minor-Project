document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // stops reload

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        alert(result.message || result.error);

        if (result.success) {
            window.location.href = "login.html";
        }

    } catch (error) {
        alert("Something went wrong. Try again!");
        console.error(error);
    }
});
