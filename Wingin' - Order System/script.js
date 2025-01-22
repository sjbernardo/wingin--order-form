let cartCount = 0;
let orderHistory = []; // Array to store multiple orders

// Validate the form to ensure both wings and drinks are selected
function validateForm() {
    const wings = document.getElementsByName('wings');
    const drinks = document.getElementsByName('drinks');
    let wingsSelected = false;
    let drinksSelected = false;

    for (let i = 0; i < wings.length; i++) {
        if (wings[i].checked) {
            wingsSelected = true;
            break;
        }
    }

    for (let i = 0; i < drinks.length; i++) {
        if (drinks[i].checked) {
            drinksSelected = true;
            break;
        }
    }

    return wingsSelected && drinksSelected;
}

// Enable or disable the Add to Cart button based on form validation
function toggleAddToCartButton() {
    document.getElementById('addCartButton').disabled = !validateForm();
}

// Add selected items to the cart and update the order history
function addToCart() {
    if (validateForm()) {
        const wings = document.querySelector('input[name="wings"]:checked');
        const drinks = document.querySelector('input[name="drinks"]:checked');
        const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'));

        const wingsPrice = parseFloat(wings.getAttribute('data-price'));
        const drinksPrice = parseFloat(drinks.getAttribute('data-price'));
        const extrasPrice = extras.reduce((total, extra) => total + parseFloat(extra.getAttribute('data-price')), 0);

        // Calculate the total price
        const totalPrice = wingsPrice + drinksPrice + extrasPrice;

        const orderData = {
            wings: wings.value,
            drinks: drinks.value,
            extras: extras.map(extra => extra.value),
            wingsPrice: wingsPrice,
            drinksPrice: drinksPrice,
            extrasPrice: extrasPrice,
            totalPrice: totalPrice
        };

        orderHistory.push(orderData); // Store order in history
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

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve and display order summary
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
        summaryDiv.innerHTML = "<p>No orders found in session.</p>";
    }

    // Retrieve and display customer details
    const savedCustomerDetails = JSON.parse(sessionStorage.getItem('customerDetails'));

    if (savedCustomerDetails) {
        const nameElement = document.getElementById('customerName');
        if (nameElement) {
            nameElement.innerText = savedCustomerDetails.name || 'N/A';
        }

        const streetElement = document.getElementById('customerStreet');
        if (streetElement) {
            streetElement.innerText = savedCustomerDetails.street || 'N/A';
        }

        const cityElement = document.getElementById('customerCity');
        if (cityElement) {
            cityElement.innerText = savedCustomerDetails.city || 'N/A';
        }

        const emailElement = document.getElementById('customerEmail');
        if (emailElement) {
            emailElement.innerText = savedCustomerDetails.email || 'N/A';
        }

        const phoneElement = document.getElementById('customerPhone');
        if (phoneElement) {
            phoneElement.innerText = savedCustomerDetails.phone || 'N/A';
        }
    } else {
        console.log('');
    }
});


function addOrder() {
    window.location.href = 'menu.html';
}

function saveCustomerDetails(event) {
    event.preventDefault(); // Prevent form submission and page reload

    // Gather input values
    const customerDetails = {
        name: document.getElementById('name').value.trim(),
        street: document.getElementById('street').value.trim(),
        city: document.getElementById('city').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone-num').value.trim(),
    };

    // Log customer details for debugging
    console.log('Saving Customer Details:', customerDetails);

    // Save data to sessionStorage
    sessionStorage.setItem('customerDetails', JSON.stringify(customerDetails));

    // Verify the data stored in sessionStorage
    console.log('Stored Customer Details in sessionStorage:', sessionStorage.getItem('customerDetails'));

    // Redirect to the menu page 
    window.location.href = 'menu.html';
}
