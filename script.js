// SHOPPING CART
let cart = JSON.parse(localStorage.getItem("cricketCart") || "[]");

// PRODUCT PRICES
const prices = {
    "English Willow Bat": 12000,
    "Kashmir Willow Bat": 8500,
    "Tape Ball Bat": 4500,
    "Red Cricket Ball": 1200,
    "White Cricket Ball": 1500
};

// SAVE CART
function saveCart() {
    localStorage.setItem("cricketCart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(productName) {

    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: prices[productName],
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}

// DISPLAY CART
function displayCart() {

    let cartBox = document.getElementById("cartBox");

    if (!cartBox) {
        cartBox = document.createElement("section");
        cartBox.id = "cartBox";
        cartBox.className = "contact";

        const footer = document.querySelector("footer");

        if (footer) {
            footer.before(cartBox);
        } else {
            document.body.appendChild(cartBox);
        }
    }

    if (cart.length === 0) {
        cartBox.remove();
        return;
    }

    let total = 0;

    let cartHTML = "<h2>Your Shopping Cart</h2>";

    cart.forEach(item => {

        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartHTML += `
            <p>
                ${item.name} -
                Rs. ${item.price.toLocaleString()}
                × ${item.quantity}
                = Rs. ${subtotal.toLocaleString()}
                <button onclick="removeFromCart('${item.name}')">
                    Remove
                </button>
            </p>
        `;
    });

    cartHTML += `
        <h3>Total: Rs. ${total.toLocaleString()}</h3>
        <button onclick="checkout()">Checkout</button>
    `;

    cartBox.innerHTML = cartHTML;
}

// REMOVE PRODUCT
function removeFromCart(productName) {

    cart = cart.filter(item => item.name !== productName);

    saveCart();
    displayCart();
}

// CHECKOUT
function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    saveCart();

    window.location.href = "contact.html";
}

// PAGE LOADING
document.addEventListener("DOMContentLoaded", function() {

    // SHOW CART ON PRODUCTS PAGE
    if (document.querySelector(".products")) {
        displayCart();
    }

    // LOAD ORDER DETAILS ON CONTACT PAGE
    const orderForm = document.getElementById("orderForm");

    if (orderForm && cart.length > 0) {

        const contactSection = document.querySelector(".contact");

        let total = 0;

        let summaryHTML = `
            <div class="order-summary">
                <h3>Your Order Summary</h3>
        `;

        cart.forEach(item => {

            const subtotal = item.price * item.quantity;
            total += subtotal;

            summaryHTML += `
                <p>
                    ${item.name} × ${item.quantity}
                    = Rs. ${subtotal.toLocaleString()}
                </p>
            `;
        });

        summaryHTML += `
                <h3>Total: Rs. ${total.toLocaleString()}</h3>
            </div>
        `;

        contactSection.insertAdjacentHTML(
            "afterbegin",
            summaryHTML
        );

        // FILL FIRST PRODUCT AND QUANTITY
        const productSelect = orderForm.querySelector("select");

        const quantityInput = orderForm.querySelector(
            'input[type="number"]'
        );

        if (productSelect) {
            productSelect.value = cart[0].name;
        }

        if (quantityInput) {
            quantityInput.value = cart[0].quantity;
        }
    }

    // ORDER FORM SUBMISSION
    if (orderForm) {

        orderForm.addEventListener("submit", function(event) {

            event.preventDefault();

            if (cart.length > 0) {
                alert(
                    "Thank you! Your order has been submitted.\n" +
                    "Total Amount: Rs. " +
                    cart.reduce(
                        (sum, item) =>
                            sum + item.price * item.quantity,
                        0
                    ).toLocaleString()
                );
            } else {
                alert("Thank you! Your order has been submitted.");
            }

            // CLEAR CART AFTER ORDER
            cart = [];
            localStorage.removeItem("cricketCart");

            orderForm.reset();

            const summary = document.querySelector(".order-summary");

            if (summary) {
                summary.remove();
            }
        });
    }

});
       
