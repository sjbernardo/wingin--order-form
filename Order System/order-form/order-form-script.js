let cartCount = 0;
let orderHistory = []; // Array to store multiple orders

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

function toggleAddToCartButton() {
    document.getElementById('addCartButton').disabled = !validateForm();
}

function addToCart() {
    if (validateForm()) {
        const wings = document.querySelector('input[name="wings"]:checked');
        const drinks = document.querySelector('input[name="drinks"]:checked');
        const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'));

        const wingsPrice = parseFloat(wings.getAttribute('data-price'));
        const drinksPrice = parseFloat(drinks.getAttribute('data-price'));
        const extrasPrice = extras.reduce((total, extra) => total + parseFloat(extra.getAttribute('data-price')), 0);

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
        document.getElementById('orderCount').innerText = `Orders: ${cartCount}`;

        // Deselect all options for a fresh selection
        document.getElementById('orderForm').reset();

        // Update Checkout button with summary of orders
        const cartSummary = document.getElementById('cartSummary');
        cartSummary.innerText = `(${cartCount} Orders)`;

        // Store order history and cart count in sessionStorage
        sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        sessionStorage.setItem('cartCount', cartCount);
    }
}


function goToCheckout() {
    if (orderHistory.length > 0) {
        sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        window.location.href = '/order-details/order-details.html';
    }
}

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
    document.getElementById('orderCount').innerText = `Orders: ${cartCount}`;

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
