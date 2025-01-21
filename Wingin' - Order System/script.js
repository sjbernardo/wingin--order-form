let cartCount = 0; // Initialize cart count
let orderHistory = []; // Array to store multiple orders

// Validate the form to ensure both wings and drinks are selected
function validateForm() {
    const wings = document.getElementsByName('wings');
    const drinks = document.getElementsByName('drinks');
    let wingsSelected = false;
    let drinksSelected = false;

    // Check if any wings option is selected
    for (let i = 0; i < wings.length; i++) {
        if (wings[i].checked) {
            wingsSelected = true;
            break;
        }
    }

    // Check if any drinks option is selected
    for (let i = 0; i < drinks.length; i++) {
        if (drinks[i].checked) {
            drinksSelected = true;
            break;
        }
    }

    // Return true if both wings and drinks are selected
    return wingsSelected && drinksSelected;
}

// Enable or disable the Add to Cart button based on form validation
function toggleAddToCartButton() {
    document.getElementById('addCartButton').disabled = !validateForm();
}

// Add selected items to the cart and update the order history
function addToCart() {
    if (validateForm()) {
        // Get selected wings, drinks, and extras
        const wings = document.querySelector('input[name="wings"]:checked');
        const drinks = document.querySelector('input[name="drinks"]:checked');
        const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'));

        // Get the prices for selected items
        const wingsPrice = parseFloat(wings.getAttribute('data-price'));
        const drinksPrice = parseFloat(drinks.getAttribute('data-price'));
        const extrasPrice = extras.reduce((total, extra) => total + parseFloat(extra.getAttribute('data-price')), 0);

        // Calculate the total price
        const totalPrice = wingsPrice + drinksPrice + extrasPrice;

        // Create an order object with the selected items and prices
        const orderData = {
            wings: wings.value,
            drinks: drinks.value,
            extras: extras.map(extra => extra.value),
            wingsPrice: wingsPrice,
            drinksPrice: drinksPrice,
            extrasPrice: extrasPrice,
            totalPrice: totalPrice
        };

        // Store order in history and update cart count
        orderHistory.push(orderData);
        cartCount++;

        // Display updated order count
        document.getElementById('orderCount').innerText = `${cartCount}`;

        // Update Checkout button with summary of orders
        const cartSummary = document.getElementById('cartSummary');
        cartSummary.innerText = `(${cartCount} Orders)`;

        // Store order history and cart count in sessionStorage
        sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        sessionStorage.setItem('cartCount', cartCount);

        // Reset the form
        resetForm();
    }
}

// Reset the form selections
function resetForm() {
    const formElements = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    formElements.forEach(element => {
        element.checked = false;
    });
    toggleAddToCartButton();
}

// Navigate to the checkout page
function goToCheckout() {
    if (orderHistory.length > 0) {
        sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        window.location.href = 'order-summary.html';
    }
}

// Initialize the page by retrieving stored data and attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve stored order count and history from sessionStorage
    const storedOrderHistory = sessionStorage.getItem('orderHistory');
    const storedCartCount = sessionStorage.getItem('cartCount');

    if (storedOrderHistory) {
        orderHistory = JSON.parse(storedOrderHistory);
    }
    if (storedCartCount) {
        cartCount = parseInt(storedCartCount);
    }

    // Update order count on page load
    document.getElementById('orderCount').innerText = `${cartCount}`;

    const wings = document.getElementsByName('wings');
    const drinks = document.getElementsByName('drinks');

    // Attach event listeners to wings radio buttons
    for (let i = 0; i < wings.length; i++) {
        wings[i].addEventListener('change', toggleAddToCartButton);
    }

    // Attach event listeners to drinks radio buttons
    for (let i = 0; i < drinks.length; i++) {
        drinks[i].addEventListener('change', toggleAddToCartButton);
    }

    // Initial validation check
    toggleAddToCartButton();
});

// Retrieve and display order summary and customer details on order-summary.html
document.addEventListener('DOMContentLoaded', function () {
    const savedOrderHistory = JSON.parse(sessionStorage.getItem('orderHistory'));
    const summaryDiv = document.getElementById('orderSummary');

    if (savedOrderHistory && savedOrderHistory.length > 0) {
        let summaryHtml = "<ul>";
        let totalAmount = 0; // Variable to store total amount for all orders

        savedOrderHistory.forEach((order, index) => {
            const subtotal = order.totalPrice && !isNaN(order.totalPrice) ? order.totalPrice : 0;
            totalAmount += subtotal;

            summaryHtml += 
                `<li><strong>Order ${index + 1}:</strong></li>
                 <p><strong>Wings:</strong> ${order.wings} - ₱${order.wingsPrice}</p>
                 <p><strong>Drinks:</strong> ${order.drinks} - ₱${order.drinksPrice}</p>
                 <p><strong>Extras:</strong></p>
                 <ul>`;

            order.extras.forEach(extra => {
                summaryHtml += `<ul>${extra} - ₱${order.extrasPrice}</ul>`;
            });

            summaryHtml += 
                `</ul>
                 <p style="color: #EB687D;"><strong>Subtotal: ₱${subtotal.toFixed(2)}</strong></p>
                 <br>`;
        });

        summaryHtml += "</ul>";
        summaryHtml += `<p class="order-total"><strong>Total Amount: ₱${totalAmount.toFixed(2)}</strong></p>`;
        summaryDiv.innerHTML = summaryHtml;
    } else {
        summaryDiv.innerHTML = "<p>No orders yet.</p>";
    }
});

// Navigate back to the menu page to add more orders
function addOrder() {
    window.location.href = 'menu.html';
}
