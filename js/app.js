document.addEventListener("DOMContentLoaded", function () {
    navigateTo("home"); // Load Home by default
});

// Function to load content dynamically
function navigateTo(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            if (page === "dashboard") setupDashboard();
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Page not found.</p>";
        });
}

// Function to setup Dashboard (Handles Adding Products)
function setupDashboard() {
    const form = document.getElementById("product-form");
    const productList = document.getElementById("product-list");

    // Load saved products
    let products = JSON.parse(localStorage.getItem("products")) || [];
    renderProducts(products);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const image = document.getElementById("product-image").value;

        // Create new product object
        const newProduct = { name, price, image };
        products.push(newProduct);

        // Save to localStorage
        localStorage.setItem("products", JSON.stringify(products));

        // Re-render product list
        renderProducts(products);

        // Clear form
        form.reset();
    });

    // Function to render products in the admin panel
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

// Function to delete product
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    navigateTo("dashboard"); // Reload dashboard
}
