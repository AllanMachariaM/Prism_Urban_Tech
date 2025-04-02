document.addEventListener("DOMContentLoaded", function () {
    navigateTo("home"); // Load Home by default
});

// Function to load content dynamically based on navigation
function navigateTo(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            if (page === "shop") loadShopPage();
            if (page === "cart") loadCartPage();
            if (page === "checkout") loadCheckoutPage();
            if (page === "dashboard") setupDashboard();
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Page not found.</p>";
        });
}


// ========== SHOP PAGE FUNCTIONALITY ==========
function loadShopPage() {
    const productList = document.getElementById("product-list");
    let products = JSON.parse(localStorage.getItem("products")) || [];

    productList.innerHTML = ""; // Clear previous content

    if (products.length === 0) {
        productList.innerHTML = "<p>No products available.</p>";
    } else {
        products.forEach((product, index) => {
            productList.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button onclick="addToCart(${index})">Add to Cart</button>
                </div>
            `;
        });
    }
}


// Load Cart Page
function loadCartPage() {
    const cartItems = document.getElementById("cart-items");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPrice = 0;

    cartItems.innerHTML = ""; // Clear cart display

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((product, index) => {
            totalPrice += parseFloat(product.price);
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        });

        document.getElementById("total-price").innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    }
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartPage(); // Reload cart page
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem("cart");
    loadCartPage();
}

// Load Checkout Page
function loadCheckoutPage() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, product) => sum + parseFloat(product.price), 0);
    
    document.getElementById("checkout-total").innerHTML = `Total: $${total.toFixed(2)}`;

    document.getElementById("checkout-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        let orderData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            total,
            cart
        };

        let response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        let result = await response.json();

        if (result.success) {
            alert(result.message);
            localStorage.removeItem("cart");
            navigateTo("home");
        } else {
            alert("Order failed. Please try again.");
        }
    });
}


// ========== DASHBOARD FUNCTIONALITY ==========
function setupDashboard() {
    const form = document.getElementById("product-form");
    const productList = document.getElementById("product-list");

    let products = JSON.parse(localStorage.getItem("products")) || [];
    renderProducts(products);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const image = document.getElementById("product-image").value;

        const newProduct = { name, price, image };
        products.push(newProduct);

        localStorage.setItem("products", JSON.stringify(products));
        renderProducts(products);
        form.reset();
    });

    function renderProducts(products) {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            productList.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </div>
            `;
        });
    }
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    navigateTo("dashboard");
}
