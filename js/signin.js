 const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    loginTab.addEventListener("click", () => {
        loginForm.style.display = "block";
        signupForm.style.display = "none";

        loginTab.classList.add("active");
        signupTab.classList.remove("active");
    });

    signupTab.addEventListener("click", () => {
        signupForm.style.display = "block";
        loginForm.style.display = "none";

        signupTab.classList.add("active");
        loginTab.classList.remove("active");
    });

    const BASE_URL = "http://localhost:8080/api/v1/auth";

// ✅ SIGNUP
async function signup() {
    const data = {
        username: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.text();
    alert(result);
}

// ✅ LOGIN
async function login(event) {
     event.preventDefault();// used to hold the default functions of forms/event 
    const data = {
        email: document.getElementById("loginUsername").value,
        password: document.getElementById("loginPassword").value
    };

    const response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const token = await response.text();

        // 🔐 Store JWT
        localStorage.setItem("token", token);

        alert("Login Successful!");

        // redirect
        window.location.href = "/html/dashboard.html";

    } else {
        alert("Invalid credentials");
    }
}