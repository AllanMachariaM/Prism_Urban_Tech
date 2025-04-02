document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

// Function to Fetch Orders from Backend and Display in Table
function loadOrders() {
    fetch("/api/orders")
        .then(response => response.json())
        .then(data => {
            const orderTable = document.getElementById("orderTable");
            orderTable.innerHTML = ""; // Clear previous data

            data.forEach((order, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${order.name}</td>
                    <td>${order.email}</td>
                    <td>${order.address}</td>
                    <td>$${order.total}</td>
                    <td>
                        <select onchange="updateOrderStatus(${order.id}, this.value)">
                            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                            <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                            <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        </select>
                    </td>
                    <td>
                        <button onclick="deleteOrder(${order.id})" class="delete-btn">Delete</button>
                    </td>
                `;
                orderTable.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching orders:", error));
}

// Function to Update Order Status
function updateOrderStatus(orderId, newStatus) {
    fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadOrders(); // Reload order list
    })
    .catch(error => console.error("Error updating order status:", error));
}

// Function to Delete an Order
function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`/api/orders/${orderId}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadOrders(); // Reload order list
        })
        .catch(error => console.error("Error deleting order:", error));
    }
}
