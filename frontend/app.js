// Check if the user is already logged in by checking the loggedIn flag and authToken in localStorage
if (localStorage.getItem("loggedIn") === "true" && localStorage.getItem("authToken")) {
  window.location.href = "dashboard.html"; // Redirect to dashboard if already logged in
}

// Show login form
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("createAccountForm").style.display = "none";
}

// Show create account form
function showCreateAccount() {
  document.getElementById("createAccountForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
}

// Create Account Function
function createAccount() {
  const username = document.getElementById("createUsername").value.trim();
  const password = document.getElementById("createPassword").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  // Send a POST request to create a new user account
  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    })
    .then((data) => {
      alert("Account created successfully!");
      showLogin(); // Show the login form after account creation
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(err.error || "Account creation failed. Please try again.");
    });
}

// Login Function
function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  // Send a POST request to login the user
  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    })
    .then((data) => {
      console.log("Login response:", data); // Debugging: Verify returned data

      // Save user-specific data in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("authToken", data.token); // Save the JWT token
      localStorage.setItem("currentUser", JSON.stringify(data.user)); // Save the current user's data

      // Redirect to the dashboard
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(err.error || "Login failed. Please try again.");
    });
}

// Example function to add a transaction, sending the JWT token in the request header
function addTransaction() {
  const text = document.getElementById("transactionText").value.trim();
  const amount = parseFloat(document.getElementById("transactionAmount").value.trim());
  const userId = JSON.parse(localStorage.getItem("currentUser"))._id; // Fetch userId dynamically
  const token = localStorage.getItem("authToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You need to log in first!");
    return;
  }

  fetch("http://localhost:3000/api/transactions/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Include the token in the Authorization header
    },
    body: JSON.stringify({ text, amount, userId })
  })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log("Transaction added:", data); // Log the response data (e.g., the new transaction)
      alert("Transaction added successfully!");
    })
    .catch(err => {
      console.error("Error adding transaction:", err); // Handle errors
      alert("Error adding transaction.");
    });
}

// Example function to fetch transactions for the logged-in user
function getTransactions() {
  const userId = JSON.parse(localStorage.getItem("currentUser"))._id;
  const token = localStorage.getItem("authToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You need to log in first!");
    return;
  }

  fetch(`http://localhost:3000/api/transactions/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}` // Include the token in the Authorization header
    }
  })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log("Transactions fetched:", data); // Log the response data (e.g., the user's transactions)
      // Optionally, render the transactions in the UI
    })
    .catch(err => {
      console.error("Error fetching transactions:", err); // Handle errors
      alert("Error fetching transactions.");
    });
}
