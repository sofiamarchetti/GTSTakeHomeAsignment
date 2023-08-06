const cart = [];
const cartTotalElement = document.getElementById('cart-total');

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotalElement.textContent = total.toFixed(2);
}